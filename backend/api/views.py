from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.middleware.csrf import get_token

from .services import create_carbon_estimate, get_city_air_data, get_historic_temperatues, get_historic_carbon


@api_view()
def get_csrf(request):
    csrf_token = get_token(request)
    return Response(
        {'detail': 'CSRF cookie set'},
        headers={'X-CSRFToken': csrf_token}
    )


class CarbonApiView(APIView):
    def post(self, request):
        estimate_data = create_carbon_estimate(request.data)
        return Response(estimate_data, status=status.HTTP_200_OK)


carbon_api_view = CarbonApiView.as_view()


class NetlifxEmissions(APIView):

    # https://iopscience.iop.org/article/10.1088/1748-9326/9/5/054007
    # accroding to the peer reviewed study, video streaming consumes 7.9 MJ energy per viewing hour
    ENERGY_PER_HOUR = 7.9

    def post(self, request):
        try:
            hours = int(request.data['hours'])
        except (KeyError, ValueError):
            return Response(
                'need to include the number of hours (i.e {"hours": 42}) in request body',
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            "type": 'electricity',
            "electricity_unit": "mwh",
            "country": "gb",
            "electricity_value": hours * self.ENERGY_PER_HOUR,
        }
        estimate_data = create_carbon_estimate(data)
        return Response(estimate_data, status=status.HTTP_200_OK)


netlifx_emissions_view = NetlifxEmissions.as_view()


class HouseholdEnergy(APIView):
    # according to uk gov data
    AVG_YEARLY_CONSUMPTION_KWH = 3567

    categories = {
        "Cold appliances": 0.162,
        "Cooking": 0.138,
        'Lighting': 0.154,
        'Technology': 0.205,
        'Washing': 0.136,
        'Other': 0.205,
        'Total': 1
    }

    def post(self, request):
        data = {
            "type": 'electricity',
            "electricity_unit": "kwh",
            "country": "gb",
            "electricity_value": self.AVG_YEARLY_CONSUMPTION_KWH,
        }
        estimate_data = create_carbon_estimate(data)

        UNIT = "carbon_g"
        carbon_estimate = float(
            estimate_data['data']['attributes'][UNIT]
        )

        estimate_data['data']['categories'] = {
            cat: carbon_estimate * percentage for cat, percentage in self.categories.items()
        }

        estimate_data['data']['unit'] = UNIT

        return Response(estimate_data, status=status.HTTP_200_OK)


household_energy_view = HouseholdEnergy.as_view()


class AirQuality(APIView):

    def post(self, request):
        #{"city":"glasgow", "measure":"pm10"}
        """
        request
            {
                "city":"glasgow",
                "measure":"pm10"
            }
            should use pm10 or pm25 for air quality

        returns:
            - Response including integer for air quality measure
        """
        print(request.data)
        try:
            city = str(request.data["city"])
            measure = str(request.data["measure"])
        except:
            return Response(
                'Include just a city name and valid measure in the request',
                status=status.HTTP_400_BAD_REQUEST
            )
        air_quality_data = get_city_air_data(city, measure)
        return Response(air_quality_data, status=status.HTTP_200_OK)


air_quality_view = AirQuality.as_view()


class HistoricTemperature(APIView):

    def get(self, request):
        """
        returns:
            json data of temperature change from 1880 to 2021
        """
        historic_temperature_data = get_historic_temperatues()
        return Response(historic_temperature_data, status=status.HTTP_200_OK)


historic_temperature_view = HistoricTemperature.as_view()


class HistoricCarbon(APIView):

    def get(self, request):
        """
        returns:
            CO2 Concentrations
            From 1958, the measurements of carbon dioxide concentrations are done by Mauna Loa Observatory. Source: Ed Dlugokencky and Pieter Tans, NOAA/GML ( https://www.esrl.noaa.gov/gmd/ccgg/trends/)
            Data source: 800,000 years ago to 1958 https://www.epa.gov/climate-indicators/climate-change-indicators-atmospheric-concentrations-greenhouse-gases
            From 2010.01.01 the data is measured on a quasi daily basis
        """
        historic_carbon_data = get_historic_carbon()
        return Response(historic_carbon_data, status=status.HTTP_200_OK)


historic_carbon_view = HistoricCarbon.as_view()


class VideoStreamingEmissions(APIView):

    # https://prod-drupal-files.storage.googleapis.com/documents/resource/public/Carbon-impact-of-video-streaming.pdf
    # Emissions for hour of streaming in gCO2
    EMISSIONS_PER_HOUR = 56

    streaming_components = {
        "total": 1,
        "Data Centres": 0.01,
        "Transmission Network": 0.1,
        "Home Router": 0.38,
        "TV Peripheral": 0.05,
        "Screens": 0.46,
    }

    def _get_emissions_for_component(self, hours, percentage):
        return hours * self.EMISSIONS_PER_HOUR * percentage

    def post(self, request):
        try:
            hours = int(request.data['hours'])
        except (KeyError, ValueError):
            return Response(
                'need to include the number of hours (i.e {"hours": 42}) in request body',
                status=status.HTTP_400_BAD_REQUEST
            )

        emissions_by_component = {
            name: self._get_emissions_for_component(hours, percent) for name, percent in self.streaming_components.items()
        }
        estimate_data = {
            "data": {
                "unit": 'gCO2e',
                **emissions_by_component
            }
        }

        return Response(estimate_data, status=status.HTTP_200_OK)


video_streaming_emissions_view = VideoStreamingEmissions.as_view()

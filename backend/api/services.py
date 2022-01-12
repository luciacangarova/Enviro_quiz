import requests
import json
from django.conf import settings

ESTIMATES_API = "https://www.carboninterface.com/api/v1/estimates"
AIR_QUALITY_API = "https://api.waqi.info"
TEMPERATURE_API = "https://global-warming.org/api/temperature-api"
CARBON_API = "https://global-warming.org/api/co2-api"


def create_carbon_estimate(data: dict) -> dict:
    headers = {
        'Content-Type': 'application/json',
        "Authorization": f"Bearer {settings.CARBON_INTERFACE_API_KEY}"
    }

    res = requests.post(
        ESTIMATES_API,
        headers=headers,
        data=json.dumps(data)
    )
    estimate = res.json()
    return estimate


def get_city_air_data(city_name: str, gas_data: str) -> int:
    """
    city_name:
        Name of a city somewhere

    gas_data:
        Name of air quality measurement e [pm10, pm25, o3]

    returns: 
        Integer for average measurement data for TODAY. -1 if invalid request.

    notes:
        https://aqicn.org/city
    """

    res = requests.get(
        f"{AIR_QUALITY_API}/feed/{city_name}/?token={settings.AIR_QUALITY_API_KEY}"
    )

    data = res.json()

    try:
        return data['data']['forecast']['daily'][gas_data][2]['avg']
    except:
        return -1


def get_historic_temperatues() -> dict:
    """
    returns:
        lengthy json of historic temperature change

    notes:
        Source: GISTEMP Team, 2020: GISS Surface Temperature Analysis (GISTEMP), version 4. NASA Goddard Institute for Space Studies. Dataset accessed 20YY-MM-DD at https://data.giss.nasa.gov/gistemp/. Source data 1880 - present: Lenssen, N., G. Schmidt, J. Hansen, M. Menne, A. Persin, R. Ruedy, and D. Zyss, 2019: Improvements in the GISTEMP uncertainty model. J. Geophys. Res. Atmos., 124, no. 12, 6307-6326, doi:10.1029/2018JD029522. Source data year 1 – 1979:  https://earthdata.nasa.gov/
        From 1880.04 the data is measured on a monthly basis
    """
    res = requests.get(
        TEMPERATURE_API
    )

    data = res.json()

    return data


def get_historic_carbon() -> dict:
    """
    returns:
        lengthy json of historic CO2 concentrations

    notes:
        From 1958, the measurements of carbon dioxide concentrations are done by Mauna Loa Observatory. Source: Ed Dlugokencky and Pieter Tans, NOAA/GML ( https://www.esrl.noaa.gov/gmd/ccgg/trends/)
        Data source: 800,000 years ago to 1958 https://www.epa.gov/climate-indicators/climate-change-indicators-atmospheric-concentrations-greenhouse-gases
        From 2010.01.01 the data is measured on a quasi daily basis
    """
    res = requests.get(
        CARBON_API
    )

    data = res.json()

    return data

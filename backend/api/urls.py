from django.urls import path
from rest_framework import routers

from .views import (
    carbon_api_view,
    netlifx_emissions_view,
    get_csrf,
    household_energy_view,
    air_quality_view,
    historic_temperature_view,
    historic_carbon_view,
    video_streaming_emissions_view
)

router = routers.DefaultRouter()

urlpatterns = router.urls + [
    path('csrf', get_csrf, name='csrf'),
    path('carbon-emissions', carbon_api_view, name='carbon_api'),
    path('netflix-emissions', netlifx_emissions_view, name='netlifx_emissions'),
    path('household-emissions', household_energy_view, name='household_energy'),
    path('air-quality', air_quality_view, name='air_quality'),
    path('historic-temperature', historic_temperature_view,
         name='historic_temperature'),
    path('historic-carbon', historic_carbon_view,
         name='historic_carbon'),
    path('streaming-emissions', video_streaming_emissions_view,
         name='streaming_emissions')
]

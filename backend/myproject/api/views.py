import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CityRequest
import json

API_KEY = "e1b82d25d2bd9c5af089cf479ac6b387"

def get_weather(request):
    city = request.GET.get("city")

    if not city:
        return JsonResponse({"error": "City is required"}, status=400)

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    
    response = requests.get(url)
    data = response.json()

    return JsonResponse(data, safe=False)


@csrf_exempt
def save_city_request(request):
    if request.method == "POST":
        data = json.loads(request.body)

        CityRequest.objects.create(
            state=data.get("state"),
            city_name=data.get("city"),
            description=data.get("description"),
        )

        return JsonResponse({"message": "Saved successfully"})

        
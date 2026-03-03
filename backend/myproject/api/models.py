from django.db import models

class CityRequest(models.Model):
    state = models.CharField(max_length=100)
    city_name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.city_name
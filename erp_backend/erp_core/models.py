from django.db import models
from django.contrib.auth.models import User

class Invoice(models.Model):
    client_name = models.CharField(max_length=100)
    date = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Quote(models.Model):
    client_name = models.CharField(max_length=100)
    date = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

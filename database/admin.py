from django.contrib import admin

# Register your models here.
import models

admin.site.register(models.Customer)
admin.site.register(models.Restaurant)
admin.site.register(models.Address)
admin.site.register(models.Dish)
admin.site.register(models.Order)
admin.site.register(models.OrderDish)

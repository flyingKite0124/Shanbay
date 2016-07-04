from django.db import models
from django.utils.encoding import smart_unicode


# Create your models here.
class Customer(models.Model):
    phone = models.CharField(max_length=15, unique=True)
    passwd = models.CharField(max_length=60)
    status = models.IntegerField()
    default_aid = models.IntegerField(null=True)
    # default_address = models.ForeignKey(Address,null=True)

    def __unicode__(self):
        return smart_unicode(self.phone)


class Address(models.Model):
    name = models.CharField(max_length=60)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    delete_flag = models.BooleanField(default=False)
    customer = models.ForeignKey(Customer)

    def __unicode__(self):
        return smart_unicode(self.name)


class Restaurant(models.Model):
    name = models.CharField(max_length=60, unique=True)
    phone = models.CharField(max_length=15)
    passwd = models.CharField(max_length=60)
    introduction = models.TextField()
    address = models.TextField()
    classification = models.IntegerField()
    status = models.IntegerField()
    logo_path = models.TextField(null=True)

    def __unicode__(self):
        return smart_unicode(self.name)


class Dish(models.Model):
    name = models.CharField(max_length=60)
    price = models.FloatField()
    total_count = models.IntegerField(default=0)
    grade_count = models.IntegerField(default=0)
    total_grade = models.IntegerField(default=0)
    ave_grade=models.FloatField(default=0)
    introduction = models.TextField()
    pic_path = models.TextField(null=True)
    delete_flag = models.BooleanField(default=False)
    restaurant = models.ForeignKey(Restaurant)

    def __unicode__(self):
        return smart_unicode(self.name)


class Order(models.Model):
    order_time = models.DateTimeField(null=True)
    status = models.IntegerField()
    total = models.FloatField(default=0)
    customer = models.ForeignKey(Customer)
    restaurant = models.ForeignKey(Restaurant)
    address = models.ForeignKey(Address,null=True)

    def __unicode__(self):
        return smart_unicode(self.customer) + u' ' \
               + smart_unicode(self.restaurant) + u' ' \
               + smart_unicode(self.order_time)


class OrderDish(models.Model):
    num = models.IntegerField()
    price = models.FloatField()
    grade = models.IntegerField(default=0)
    comment = models.TextField(default="")
    order = models.ForeignKey(Order)
    dish = models.ForeignKey(Dish)

    def __unicode__(self):
        return smart_unicode(self.order) + u' ' \
               + smart_unicode(self.dish)

class Administrator(models.Model):
    account = models.CharField(max_length=60)
    passwd = models.CharField(max_length=60)

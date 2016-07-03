from django.shortcuts import render
from database.models import *
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect
import const

const.customer = {"NORMAL": 0, "FROZEN": 1}
const.restaurant = {"UNCERTIFIED": 0, "OPENING": 1, "CLOSED": 2, "FROZEN": 3}
const.order = {
    "UNCERTAIN": 0,
    "CERTAIN": 1,
    "PAYED": 2,
    "ACCEPTED": 3,
    "SENT": 4,
    "FINISHED": 5}

def index(request):
    if not request.is_ajax() and request.method == "GET":
        global const
        content_dict = dict()
        if request.session.get("issigned", False):
            content_dict["issigned"] = True
            content_dict["customer"] = Customer.objects.get(
                pk=request.session.get("customer_id"))
        else:
            content_dict["issigned"] = False
        content_dict["restaurant"] = dict()
        content_dict["restaurant"]["open"] = Restaurant.objects.filter(
            status=const.restaurant["OPENING"])
        content_dict["restaurant"]["close"] = Restaurant.objects.filter(
            status=const.restaurant["CLOSED"])
        return render(request, "customer/index.html", content_dict)
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')


def sign(request):
    if not request.is_ajax() and request.method=="GET":
        return render(request, "customer/sign.html")
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')


def restaurant(request):
    if not request.is_ajax() and request.method=="GET":
        if "rest_id" in request.GET:
            global const
            content_dict=dict()
            if request.session.get("issigned", False):
                content_dict["issigned"] = True
                content_dict["customer"] = Customer.objects.get(
                    pk=request.session.get("customer_id"))
            else:
                content_dict["issigned"] = False
            restaurant=Restaurant.objects.filter(pk=request.GET["rest_id"])
            if restaurant.count()==1:
                content_dict["restaurant"]=restaurant[0]
            else:
                return HttpResponseRedirect("index")
            return render(request, "customer/restaurant.html",content_dict)
        else:
            return HttpResponseRedirect("index")
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')


def checkorder(request):
    if not request.is_ajax() and request.method=="GET":
        if "order_id" in request.GET:
            global const
            content_dict=dict()
            if request.session.get("issigned",False):
                content_dict["customer"]=Customer.objects.get(pk=request.session.get("customer_id"))
                content_dict["addresses"]=Address.objects.filter(customer=content_dict["customer"]).filter(delete_flag=False)
            else:
                return HttpResponseRedirect("index")
            order=Order.objects.filter(pk=request.GET["order_id"])
            if order.count()==1 and order[0].status==const.order["UNCERTAIN"]:
                content_dict["order"]=order[0]
                content_dict["order_dishes"]=OrderDish.objects.filter(order=content_dict["order"])
            else:
                return HttpResponseRedirect("index")
            return render(request, "customer/checkorder.html",content_dict)
        else:
            return HttpResponseRedirect("index")
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')




def search(request):
    if not request.is_ajax()and request.method=="GET":
        if "queryString" in request.GET:
            global const
            content_dict=dict()
            if request.session.get("issigned", False):
                content_dict["issigned"] = True
                content_dict["customer"] = Customer.objects.get(
                    pk=request.session.get("customer_id"))
            else:
                content_dict["issigned"] = False
            content_dict["restaurants"]=Restaurant.objects.filter(name__contains=request.GET["queryString"]).filter(status=const.restaurant["OPENING"])
            content_dict["dishes"]=Dish.objects.filter(name__contains=request.GET["queryString"])
            return render(request, "customer/search.html",content_dict)
        else:
            return HttpResponseRedirect("index")
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')


def profile(request):
    if not request.is_ajax() and request.method=="GET":
        global const
        content_dict = dict()
        if request.session.get('issigned',False):
            content_dict["customer"]=Customer.objects.get(pk=request.session.get(("customer_id")))
        else:
            return HttpResponseRedirect("index")
        content_dict["orders"]=Order.objects.filter(customer=content_dict["customer"]).exclude(status=const.order["UNCERTAIN"])
        for order in content_dict["orders"]:
            content_dict["order_dishes"][order.id]=OrderDish.objects.filter(order=order)
        content_dict["addresses"]=Address.objects.filter(customer=content_dict["customer"]).filter(delete_flag=False)
        return render(request, "customer/profile.html")
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')

def redirect(request):
    return HttpResponseRedirect("/customer/index")

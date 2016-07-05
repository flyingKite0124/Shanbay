# -*- coding: utf-8 -*-

from django.shortcuts import render
from database.models import *
from django.http import HttpResponse,HttpResponseRedirect,HttpResponseNotAllowed, JsonResponse
from django.template import RequestContext, loader
import json
import const
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import datetime



const.restaurant = {"UNCERTIFIED": 0, "OPENING": 1, "CLOSED": 2, "FROZEN": 3}
const.order = {
    "UNCERTAIN": 0,
    "CERTAIN": 1,
    "PAYED": 2,
    "ACCEPTED": 3,
    "SENT": 4,
    "FINISHED": 5}

# Create your views here.
def sign(request):
    if not request.is_ajax() and request.method == "GET":
        if request.session.get("isSignIn",False):
            return HttpResponseRedirect("manage")
        return render(request,"restaurant/sign.html")
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')

@csrf_exempt
def signIn(request):
    print "I am in sign in"
    if request.is_ajax() and request.method == "POST":
        print request.body
        data = json.loads(request.body)
        if "phone" not in data or "password" not in data:
            return JsonResponse({"result":"fail"})
        else:
            phone = data["phone"]
            passwd = data["password"]
            try:
                restaurant = Restaurant.objects.get(phone=phone)
            except Exception:
                return JsonResponse({"result":"fail"})
            if restaurant == None:
                return JsonResponse({"result":"fail"})
            elif restaurant.passwd == passwd:
                request.session["mID"] = restaurant.id
                request.session["isSignIn"] = True
                return JsonResponse({"result":"success"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def signUp(request):
    if request.is_ajax() and request.method == "POST":
        data = json.loads(request.body)
        if "phone" not in data \
        or "passwd" not in data \
        or "restaurant_name" not in data \
        or "introduction" not in data \
        or "address" not in data:
            return JsonResponse({"result":"fail"})
        print "check field success"
        phone = data["phone"]
        passwd = data["passwd"]
        restaurant_name = data["restaurant_name"]
        introduction = data["introduction"]
        address = data["address"]
        classification = 0
        status = const.restaurant["OPENING"]
        if len(Restaurant.objects.filter(phone=phone))>0:
            print "duplicate"
            return JsonResponse({"result": "fail"})
        else:
            try:
                newRestaurant = Restaurant()
                newRestaurant.phone = phone
                newRestaurant.passwd = passwd
                newRestaurant.name = restaurant_name
                newRestaurant.introduction = introduction
                newRestaurant.address = address
                newRestaurant.classification = classification
                newRestaurant.status = status
                newRestaurant.save()
                request.session["mID"] = newRestaurant.id
                print "mID: " ,request.session["mID"]
                request.session["isSignIn"] = True
                return JsonResponse({"result":"success"})
            except Exception, e:
                print e
                return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def checkPhone(request):
    if request.is_ajax() and request.method == "POST":
        data = json.loads(request.body)
        if "phone" not in data:
            return JsonResponse({"result":"fail"})
        phone = data["phone"]
        duplicate = Restaurant.objects.filter(phone = phone)
        if (len(duplicate) > 0):
            return JsonResponse({"result":"fail"})
        else:
            return JsonResponse({"result":"success"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def checkName(request):
    if request.is_ajax() and request.method == "POST":
        data = json.loads(request.body)
        if "restaurant_name" not in data:
            return JsonResponse({"result":"fail"})
        restaurant_name = data["restaurant_name"]
        duplicate = Restaurant.objects.filter(name = restaurant_name)
        if (len(duplicate) > 0):
            return JsonResponse({"result":"fail"})
        else:
            return JsonResponse({"result":"success"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def manage(request):
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if not request.is_ajax() and request.method == "GET":
        restaurant = None
        try:
            restaurant = Restaurant.objects.get(id=request.session.get("mID"))
        except Exception:
            HttpResponseRedirect("sign")
        if restaurant == None:
            HttpResponseRedirect("sign")
        return render(request,"restaurant/manage.html", {"restaurant":restaurant})
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')


def updateInformation(request):
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        restaurant = None
        try:
            restaurant = Restaurant.objects.get(id=request.session.get("mID"))
        except Exception:
            HttpResponseRedirect("sign")
        if restaurant == None:
            HttpResponseRedirect("sign")
        data = json.loads(request.body)
        if "restaurant_name" not in data \
        or "phone" not in data \
        or "introduction" not in data \
        or "address" not in data \
        or "classification" not in data:
            return JsonResponse({"result":"fail"})
        print data
        restaurant_name = data["restaurant_name"]
        if restaurant_name != None and restaurant_name != "":
            restaurant.name = restaurant_name
        phone = data["phone"]
        if phone != None and phone != "":
            restaurant.phone = phone
        introduction = data["introduction"]
        if introduction != None and introduction != "":
            restaurant.introduction = introduction
        address = data["address"]
        if address != None and address != "":
            restaurant.address = address
        classification = data["classification"]
        if classification != None and classification != "":
            restaurant.classification = classification
        restaurant.save()
        return JsonResponse({"result":"success"})

    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def changePasswd(request):
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        restaurant = None
        try:
            restaurant = Restaurant.objects.get(id=request.session.get("mID"))
        except Exception:
            HttpResponseRedirect("sign")
        if restaurant == None:
            HttpResponseRedirect("sign")
        data = json.loads(request.body)
        if "old_password" not in data or "new_password" not in data:
            return JsonResponse({"result":"fail"})
        else:
            old_password = data["old_password"]
            new_password = data["new_password"]
            if restaurant.passwd != old_password:
                return JsonResponse({"result":"fail"})
            else:
                restaurant.passwd = new_password
                restaurant.save()
                return JsonResponse({"result":"success"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def changeStatus(request):
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        restaurant = None
        try:
            restaurant = Restaurant.objects.get(id=request.session.get("mID"))
        except Exception:
            HttpResponseRedirect("sign")
        if restaurant == None:
            HttpResponseRedirect("sign")
        data = json.loads(request.body)
        if "type" not in data:
            return JsonResponse({"result":"fail"})
        else:
            global const
            mType = data["type"]
            if mType == "open":
                restaurant.status = const.restaurant["OPENING"]
            if mType == "close":
                restaurant.status = const.restaurant["CLOSED"]
            restaurant.save()
            return JsonResponse({"result":"success"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def manageDish(request):
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        restaurant = None
        try:
            restaurant = Restaurant.objects.get(id=request.session.get("mID"))
        except Exception:
            HttpResponseRedirect("sign")
        if restaurant == None:
            HttpResponseRedirect("sign")
        data = json.loads(request.body)
        if "type" in data:
            mType = data["type"]
            if mType == "new":
                if "name" not in data \
                or "price" not in data \
                or "introduction" not in data:
                    return JsonResponse({"result":"fail"})
                name = data["name"]
                price = data["price"]
                introduction = data["introduction"]
                try:
                    dish = Dish(name = name, price = float(price), introduction = introduction, restaurant = restaurant)
                    dish.save()
                    print data
                    return JsonResponse({"result":"success"})
                except Exception:
                    return JsonResponse({"result":"fail"})
            elif mType == "update":
                if "dish_id" not in data:
                    return JsonResponse({"result":"fail"})
                dish_id = data["dish_id"]
                print dish_id
                try:
                    dish = Dish.objects.get(id=int(dish_id))
                except Exception:
                    return JsonResponse({"result":"fail"})
                print data
                if "price" not in data \
                or "introduction" not in data:
                    return JsonResponse({"result":"fail"})

                try:
                    price = data["price"]
                    if price != None and price != "":
                        dish.price = float(price)
                    introduction = data["introduction"]
                    if introduction != None and introduction != "":
                        dish.introduction = introduction
                    dish.save()
                    return JsonResponse({"result":"success"})
                except Exception:
                    return JsonResponse({"result":"fail"})
            elif mType == "delete":
                if "dish_id" not in data:
                   return JsonResponse({"result":"fail"})
                dish_id = data["dish_id"]
                try:
                    dish = Dish.objects.get(id=dish_id)
                    dish.delete()
                    return JsonResponse({"result":"success"})
                except Exception:
                    return JsonResponse({"result":"fail"})
            else:
                return JsonResponse({"result":"fail"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

def pollOrder(request):
    #Liqimai rewrite this function
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        restaurant = None
        try:
            restaurant = Restaurant.objects.get(id=request.session.get("mID"))
        except Exception:
            HttpResponseRedirect("sign")
        if restaurant == None:
            HttpResponseRedirect("sign")
        template = loader.get_template('restaurant/orderlist.html')
        context = RequestContext(request, {
            'restaurant': restaurant,
            'sequence': [2, 3, 4, 5, 1, 0, 6],
        })
        return JsonResponse(
                {
                    "order_list": template.render(context),
                    "result":"success"
                },
                safe=False)
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

    #this is the old version
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        restaurant = None
        try:
            restaurant = Restaurant.objects.get(id=request.session.get("mID"))
        except Exception:
            HttpResponseRedirect("sign")
        if restaurant == None:
            HttpResponseRedirect("sign")
        order_list = Order.objects.filter(restaurant=restaurant)
        ret_data = []
        for item in order_list:
            order = {}
            order["order_id"] = item.id
            order["order_status"] = item.status
            order["address"] = item.address.address
            order["phone"] = item.customer.phone
            order["name"] = item.address.name
            order["dish"] = []
            orderDish = OrderDish.objects.filter(order=item)
            for dishItem in orderDish:
                order["dish"].append({"dish_name":dishItem.dish.name,"dish_num":dishItem.num})
            ret_data.append(order)
        
        return JsonResponse({"result":"success","orders":ret_data},safe=False)
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')
        


def redirect(request):
    if request.session.get("issigned", False):
        return HttpResponseRedirect("manage")
    else:
        return HttpResponseRedirect("sign")

def queryOrder(request):
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        data = json.loads(request.body)
        if "start_data" not in data \
        or "stop_data" not in data:
            return JsonResponse({"result":"fail"})
        start_date = data["start_data"]
        end_date = data["stop_data"]
        order_list = Order.objects.filter(order_time__gte=datetime(int(start_date[0:4]),int(start_date[4:6]),int(start_date[6:8]))).filter(order_time__lte=datetime(int(end_date[0:4]),int(end_date[4:6]),int(end_date[6:8])))
        ret_data = []
        for item in order_list:
            order = {}
            order["order_id"] = item.id
            order["order_status"] = item.status
            order["address"] = item.address.address
            order["phone"] = item.customer.phone
            order["name"] = item.address.name
            order["dish"] = []
            orderDish = OrderDish.objects.filter(order=item)
            for dishItem in orderDish:
                order["dish"].append({"dish_name":dishItem.dish.name,"dish_num":dishItem.num})
            ret_data.append(order)
        
        return JsonResponse({"result":"success","orders":ret_data},safe=False)
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')
def changeOrderStatus(request):
    if not request.session.get("isSignIn", False):
        return HttpResponseRedirect("sign")
    if request.is_ajax() and request.method == "POST":
        data = json.loads(request.body)
        if "order_id" not in data \
        or "type" not in data:
            return JsonResponse({"result":"fail"})
        try:
            order = Order.objects.get(id=data['order_id'])
        except Exception:
            return JsonResponse({"result":"fail"})
        mType = data["type"]
        global const
        if mType == "accept":
            order.status = const.order["ACCEPTED"]
            order.save()
            return JsonResponse({"result":"success"})
        elif mType == "sendout":
            order.status = const.order["SENT"]
            order.save()
            return JsonResponse({"result":"success"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')



def logout(request):
    if request.is_ajax() and request.method == "POST":
        if "isSignIn" not in request.session:
            return JsonResponse({"result":"fail"})
        request.session["isSignIn"] = False
        return JsonResponse({"result":"success"})
    else:
        return HttpResponseNotAllowed(['POST'], 'illegal request')

        



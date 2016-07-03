from django.shortcuts import render
from database.models import *
from django.http import HttpResponse,HttpResponseRedirect
import json

# Create your views here.
def sign(request):
    # request.session["issigned"]=True
    return render(request,"restaurant/sign.html")

def manage(request):
    # request.session["issigned"]=False
    restaurant = Restaurant.objects.get(name="SiLing")
    content_dict = dict()
    content_dict["restaurant"] = restaurant
    request.session["mRestaurant"] = restaurant.name
    return render(request,"restaurant/manage.html", content_dict)

def redirect(request):
    if request.session.get("issigned",False):
        return HttpResponseRedirect("manage")
    else:
        return HttpResponseRedirect("sign")

def signIn(request):
    content_dict = dict()
    content_dict["result"] = "success"
    result = json.dumps(content_dict)
    return HttpResponse(result)
    '''
    if not request.is_ajax() and request.method == "GET":
        return render(request,"restaurant/signIn.html",content_dict)
    elif request.is_ajax() and request.method == "POST":
        return render(request,"restaurant/signIn.html",content_dict)
    '''

def signUp(request):
    content_dict = dict()
    content_dict["result"] = "success"
    result = json.dumps(content_dict)
    return HttpResponse(result)

def checkPhone(request):
    content_dict = dict()
    content_dict["result"] = "success"
    result = json.dumps(content_dict)
    return HttpResponse(result)

def checkName(request):
    content_dict = dict()
    content_dict["result"] = "success"
    result = json.dumps(content_dict)
    return HttpResponse(result)


def updateInformation(request):
    return HttpResponseRedirectnse("updateInformation")

def changePasswd(request):
    return HttpResponse("changePasswd")

def changeStatus(request):
    content_dict = dict()
    content_dict["result"] = "success"
    result = json.dumps(content_dict)
    return HttpResponse(result)

def manageDish(request):
    content_dict = dict()
    if request.is_ajax() and request.method == "POST":
        if "type" in request.POST:
            mType = request.POST["type"]
            if mType == "new":
                if "name" not in request.POST \
                or "price" not in request.POST \
                or "introduction" not in request.POST:
                    content_dict["result"] = "fail"
                    result = json.dumps(content_dict)
                    return HttpResponse(result)
                print "finish add check"
                name = request.POST["name"]
                price = request.POST["price"]
                introduction = request.POST["introduction"]
                print name, price, introduction
                restaurantName = request.session.get("mRestaurant")
                restaurant = Restaurant.objects.get(name=restaurantName)
                print "Restaurant name : ", restaurant.name
                dish = Dish(name = name, price = float(price), introduction = introduction, restaurant = restaurant)
                print "create succ"
                dish.save()
                print "save succ"
                print "name : " ,dish.name 
                print "price : ", dish.price
                print "introduction : ", introduction
                content_dict["result"] = "success"
                result = json.dumps(content_dict)
                return HttpResponse(result)
            elif mType == "update":
                print "updating"
                if "dish_id" not in request.POST:
                    print "no dish id"
                    content_dict["result"] = "fail"
                    result = json.dumps(content_dict)
                    return HttpResponse(result)
                dish_id = request.POST["dish_id"]
                dish = Dish.objects.get(id=dish_id)
                if "price" in request.POST:
                    print "before : ", dish.price
                    dish.price = float(request.POST["price"])
                    print "after : ",dish.price
                if "introduction" in request.POST:
                    print dish.introduction
                    dish.introduction = request.POST["introduction"]
                dish.save()
                print "finish update"
                content_dict["result"] = "success"
                result = json.dumps(content_dict)
                return HttpResponse(result)
            elif mType == "delete":
                print "deleting"
                if "dish_id" not in request.POST:
                    print "no dish id"
                    content_dict["result"] = "fail"
                    result = json.dumps(content_dict)
                    return HttpResponse(result)
                dish_id = request.POST["dish_id"]
                dish = Dish.objects.get(id=dish_id)
                dish.delete()
                content_dict["result"] = "success"
                result = json.dumps(content_dict)
                return HttpResponse(result)
            else:
                content_dict["result"] = "fail"
                result = json.dumps(content_dict)
                return HttpResponse(result)
        else:
            content_dict["result"] = "fail"
            result = json.dumps(content_dict)
            return HttpResponse(result)

def pollOrder(request):
    return HttpResponse("pollOrder")

def queryOrder(request):
    return HttpResponse("queryOrder")

def changeOrderStatus(request):
    return HttpResponse("changeOrderStatus")

def logout(request):
    return HttpResponse("logout")



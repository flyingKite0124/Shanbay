import datetime
from django.shortcuts import render
from database.models import *
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect,JsonResponse
import json
import const


const.customer = {"NORMAL": 0, "FROZEN": 1}
const.restaurant = {"UNCERTIFIED": 0, "OPENING": 1, "CLOSED": 2, "FROZEN": 3}
const.order = {
    "UNCERTAIN": 0,
    "CERTAIN": 1,
    "PAYED": 2,
    "ACCEPTED": 3,
    "SENT": 4,
    "FINISHED": 5,
    "CANCELLED": 6,
}

def index(request):
    if not request.is_ajax() and request.method == "GET":
        global const
        content_dict = dict()
        if request.session.get("issigned", "False")=="True":
            content_dict["issigned"] = True
            content_dict["customer"] = Customer.objects.get(
                pk=int(request.session.get("customer_id")))
        else:
            content_dict["issigned"] = False
        content_dict["restaurants"] = dict()
        content_dict["restaurants"]["open"] = Restaurant.objects.filter(
            status=const.restaurant["OPENING"])
        content_dict["restaurants"]["close"] = Restaurant.objects.filter(
            status=const.restaurant["CLOSED"])
        return render(request, "customer/index.html", content_dict)
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')


def sign(request):
    if not request.is_ajax() and request.method=="GET":
        if request.session.get("issigned", "False")=="True":
            return HttpResponseRedirect("index")
        else:
            return render(request, "customer/sign.html")
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')


def restaurant(request):
    if not request.is_ajax() and request.method=="GET":
        if "rest_id" in request.GET:
            global const
            content_dict=dict()
            if request.session.get("issigned", "False")=="True":
                content_dict["issigned"] = True
                content_dict["customer"] = Customer.objects.get(
                    pk=int(request.session.get("customer_id")))
            else:
                content_dict["issigned"] = False
            restaurant=Restaurant.objects.filter(pk=request.GET["rest_id"])
            if restaurant.count()==1:
                content_dict["restaurant"]=restaurant[0]
                content_dict["dishes"]=Dish.objects.filter(restaurant=restaurant[0])
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
            if request.session.get("issigned", "False")=="True":
                content_dict["customer"]=Customer.objects.get(pk=int(request.session.get("customer_id")))
                if content_dict["customer"].default_aid is None:
                    content_dict["customer"].default_aid=-1
                content_dict["addresses"]=Address.objects.filter(customer=content_dict["customer"]).filter(delete_flag=False)
            else:
                return HttpResponseRedirect("index")
            order=Order.objects.filter(pk=request.GET["order_id"])
            if order.count()==1 and order[0].status==const.order["UNCERTAIN"] and order[0].customer.id==int(request.session.get("customer_id")):
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
            if request.session.get("issigned", "False")=="True":
                content_dict["issigned"] = True
                content_dict["customer"] = Customer.objects.get(
                    pk=int(request.session.get("customer_id")))
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
        if request.session.get("issigned", "False")=="True":
            content_dict["issigned"]=True
            content_dict["customer"]=Customer.objects.get(pk=int(request.session.get("customer_id")))
        else:
            return HttpResponseRedirect("index")
        content_dict["orders"]=Order.objects.filter(customer=content_dict["customer"]).exclude(status=const.order["UNCERTAIN"])
        content_dict["order_dishes"]=dict()
        for order in content_dict["orders"]:
            content_dict["order_dishes"][order.id]=OrderDish.objects.filter(order=order)
        content_dict["addresses"]=Address.objects.filter(customer=content_dict["customer"]).filter(delete_flag=False)
        return render(request, "customer/profile.html",content_dict)
    else:
        return HttpResponseNotAllowed(['GET'], 'illegal request')

def test(request):
    return render(request,"customer/search.html")

def signIn(request):
    if request.is_ajax() and request.method=="POST":
        global const
        postObj=json.loads(request.body)
        phone=postObj["phone"]
        password=postObj["password"]
        hasCustomer=Customer.objects.filter(phone=phone).filter(passwd=password)
        if hasCustomer.count()==1:
            request.session["customer_id"]=str(hasCustomer[0].id)
            request.session["issigned"]="True"
            return JsonResponse({"result":"success"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def signUp(request):
    if request.is_ajax() and request.method=="POST":
        global const
        postObj=json.loads(request.body)
        phone=postObj["phone"]
        password=postObj["password"]
        if Customer.objects.filter(phone=phone).count():
            return JsonResponse({"result":"dup_phone"})
        else:
            try:
                newCustomer=Customer()
                newCustomer.phone=phone
                newCustomer.passwd=password
                newCustomer.status=const.customer["NORMAL"]
                newCustomer.save()
                request.session["customer_id"]=str(newCustomer.id)
                request.session["issigned"]="True"
                return JsonResponse({"result":"success"})
            except Exception:
                return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def checkPhone(request):
    if request.is_ajax() and request.method=="POST":
        global const
        postObj=json.loads(request.body)
        phone=postObj["phone"]
        if Customer.objects.filter(phone=phone).count():
            return JsonResponse({"result":"fail"})
        else:
            return JsonResponse({"result":"success"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def createOrder(request):
    if request.is_ajax() and request.method=="POST":
        global const
        if request.session.get("issigned","False")=="True":
            postObj=json.loads(request.body)
            rest_id=postObj["rest_id"]
            order_dishes=postObj["order_dishes"]
            order=Order()
            order.customer=Customer.objects.get(pk=int(request.session.get("customer_id")))
            order.restaurant=Restaurant.objects.get(pk=rest_id)
            order.total=0
            order.status=const.order["UNCERTAIN"]
            order.save()
            for order_dish in order_dishes:
                orderDish=OrderDish()
                orderDish.order=order
                orderDish.dish=Dish.objects.get(pk=order_dish["dish_id"])
                orderDish.price=orderDish.dish.price
                orderDish.num=order_dish["dish_num"]
                order.total+=orderDish.price*orderDish.num
                orderDish.save()
            order.save()
            return JsonResponse({"result":"success","order_id":order.id})
        else:
            return JsonResponse({"result":"notsigned"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def submitOrder(request):
    if request.is_ajax() and request.method=="POST":
        global const
        if request.session.get("issigned","False")=="True":
            postObj=json.loads(request.body)
            order_id=int(postObj["order_id"])
            address_id=int(postObj["address_id"])
            order=Order.objects.get(pk=order_id)
            order.address=Address.objects.get(pk=address_id)
            order.order_time=datetime.datetime.now()
            order.status=const.order["PAYED"]
            order.save()
            orderDishes=OrderDish.objects.filter(order=order)
            for orderDish in orderDishes:
                orderDish.dish.total_count+=1
                orderDish.dish.save()
            return JsonResponse({"result":"success"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def manageAddress(request):
    if request.is_ajax() and request.method=="POST":
        global const
        if request.session.get("issigned","False")=="True":
            postObj=json.loads(request.body)
            customer_id=int(request.session.get("customer_id"))
            customer=Customer.objects.get(pk=customer_id)
            if postObj["type"]=="new":
                address=Address()
                address.name=postObj["name"]
                address.phone=postObj["phone"]
                address.address=postObj["address"]
                address.customer=customer
                address.save()
                customer.default_aid=address.id
                customer.save()
                return JsonResponse({"result":"success","address_id":address.id})
            elif postObj["type"]=="delete":
                address_id=postObj["address_id"]
                address=Address.objects.get(pk=address_id)
                address.delete_flag=True
                address.save()
                return JsonResponse({"result":"success"})
            elif postObj["type"]=="default":
                address_id=postObj["address_id"]
                customer.default_aid=address_id
                customer.save()
                return JsonResponse({"result":"success"})
        else:
            return JsonResponse({"result":"fail"})

    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def updatePasswd(request):
    if request.is_ajax() and request.method=="POST":
        global const
        if request.session.get("issigned","False")=="True":
            postObj=json.loads(request.body)
            customer_id=int(request.session.get("customer_id"))
            customer=Customer.objects.get(pk=customer_id)
            old_password=postObj["old_password"]
            if customer.passwd==old_password:
                new_password=postObj["new_password"]
                customer.passwd=new_password
                customer.save()
                return JsonResponse({"result":"success"})
            else:
                return JsonResponse({"result":"fail"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')


def cancelOrder(request):
    if request.is_ajax() and request.method=="POST":
        global const
        if request.session.get("issigned","False")=="True":
            postObj=json.loads(request.body)
            customer_id=int(request.session.get("customer_id"))
            order_id=postObj["order_id"]
            order=Order.objects.get(pk=order_id)
            if order.customer.id==customer_id:
                if order.status==const.order["PAYED"]:
                    order.status=const.order["CANCELLED"]
                    order.save()
                    return JsonResponse({"result":"success"})
                else:
                    return JsonResponse({"result":"fail"})
            else:
                return JsonResponse({"result":"fail"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def comment(request):
    if request.is_ajax() and request.method=="POST":
        global const
        if request.session.get("issigned","False")=="True":
            postObj=json.loads(request.body)
            order_id=postObj["order_id"]
            order_dishes=postObj["order_dishes"]
            print order_dishes
            order=Order.objects.get(pk=order_id)
            order.status=const.order["FINISHED"]
            order.save()
            for order_dish in order_dishes:
                orderDish=OrderDish.objects.get(pk=order_dish["order_dish_id"])
                orderDish.grade=int(order_dish["grade"])
                orderDish.comment=order_dish["comment"]
                orderDish.save()
                if orderDish.grade!=0:
                    orderDish.dish.total_grade+=orderDish.grade
                    orderDish.dish.grade_count+=1
                    orderDish.dish.ave_grade=orderDish.dish.total_grade/float(orderDish.dish.grade_count)
                    orderDish.dish.save()
            return JsonResponse({"result":"success"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def logout(request):
    if request.is_ajax() and request.method=="POST":
        global const
        if request.session.get("issigned","False")=="True":
            del request.session["issigned"]
            del request.session["customer_id"]
            return JsonResponse({"result":"success"})
        else:
            return JsonResponse({"result":"fail"})
    else:
        return HttpResponseNotAllowed(['POST'],'illegal request')

def redirect(request):
    return HttpResponseRedirect("/customer/index")

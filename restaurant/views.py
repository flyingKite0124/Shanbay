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
    return render(request,"restaurant/manage.html")

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

def manage(request):
    return render(request, "restaurant/signIn.html")

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
    return HttpResponse("manageDish")

def pollOrder(request):
    return HttpResponse("pollOrder")

def queryOrder(request):
    return HttpResponse("queryOrder")

def changeOrderStatus(request):
    return HttpResponse("changeOrderStatus")

def logout(request):
    return HttpResponse("logout")



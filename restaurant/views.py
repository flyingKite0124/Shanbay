from django.shortcuts import render
from database.models import *
from django.http import HttpResponse,HttpResponseRedirect

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

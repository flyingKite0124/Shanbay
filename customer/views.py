from django.shortcuts import render
from database.models import *
from django.http import HttpResponse,HttpResponseRedirect
import random

# Create your views here.
def index(request):
    return render(request,"customer/index.html")

def sign(request):
    return render(request,"customer/sign.html")

def restaurant(request):
    return render(request,"customer/restaurant.html")

def checkorder(request):
    return render(request,"customer/checkorder.html")

def search(request):
    return render(request,"customer/search.html")

def profile(request):
    return render(request,"customer/profile.html")

def redirect(request):
    return HttpResponseRedirect("/customer/index")


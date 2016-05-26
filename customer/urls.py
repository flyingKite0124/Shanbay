from django.conf.urls import include, url
import views

urlpatterns = [
    url(r'^index$',views.index,name="index"),
    url(r'^sign$',views.sign,name="sign"),
    url(r'^restaurant$',views.restaurant,name="restaurant"),
    url(r'^checkorder$',views.checkorder,name="checkorder"),
    url(r'^search$',views.search,name="search"),
    url(r'^profile$',views.profile,name="profile"),
]

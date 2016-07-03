from django.conf.urls import include, url
import views

urlpatterns = [
    url(r'^index$',views.index,name="index"),
    url(r'^sign$',views.sign,name="sign"),
    url(r'^restaurant$',views.restaurant,name="restaurant"),
    url(r'^checkorder$',views.checkorder,name="checkorder"),
    url(r'^search$',views.search,name="search"),
    url(r'^profile$',views.profile,name="profile"),
    url(r'^signIn$',views.signIn,name="signIn"),
    url(r'^signUp$',views.signUp,name="signUp"),
    url(r'^checkPhone$',views.checkPhone,name="checkPhone"),
    url(r'^createOrder$',views.createOrder,name="createOrder"),
    url(r'^test$',views.test,name="test"),
]

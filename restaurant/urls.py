from django.conf.urls import include, url
import views

urlpatterns = [
    url(r'^$',views.redirect,name="redirect"),
    url(r'^sign$',views.sign,name="sign"),
    url(r'^manage$',views.manage,name="manage"),
]


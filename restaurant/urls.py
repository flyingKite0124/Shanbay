from django.conf.urls import include, url
import views

urlpatterns = [
    url(r'^$',views.redirect,name="redirect"),
    url(r'^sign$',views.sign,name="sign"),
    url(r'^manage$',views.manage,name="manage"),
    url(r'^signIn$', views.signIn, name='signIn'),
    url(r'^signUp$', views.signUp, name='signUp'),
    url(r'^checkPhone$', views.checkPhone, name='checkPhone'),
    url(r'^checkName$', views.checkName, name='checkName'),
    url(r'^manage$', views.manage, name='manage'),
    url(r'^updateInformation$', views.updateInformation, name='updateInformation'),
    url(r'^changePasswd$', views.changePasswd, name='changePasswd'),
    url(r'^changeStatus$', views.changeStatus, name='changeStatus'),
    url(r'^manageDish$', views.manageDish, name='manageDish'),
    url(r'^pollOrder$', views.pollOrder, name='pollOrder'),
    url(r'^queryOrder$', views.queryOrder, name='queryOrder'),
    url(r'^changeOrderStatus$', views.changeOrderStatus, name='changeOrderStatus'),
    url(r'^logout$', views.logout, name='logout'),
]


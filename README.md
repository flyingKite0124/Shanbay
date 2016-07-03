# Shanbay
a django project for SE

Please run following command first:
```bash
git update-index --skip-worktree shanbay/my.cnf
```

# administrator
Create a superuser:
```bash
python manage.py createsuperuser
```
用你注册的帐号登录<a href="localhost:8000/admin">localhost:8000/admin</a>，进行数据库管理，如创建customs，restaurant，方便调试。

# ajax Template
上次给的ajax的模版发送的数据不是json格式的，和我们的接口不一致。这里重新给出发送json格式数据的ajax模版。
主要就是添加了
1. contentType: "application/json"
2. JSON.stringify()
```JavaScript
    //准备好你要发送的各种数据
    data = {
        phone: "13800000000"    // 填上接口中要的各种数据
        password: "123456"
    };
    //开始进行ajax请求
    $.ajax({
        url: "/resturant/signIn",   // 填上接口中要求的url
        data: JSON.stringify(data), //注意！这里跟上次给的模版不一样，我们的数据需要调用JSON.stringify()进行序列化。
        type: "POST",       // 据熊学长说都是POST请求，不用改
        dataType : "json",  // 据熊学长说都是json格式，不用改。这个是指定请求的返回值类型的
        contentType: "application/json", //这个是指定你发送的数据类型。注意，上次给的模版里面没有这个，这个一定要加。
    })
      //请求成功时的回调函数
      .done(function( data ) {  
        console.log(data);  //data里面有后端返回给你各种数据，按照接口取出来用  
      })
      /*请求失败时的回调函数，这个失败是指http的request失败，
       *某些接口中给你返回{result:"fail"},并不会调用这个函数。
       *你能成功收到这个{result:"fail"}返回，说明请求已经成功了*/
      .fail(function( xhr, status, errorThrown ) {  
        alert( "Sorry, there was a problem!" );
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
      })
      //总是会调用的回调函数，不需要的话就不注册
      .always(function( xhr, status ) {         
        alert( "The request is complete!" );
      });
```
var isOverWriten = false;

function sign_in() {
    data = {
        phone: $('#username').val(),
        password: $('#password').val(),
    };
    console.log(data)
    $.ajax({
            url: "/customer/signIn",   // 填上接口中要求的url
            data: JSON.stringify(data),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                $(window.location).attr('href', '/customer/index');
            }
            else {
                alert('用户名或密码错误');
            }
        })
    e.preventDefault();
};



$(".name-input").blur(function(){
  var phone = $(this).val();
  console.log("phone="+phone);
   $.ajax({
            url: "/customer/checkPhone",   // 填上接口中要求的url
            data: JSON.stringify(phone),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        }).done(function(data){
            if(data.result == 'success')
            {
                isOverWriten = false;
            }
            else {
                isOverWriten = true;
            }
        })
});



function sign_up(){
    if(isOverWriten)
    {
        confirm("您的号码已经注册过，请登陆");
        return
    }
    var phone       =   $('#username').val();
    var password    =   $('#password').val();
    data = {
        "phone":  phone
    };
    console.log(data)
    $.ajax({
            url: "/customer/checkPhone",   // 填上接口中要求的url
            data: JSON.stringify(data),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success'){
                 $(window.location).attr('href', '/customer/index');

            }
            else {
                alert('注册失败');
            }
        })
    e.preventDefault();
};
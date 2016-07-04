isOverWriten = false;

function sign_in(e) {
    data = {
        phone: $('#username').val(),
        password: $('#password').val(),
    };
    $.ajax({
            url: "/restaurant/signIn",   // 填上接口中要求的url
            data: JSON.stringify(data),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                $(window.location).attr('href', '/restaurant/manage');
            }
            else {
                alert('Username and password are not compitable.');
            }
        })
    e.preventDefault();
}

$(".username").blur(function(){
  var phone = $(this).val();
  console.log("phone="+phone);
   $.ajax({
            url: "/returant/checkPhone",   // 填上接口中要求的url
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


function slide(){
    console.log("fuck");
    $("#restname").css("display","block");
    $("#introduction").css("display","block");
    $("#address").css("display","block");
    $("#sign-in").click(sign_up);
    $("#sign-in").text('注册');
    $("#sige-in").attr("id","sign-up");
}


function hide(){
    $("#restname").css("display","none");
    $("#introduction").css("display","none");
    $("#address").css("display","none");
    $('#sign-up').click(sign_in);
    $('#sign-up').text(登陆);
    $('#sign-up').attr("id","sign-in");
}



function sign_up(e) {
    if(isOverWriten)
    {
        alert("该手机号已被注册，请使用密码登陆");
        return;
    }

    data = {
        phone: $('#username').val(),
        password: $('#password').val(),
        restaurant_name: $('#restname').val(),
        introduction: $('#introduction').val(),
        address:$('address').val(),
    };
    $.ajax({
            url: "/restaurant/signUp",   // 填上接口中要求的url
            data: JSON.stringify(data),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                $(window.location).attr('href', '/restaurant/sign');
            }
            else {
                alert('注册失败');
            }
        })
    e.preventDefault();
}
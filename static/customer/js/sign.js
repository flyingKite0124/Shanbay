var isOverWriten = false;

function sign_in() {
    data = {
        phone: $('#username').val(),
        password: $('#password').val()
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
}

$(document).ready(function()
{
    $("#username").blur(checkPhoneNumber)
});
function checkPhoneNumber()
{
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!myreg.test($("#username").val())){
        $("#alert").html("请输入合法的手机号");
        return false
    }
    else {
        $("#alert").html("");
        return true
    }
}

function sign_up() {
    if (!checkPhoneNumber())
        return;
    var phone = $('#username').val();
    var password = $('#password').val();
    data = {
        phone: phone,
        password: password
    };
    $.ajax({
            url: "/customer/signUp",   // 填上接口中要求的url
            data: JSON.stringify(data),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json"
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                $(window.location).attr('href', '/customer/index');

            }
            else if (data.result === "dup_phone") {
                $("#alert").html("您的号码已经注册过，请登录")
            }
            else {
                alert('注册失败');
            }
        })
};
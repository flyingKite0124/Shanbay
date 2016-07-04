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
                alert('Username and password are not compitable.');
            }
        })
    e.preventDefault();
}
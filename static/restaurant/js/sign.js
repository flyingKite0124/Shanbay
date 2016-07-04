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
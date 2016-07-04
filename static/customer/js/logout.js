function log_out() {
    $.ajax({
            url: "/customer/logout",   // 填上接口中要求的url
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
                alert('error');
            }
        })
}
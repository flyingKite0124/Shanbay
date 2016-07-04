function log_out(){
    $.ajax({
            url: "/restaurant/logout",   // 填上接口中要求的url
            data: JSON.stringify(null),
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
                alert('Fail to log out');
            }
        })
        .fail(ajax_fail_handler);
}
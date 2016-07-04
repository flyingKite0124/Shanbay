/*请求失败时的回调函数，这个失败是指http的request失败，
 *某些接口中给你返回{result:"fail"},并不会调用这个函数。
 *你能成功收到这个{result:"fail"}返回，说明请求已经成功了*/
function ajax_fail_handler(xhr, status, errorThrown) {
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
}

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
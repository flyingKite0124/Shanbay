var open_btn = $('#open_restaurant');
var close_btn = $('#close_restaurant');

/*请求失败时的回调函数，这个失败是指http的request失败，
 *某些接口中给你返回{result:"fail"},并不会调用这个函数。
 *你能成功收到这个{result:"fail"}返回，说明请求已经成功了*/
function ajax_fail_handler(xhr, status, errorThrown) {
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
}

function show_banned_btn(){
    $("#open_or_close").addClass('hide');
    $("#banned_btn").removeClass('hide');
}
function open_restaurant(e) {
    $.ajax({
            url: " /restaurant/changeStatus",   // 填上接口中要求的url
            data: {
                type: "open"    // 填上接口中要的各种数据
            },
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                open_btn.removeClass('btn-default');
                open_btn.addClass('btn-warning active');
                close_btn.removeClass('btn-warning active');
                close_btn.addClass('btn-default');
            }
            else {
                alert('您已被管理员封停');
                show_banned_btn();
            }
        })
        .fail(ajax_fail_handler)
}
function close_restaurant(e) {
    $.ajax({
            url: " /restaurant/changeStatus",   // 填上接口中要求的url
            data: {
                type: "close"    // 填上接口中要的各种数据
            },
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                close_btn.removeClass('btn-default');
                close_btn.addClass('btn-warning active');
                open_btn.removeClass('btn-warning active');
                open_btn.addClass('btn-default');
            }
            else {
                alert('您已被管理员封停');
                show_banned_btn();
            }
        })
        .fail(ajax_fail_handler);
}
function modify_dish(e){
    console.log('modify-dish');
}
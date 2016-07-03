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

function show_banned_btn() {
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
            url: "/restaurant/changeStatus",   // 填上接口中要求的url
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
function btn_modify_dish(e) {
    var dish_item = $(this).parent().parent().parent();
    var dish_info = dish_item.find(".dish-info");
    var dish_modify = dish_item.find(".dish-modify");
    dish_info.hide('fast');
    dish_modify.show('slow');
}
function btn_cancel_modify_dish(e) {
    var dish_item = $(this).parent().parent().parent();
    var dish_info = dish_item.find(".dish-info");
    var dish_modify = dish_item.find(".dish-modify");
    dish_modify.hide('fast');
    dish_info.show('slow');
}
function btn_submit_modify_dish(e) {
    var dish_modify = $(this).parent().parent();
    var dish = {
        type: 'update',
        dish_id: dish_modify.find(".dish-id").val(),
        name: dish_modify.find(".dish-name").val(),
        price: dish_modify.find(".dish-price").val(),
        introduction: dish_modify.find(".dish-introduction").val(),
    };
    console.log(dish);
    $.ajax({
            url: "/restaurant/manageDish",   // 填上接口中要求的url
            data: dish,
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                window.location.reload();
            }
            else {
                alert('Not success');
            }
        })
        .fail(ajax_fail_handler);
}

function btn_delete_dish(e) {
    var dish_modify = $(this).parent().parent();
    var dish = {
        type: 'delete',
        dish_id: dish_modify.find(".dish-id").val(),
    };
    console.log(dish);
    $.ajax({
            url: "/restaurant/manageDish",   // 填上接口中要求的url
            data: dish,
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                window.location.reload();
            }
            else {
                alert('Not success');
            }
        })
        .fail(ajax_fail_handler);
}



var dish_create = $('#dish-create');
var create_btn_row = $('#btn-create-dish').parent();
function btn_create_dish(e) {
    create_btn_row.hide('fast');
    dish_create.show('slow');
}
function btn_cancel_create_dish(e) {
    dish_create.hide('fast');
    create_btn_row.show('slow');
}

function btn_submit_create_dish(e) {
    var dish = {
        type: 'new',
        name: dish_create.find(".dish-name").val(),
        price: dish_create.find(".dish-price").val(),
        introduction: dish_create.find(".dish-introduction").val(),
    };
    console.log(dish);
    $.ajax({
            url: "/restaurant/manageDish",   // 填上接口中要求的url
            data: dish,
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                window.location.reload();
            }
            else {
                alert('Not success');
            }
        })
        .fail(ajax_fail_handler);
}

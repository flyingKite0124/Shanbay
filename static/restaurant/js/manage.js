var open_btn = $('#open_restaurant');
var close_btn = $('#close_restaurant');

function show_banned_btn() {
    $("#open-or-close").addClass('hide');
    $("#unauthorized-btn").addClass('hide');
    $("#banned-btn").removeClass('hide');
}
function show_unauthorized_btn() {
    $("#open-or-close").addClass('hide');
    $("#banned-btn").addClass('hide');
    $("#unauthorized-btn").removeClass('hide');
}
function open_restaurant(e) {
    $.ajax({
            url: " /restaurant/changeStatus",   // 填上接口中要求的url
            data: JSON.stringify({
                type: "open"    // 填上接口中要的各种数据
            }), //注意！这里跟上次给的模版不一样，我们的数据需要调用JSON.stringify()进行序列化。
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改。这个是指定请求的返回值类型的
            contentType: "application/json", //这个是指定你发送的数据类型。注意，上次给的模版里面没有。这个一定要加。
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
            data: JSON.stringify({
                type: "close"    // 填上接口中要的各种数据
            }),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
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
    var dish_item = $(this).parents(".dish-item");
    var dish_info = dish_item.find(".dish-info");
    var dish_modify = dish_item.find(".dish-modify");
    dish_info.hide('fast');
    dish_modify.show('slow');
}
function btn_cancel_modify_dish(e) {
    var dish_item = $(this).parents(".dish-item");
    var dish_info = dish_item.find(".dish-info");
    var dish_modify = dish_item.find(".dish-modify");
    dish_modify.hide('fast');
    dish_info.show('slow');
}
function btn_submit_modify_dish(e) {
    var dish_modify = $(this).parents(".dish-modify");
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
            data: JSON.stringify(dish),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
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
    var dish_info = $(this).parents(".dish-info");
    var dish = {
        type: 'delete',
        dish_id: dish_info.find(".dish-id").html(),
    };
    console.log(dish);
    $.ajax({
            url: "/restaurant/manageDish",   // 填上接口中要求的url
            data: JSON.stringify(dish),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                var dish_item = dish_info.parents(".dish-item");
                dish_item.remove();
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
            data: JSON.stringify(dish),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
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

var btn_modify_restaurant_row = $('#btn-modify-restaurant-row');
var btn_submit_or_cancel_modify_restaurant = $('#btn-submit-or-cancel-modify-restaurant');
var restaurant_info = $('#restaurant-info');
var restaurant_info_input = restaurant_info.find('input');
var restaurant_info_textarea = restaurant_info.find('textarea');
function btn_modify_restaurant(e) {
    btn_modify_restaurant_row.hide('fast');
    btn_submit_or_cancel_modify_restaurant.show('slow');
    restaurant_info_input.removeAttr('disabled');
    restaurant_info_textarea.removeAttr('disabled');
}
function btn_submit_modify_restaurant(e) {
    var restaurant = {
        restaurant_name: restaurant_info.find("#restaurant-name").val(),
        phone: restaurant_info.find("#restaurant-phone").val(),
        introduction: restaurant_info.find("#restaurant-introduction").val(),
        address: restaurant_info.find("#restaurant-address").val(),
        classification: restaurant_info_input.filter("[type='radio']:checked").val(),
    }
    console.log(restaurant);
    $.ajax({
            url: "/restaurant/updateInformation",   // 填上接口中要求的url
            data: JSON.stringify(restaurant),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
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

function btn_cancel_modify_restaurant(e, classification) {
    btn_submit_or_cancel_modify_restaurant.hide('fast');
    btn_modify_restaurant_row.show('slow');
    restaurant_info_input.attr('disabled', true);
    restaurant_info_textarea.attr('disabled', true);
    restaurant_info_input.filter('[type!=radio]').each(function () {
        j = $(this);
        j.val(j.attr('value'));
    });
    restaurant_info_textarea.val(restaurant_info_textarea.html());
    restaurant_info_input.filter("[type='radio']").attr('checked', false);
    $("#classification" + classification).attr('checked', true);
    //restaurant_info_input.filter("[type='radio']").filter("[value="+classification+"]").attr('checked',true);
}

function get_orders() {
    $.ajax({
            url: "/restaurant/pollOrder",   // 填上接口中要求的url
            data: JSON.stringify(null),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                //console.log(data.order_list);
                //console.log(typeof (data.order_list));
                $('#order-list').replaceWith(data.order_list);
            }
            else {
                alert('Fail to get orders');
            }
        })
        .fail(ajax_fail_handler);
}

function take_order(e) {
    var data = {
        order_id: $(e).parents('.order-item').find('.order-id').html(),
        type: "accept",
    };
    console.log(data.order_id);
    $.ajax({
            url: "/restaurant/changeOrderStatus",   // 填上接口中要求的url
            data: JSON.stringify(data),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                get_orders();
            }
            else {
                alert('Fail to change order status');
            }
        })
        .fail(ajax_fail_handler);
}

function send_food(e) {
    var data = {
        order_id: $(e).parents('.order-item').find('.order-id').html(),
        type: "sendout",
    };
    $.ajax({
            url: "/restaurant/changeOrderStatus",   // 填上接口中要求的url
            data: JSON.stringify(data),
            type: "POST",       // 据熊学长说都是POST请求，不用改
            dataType: "json",  // 据熊学长说都是json格式，不用改
            contentType: "application/json",
        })
        //请求成功时的回调函数
        .done(function (data) {
            if (data.result === 'success') {
                get_orders();
            }
            else {
                alert('Fail to change order status');
            }
        })
        .fail(ajax_fail_handler);
}
/**
* Created by zhw on 16-7-5.
*/
var order = {
    orderID : undefined,
    total : undefined,
    dishlist : [],
}

var addrlist = [];
var defaultAddr = -1;

function dishObj(name, price, num){
    this.name = name;
    this.subtotal = price * num;
    this.number = num;
}

function addrObj(id, name, address, phone){
    this.id = id;
    this.name = name;
    this.address = address;
    this.phone = phone;
}

function renderOrder(oid, total, dishes){
    $('#order-manager').attr('orderID', String(oid));
    var dishList = $('#checkoutcart-dishlist');
    dishList.empty();
    var count = 0;
    for(var i=0; i < dishes.length; i++){
        var item = $('<div>').addClass('checkoutcart-row');
        var name = $('<div>').addClass('cell dishname').text(dishes[i].name);
        var quantity = $('<div>').addClass('cell dishquantity').text(dishes[i].number);
        var price = $('<div>').addClass('cell dishprice').text('￥'+dishes[i].subtotal);
        item.append(name).append(quantity).append(price);
        dishList.append(item);
        count = count + dishes[i].number;
    }
    $('#totalprice').text(total+5);
    $('#totalquantity').text(count);
}

function renderAddress(addresses) {
    var addressList = $('#address-manager .list-group');
    addressList.empty();
    if (addresses.length === 0){
        var tip = $("<p>你还没有地址，请先添加地址</p>");
        addressList.append(tip);
    }
    for (var i=0; i < addresses.length; i++){
        var addrid = addresses[i].id;
        var item = $('<div>').addClass('list-group-item address-item').attr('addrID', String(addrid));
        var info = $('<div>').addClass('address-info');
        var edit = $('<div>').addClass('address-edit');
        item.append(info).append(edit);
        var icon = $('<span>').addClass('glyphicon glyphicon-ok-sign').attr('aria-hidden','true');
        var p1 = $('<p>');
        var p2 = $('<p>');
        var name= $('<span>').addClass('name').text(addresses[i].name);
        var phone= $('<span>').addClass('phone').text(addresses[i].phone);
        var address= $('<span>').addClass('address').text(addresses[i].address);
        p1.append(name).append(phone);
        p2.append(address);
        info.append(icon).append(p1).append(p2);
        var update = $('<button>').addClass('btn btn-link btn-md')
                .attr('data-toggle','modal').attr('data-target', '#addressdialog')
                .attr('onclick','showEditAddress(this)').html('<small>编辑</small>');
        var del = $('<button>').addClass('btn btn-link btn-md')
                .attr('data-toggle','modal').attr('data-target', '#confirmdialog')
                .attr('onclick','showDeleteAddress(this)').html('<small>删除</small>');
        var setdefault = $('<button>').addClass('btn btn-link btn-md')
            .attr('onclick', 'defaultAddress(this)').html('<small>设为默认地址</small>')
        edit.append(update).append(del).append(setdefault);
        addressList.append(item);
        if (addrid == defaultAddr){
            item.addClass('chosen');
        }
    }
    addListener();
}


function addAddress() {
    var name = $('#name').val();
    var addr = $('#address').val();
    var phone = $('#phone').val();
    $.ajax({
        url: "/customer/manageAddress",
        data: JSON.stringify({
            type:'new',
            name:name,
            phone:phone,
            address:addr
        }),
        type: "POST",
        contentType: "application/json",
    }).done(function (data) {
        if (data.result === "success") {
            addrlist.push(new addrObj(data.address_id, name, addr, phone));
            defaultAddr = data.address_id;
            renderAddress(addrlist);
        }else{
            alert("add address failed");
        }
    }).fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    })

    $('#addressdialog').modal('hide');
}

function updateAddress() {
    var id = $('#addressdialog').attr('addrID');
    id = Number(id);
    var name = $('#name').val();
    var addr = $('#address').val();
    var phone = $('#phone').val();
    $.ajax({
        url: "/customer/manageAddress",
        data:JSON.stringify({
            type:'update',
            address_id:id,
            name:name,
            phone:phone,
            address:addr
        }),
        type:"POST",
        contentType: "application/json",
    }).done(function (data) {
        if (data.result === "success"){
            var updated = addrlist.filter(function (item) {
                return item.id === id;
            })[0];
            updated.name = name;
            updated.phone = phone;
            updated.address = addr;
            renderAddress(addrlist);
        }else{
            alert("update failed");
        }
    }).fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    })

    $('#addressdialog').modal('hide');
}

function addressManage() {
    var option = $('#addressdialog').attr('type');
    if(option === "add")
            addAddress();
    else if (option === "update")
            updateAddress();
    else
            $("#addressdialog").modal('hide');
}

function deleteAddress(){
    var id = $('#confirmdialog').attr('addrID');
    id = Number(id);
    if (id == defaultAddr) {
        alert("Can't delete default address");
    } else {
        $.ajax({
            url: "/customer/manageAddress",
            data: JSON.stringify({
                type: 'delete',
                address_id: id
            }),
            type: "POST",
            contentType: "application/json",
        }).done(function (data) {
            if (data.result === "success") {
                var deleted = addrlist.filter(function (item) {
                    return item.id === id;
                })[0];
                addrlist.shift(deleted);
                renderAddress(addrlist);
            } else {
                alert("delete address failed");
            }
        }).fail(function (xhr, status, errorThrown) {
            alert("Sorry, there was a problem!");
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        })
    }

    $('#confirmdialog').modal('hide');
}

function defaultAddress(btn){
    var id = $(btn).parents('.address-item').attr('addrID')
    id = Number(id);
    $.ajax({
        url: "/customer/manageAddress",
        data:JSON.stringify({
            type:'default',
            address_id:id
        }),
        type:"POST",
        contentType: "application/json",
    }).done(function (data) {
        if (data.result === "success"){
            defaultAddr = id;
            alert("set default address success.");
        }
    }).fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    })
}

function submitOrder() {
    var address_id = $('.address-item.chosen').attr('addrID');
    address_id = Number(address_id);
    if (isNaN(address_id))
    {
        alert("请选择收货地址");
        return
    }
    $.ajax({
        url: "/customer/sumbitOrder",
        data:JSON.stringify({
            order_id: order.orderID,
            address_id: address_id
        }),
        type: "POST",
        contentType: "application/json",
    }).done(function (data) {
        if (data.result === "success"){
            location.href = "/customer/profile";
        }else{
            alert("submit filed");
        }
    }).fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);

    })
}

function addListener() {
    $('.address-item').find('.address-edit').hide();
    $('.payment-item').first().addClass('chosen');
    $('.address-item').on('mouseenter', function () {
        $(this).find('.address-edit').show();
    });

    $('.address-item').on('mouseleave', function () {
        $(this).find('.address-edit').hide();
    });

    $('.address-item').on('click', function () {
        $('.address-item').filter('.chosen').removeClass('chosen');
        $(this).addClass('chosen');
    });

    $('.payment-item').on('click', function () {
        $('.payment-item').filter('.chosen').removeClass('chosen');
        $(this).addClass('chosen');
    });
}
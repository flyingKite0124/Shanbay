/**
 * Created by flyingkite on 7/3/16.
 */

$(document).ready(function () {
    $("#testBtn").click(testCheckOrder);
    $("#checkorder").click(getCheckorder);
});

function testCheckOrder() {
    $.ajax({
        type: 'POST',
        url: '/customer/createOrder',
        data: JSON.stringify({
            "rest_id": 10,
            "order_dishes": [
                {
                    "dish_id": 2,
                    "dish_num": 3
                },
                {
                    "dish_id": 4,
                    "dish_num": 5
                },
                {
                    "dish_id": 6,
                    "dish_num": 7
                }
            ]
        }),
        //dataType: 'json',
        success: function (data) {
            if (data.result == 'success')
                alert("success");
        }
    })
    //$.post("/customer/createOrder", {
    //    rest_id: 10,
    //    order_dishes: [
    //        {
    //            dish_id: 2,
    //            dish_num: 3
    //        },
    //        {
    //            dish_id: 4,
    //            dish_num: 5
    //        },
    //        {
    //            dish_id: 6,
    //            dish_num: 7
    //        }
    //    ]
    //}, function (data) {
    //    alert("success")
    //}, "json")
}

data={
    result:"success",
    orders:[
        {
            order_id:1,
            order_status:2,
            address:"7舍",
            phone:"1888xxx",
            name:"熊青城",
            dish:[
                {
                    dish_id:12,
                    dish_num:2
                },
                {
                    dish_id:2,
                    dish_num:1
                }
            ]
        }
    ]
};

function getCheckorder(){
    $.ajax({
        url: "/customer/checkorder",
        data: {
            order_id: 1
        },
        type:"GET",
        contentType:"application/json"
    }).done(function (data){
        alert("done");
    }).fail(function (xhr, statu) {
        alert(statu);
    })
}

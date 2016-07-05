function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

var getCookies = function(){
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i=0; i < pairs.length; i++){
    var pair = pairs[i].split("=");
    cookies[pair[0].trim()] = unescape(pair[1]);
  }
  return cookies;
}


var cartItem = {

	initTop : -34,

	curTop : undefined,

	itemList : {},

	dishRef : {},

	init : function (dl){
		for (var i = 0; i < dl.length; ++i){
			this.dishRef[dl[i].id] = dl[i];
		}
	},

	readCookies : function (){
		cookies = getCookies();
		for (k in cookies){
			if (k in this.dishRef){
				this.itemList[k] = parseInt(cookies[k]);
			}
		}
		this.render();
	},

	add : function (btn){
		dishid = $(btn.parentElement).attr('did');
		if (dishid in this.itemList){
			this.itemList[dishid] += 1;
			setCookie(dishid, this.itemList[dishid], 1);
		}
		else {
			this.itemList[dishid] = 1;
			setCookie(dishid, 1, 1);
		}
		this.render();
	},

	plus : function (btn){
		dishid = $(btn.parentElement.parentElement).attr('did');
		this.itemList[dishid] += 1;
		setCookie(dishid, this.itemList[dishid], 1);
		//$(btn).parent().find('input')[0].value = this.itemList[dishid];
		this.render();
	},

	minus : function (btn){
		dishid = $(btn.parentElement.parentElement).attr('did');
		this.itemList[dishid] -= 1;
		setCookie(dishid, this.itemList[dishid], 1);
		if (this.itemList[dishid] == 0){
			delete this.itemList[dishid];
			setCookie(dishid, 0, -1);
		}
		//$(btn).parent().find('input')[0].value = this.itemList[dishid];
		this.render();
	},
	/*
		<div class="shop-cartbasket-list">
			<div class="shop-cartbasket-item">
				<div class="shop-cartbasket-cell itemname">汉堡1</div>
				<div class="shop-cartbasket-cell itemquantity">
					<button>-</button>
					<input>
					<button>+</button>
				</div>
				<div class="shop-cartbasket-cell itemtotal">￥99</div>
			</div>
		</div>
	*/
	render : function(){
		$('.shop-cartbasket-list').empty();
		this.curTop = this.initTop + Object.keys(this.itemList).length * -44;
		var basketEle = $('.shop-cartbasket-list');
		var checkoutPrice = 0;
		for (k in this.itemList){
			var item = $('<div>').attr('did', k).attr('class', 'shop-cartbasket-item');
			var name = $('<div>').attr('class', 'shop-cartbasket-cell itemname').text(this.dishRef[k].name);
			var quantity = $('<div>').attr('class', 'shop-cartbasket-cell itemquantity');
			quantity.append($('<button>').attr('onclick', 'cartItem.minus(this)').text('-'));
			var input = $('<input>');
			input[0].value = this.itemList[k];
			quantity.append(input);
			quantity.append($('<button>').attr('onclick', 'cartItem.plus(this)').text('+'));
			var tp = this.dishRef[k].price * this.itemList[k];
			var total = $('<div>').attr('class', 'shop-cartbasket-cell itemtotal').text('￥' + tp.toString())
			checkoutPrice += tp;
			item.append(name).append(quantity).append(total);
			basketEle.append(item);
		}
		$('.shop-cartbasket').attr('style','top : ' + this.curTop.toString() + 'px');
		$('.shop-cartfooter .shop-cartfooter-price').text('￥' + checkoutPrice.toString());
	},

	clear : function (){
		this.itemList = {};
		//this.cartListObj.empty();
		$('.shop-cartbasket-list').empty();
		cookies = getCookies();
		for (k in cookies){
			if (k in this.dishRef){
				setCookie(k, 0, -1);
			}
		}
		$('.shop-cartbasket').attr('style','top : ' + this.initTop.toString() + 'px');
		$('.shop-cartfooter .shop-cartfooter-price').text('￥0');
		this.curTop = this.initTop;
	}
}

var dishItem = {
	restID : undefined,
	dl : [],
}

function shopObj(name, introduction, logo_path){
	this.name = name;
	this.introduction = introduction;
	this.logo_path = logo_path;
}

function dishObj(id, name, price, introduction, total_count, grade_count, total_grade, pic_path){
	this.id = id;
	this.name = name;
	this.price = price;
	this.introduction = introduction;
	this.total_count = total_count;
	this.grade_count = grade_count;
	this.total_grade = total_grade;
	this.pic_path = pic_path;
	this.grade = this.total_grade / this.grade_count;
}

var sortObj = function (tosort, key, inverse) {
	var temp = tosort.slice(0);
	if (inverse){
		temp.sort(function(a, b) {
			var x = a[key];
			var y = b[key];
			return x < y ? 1 : x > y ? -1 : 0;
		});
	}
	else {
		temp.sort(function(a, b) {
			var x = a[key];
			var y = b[key];
			return x > y ? 1 : x < y ? -1 : 0;
		});
	}
	
	return temp;
}

function sortTitle(str){
	$('#shopnav-title').text(str);
}

function renderDishes(dishlist){
	/*
	<div id="dish1" class="dishitem">
		<img src="./logo.jpeg" class="dishitem-pic">
		<p class="dishitem-name">汉堡1</p>
		<p>
			<span class="dishitem-grade">xxxxx</span>
			<span class="dishitem-count">月销 99 份</span>
		</p>
		<span class="dishitem-price">99 元</span>
		<button class="shop-cartbutton" onclick="cartItem.add()">加入购物车</button>
	</div>
	*/
	this.dlElement = $('#dishlist');
	this.dlElement.empty();
	for (var i = 0; i < dishlist.length; ++i){
		//var item = $('<div>').attr('did', 'dish' + (i+1).toString()).attr('class', 'dishitem');
		var item = $('<div>').attr('did', (i+1).toString()).attr('class', 'dishitem');
		var img = $('<img>').attr('class', 'dishitem-pic').attr('src', dishlist[i].pic_path);
		var name = $('<name>').attr('class', 'dishitem-name').text(dishlist[i].name);
		var d = $('<div>');
		//var grade = $('<span>').attr('class', 'dishitem-grade').text(dishlist[i].grade);
		var grade = $('<div class="dishitem-grade" data-steps="2"><ul class="star-bg"><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li></ul><ul class="star-bg star-fg"><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li><li><a href="#"><span class="glyphicon glyphicon-star"></span></a></li></ul></div>');
		gradeScore = Math.round(dishlist[i].grade * 20);
		grade.children().filter('.star-fg').css('width', gradeScore + '%');
		var gradeCount = $('<span>').attr('class', 'dishitem-gradecount').text('(' + dishlist[i].grade_count + ')');
		var count = $('<span>').attr('class', 'dishitem-count').text('月销 ' + dishlist[i].total_count + ' 份');
		d.append(grade).append(gradeCount).append(count);
		var price = $('<span>').attr('class', 'dishitem-price').text(dishlist[i].price.toString() + ' 元');
		var button = $('<button>').attr('class', 'shop-cartbutton').attr('onclick','cartItem.add(this)').text('加入购物车');
		item.append(img).append(name).append(d).append(price).append(button);
		this.dlElement.append(item);
	}
}

function sendOrder() {
	orderDishes = []
	for (k in cartItem.itemList){
		orderDishes.push({'dish_id' : k, 'dish_num' : cartItem.itemList[k]});
	}
	$.ajax({
		type	: 'POST',
		url		: '/customer/createOrder',
		contentType: "application/json",
		dataType : "json",
		data	: JSON.stringify({rest_id : dishItem.restID, order_dishes : orderDishes})
	}).done(function (data) {
		if(data.result=="success") {
			cartItem.clear();
			cartItem.render();
			location.href = "/customer/checkorder?order_id=" + data.order_id;
		}
		else if(data.result=="notsigned")
		{
			alert("您还未登录");
			location.href="/customer/sign"
		}
	});
}
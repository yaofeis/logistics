import Vue from 'vue'
import App from './App'
import './icon/iconfont.css'
import http from './http/http.js'

Vue.config.productionTip = false
Vue.prototype.http = http;

Vue.prototype.request = function(params, isLoad = true) {
	isLoad && uni.showLoading({
		title: '加载中',
		mask: true
	});
	uni.request({
		method: params.type || "post",
		url: params.url,
		data: params.data,
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		success: (res) => {
			isLoad && uni.hideLoading();
			params.success(res.data);
		}
	});
}

Vue.filter('time', function(value) {
	let _date = new Date(value);
	let _year = _date.getFullYear();
	let _month = _date.getMonth() + 1;
	let _day = _date.getDate();
	return `${_year}-${_month}-${_day}`;
})

Vue.filter('orderState', function(value) {
	switch (value) {
		case 1:
			return "待抢单";
		case 2:
			return "待取货";
		case 3:
			return "装货中";
		case 4:
			return "待收货";
		case 5:
			return "卸货中";
		case 6:
			return "待结算";
		case 7:
			return "待支付";
		case 8:
			return "已完成";
		case 10:
			return "已取消";
	}
})

Vue.filter('tips', function(value) {
	switch (value) {
		case 1:
			return "感谢您对花城快线的信任，请耐心等待司机接单。";
		case 2:
			return "感谢您对花城快线的信任，司机师傅正在快马加鞭的赶到，请耐心等待司机上门取货。";
		case 3:
			return "感谢您对花城快线的信任，司机师傅正在忙碌的装货中。";
		case 4:
			return "感谢您对花城快线的信任，司机师傅正护送您的货物到指定地点，请耐心等候。";
		case 5:
			return "感谢您对花城快线的信任，司机师傅正在忙碌的卸货中。";
		case 6:
			return "感谢您对花城快线的信任，司机师傅已经完成对货物的运送，等待司机师傅的结算中。";
		case 7:
			return "感谢您对花城快线的信任，司机师傅已经完成对货物的运送，请支付相应的酬劳。";
		case 8:
			return "感谢您对花城快线的信任，司机师傅已经完成对货物的运送，期待您的再次光临。";
		case 10:
			return "您已取消此次订单。";
	}
})

Vue.filter('timeDetail', function(value) {
	let _date = new Date(value);
	let _month = _date.getMonth() + 1;
	let _day = _date.getDate();
	let _hour = _date.getHours();
	let _minute = _date.getMinutes();
	_month = _month < 10 ? `0${_month}` : _month;
	_day = _day < 10 ? `0${_day}` : _day;
	_hour = _hour < 10 ? `0${_hour}` : _hour;
	_minute = _minute < 10 ? `0${_minute}` : _minute;
	return `${_month}月${_day}日 ${_hour}:${_minute}`;
})

Vue.filter('date', function(value) {
	let _date = new Date(value);
	let _year = _date.getFullYear();
	let _month = _date.getMonth() + 1;
	let _day = _date.getDate();
	let _hour = _date.getHours();
	let _minute = _date.getMinutes();
	_month = _month < 10 ? `0${_month}` : _month;
	_day = _day < 10 ? `0${_day}` : _day;
	_hour = _hour < 10 ? `0${_hour}` : _hour;
	_minute = _minute < 10 ? `0${_minute}` : _minute;
	return `${_year}-${_month}-${_day} ${_hour}:${_minute}`;
})

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

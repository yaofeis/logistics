const _http = 'https://www.sqyj.tech/transportation-server/';
const http = {
	getBanner: _http + 'banner/getBannerList.do',// 获取首页banner
	getNewsList: _http + 'news/getNewsList.do',// 获取新闻列表
	getNewsDetail: _http + 'news/getNewsById.do',// 获取新闻详情
	getCouponList: _http + 'userCoupon/getUserCouponList.do',// 获取优惠券列表
	getTransportList: _http + 'transport/getTransportList.do',// 获取运输工具列表
	getTransportGoodsList: _http + 'transportGoods/getTransportGoodsList.do',// 同城快送货物列表
	login: _http + 'user/thirdPartyLogin.do',// 用户登录(注册信息)
	getOpenId: _http + 'user/getOpenId.do',// 获取用户openId
	priceBudget: _http + 'order/priceBudget.do',// 价格预算
	addOrder: _http + 'order/addOrder.do',// 用户下单
	getOrderList: _http + 'order/getOrderList.do',// 获取用户订单列表
	orderDetail: _http + 'order/getOrderById.do',// 用户订单列表详情
	oneFileUpload: _http + 'fileUpload/oneFileUpload.do',// 单文件上传
	driverApply: _http + 'driver/driverApply.do',// 司机认证
	getRobOrderList: _http + 'order/getRobOrderList.do',// 获取司机端抢单列表
	orderTaking: _http + 'order/orderTaking.do',// 司机抢单
	driverPickup: _http + 'order/driverPickup.do',// 司机提货码
	loadingComplete: _http + 'order/loadingComplete.do',// 司机装卸货完成
	userPickup: _http + 'order/userPickup.do',// 司机到货码
	orderSettlement: _http + 'order/orderSettlement.do',// 订单结算
	getDriverDealList: _http + 'driverDeal/getDriverDealList.do',// 获取司机交易记录
	addWithdrawal: _http + 'withdrawal/addWithdrawal.do',// 司机提现申请
	addAppraise: _http + 'appraise/addAppraise.do',// 添加评价
	orderCancel: _http + 'order/orderCancel.do',// 取消订单
	pay: _http + 'pay/createPay.do',// 支付
	getRecevieCouponList: _http + 'coupon/getCouponList.do', // 获取领取优惠券时的优惠券列表
	addUserCoupon: _http + 'userCoupon/addUserCoupon.do', // 领取优惠券
};
export default http;
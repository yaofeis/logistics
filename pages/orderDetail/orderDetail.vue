<template>
	<view id="order_detail">
		<view>
			{{orderInfo.status | orderState}}
			&nbsp;
			<text class="iconfont icon-youjiantou"></text>
		</view>
		<view class="top">
			<view>{{orderInfo.status | tips}}</view>
			<navigator v-if="orderInfo.status === 8" :url="'/pages/evaluate/evaluate?orderId='+orderInfo.orderId">评价</navigator>
			<view v-if="orderInfo.status === 7" class="btn" @click="pay">去支付</view>
			<view v-if="orderInfo.status === 1 || orderInfo.status === 2" class="btn" @click="cancelOrder">取消订单</view>
		</view>
		<view class="middle">
			<image src="../../static/logo.png"></image>
		</view>
		<view class="bottom">
			<view class="adress">
				<view>出发地：{{orderInfo.startPlace}}</view>
				<view>目的地：{{orderInfo.endPlace}}</view>
			</view>
			<view class="info">
				<view>公里数：{{orderInfo.distance}}km</view>
				<view v-if="orderInfo.couponPrice !== 0">优惠券：-{{orderInfo.couponPrice}}</view>
				<view v-if="orderInfo.driverName">司机：{{orderInfo.driverName}}</view>
			</view>
			<view class="price" v-if="orderInfo.status === 1 || orderInfo.status === 2 || orderInfo.status === 3 || orderInfo.status === 4 || orderInfo.status === 5 || orderInfo.status === 6">
				已优惠￥{{orderInfo.couponPrice}}，预计：￥{{orderInfo.estimatePrice}}
			</view>
			<view class="price" v-if="orderInfo.status === 7 || orderInfo.status === 8">
				已优惠￥{{orderInfo.couponPrice}}，合计：￥{{orderInfo.actualPrice}}
			</view>
			<view class="btn" v-if="orderInfo.driverMobile">
				<view @click="callPhone">
					<image src="../../static/contact-people.png" mode="widthFix"></image>联系我们
				</view>
				<view @click="callDriver">
					<image src="../../static/contact-driver.png" mode="widthFix"></image>联系司机
				</view>
			</view>
			<view class="singleBtn" v-else @click="callPhone">
				<image src="../../static/contact-people.png" mode="widthFix"></image>联系我们
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo: {}
			}
		},
		onLoad(params) {
			this.init(params.orderId);
		},
		methods: {
			// 支付
			pay() {
				let _this = this;
				_this.request({
					url: _this.http.pay,
					data: {
						orderId: _this.orderInfo.orderId,
						openId: uni.getStorageSync("userInfo").openId
					},
					success: (res) => {
						if (res.code === '0') {
							if (res.result.result_code.toLowerCase() === "success" && res.result.return_code.toLowerCase() === "success") {
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.result.timeStamp,
									nonceStr: res.result.nonce_str,
									package: `prepay_id=${res.result.prepay_id}`,
									signType: 'MD5',
									paySign: res.result.paySign,
									success: function(res) {
										uni.showToast({
											title: "支付成功",
											icon: 'success'
										});
										setTimeout(()=>{
											_this.init(_this.orderInfo.orderId);
										}, 1500);
									},
									fail: function(err) {
										uni.showToast({
											title: "支付失败",
											icon: 'none'
										});
									}
								});
							} else {
								uni.showToast({
									title: "支付失败",
									icon: 'none'
								});
							}
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					}
				});
			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: '18302846993'
				});
			},
			callDriver() {
				uni.makePhoneCall({
					phoneNumber: this.orderInfo.driverMobile
				});
			},
			cancelOrder() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '是否取消该订单',
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: _this.http.orderCancel,
								data: {
									orderId: _this.orderInfo.orderId
								},
								success: (res) => {
									if (res.code === '0') {
										uni.showToast({
											title: "取消成功",
											icon: 'success'
										});
										_this.init(_this.orderInfo.orderId);
									} else {
										uni.showToast({
											title: res.message,
											icon: 'none'
										});
									}
								}
							});
						}
					}
				});
			},
			init(orderId) {
				let _this = this;
				_this.request({
					url: _this.http.orderDetail,
					data: {
						orderId: orderId
					},
					success: (res) => {
						if (res.code === '0') {
							_this.orderInfo = res.result;
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	#order_detail {
		padding: 20upx;
		font-size: $font-size-base;
		color: $text-color;
		background: $bg-color-F9F9F9;
		height: calc(100% - 40upx);

		>view:nth-of-type(1) {
			padding-bottom: 20upx;
		}

		.top {
			background: white;
			padding: 20upx;
			border-radius: 5px;

			>navigator,
			>.btn {
				border: 1px solid $bg-color-orange;
				color: $bg-color-orange;
				border-radius: 5px;
				padding: 8upx 40upx;
				display: inline-block;
				margin-top: 20upx;
			}
		}

		.middle {
			margin: 20upx 0;
			padding: 20upx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: white;
			border-radius: 5px;

			>image {
				width: 150upx;
				height: 150upx;
			}
		}

		.bottom {
			padding-top: 20upx;
			background: white;
			border-radius: 5px;

			>.adress,
			>.info,
			>.price {
				padding: 20upx;
			}

			>.btn {
				display: flex;
				align-items: center;
				height: 100upx;
				border-top: 1px solid $border-color;

				>view {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-basis: 50%;
					height: 100%;

					>image {
						width: 40upx;
						height: 40upx;
						will-change: transform;
						margin-right: 20upx;
					}
				}

				>view:nth-of-type(1) {
					border-right: 1px solid $border-color;
				}
			}

			>.singleBtn {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100upx;
				border-top: 1px solid $border-color;

				>image {
					width: 40upx;
					height: 40upx;
					will-change: transform;
					margin-right: 20upx;
				}
			}
		}
	}
</style>

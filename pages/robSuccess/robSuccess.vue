<template>
	<view id="detail">
		<view class="title">{{order.status | orderState}}</view>
		<view class="info">
			<view class="address">
				<view class="fa">发</view>
				<view>{{order.startPlace}}</view>
			</view>
			<view class="address">
				<view class="shou">收</view>
				<view>{{order.endPlace}}</view>
			</view>
			<view class="information">
				<view>
					<view>总距离:{{order.distance}}km</view>
					<view>{{order.transportName || order.goodsName}}</view>
				</view>
				<view>
					<view>￥<text>{{order.estimatePrice}}</text></view>
				</view>
			</view>
		</view>
		<view class="remark">
			<view>客户备注信息:</view>
			<view>{{order.remark || "无"}}</view>
		</view>
		<view class="agree">
			<view>是否需要搬运:{{order.isCarry === 1 ? '需要' : '不需要'}}</view>
			<view v-show="order.transportName">车型:{{order.transportName}}</view>
			<view>时间:{{order.appointmentTime | timeDetail}}</view>
		</view>
		<view class="navigation">
			<block v-if="order.status === 2">
				<view @click="pickUp(1)">
					导航到取货点
					<text class="iconfont icon-dingwei"></text>
				</view>
				<view @click="inputCode(1)">
					输入提货码
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</block>
			<block v-if="order.status === 3">
				<view @click="complete(1)">
					装货完成
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</block>
			<block v-if="order.status === 4">
				<view @click="pickUp(2)">
					导航到收货点
					<text class="iconfont icon-dingwei"></text>
				</view>
				<view @click="inputCode(2)">
					输入到货码
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</block>
			<block v-if="order.status === 5">
				<view @click="complete(2)">
					卸货完成
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</block>
			<block v-if="order.status === 6">
				<view @click="end">
					订单完成
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</block>
		</view>
		<view class="tips">
			若产生高速费用、停车费和搬运费需要用户按实际支付，若涉及
			逾时等候费用，请与司机按收费标准结算，如有问题请联系
		</view>
		<view class="btn">
			<navigator url="/pages/driverIndex/driverIndex" open-type="reLaunch">确定</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {}
			}
		},
		onLoad(params) {
			let _this = this;
			_this.request({
				url: _this.http.orderDetail,
				data: {
					orderId: params.orderId
				},
				success: (res) => {
					if (res.code === '0') {
						_this.order = res.result;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			})
		},
		onPullDownRefresh() {
			let _this = this;
			_this.request({
				url: _this.http.orderDetail,
				data: {
					orderId: _this.order.orderId
				},
				success: (res) => {
					if (res.code === '0') {
						_this.order = res.result;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
					uni.stopPullDownRefresh();
				}
			}, false)
		},
		methods: {
			pickUp(type) {
				const _this = this;
				let latitude = '';
				let longitude = '';
				let name = '';
				switch (type) {
					case 1:
						latitude = _this.order.startLat;
						longitude = _this.order.startLong;
						name = _this.order.startPlace;
						break;
					case 2:
						latitude = _this.order.endLat;
						longitude = _this.order.endLong;
						name = _this.order.endPlace;
						break;
				}
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: name,
					fail: function() {
						uni.showToast({
							icon: 'none',
							title: '打开失败，请完全关闭小程序之后再次进入或联系管理员。'
						})
					}
				});
			},
			inputCode(type) {
				uni.navigateTo({
					url: `/pages/code/code?type=${type}&orderId=${this.order.orderId}`
				})
			},
			complete(type) {
				let _this = this;
				let content = type === 1 ? '确定装货完成？' : '确定卸货完成？';
				uni.showModal({
					title: '提示',
					content: content,
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: _this.http.loadingComplete,
								data: {
									orderId: _this.order.orderId,
									type: type
								},
								success: (res)=>{
									if(res.code === "0"){
										uni.showToast({
											icon: "success",
											message: "操作成功"
										});
										_this.order.status = type === 1 ? 4 : 6;
									}else{
										uni.showToast({
											icon: "none",
											message: res.message
										})
									}
								}
							});
						}
					}
				});
			},
			end(){
				let _this = this;
				uni.showModal({
					title: '提示',
					content: "确定订单已完成，是否结算?",
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: _this.http.orderSettlement,
								data: {
									orderId: _this.order.orderId
								},
								success: (res)=>{
									if(res.code === "0"){
										uni.showToast({
											icon: "success",
											title: "操作成功"
										});
									}else{
										uni.showToast({
											icon: "none",
											title: res.message
										})
									}
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	#detail {
		color: $text-color;
		font-size: $font-size-base;
		padding: 20upx;

		.title {
			font-size: $font-size-lg;
			font-weight: bold;
			padding-bottom: 10upx;
		}

		.info {
			background: white;
			border: 1px solid $border-color;
			border-radius: 5px;
			margin-bottom: 40upx;

			.address {
				display: flex;
				align-items: center;
				padding: 40upx 10upx;
				border-bottom: 1px solid $border-color;

				.fa,
				.shou {
					background: $bg-color-fa;
					width: 50upx;
					height: 50upx;
					border-radius: 50upx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
					margin-right: 20upx;
				}

				.shou {
					background: $bg-color-shou;
				}
			}

			.information {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				padding: 10upx;

				>view:nth-of-type(1) {
					>view:nth-of-type(2) {
						color: $text-999999;
						border: 1px solid $border-color;
						border-radius: 5px;
						padding: 5upx 10upx;
						margin-top: 10upx;
						display: inline-block;
					}
				}

				>view:nth-of-type(2) {
					>view:nth-of-type(1) {
						>text {
							font-size: 40upx;
						}
					}
				}
			}
		}

		.remark {
			>view:nth-of-type(1) {
				padding-bottom: 10upx;
			}

			>view:nth-of-type(2) {
				border: 1px solid $border-color;
				height: 200upx;
				border-radius: 5upx;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow-y: auto;
				padding: 20upx;
			}
		}

		.agree {
			border: 1px solid $border-color;
			border-radius: 5upx;
			margin-top: 40upx;

			>view {
				padding: 10upx;
			}

			>view:nth-of-type(1),
			>view:nth-of-type(2) {
				border-bottom: 1px solid $border-color;
			}
		}

		.navigation {
			display: flex;
			justify-content: center;
			padding: 40upx;

			>view {
				border: 1px solid $border-color;
				padding: 5upx 10upx;
				border-radius: 5upx;
				margin-right: 20upx;
			}
		}

		.tips {
			color: $text-999999;
			margin-bottom: 120upx;
			font-size: $font-size-sm;
		}

		.btn {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: white;
			color: white;
			font-size: $font-size-lg;
			height: 120upx;

			>navigator {
				background: $bg-color-orange;
				height: 80upx;
				line-height: 80upx;
				border-radius: 5upx;
				width: calc(100% - 40upx);
				text-align: center;
				margin: 20upx;
			}
		}

	}
</style>

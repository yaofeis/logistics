<template>
	<view id="detail">
		<view class="title">订单详情</view>
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
		<view class="btn">
			<view @click="robOrder">立即抢单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {},
				orderId: 0
			}
		},
		onLoad(params) {
			let _this = this;
			_this.orderId = params.orderId;
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
		methods: {
			robOrder() {
				let _this = this;
				let driverId = uni.getStorageSync("userInfo").driverId;
				_this.request({
					url: _this.http.orderTaking,
					data: {
						orderId: _this.orderId,
						driverId: driverId
					},
					success: (res) => {
						if (res.code === '0') {
							uni.showToast({
								title: "抢单成功",
								icon: 'success',
								mask: true
							});
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/robSuccess/robSuccess?orderId=' + _this.orderId
								});
							}, 1500);
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
			margin-bottom: 120upx;

			>view {
				padding: 10upx;
			}

			>view:nth-of-type(1),
			>view:nth-of-type(2) {
				border-bottom: 1px solid $border-color;
			}
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

			>view {
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

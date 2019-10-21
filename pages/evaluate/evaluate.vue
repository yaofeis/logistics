<template>
	<view id="evaluate">
		<view class="title">您对司机满意嘛？</view>
		<view class="info">
			<view>司机：{{orderInfo.driverName}}</view>
			<view>电话：{{orderInfo.driverMobile}}</view>
			<view>时间：{{orderInfo.appointmentTime | date}}</view>
		</view>
		<view class="message">
			<view>评价信息</view>
			<textarea placeholder="请输入评价信息" v-model="content"></textarea>
		</view>
		<view class="btn" @click="submit">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo: {},
				content: ""
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
						_this.orderInfo = res.result;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		methods: {
			submit() {
				let _this = this;
				if (_this.content === "") {
					return uni.showToast({
						title: "请输入评价内容",
						icon: 'none'
					});
				}
				if (_this.content.length > 200) {
					return uni.showToast({
						title: "请输入200字以内的评论内容",
						icon: 'none'
					});
				}
				_this.request({
					url: _this.http.addAppraise,
					data: {
						orderId: _this.orderInfo.orderId,
						driverId: uni.getStorageSync("userInfo").driverId,
						content: _this.content
					},
					success: (res) => {
						if (res.code === '0') {
							uni.showToast({
								title: "评价成功",
								icon: 'success'
							});
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

	#evaluate {
		padding: 20upx;
		font-size: $font-size-base;
		color: $text-color;
		background: $bg-color-F9F9F9;
		height: calc(100% - 40upx);

		.title {
			text-align: center;
			padding-bottom: 20upx;
		}

		.info {
			border: 1px solid $border-color;
			border-radius: 5px;
			padding: 20upx;
			background: white;

			>view {
				line-height: 1.5;
			}
		}

		.message {
			border: 1px solid $border-color;
			border-radius: 5px;
			padding: 20upx;
			background: white;
			margin-top: 20upx;

			>textarea {
				border: 1px solid $border-color;
				margin-top: 20upx;
				width: calc(100% - 20upx);
				height: 200upx;
				padding: 10upx;
				border-radius: 5px;
			}
		}

		.btn {
			width: 60%;
			margin: auto;
			background: $bg-color-orange;
			;
			color: white;
			text-align: center;
			padding: 15upx 0;
			border-radius: 5px;
			margin-top: 20upx;
		}
	}
</style>

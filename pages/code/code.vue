<template>
	<view id="code">
		<view class="title">{{title}}</view>
		<view class="tips">请输入{{title}}码</view>
		<input type="number" maxlength="6" focus="true" v-model="code">
		<view class="btn">
			<view @click="submit">确定</view>
			<view @click="cancel">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '1',
				code: '',
				orderId: 0,
				title: '提货'
			}
		},
		// type = 1 提货  2 到货
		onLoad(params) {
			switch (params.type) {
				case '1':
					uni.setNavigationBarTitle({
						title: '提货码'
					});
					this.title = '提货';
					break;
				case '2':
					uni.setNavigationBarTitle({
						title: '到货码'
					});
					this.title = '到货';
					break;
			}
			this.type = params.type;
			this.orderId = params.orderId;
		},
		methods: {
			submit() {
				let _this = this;
				if (_this.code.length < 6) {
					return uni.showToast({
						icon: "none",
						title: '请输入正确的6位码'
					})
				}
				let data = {};
				let url = '';
				switch (_this.type) {
					case '1':
						data.orderId = _this.orderId;
						data.driverId = uni.getStorageSync("userInfo").driverId;
						data.sendCode = _this.code;
						url = _this.http.driverPickup;
						break;
					case '2':
						data.orderId = _this.orderId;
						data.sendCode = _this.code;
						url = _this.http.userPickup;
						break;
				}
				_this.request({
					url: url,
					data: data,
					success: (res) => {
						if (res.code === '0') {
							uni.showToast({
								icon: "success",
								title: "操作成功"
							});
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/robSuccess/robSuccess?orderId=' + this.orderId
								});
							}, 1500)
						} else {
							uni.showToast({
								icon: "none",
								title: res.message
							})
						}
					}
				})
			},
			cancel() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	#code {
		color: $text-color;
		font-size: $font-size-base;
		padding-top: 100upx;
		text-align: center;

		.title {
			font-weight: bold;
			font-size: $font-size-lg;
		}

		.tips {
			padding-top: 40upx;
			padding-bottom: 60upx;
		}

		>input {
			border-bottom: 1px solid black;
			width: 300upx;
			margin: auto;
			height: 60upx;
			font-size: $font-size-lg;
		}

		.btn {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			display: flex;
			align-items: center;

			>view {
				width: 50%;
				background: $bg-color-orange;
				color: white;
				padding: 25upx 0;
				font-size: $font-size-lg;
				letter-spacing: 10upx;
			}

			>view:nth-of-type(2) {
				background: $bg-color;
			}
		}
	}
</style>

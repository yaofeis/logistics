<template>
	<view id="withdrawal">
		<view class="form">
			<view>
				<text>提现金额:</text>
				<input type="number" v-model="form.amount">
			</view>
			<view>
				<text>账户名:</text>
				<input type="text" v-model="form.name">
			</view>
			<view>
				<text>开户行:</text>
				<input type="text" v-model="form.back">
			</view>
			<view>
				<text>银行卡号:</text>
				<input type="number" v-model="form.card">
			</view>
			<view>
				<text>预留人手机:</text>
				<input type="number" v-model="form.tel">
			</view>
		</view>
		<view class="tips">提示:提现金额1-3个工作日到账，请耐心等待!</view>
		<view class="btn">
			<view @click="showMoney">提现</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					amount: uni.getStorageSync("userInfo").balance || 0,
					name: "",
					back: "",
					card: "",
					tel: ""
				}
			}
		},
		onLoad() {

		},
		methods: {
			showMoney() {
				let _this = this;
				if (_this.form.amount < 0) {
					return uni.showToast({
						title: "提现金额需为大于0",
						icon: 'none'
					});
				}
				if (_this.form.amount > uni.getStorageSync("userInfo").balance) {
					return uni.showToast({
						title: "提现金额不能大于余额",
						icon: 'none'
					});
				}
				if (_this.form.name === '') {
					return uni.showToast({
						title: "请输入账户名",
						icon: 'none'
					});
				}
				if (_this.form.back === '') {
					return uni.showToast({
						title: "请输入开户行",
						icon: 'none'
					});
				}
				if (_this.form.card === '') {
					return uni.showToast({
						title: "请输入银行卡号",
						icon: 'none'
					});
				}
				if (!/^[1][0-9][0-9]{9}$/.test(_this.form.tel)) {
					return uni.showToast({
						title: "请输入正确的预留人手机",
						icon: 'none'
					});
				}
				_this.request({
					url: _this.http.addWithdrawal,
					data: {
						driverId: uni.getStorageSync("userInfo").driverId,
						withdrawalMoney: _this.form.amount,
						accountUser: _this.form.name,
						openingBank: _this.form.back,
						bankCard: _this.form.card,
						mobile: _this.form.tel
					},
					success: (res) => {
						if (res.code === '0') {
							uni.showToast({
								title: "提现成功",
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
	#withdrawal {
		font-size: $font-size-base;
		color: $text-color;
		padding: 20upx;

		.form {
			>view {
				border-bottom: 1px solid $border-color;
				display: flex;
				align-items: center;
				padding: 10upx 0;

				>text {
					flex-basis: 180upx;
					text-align: justify;
				}

				>input {
					flex-basis: calc(100% - 180upx);
				}
			}
		}

		.tips {
			color: $text-999999;
			padding-top: 10upx;
			font-size: $font-size-sm;
		}

		.btn {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 120upx;
			padding: 20upx;
			box-sizing: border-box;

			>view {
				width: 100%;
				height: 100%;
				background: $bg-color-orange;
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 5px;
			}
		}
	}
</style>

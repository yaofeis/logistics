<template>
	<view id="select">
		<view class="info">
			<view>{{info.name}}</view>
			<image src="../../static/logo.png"></image>
		</view>
		<view class="btn">
			<view>您是</view>
			<view @click="toIndex(1)">用户</view>
			<view @click="toIndex(2)">司机</view>
		</view>
		<view class="bottom">
			<view>{{info.name}}</view>
			<view>{{info.title}}</view>
			<view>
				<text>联系方式:{{info.tel}}</text>
				<text>电子邮箱:{{info.email}}</text>
			</view>
		</view>
		<view class="setting" v-show="isShow" @click="setting">
			<image src="../../static/setting.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				data: null,
				isSuccess: false,
				info: {
					name: "",
					title: "",
					tel: "",
					email: ""
				}
			}
		},
		onLoad() {
			let _this = this;
			uni.login({
				provider: 'weixin',
				success: function(res) {
					if (res.code) {
						_this.getUserData(res.code);
					}
				}
			});

			// 获取系统设置
			_this.request({
				url: _this.http.getSetting,
				data: {
					settingId: 1
				},
				success(res) {
					if (res.code === '0') {
						_this.info.name = res.result.platName;
						_this.info.title = res.result.platTitle;
						_this.info.tel = res.result.platMobile;
						_this.info.email = res.result.platMail;
						uni.setStorageSync('serveMobile', res.result.serveMobile);
					} else {
						uni.showToast({
							title: res.message,
							duration: 2000,
							icon: 'none'
						});
					}
				}
			});
		},
		methods: {
			// 小程序登录之后获取用户信息
			getUserData(code) {
				let _this = this;
				_this.request({
					url: _this.http.getOpenId,
					data: {
						jsCode: code
					},
					success: (res) => {
						if (res.code === '0') {
							_this.isSuccess = true;
							uni.setStorageSync('openId', res.result.openId);
							_this.getJurisdiction();
						} else {
							uni.showToast({
								title: '登录失败，请重新进入小程序!',
								duration: 2000,
								icon: 'none'
							});
						}
					}
				});
			},

			// 获取用户地理位置权限
			getJurisdiction() {
				let _this = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.userLocation']) {
							uni.authorize({
								scope: 'scope.userLocation',
								success() {
									uni.getLocation();
								},
								fail() {
									_this.isShow = true;
									uni.showToast({
										title: '请允许花城快线使用您的地理位置,点击左上角设置打开',
										icon: 'none',
										mask: true
									});
								}
							})
						}
					}
				});
			},

			// 点击按钮1用户2司机
			toIndex(type) {
				let _this = this;
				if (!_this.isSuccess) return uni.showToast({
					title: '小程序登录失败，请重新登录',
					icon: 'none',
					mask: true
				});
				let url = type === 1 ? '/pages/index/index' : '/pages/driverIndex/driverIndex';
				uni.getSetting({
					success(res) {
						// 没有授权位置权限不让其进入小程序
						if (!res.authSetting['scope.userLocation']) {
							return uni.showToast({
								title: '请允许花城快线使用您的地理位置,点击左上角设置打开',
								icon: 'none',
								mask: true
							});
						}
						_this.request({
							url: _this.http.login,
							data: {
								openId: uni.getStorageSync("openId"),
								userType: type
							},
							success: (res) => {
								if (res.code === '0') {
									uni.removeStorageSync("userInfo");
									uni.setStorageSync('userInfo', res.result.userInfo);
									if (type === 2) {
										// 司机端判断状态，否则跳转到注册页面或不跳转（1通过2未通过3认证中4未认证）
										switch (res.result.userInfo.authStatus) {
											case 1:
												uni.reLaunch({
													url: url
												});
												break;
											case 2:
												uni.showToast({
													title: "您的审核资料未通过，请重新上传!",
													icon: 'none'
												});
												_this.toRegister();
												break;
											case 3:
												uni.showToast({
													title: "您的审核资料正在认证中，请耐心等待!",
													icon: 'none'
												});
												break;
											case 4:
												_this.toRegister();
												break;
										}
									} else {
										uni.reLaunch({
											url: url
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
					}
				})
			},
			// 跳转到司机注册页面
			toRegister() {
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/register/register'
					})
				}, 2000);
			},
			// 打开获取权限列表
			setting() {
				wx.openSetting({
					success(res) {
						res.authSetting = {
							"scope.userInfo": true,
							"scope.userLocation": true
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	#select {
		padding: 20upx;
		font-size: $font-size-base;
		color: $text-color;
		position: relative;
		height: calc(100% - 40upx);

		.info {
			text-align: center;

			>view {
				padding: 20upx;
			}

			>image {
				width: 150upx;
				height: 150upx;
				border-radius: 50%;
				will-change: transform;
				border: 1px solid $border-color;
			}
		}

		.btn {
			margin-top: 50upx;
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 20upx 0;

			>view:nth-of-type(1) {
				font-weight: bold;
			}

			>view:nth-of-type(2),
			>view:nth-of-type(3),
				{
				border-radius: 5upx;
				width: 70%;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				margin: 40upx 0;
			}

			>view:nth-of-type(2) {
				box-shadow: 0 0 8px 2px $bg-color-orange;
			}

			>view:nth-of-type(3) {
				background: $bg-color;
				color: white;
				box-shadow: 0 0 8px 2px $bg-color;
			}
		}

		.bottom {
			position: absolute;
			bottom: 0;
			left: 0;
			width: calc(100% - 40upx);
			padding: 20upx;
			text-align: center;
			font-size: $font-size-sm;
			color: $text-999999;

			>view:nth-of-type(1),
			>view:nth-of-type(2) {
				line-height: 1.5;
			}

			>view:nth-of-type(2) {
				padding-bottom: 20upx;
			}

			>view:nth-of-type(3) {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}

		.setting {
			position: fixed;
			top: 20upx;
			left: 20upx;
			width: 50upx;
			height: 50upx;
			border-radius: 50%;
			box-shadow: 0 0 8px 2px $bg-color-orange;
			overflow: hidden;

			>image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>

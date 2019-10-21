<template>
	<view id="select">
		<view class="info">
			<view>花城快线</view>
			<image src="../../static/logo.png"></image>
		</view>
		<view class="btn">
			<view>您是</view>
			<view @click="toIndex(1)">用户</view>
			<view @click="toIndex(2)">司机</view>
		</view>
		<view class="bottom">
			<view>花城快线</view>
			<view>帮您拉货、搬家、运东西!</view>
			<view>
				<text>联系方式:18302846993</text>
				<text>电子邮箱:185286405@qq.com</text>
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
				isSuccess: false
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
							uni.setStorageSync('userData', res.result);
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
				let url = type === 1 ? '/pages/index/index' : '/pages/register/register';
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.userLocation']) {
							uni.showToast({
								title: '请允许花城快线使用您的地理位置,点击左上角设置打开',
								icon: 'none',
								mask: true
							});
						} else {
							_this.data = uni.getStorageSync('userData');
							if (_this.data.userType === 1) {
								uni.setStorageSync('userInfo', _this.data.userInfo);
								uni.reLaunch({
									url: '/pages/index/index'
								})
							} else if (_this.data.userType === 2) {
								uni.setStorageSync('userInfo', _this.data.userInfo);
								if (_this.data.userInfo.authStatus === 2) {
									uni.showToast({
										title: "您的审核被拒绝，请重新上传资料审核或与我司联系!",
										icon: 'none',
										duration: 2000
									});
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/register/register'
										})
									}, 2000)
									return false;
								} else if (_this.data.userInfo.authStatus === 3) {
									return uni.showToast({
										title: "您的审核正在审核中，请耐心等候!",
										icon: 'none'
									});
								}
								uni.reLaunch({
									url: '/pages/driverIndex/driverIndex'
								});
							} else {
								_this.request({
									url: _this.http.login,
									data: {
										openId: uni.getStorageSync("userData").openId,
										userType: type
									},
									success: (res) => {
										if (res.code === '0') {
											uni.removeStorageSync("userData");
											uni.setStorageSync('userData', res.result);
											uni.removeStorageSync("userInfo");
											uni.setStorageSync('userInfo', res.result.userInfo);
											uni.reLaunch({
												url: url
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
				})
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
			// goWhere() {
			// 	// 判断小程序跳转去哪个页面
			// 	let _this = this;
			// 	_this.data = uni.getStorageSync('userData');
			// 	if (_this.data.userType === 1) {
			// 		uni.setStorageSync('userInfo', _this.data.userInfo);
			// 		uni.reLaunch({
			// 			url: '/pages/index/index'
			// 		})
			// 	} else if (_this.data.userType === 2) {
			// 		uni.setStorageSync('userInfo', _this.data.userInfo);
			// 		if (_this.data.userInfo.authStatus === 2) {
			// 			uni.showToast({
			// 				title: "您的审核被拒绝，请重新上传资料审核或与我司联系!",
			// 				icon: 'none',
			// 				duration: 2000
			// 			});
			// 			setTimeout(() => {
			// 				uni.reLaunch({
			// 					url: '/pages/register/register'
			// 				})
			// 			}, 2000)
			// 			return false;
			// 		} else if (_this.data.userInfo.authStatus === 3) {
			// 			return uni.showToast({
			// 				title: "您的审核正在审核中，请耐心等候!",
			// 				icon: 'none'
			// 			});
			// 		}
			// 		uni.reLaunch({
			// 			url: '/pages/driverIndex/driverIndex'
			// 		});
			// 	}
			// }
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

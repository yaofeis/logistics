<template>
	<view id="register">
		<view class="top-box">
			<view>
				<text>姓名</text>
				<input type="text" placeholder="请输入姓名" v-model="params.realName">
			</view>
			<view>
				<text>手机号</text>
				<input type="number" placeholder="请输入手机号" v-model="params.mobile">
			</view>
			<view>
				<text>身份证</text>
				<input type="text" placeholder="请输入身份证" v-model="params.idCard">
			</view>
			<view>
				<text>车型</text>
				<picker :value="dataList[index].id" :range="dataList" range-key="transportName" @change="typeChange">
					<view class="picker">
						{{dataList[index].transportName}}
					</view>
				</picker>
			</view>
			<view>
				<text>车牌号</text>
				<input type="text" placeholder="请输入车牌号" v-model="params.plateNumber">
			</view>
			<view class="last">
				<text>认证状态</text>
				<radio-group @change="stateChange">
					<label>
						<radio value="1" checked="true" color="#FA893B" />快送
					</label>
					<label>
						<radio value="2" color="#FA893B" />货运
					</label>
					<label>
						<radio value="3" color="#FA893B" />快递
					</label>
				</radio-group>
			</view>
		</view>
		<view class="tel">
			<view>
				<text>紧急联系人</text>
				<input type="text" placeholder="请输入紧急联系人" v-model="params.emergencyContact">
			</view>
			<view class="last">
				<text>联系人电话</text>
				<input type="number" placeholder="请输入联系人电话" v-model="params.emergencyMobile">
			</view>
		</view>
		<view class="upload">
			<view>
				<text>身份证正面</text>
				<view @click="upload(1)">
					<image :src="idCardUrlOne"></image>
				</view>
			</view>
			<view>
				<text>身份证反面</text>
				<view @click="upload(2)">
					<image :src="idCardUrlTwo"></image>
				</view>
			</view>
			<view>
				<text>驾驶证</text>
				<view @click="upload(3)">
					<image :src="driveUrl"></image>
				</view>
			</view>
			<view>
				<text>行驶证</text>
				<view @click="upload(4)">
					<image :src="moveUrl"></image>
				</view>
			</view>
		</view>
		<view class="submit">
			<view @click="submit">申请入驻</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				index: 0,
				idCardUrlOne: '../../static/add.png',
				idCardUrlTwo: '../../static/add.png',
				driveUrl: '../../static/add.png',
				moveUrl: '../../static/add.png',
				params: {
					authType: 1,
					realName: '',
					mobile: '',
					idCard: '',
					transportId: '',
					plateNumber: '',
					emergencyContact: '',
					emergencyMobile: '',
					idCardFront: '',
					idCardBack: '',
					licenseImage: '',
					permitImage: ''
				}
			}
		},
		onLoad() {
			let _this = this;
			_this.request({
				url: _this.http.getTransportList,
				data: {
					pageNum: '1',
					pageSize: '100'
				},
				success: (res) => {
					if (res.code === '0') {
						_this.dataList = res.result;
						_this.params.transportId = res.result[0].transportId;
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
			// 车型
			typeChange(e) {
				this.index = e.detail.value
				this.params.transportId = this.dataList[this.index].transportId;
			},
			// 认证状态
			stateChange(e) {
				this.params.authType = e.detail.value;
			},
			// 上传图片
			upload(type) {
				let _this = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: function(res) {
						const tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '加载中',
							mask: true
						});
						uni.uploadFile({
							url: _this.http.oneFileUpload,
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'fileType': '2'
							},
							success: (result) => {
								uni.hideLoading();
								const resData = JSON.parse(result.data);
								if (resData.code === '0') {
									switch (type) {
										case 1:
											_this.idCardUrlOne = resData.result;
											_this.params.idCardFront = resData.result;
											break;
										case 2:
											_this.idCardUrlTwo = resData.result;
											_this.params.idCardBack = resData.result;
											break;
										case 3:
											_this.driveUrl = resData.result;
											_this.params.licenseImage = resData.result;
											break;
										case 4:
											_this.moveUrl = resData.result;
											_this.params.permitImage = resData.result;
											break;
									}
								} else {
									uni.showToast({
										title: resData.message,
										icon: 'none'
									});
								}
							}
						});

					}
				});
			},
			// 申请入驻
			submit() {
				let _this = this;
				let _params = _this.params;
				const regExp = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;
				if (_params.realName === '') {
					return uni.showToast({
						title: "请输入姓名",
						icon: 'none'
					});
				}
				if (!/^[1][0-9][0-9]{9}$/.test(_params.mobile)) {
					return uni.showToast({
						title: "请输入正确的手机号",
						icon: 'none'
					});
				}
				if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(_params.idCard)) {
					return uni.showToast({
						title: "请输入正确的身份证号码",
						icon: 'none'
					});
				}
				if (!regExp.test(_params.plateNumber)) {
					return uni.showToast({
						title: "请输入正确的车牌号",
						icon: 'none'
					});
				}
				if (_params.emergencyContact === '') {
					return uni.showToast({
						title: "请输入紧急联系人姓名",
						icon: 'none'
					});
				}
				if (!/^[1][0-9][0-9]{9}$/.test(_params.emergencyMobile)) {
					return uni.showToast({
						title: "请输入正确的紧急联系人号码",
						icon: 'none'
					});
				}
				if (_params.idCardFront === '') {
					return uni.showToast({
						title: "请上传身份证正面照",
						icon: 'none'
					});
				}
				if (_params.idCardBack === '') {
					return uni.showToast({
						title: "请上传身份证反面照",
						icon: 'none'
					});
				}
				if (_params.licenseImage === '') {
					return uni.showToast({
						title: "请上传驾驶证照",
						icon: 'none'
					});
				}
				if (_params.permitImage === '') {
					return uni.showToast({
						title: "请上传行驶证照",
						icon: 'none'
					});
				}
				_params.driverId = uni.getStorageSync("userInfo").driverId;
				_this.request({
					url: _this.http.driverApply,
					data: _params,
					success: (res) => {
						if (res.code === '0') {
							uni.navigateTo({
								url: "../registerSuccess/registerSuccess"
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
	#register {
		background: $bg-color-F9F9F9;
		padding: 40upx 40upx 200upx 40upx;
		font-size: $font-size-base;
		color: $text-color;

		.top-box {
			border: 1px solid $border-color;
			border-radius: 5px;
			background: white;
			padding: 10upx;

			>view {
				padding: 15upx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid $border-color;

				>text {
					flex-basis: 150upx;
				}

				>input,
				>picker,
				>radio-group {
					width: 100%;
				}

				>radio-group>label {
					margin-left: 10upx;
				}
			}

			>view.last {
				border-bottom: none;
			}
		}

		.tel {
			margin-top: 50upx;
			border: 1px solid $border-color;
			border-radius: 5px;
			background: white;
			padding: 10upx;

			>view {
				padding: 15upx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid $border-color;

				>text {
					flex-basis: 200upx;
				}

				>input {
					width: 100%;
				}
			}

			>view.last {
				border-bottom: none;
			}
		}

		.upload {
			margin-top: 50upx;

			>view {
				display: flex;
				align-items: center;
				padding-bottom: 20upx;

				>text {
					flex-basis: 200upx;
				}

				>view {
					border: 1px solid $border-color;
					width: 200upx;
					height: 200upx;

					>image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.submit {
			position: fixed;
			width: 100%;
			padding: 40upx;
			bottom: 0;
			left: 0;
			background: $bg-color-F9F9F9;

			>view {
				width: calc(100% - 80upx);
				background: $bg-color-orange;
				color: white;
				font-size: $font-size-lg;
				padding: 20upx 0;
				text-align: center;
			}
		}
	}
</style>

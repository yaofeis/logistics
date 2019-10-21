<template>
	<view id="confirm_order">
		<view>
			<view class="top-box">
				<view class="isHlep" v-if="isShow">
					<view>是否需要搬运<text>(价格请与司机商量)</text></view>
					<view @click="isNeed" :class="needHelp ? 'active' : ''">需要</view>
				</view>
				<view class="remark">
					<view>订单备注</view>
					<textarea placeholder="输入备注(如货物类别等)" v-model="remark"></textarea>
				</view>
			</view>
			<view class="info">订单联系人资料</view>
			<view class="bottom-box">
				<view>
					<text class="iconfont icon-rili"></text>
					<picker mode="date" :value="date" @change="bindDateChange" :start="startDate" :end="endDate" :disabled='isDisabled'>
						<view class="uni-input">{{date}}</view>
					</picker>
					<picker mode="time" :value="time" @change="bindTimeChange" start="00:00" end="23:59" :disabled='isDisabled'>
						<view class="uni-input">{{time}}</view>
					</picker>
				</view>
				<view>
					<text class="iconfont icon-yonghu"></text>
					<input type="text" placeholder="发货联系人" v-model="sendMan">
				</view>
				<view>
					<text class="iconfont icon-weibiaoti-"></text>
					<input type="number" placeholder="发货人联系电话" v-model="sendTel">
				</view>
				<view>
					<text class="iconfont icon-yonghu"></text>
					<input type="text" placeholder="收货联系人" v-model="getMan">
				</view>
				<view>
					<text class="iconfont icon-weibiaoti-"></text>
					<input type="number" placeholder="收货人联系电话" v-model="getTel">
				</view>
				<view class="coupon" v-if="isShow">
					<view>
						<text class="iconfont icon-youhuiquan"></text>
						<text>优惠券</text>
					</view>
					<view @click="selectCoupon">
						<text>{{couponTitle}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
			</view>
			<view class="tips">若产生高速费用、停车费和搬运费,请用户额外支付,若涉及逾时等候费,请与司机按收费标准结算</view>
			<view class="agreement">
				<checkbox-group @change="agree">
					<checkbox value="1" />
				</checkbox-group>
				<text>我已经阅读并同意</text>
				<navigator url="/pages/rule/rule?type=1">《货运托运区间服务协议》</navigator>
			</view>
		</view>
		<view>
			<view>￥<text>{{price}}</text></view>
			<view @click="pay">下单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				date: '',
				time: '',
				needHelp: false,
				startDate: '',
				endDate: '',
				isDisabled: false,
				topData: null,
				price: 0,
				remark: '',
				sendMan: '',
				sendTel: '',
				getMan: '',
				getTel: '',
				coupon: '',
				couponTitle: '请选择',
				isAgree: false,
				isShow: true
			}
		},
		onLoad(params) {
			uni.removeStorageSync('coupon');

			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() + 1;
			let day = now.getDate();
			let hour = now.getHours();
			let minute = now.getMinutes();
			if (month < 10) month = `0${month}`;
			if (day < 10) day = `0${day}`;
			if (hour < 10) hour = `0${hour}`;
			if (minute < 10) minute = `0${minute}`;
			this.date = `${year}-${month}-${day}`;
			this.time = `${hour}:${minute}`;
			this.startDate = `${year}-${month}-${day}`;
			this.endDate = `${year + 1}-${month}-${day}`;

			let data = JSON.parse(params.params);
			this.topData = data;
			this.isDisabled = data.type === 1;
			this.price = data.price;
			this.isShow = data.type !== 2;
		},
		onShow() {
			this.coupon = uni.getStorageSync('coupon');
			this.couponTitle = this.coupon ? this.coupon.couponTitle : '请选择';
			if(this.coupon){
				let _price = this.price - this.coupon.parValue;
				this.price = _price < 0 ? 0 : _price;
			}else{
				this.price = this.topData.price;
			}
		},
		onHide() {
			uni.removeStorageSync('coupon');
			this.price = this.topData.price;
		},
		methods: {
			// 日期变化
			bindDateChange: function(e) {
				this.date = e.target.value;
			},
			// 时间变化
			bindTimeChange: function(e) {
				this.time = e.target.value
			},
			// 是否需要搬运
			isNeed() {
				this.needHelp = !this.needHelp;
			},
			// 选择优惠券
			selectCoupon() {
				uni.navigateTo({
					url: '/pages/coupon/coupon?type=2'
				});
			},
			// 同意协议
			agree(e) {
				this.isAgree = e.detail.value.length > 0;
			},
			/*
			 * 下单
			 * type:0 现在用车，1 预约, 2 同城快送
			 */
			pay() {
				let _this = this;
				let userInfo = uni.getStorageSync('userInfo');
				if (!_this.isAgree) {
					return uni.showToast({
						title: "请同意《货运托运区间服务协议》",
						icon: 'none'
					});
				}
				if (_this.sendMan === '') {
					return uni.showToast({
						title: "请输入发货联系人",
						icon: 'none'
					});
				}
				if (!/^[1][0-9][0-9]{9}$/.test(_this.sendTel)) {
					return uni.showToast({
						title: "请输入正确的发货人联系电话",
						icon: 'none'
					});
				}
				if (_this.getMan === '') {
					return uni.showToast({
						title: "请输入收货联系人",
						icon: 'none'
					});
				}
				if (!/^[1][0-9][0-9]{9}$/.test(_this.getTel)) {
					return uni.showToast({
						title: "请输入正确的收货人联系电话",
						icon: 'none'
					});
				}
				let params = {
					userId: userInfo.userId,
					startPlace: _this.topData.startPlace,
					startLong: _this.topData.startLong,
					startLat: _this.topData.startLat,
					endPlace: _this.topData.endPlace,
					endLong: _this.topData.endLong,
					endLat: _this.topData.endLat,
					appointmentTime: `${this.date} ${this.time}`,
					contacts: _this.sendMan,
					contactsMobile: _this.sendTel,
					receiveUser: _this.getMan,
					receiveMobile: _this.getTel,
					estimatePrice: _this.price,
					distance: _this.topData.distance
				};
				if(_this.coupon.ucId) params.couponId = _this.coupon.ucId;
				if (_this.topData.additionalType !== undefined) {
					let _remark = _this.topData.additionalType === 0 ? '座位全拆' : '保留座位';
					params.remark = `${_this.remark},${_remark}`;
				} else {
					params.remark = _this.remark;
				}
				if (_this.topData.type === 0 || _this.topData.type === 1) {
					params.orderType = 1;
					params.transportId = _this.topData.transportId;
					params.isCarry = _this.needHelp ? 1 : 2;

				} else {
					params.orderType = 2;
					params.goodsId = _this.topData.goodsId;
				}
				_this.request({
					url: _this.http.addOrder,
					data: params,
					success: (res) => {
						if (res.code === '0') {
							uni.showToast({
								title: '下单成功',
								duration: 2000
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}, 2000);
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
	#confirm_order {
		font-size: $font-size-base;

		>view:nth-of-type(1) {
			padding: 20upx;

			.top-box {
				border: 1px solid $border-color;
				border-radius: 5px;

				.isHlep {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 40upx 20upx;
					border-bottom: 1px solid $border-color;

					>view:nth-of-type(1) {
						>text {
							color: $bg-color-orange;
						}
					}

					>view:nth-of-type(2) {
						border: 1px solid $border-color;
						padding: 10upx 40upx;
						border-radius: 5px;
					}

					>view:nth-of-type(2).active {
						border-color: $bg-color-orange;
					}
				}

				.remark {
					padding: 20upx;

					>view {
						padding-bottom: 20upx;
					}

					>textarea {
						width: 100%;
						height: 200upx;
						padding: 10upx;
						border: 1px solid $border-color;
						border-radius: 5px;
					}
				}
			}

			.info {
				padding: 20upx;
			}

			.bottom-box {
				border: 1px solid $border-color;
				border-radius: 5px;

				>view {
					display: flex;
					align-items: center;
					padding: 20upx;
					border-bottom: 1px solid $border-color;

					.iconfont {
						padding-right: 20upx;
					}

					picker {
						margin-right: 20upx;
					}
				}

				.coupon {
					display: flex;
					justify-content: space-between;
					align-items: center;

					>view {
						display: flex;
						align-items: center;
					}

					>view:nth-of-type(2) {
						>text {
							padding-right: 20upx;
						}
					}
				}
			}

			.tips {
				padding: 20upx 10upx;
				color: $text-999999;
			}

			.agreement {
				display: flex;
				align-items: center;
				padding: 0 10upx;
				color: $text-999999;

				>navigator {
					color: $bg-color-orange;
				}
			}
		}

		>view:nth-of-type(2) {
			margin-top: 30upx;

			>view:nth-of-type(1) {
				text-align: center;
				padding: 30upx 0;

				>text {
					font-size: 40upx;
				}
			}

			>view:nth-of-type(2) {
				background: $bg-color-orange;
				color: white;
				text-align: center;
				padding: 30upx 0;
				font-size: $font-size-lg;
			}
		}
	}
</style>

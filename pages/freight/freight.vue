<template>
	<view id="freight">
		<view class="nav">
			<text @click="changeType(0)" :class="carType == 0 ? 'active' : ''">面包车</text>
			<text @click="changeType(1)" :class="carType == 1 ? 'active' : ''">小平板车</text>
			<text @click="changeType(2)" :class="carType == 2 ? 'active' : ''">中面包车</text>
			<text @click="changeType(3)" :class="carType == 3 ? 'active' : ''">厢型货车</text>
			<text @click="changeType(4)" :class="carType == 4 ? 'active' : ''">大型平板</text>
		</view>
		<view class="information">
			<image :src="car.transportIcon" mode="widthFix"></image>
			<view>
				<text>载重:{{car.load}}公斤</text>
				<text>尺寸:{{car.size}}</text>
				<text>载货体积:{{car.volume}}立方米</text>
			</view>
		</view>
		<view class="additional" v-show="isShow">
			<view>
				<text>座位全拆</text>
				<view @click="additional(0)" :class="additionalType == 0 ? 'active' : ''">选择</view>
			</view>
			<view>
				<text>保留座位</text>
				<view @click="additional(1)" :class="additionalType == 1 ? 'active' : ''">选择</view>
			</view>
		</view>
		<view class="address">
			<view>
				<view>发</view>
				<input type="text" v-model="send" placeholder="请选择发货地址" disabled="true" @click="getLocation(1)">
			</view>
			<view>
				<view>收</view>
				<input type="text" v-model="take" placeholder="请选择收货地址" disabled="true" @click="getLocation(2)">
			</view>
		</view>
		<navigator class="agreement"  url="/pages/rule/rule?type=2">《用车规则》请阅读</navigator>
		<view class="btn">
			<view>
				￥<text>{{price}}</text>
			</view>
			<view>
				<view @click="toOrder(0)">现在用车</view>
				<view @click="toOrder(1)">
					<text class="iconfont icon-yuyue"></text>
					<text>预约</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				additionalType: 0,
				carType: 0,
				car: {
					load: '',
					size: '',
					volume: ''
				},
				send: '',
				take: '',
				isShow: true,
				location: {
					startLong: '',
					startLat: '',
					endLong: '',
					endLat: ''
				},
				price: 0,
				distance: 0
			}
		},
		onLoad() {
			this.getCar("面包车");
		},
		methods: {
			/*
			 * 导航栏切换
			 */
			changeType(e) {
				switch (e) {
					case 0:
						this.getCar("面包车");
						break;
					case 1:
						this.getCar("小平板车");
						break;
					case 2:
						this.getCar("中面包车");
						break;
					case 3:
						this.getCar("厢型货车");
						break;
					case 4:
						this.getCar("大型平板");
						break;
				}
				this.carType = e;
				this.isShow = e === 0;
			},
			/*
			 * 面包车独有附加选项
			 */
			additional(e) {
				this.additionalType = e;
			},
			/*
			 * 获取位置详情
			 */
			getLocation(type) {
				let _this = this;
				uni.chooseLocation({
					success: function(res) {
						if (type === 1) {
							_this.send = res.address;
							_this.location.startLong = res.longitude;
							_this.location.startLat = res.latitude;
						} else {
							_this.take = res.address;
							_this.location.endLong = res.longitude;
							_this.location.endLat = res.latitude;
						}
						_this.isUse();
					}
				});
			},
			/*
			 * 获取上方车辆信息
			 */
			getCar(name) {
				let _this = this;
				_this.request({
					url: _this.http.getTransportList,
					data: {
						pageNum: '1',
						pageSize: '1',
						transportName: name
					},
					success: (res) => {
						if (res.code === '0') {
							_this.car = res.result[0];
							_this.isUse();
						}
					}
				});
			},
			/*
			 * 计算价格
			 */
			countPrice(data) {
				let _this = this;
				_this.request({
					url: _this.http.priceBudget,
					data: {
						orderType: '1',
						transportId: _this.car.transportId,
						startLong: data.startLong,
						startLat: data.startLat,
						endLong: data.endLong,
						endLat: data.endLat
					},
					success: (res) => {
						if (res.code === '0') {
							_this.price = res.result.price;
							_this.distance = res.result.distance;
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					}
				});
			},
			/*
			 * 判断是否调用计算价格
			 */
			isUse() {
				if (this.location.startLong && this.location.startLat && this.location.endLong && this.location.endLat) {
					this.countPrice(this.location);
				}
			},
			/*
			 * 去订单页面
			 */
			toOrder(e){
				if (this.send === '') {
					return uni.showToast({
						title: "请选择发货地",
						icon: 'none'
					});
				}
				if (this.take === '') {
					return uni.showToast({
						title: "请选择收货地",
						icon: 'none'
					});
				}
				let params = {
					transportId: this.car.transportId,
					startPlace: this.send,
					startLong: this.location.startLong,
					startLat: this.location.startLat,
					endPlace: this.take,
					endLong: this.location.endLong,
					endLat: this.location.endLat,
					type: e,
					price: this.price,
					distance: this.distance
				};
				if(this.carType === 0){
					params.additionalType = this.additionalType;
				}
				uni.navigateTo({
					url: '/pages/confirmOrder/confirmOrder?params=' + JSON.stringify(params)
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	#freight {
		background: $bg-color-F9F9F9;
		height: 100%;
		position: relative;

		.nav {
			background: $bg-color;
			display: flex;
			justify-content: space-around;
			padding: 20upx 0;

			>text {
				font-size: $font-size-base;
				color: white;

				&.active {
					color: $bg-color-orange;
				}
			}
		}

		.information {
			margin: 40upx 0;
			background: white;
			display: flex;
			align-items: center;
			padding: 40upx;
			height: 300upx;
			border: 1px solid $border-color;

			>image {
				will-change: transform;
				width: 400upx;
				height: 100%;
			}

			>view {
				font-size: $font-size-base;
				color: $text-color;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				height: 100%;
				padding-left: 20upx;
			}
		}

		.additional {
			padding: 0 30upx 40upx 30upx;

			>view {
				display: flex;
				align-items: cencer;
				font-size: $font-size-base;
				color: $text-color;
				padding: 10upx 0;

				>text {
					padding: 10upx 20upx;
				}

				>view {
					padding: 10upx 40upx;
					border: 1px solid $border-color;
					border-radius: 10upx;

					&.active {
						border: 1px solid $bg-color-orange;
						color: $bg-color-orange;
					}
				}
			}
		}

		.address {
			background: white;
			margin: 0 40upx;
			padding: 30upx;
			border-radius: 5upx;

			>view {
				display: flex;
				align-items: center;
				font-size: $font-size-base;
				color: $text-color;

				>view {
					color: white;
					border-radius: 100upx;
					width: 50upx;
					height: 45upx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: $font-size-sm;
				}

				>input {
					margin-left: 20upx;
					width: 100%;
				}
			}

			>view:nth-of-type(1) {
				padding-bottom: 20upx;

				>view {
					background: #2EA932;
				}
			}

			>view:nth-of-type(2) {
				>view {
					background: #DE3444;
				}
			}
		}

		.agreement {
			margin-left: 40upx;
			font-size: $font-size-base;
			color: $text-a;
			padding-top: 5upx;
		}

		.btn {
			position: absolute;
			width: 96%;
			margin: 2%;
			bottom: 0;

			>view:nth-of-type(1) {
				text-align: center;
				padding: 20upx 0;
				color: $text-color;
				font-size: $font-size-sm;
				background: white;

				>text {
					font-size: 40upx;
				}
			}

			>view:nth-of-type(2) {
				display: flex;
				align-items: center;
				height: 100upx;
				color: white;
				font-size: $font-size-lg;

				>view:nth-of-type(1) {
					width: 500upx;
					background: $bg-color;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				>view:nth-of-type(2) {
					width: calc(100% - 500upx);
					background: $bg-color-orange;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100%;

					>text:nth-of-type(1) {
						padding-top: 5upx;
					}

					>text:nth-of-type(2) {
						padding-left: 10upx;
					}
				}
			}
		}
	}
</style>

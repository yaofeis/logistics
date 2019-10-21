<template>
	<view id="quick_send">
		<view class="top-box">
			<view>请选择货物种类/重量</view>
			<view>
				<view v-for="(item, index) in goodsList" :key="index" @click="selectGoods(item.goodsId, index)" :class="item.active ? 'active' : ''">
					{{item.goodsTitle}}
				</view>
			</view>
			<view>
				<text>重量:</text>
				<input type="text" placeholder="请输入预计公斤数" @change="weightEvent" v-model="weight">
			</view>
		</view>
		<view class="adress">
			<view>
				<view>发</view>
				<input type="text" v-model="send" placeholder="请选择发货地址" disabled="true" @click="getLocation(1)">
			</view>
			<view>
				<view>收</view>
				<input type="text" v-model="take" placeholder="请选择收货地址" disabled="true" @click="getLocation(2)">
			</view>
		</view>
		<navigator class="rule" url="/pages/rule/rule?type=2">《用车规则》请阅读</navigator>
		<view class="btn">
			<view>￥<text>{{price}}</text></view>
			<view @click="goOrder">现在用车</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [],
				goodsId: '',
				send: '',
				take: '',
				location: {
					startLong: '',
					startLat: '',
					endLong: '',
					endLat: ''
				},
				weight: '',
				price: 0,
				distance: 0,
				ruleShow: false
			}
		},
		onLoad() {
			let _this = this;
			_this.request({
				url: _this.http.getTransportGoodsList,
				data: {
					pageNum: '1',
					pageSize: '100'
				},
				success: (res) => {
					if (res.code === '0') {
						res.result.map(item => item.active = false);
						_this.goodsList = res.result;
					}
				}
			});
		},
		methods: {
			/*
			 * 选择商品
			 */
			selectGoods(id, index) {
				this.goodsList[index].active = !this.goodsList[index].active;
				this.goodsList.map((item, _index) => {
					if (index !== _index) {
						item.active = false;
					}
				});
				if (this.goodsList[index].active) {
					this.goodsId = id;
				} else {
					this.goodsId = '';
				}
				this.isUse();
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
			 * 计算价格
			 */
			countPrice(data) {
				let _this = this;
				_this.request({
					url: _this.http.priceBudget,
					data: {
						orderType: '2',
						goodsId: _this.goodsId,
						goodsWeight: _this.weight,
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
			 * 重量输入框
			 */
			weightEvent() {
				this.isUse();
			},
			/*
			 * 判断是否调用计算价格
			 */
			isUse(){
				if (this.location.startLong && this.location.startLat && this.location.endLong && this.location.endLat && this.weight !==
					'' && this.goodsId !== '') {
					this.countPrice(this.location);
				}
			},
			/*
			 * 现在用车--下单
			 */
			goOrder() {
				if (this.goodsId === '') {
					return uni.showToast({
						title: "请选择货物种类",
						icon: 'none'
					});
				}
				if (this.weight === '') {
					return uni.showToast({
						title: "请输入货物重量",
						icon: 'none'
					});
				}
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
				if(this.price === 0) return uni.showToast({
						title: "请填写完整货运信息",
						icon: 'none'
					});
				let params = {
					goodsId: this.goodsId,
					startPlace: this.send,
					startLong: this.location.startLong,
					startLat: this.location.startLat,
					endPlace: this.take,
					endLong: this.location.endLong,
					endLat: this.location.endLat,
					type: 2,
					price: this.price,
					distance: this.distance
				};
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

	#quick_send {
		height: calc(100% - 40upx);
		background: $bg-color-F9F9F9;
		padding: 20upx;
		font-size: $font-size-base;
		color: $text-color;

		.top-box {
			padding: 40upx 0 40upx 40upx;
			border: 1px solid $border-color;
			background: white;
			border-radius: 5px;

			>view:nth-of-type(1) {
				color: $bg-color-orange;
			}

			>view:nth-of-type(2) {
				margin-top: 20upx;
				display: flex;
				flex-wrap: wrap;

				>view {
					border-radius: 5px;
					border: 1px solid $border-color;
					width: 178upx;
					height: 60upx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					overflow-y: auto;
					margin-bottom: 20upx;
					margin-right: 40upx;
				}

				.active {
					border-color: $bg-color-orange;
				}
			}

			>view:nth-of-type(3) {
				display: flex;
				align-items: center;

				>text {
					padding-right: 10upx;
				}
			}
		}

		.adress {
			margin-top: 40upx;
			background: white;
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

		.rule {
			color: $text-a;
			padding-top: 10upx;
		}

		.btn {
			position: fixed;
			bottom: 0;
			width: calc(100% - 40upx);
			padding: 20upx;
			left: 0;
			z-index: 1;

			>view:nth-of-type(1) {
				background: white;
				padding: 30upx 0;
				width: 100%;
				text-align: center;

				>text {
					font-size: 40upx;
				}
			}

			>view:nth-of-type(2) {
				width: 100%;
				background: $bg-color;
				color: white;
				font-size: $font-size-lg;
				text-align: center;
				padding: 30upx 0;
			}
		}
	}
</style>
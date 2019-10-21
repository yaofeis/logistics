<template>
	<view id="order">
		<view v-if="orderList.length > 0" class="have">
			<view class="title">
				<text>时间</text>
				<text>状态</text>
				<text>金额</text>
				<text>&nbsp;</text>
			</view>
			<view v-for="(item, index) in orderList" :key="index">
				<text>{{item.appointmentTime | time}}</text>
				<text>{{item.status | orderState}}</text>
				<text v-if="item.status === 1 || item.status === 2 || item.status === 3 || item.status === 4 || item.status === 5 || item.status === 6">￥{{item.estimatePrice}}</text>
				<text v-else>￥{{item.actualPrice}}</text>
				<text @click="goOrder(item.orderId)" class="detail">详情</text>
			</view>
		</view>
		<view v-else class="noHave">
			<text v-if="type === 1">暂无订单，快去下单吧!</text>
			<text v-else>暂无订单，快去接单吧!</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [],
				type: 1 // 1 用户 2 司机
			}
		},
		/*
		 * orderType:1.同城货运，2同城快运，3快递
		 * @params type 1.同城货运，2同城快运，3快递 4司机订单
		 */
		onLoad(params) {
			let _this = this;
			let userInfo = uni.getStorageSync('userInfo');
			let data = {
				pageNum: "1",
				pageSize: '1000'
			}
			if(params.type.toString() === "4"){
				data.driverId = userInfo.driverId;
				_this.type = 2;
			}else{
				data.userId = userInfo.userId;
				data.orderType = params.type;
				_this.type = 1;
			}
			_this.request({
				url: _this.http.getOrderList,
				data: data,
				success: (res) => {
					if (res.code === '0') {
						_this.orderList = res.result;
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
			goOrder(id){
				if(this.type === 1){
					uni.navigateTo({
						url: '/pages/orderDetail/orderDetail?orderId=' + id
					})
				}else{
					uni.navigateTo({
						url: '/pages/robSuccess/robSuccess?orderId=' + id
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	#order {
		padding: 10upx;

		>.have {
			>view {
				padding-bottom: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				&.title {
					padding-bottom: 30upx;
				}

				>text,
				>navigator {
					flex-basis: 25%;
					text-align: center;
					color: $text-color;
					font-size: $font-size-base;
				}

				.detail {
					color: $bg-color-orange;
				}
			}
		}

		>.noHave {
			color: $text-999999;
			font-size: $font-size-base;
			padding: 20upx;
			text-align: center;
		}
	}
</style>

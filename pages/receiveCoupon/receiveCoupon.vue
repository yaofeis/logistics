<template>
	<view id="receiveCoupon">
		<view v-if="couponList.length === 0" class="not-coupon">
			<text>暂无可领取的优惠券</text>
		</view>
		<view v-else class="list" v-for="(item, index) in couponList" :key="index" @click="getCoupon(item)">
			<view>{{item.couponTitle}}</view>
			<view>有效期至{{item.onTime | time}}</view>
			<view>￥<text>{{item.parValue}}</text></view>
			<view>仅限本人使用</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				couponList: []
			}
		},
		onLoad(params) {
			let _this = this;
			let userInfo = uni.getStorageSync("userInfo");
			_this.request({
				url: _this.http.getRecevieCouponList,
				data: {
					pageNum: '1',
					pageSize: '100',
					isSand: 1
				},
				success: (res) => {
					if (res.code === '0') {
						_this.couponList = res.result;
					}
				}
			});
		},
		methods: {
			getCoupon(data) {
				let _this = this;
				let userInfo = uni.getStorageSync('userInfo');
				_this.request({
					url: _this.http.addUserCoupon,
					data: {
						couponId: data.couponId,
						userId: userInfo.userId
					},
					success: (res) => {
						if (res.code === '0') {
							uni.showToast({
								title: '获取成功',
								duration: 2000,
								icon: "success",
								mask: true
							});
						}else{
							uni.showToast({
								title: '获取失败',
								duration: 2000,
								mask: true
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	#receiveCoupon {
		padding: 20upx;

		.list {
			margin-bottom: 20upx;
			border: 1px solid $bg-color-gray;
			padding: 20upx;
			color: $text-color;
			font-size: $font-size-base;
			border-radius: 10upx;
			box-shadow: 0 0 8px 2px $bg-color-gray;

			>view:nth-of-type(3) {
				text-align: center;
				color: $bg-color-orange;
				font-size: $font-size-sm;

				>text {
					font-size: 40upx;
				}
			}

			>view:nth-of-type(4) {
				text-align: right;
				color: $bg-color-gray;
			}
		}

		.not-coupon {
			text-align: center;
			color: $text-999999;
			font-size: $font-size-base;
		}
	}
</style>

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
			// 获取可获取优惠券列表
			_this.request({
				url: _this.http.getRecevieCouponList,
				data: {
					pageNum: '1',
					pageSize: '100',
					isSand: 1
				},
				success: (res) => {
					if (res.code === '0') {
						// 获取当前用户已拥有的优惠券列表
						_this.request({
							url: _this.http.getCouponList,
							data: {
								pageNum: '1',
								pageSize: '100',
								userId: userInfo.userId
							},
							success: (res1) => {
								if (res.code === '0') {
									// 去除用户已有的优惠券
									res.result.map((item) => {
										let _coupon = res1.result.find(item1 => item1.couponId === item.couponId);
										if (!_coupon) {
											_this.couponList.push(item);
										}
									})
								}
							}
						}, false);
					}
				}
			}, false);
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
							for (let i = 0; i < _this.couponList.length; i++) {
								if (_this.couponList[i].couponId === data.couponId) {
									_this.couponList.splice(i, 1);
									break;
								}
							}
						} else {
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
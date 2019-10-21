<template>
	<view id="coupon">
		<view v-if="couponList.length === 0" class="not-coupon">
			<text>暂无可用优惠券</text>
		</view>
		<view v-else class="list" v-for="(item, index) in couponList" :key="index" @click="toOrder(item)">
			<view>{{item.couponTitle}}</view>
			<view>有效期至{{item.onTime | time}}</view>
			<view>￥<text>{{item.parValue}}</text></view>
			<view>仅限本人使用</view>
		</view>
		<view class="notUse" v-if="isShow" @click="toOrder()">不使用</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				couponList: [],
				type: 0,
				isShow: false
			}
		},
		onLoad(params) {
			let _this = this;
			let userInfo = uni.getStorageSync("userInfo");
			_this.type = params.type;
			_this.isShow = _this.type !== "1";
			_this.request({
				url: _this.http.getCouponList,
				data: {
					pageNum: '1',
					pageSize: '100',
					userId: userInfo.userId
				},
				success: (res) => {
					if (res.code === '0') {
						_this.couponList = res.result;
					}
				}
			});
		},
		methods: {
			toOrder(item) {
				if (this.isShow) {
					if (item !== undefined) {
						uni.setStorageSync('coupon', item);
					}
					uni.navigateBack();
				}
			}
		}
	}
</script>

<style lang="scss">
	#coupon {
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

		.notUse {
			background: $bg-color-orange;
			color: white;
			font-size: $font-size-base;
			padding: 10upx 20upx;
			margin: auto;
			width: 100upx;
			text-align: center;
			border-radius: 10upx;
			box-shadow: 0 0 8px 2px $bg-color-gray;
			margin-top: 60upx;
		}

		.not-coupon {
			text-align: center;
			color: $text-999999;
			font-size: $font-size-base;
		}
	}
</style>

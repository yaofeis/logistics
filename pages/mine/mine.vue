<template>
	<view id="mine">
		<view class="userInfo">
			<view>
				<open-data type="userAvatarUrl" style="width: 100%;height: 100%;"></open-data>
			</view>
			<open-data type="userNickName"></open-data>
		</view>
		<view class="list">
			<navigator url="/pages/order/order?type=1">
				<view>
					<view>
						<text class="iconfont icon-dingdan"></text>
					</view>
					<text>快递订单</text>
				</view>
				<text class="iconfont icon-youjiantou"></text>
			</navigator>
			<navigator url="/pages/order/order?type=2">
				<view>
					<view>
						<text class="iconfont icon-youjian"></text>
					</view>
					<text>货运订单</text>
				</view>
				<text class="iconfont icon-youjiantou"></text>
			</navigator>
			<navigator url="/pages/commonProblem/commonProblem">
				<view>
					<view>
						<text class="iconfont icon-wenhao"></text>
					</view>
					<text>常见问题</text>
				</view>
				<text class="iconfont icon-youjiantou"></text>
			</navigator>
			<navigator @click="callPhone">
				<view>
					<view>
						<text class="iconfont icon-weibiaoti-"></text>
					</view>
					<text>联系客服</text>
				</view>
				<text class="iconfont icon-youjiantou"></text>
			</navigator>
			<navigator url="/pages/coupon/coupon?type=1">
				<view>
					<view>
						<text class="iconfont icon-youhuiquan"></text>
					</view>
					<text>我的优惠券</text>
				</view>
				<text class="iconfont icon-youjiantou"></text>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: uni.getStorageSync("serveMobile")
				});
			}
		}
	}
</script>

<style lang="scss">
	#mine {
		.userInfo {
			background: $bg-color-orange;
			display: flex;
			align-items: center;
			padding: 40upx;
			font-size:  $font-size-lg;
			color: white;

			>view {
				margin-right: 40upx;
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
				overflow: hidden;
			}
		}

		.list {
			>navigator {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 25upx 40upx;
				border-bottom: 1px solid $border-color;

				>view {
					display: flex;
					align-items: center;

					>view {
						width: 40upx;
						height: 40upx;
						background: $bg-color-orange;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;

						>text {
							color: white;
							font-size: $font-size-sm;
						}
					}

					>text {
						color: $text-color;
						font-size: $font-size-base;
						padding-left: 40upx;
					}
				}

			}
		}
	}
</style>

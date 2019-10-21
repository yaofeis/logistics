<template>
	<view id="driver_mine">
		<view class="list">
			<view class="userInfo">
				<view>
					<open-data type="userAvatarUrl" style="width: 100%;height: 100%;"></open-data>
				</view>
				<open-data type="userNickName"></open-data>
			</view>
			<view class="list-menu">
				<navigator url="/pages/order/order?type=4">
					<view>
						<view>
							<text class="iconfont icon-dingdan"></text>
						</view>
						<text>我的订单</text>
					</view>
					<text class="iconfont icon-youjiantou"></text>
				</navigator>
				<navigator url="/pages/myMoney/myMoney">
					<view>
						<view>
							<text class="iconfont icon-qianbao"></text>
						</view>
						<text>我的钱包</text>
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
			</view>
		</view>
		<view class="nav">
			<navigator url="/pages/driverIndex/driverIndex" open-type="reLaunch">
				<image src="../../static/home.png"></image>
				<text>主页</text>
			</navigator>
			<navigator url="/pages/driverMine/driverMine" open-type="reLaunch">
				<image src="../../static/mine-select.png"></image>
				<text>我的</text>
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
					phoneNumber: '114'
				});
			}
		}
	}
</script>

<style lang="scss">
	#driver_mine {
		background: $bg-color-F9F9F9;
		font-size: $font-size-base;
		color: $text-color;

		.list {

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

			.list-menu {
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

		.nav {
			position: fixed;
			bottom: 0;
			left: 0;
			height: 90upx;
			border-top: 1px solid $border-color;
			width: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			font-size: $font-size-sm;
			background: white;

			>navigator {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				>image {
					width: 50upx;
					height: 50upx;
					margin-bottom: 5upx;
					will-change: transform;
				}
			}
		}
	}
</style>

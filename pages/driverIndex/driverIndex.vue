<template>
	<view id="driver_index">
		<view class="list">
			<navigator class="list-child" v-for="(item, index) in list" :key="index" :url="'/pages/detail/detail?orderId=' + item.orderId">
				<view class="time">
					<text>{{item.appointmentTime | timeDetail}}</text>
					<text><text class="iconfont icon-dingwei"></text>距您约{{item.currentDistance.toFixed(1)}}km</text>
				</view>
				<view class="address">
					<view class="fa">发</view>
					<view>{{item.startPlace}}</view>
				</view>
				<view class="address">
					<view class="shou">收</view>
					<view>{{item.endPlace}}</view>
				</view>
				<view class="information">
					<view>
						<view>总距离:{{item.distance}}km</view>
						<view>{{item.transportName || item.goodsName}}</view>
					</view>
					<view>
						<view>￥<text>{{item.estimatePrice}}</text></view>
						<view>详情</view>
					</view>
				</view>
			</navigator>
			<view>
				<text>{{loading}}</text>
				<view v-show="loading === '加载中'"></view>
			</view>
		</view>
		<view class="nav">
			<navigator url="/pages/driverIndex/driverIndex" open-type="reLaunch">
				<image src="../../static/home-select.png"></image>
				<text>主页</text>
			</navigator>
			<navigator url="/pages/driverMine/driverMine" open-type="reLaunch">
				<image src="../../static/mine.png"></image>
				<text>我的</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				loading: "加载中",
				pageNum: 1,
				pageSize: 3,
				total: 0,
				isLoad: false,
				currentLon: 0,
				currentLat: 0
			}
		},
		// 上拉加载
		onReachBottom() {
			let _this = this;
			_this.pageNum++;
			if (_this.pageNum > Math.ceil(_this.total / _this.pageSize)) {
				return _this.loading = '暂无数据';
			}
			if (_this.isLoad) return false;
			_this.isLoad = true;
			_this.request({
				url: _this.http.getRobOrderList,
				data: {
					pageNum: _this.pageNum,
					pageSize: _this.pageSize
				},
				success: (res) => {
					if (res.code === '0') {
						res.result.map((e) => {
							e.currentDistance = _this.GetDistance(_this.currentLat, _this.currentLon, e.startLat, e.startLong);
							_this.list.push(e);
						});
						_this.total = res.total;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
					_this.loading = '加载完成';
					_this.isLoad = false;
				}
			}, false);
		},
		// 下拉刷新
		onPullDownRefresh() {
			let _this = this;
			_this.pageNum = 1;
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					_this.currentLon = res.longitude;
					_this.currentLat = res.latitude;
					_this.request({
						url: _this.http.getRobOrderList,
						data: {
							pageNum: _this.pageNum,
							pageSize: _this.pageSize
						},
						success: (res) => {
							if (res.code === '0') {
								res.result.map((e) => {
									e.currentDistance = _this.GetDistance(_this.currentLat, _this.currentLon, e.startLat, e.startLong);
								});
								_this.list = res.result;
								_this.total = res.total;
							} else {
								uni.showToast({
									title: res.message,
									icon: 'none'
								});
							}
							uni.stopPullDownRefresh();
						}
					}, false);
				}
			});
		},
		onLoad() {
			let _this = this;
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					_this.currentLon = res.longitude;
					_this.currentLat = res.latitude;
					_this.init();
				}
			});
		},
		methods: {
			init() {
				let _this = this;
				_this.request({
					url: _this.http.getRobOrderList,
					data: {
						pageNum: _this.pageNum,
						pageSize: _this.pageSize
					},
					success: (res) => {
						let _title = "";
						if (res.code === '0') {
							res.result.map((e) => {
								e.currentDistance = _this.GetDistance(_this.currentLat, _this.currentLon, e.startLat, e.startLong);
							});
							_this.list = res.result;
							_this.total = res.total;
							_title = res.total > 0 ? "加载完成" : "暂无数据";
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
						_this.loading = _title;
						_this.isLoad = false;
					}
				}, false);
			},
			// 计算两点之间的距离
			GetDistance(lat1, lng1, lat2, lng2) {
				var radLat1 = lat1 * Math.PI / 180.0;
				var radLat2 = lat2 * Math.PI / 180.0;
				var a = radLat1 - radLat2;
				var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137; // EARTH_RADIUS;
				s = Math.round(s * 10000) / 10000;
				return s;
			}

		}
	}
</script>

<style lang="scss">
	#driver_index {
		background: $bg-color-F9F9F9;
		font-size: $font-size-base;
		color: $text-color;

		.list {
			padding: 40upx 40upx 90upx 40upx;
			width: calc(100% - 80upx);

			.list-child {
				background: white;
				border: 1px solid $border-color;
				border-radius: 5px;
				margin-bottom: 40upx;

				.time {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10upx;
					border-bottom: 1px solid $border-color;
				}

				.address {
					display: flex;
					align-items: center;
					padding: 40upx 10upx;
					border-bottom: 1px solid $border-color;

					.fa,
					.shou {
						background: $bg-color-fa;
						width: 50upx;
						height: 50upx;
						border-radius: 50upx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: white;
						margin-right: 20upx;
					}

					.shou {
						background: $bg-color-shou;
					}
				}

				.information {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					padding: 10upx;

					>view:nth-of-type(1) {
						>view:nth-of-type(2) {
							color: $text-999999;
							border: 1px solid $border-color;
							border-radius: 5px;
							padding: 5upx 10upx;
							margin-top: 10upx;
							display: inline-block;
						}
					}

					>view:nth-of-type(2) {
						>view:nth-of-type(1) {
							>text {
								font-size: 40upx;
							}
						}

						>view:nth-of-type(2) {
							background: $bg-color-orange;
							color: white;
							border-radius: 5px;
							text-align: center;
							padding: 10upx;
							margin-top: 10upx;
							width: 100upx;
						}
					}
				}
			}

			>view {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-bottom: 10upx;

				>view {
					width: 25upx;
					height: 25upx;
					border-left: 1px solid red;
					border-right: 1px solid $bg-color-orange;
					border-radius: 100%;
					animation: loading 1s infinite linear;
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

	@keyframes loading {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>

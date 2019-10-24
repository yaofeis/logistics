<template>
	<view id="index">
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000">
						<swiper-item v-for="(item, index) in swiperList" :key="index">
							<image :src="item.bannerImage" mode="widthFix" style="width: 100%;" @click="receiveCoupon"></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="nav">
			<navigator url="/pages/freight/freight">
				<image src="./../../static/huoyun.png" mode="widthFix"></image>
				<text style="color: #FA893B;">货运</text>
			</navigator>
			<navigator url="/pages/quickSend/quickSend">
				<image src="./../../static/kuaisong.png" mode="widthFix"></image>
				<text style="color: #65AEE3;padding-top: 5upx;">同城快送</text>
			</navigator>
			<navigator>
				<image src="./../../static/kuaidi.png" mode="widthFix"></image>
				<text style="color: #8BC34A;padding-top: 5upx;">快递</text>
			</navigator>
			<navigator url="/pages/freight/freight">
				<image src="./../../static/yuyue.png" mode="widthFix"></image>
				<text style="color: #DBA6B8;padding-top: 8upx;">预约用车</text>
			</navigator>
		</view>
		<view class="new-thing">最新事项</view>
		<view class="news-list">
			<navigator v-for="(item, index) in newsList" :key="index" :url="'/pages/newsDetail/newsDetail?newsId=' + item.newsId">
				<view>{{item.newsTitle}}</view>
				<view>
					<image :src="item.showImage"></image>
					<view>{{item.showContent}}</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [],
				newsList: [],
				httpNum: 0
			}
		},
		onLoad() {
			let _this = this;
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			_this.request({
				url: _this.http.getBanner,
				data: {
					pageNum: '1',
					pageSize: '4'
				},
				success: (res) => {
					if (res.code === '0') {
						_this.swiperList = res.result;
					}
					_this.httpNum++;
					_this.countHttp();
				}
			}, false);
			_this.request({
				url: _this.http.getNewsList,
				data: {
					pageNum: '1',
					pageSize: '100',
					newsType: '1'
				},
				success: (res) => {
					if (res.code === '0') {
						_this.newsList = res.result;
						_this.newsList.map(item => {
							item.showContent = item.showContent && item.showContent.substring(0, 50) + '...';
						});
					}
					_this.httpNum++;
					_this.countHttp();
				}
			}, false);
		},
		methods: {
			countHttp() {
				if (this.httpNum === 2) {
					uni.hideLoading();
				}
			},
			// 轮播图点击跳转到领取优惠券页面
			receiveCoupon() {
				uni.navigateTo({
					url: '/pages/receiveCoupon/receiveCoupon'
				});
			}
		}
	}
</script>

<style lang="scss">
	#index {
		.nav {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 20upx 0;
			background: $bg-color;

			>navigator {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				>image {
					width: 70upx;
					height: 70upx;
					will-change: transform;
				}

				>text {
					font-size: $font-size-sm;
				}
			}
		}

		.new-thing {
			padding: 20upx;
			border-bottom: 1px solid $border-color;
			color: $text-color;
			font-size: $font-size-lg;
		}

		.news-list {
			>navigator {
				border-bottom: 1px solid $border-color;
				padding: 20upx;

				>view:nth-of-type(1) {
					color: $text-color;
					font-size: $font-size-base;
					padding-bottom: 20upx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 100%;
				}

				>view:nth-of-type(2) {
					display: flex;
					height: 200upx;

					>image {
						will-change: transform;
						flex-basis: 300upx;
						height: 100%;
					}

					>view {
						color: $text-color;
						font-size: $font-size-base;
						padding-left: 20upx;
						flex-basis: calc(100% - 300upx);
						text-align: justify;
						height: 100%;
						display: -webkit-box;
						word-break: break-all;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 5; //设置 需要显示的行数
					}
				}
			}
		}
	}
</style>

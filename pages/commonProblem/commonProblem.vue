<template>
	<view id="commonProblem">
		<view class="news-list">
			<navigator v-for="(item, index) in newsList" :key="index" :url="'/pages/newsDetail/newsDetail?newsId=' + item.newsId">
				<view>{{item.newsTitle}}</view>
				<view>
					<image :src="item.showImage"></image>
					<view>
						<view>{{item.showContent}}</view>
						<view>{{item.createdDate | time}}</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newsList: []
			}
		},
		onLoad() {
			let _this = this;
			_this.request({
				url: _this.http.getNewsList,
				data: {
					pageNum: '1',
					pageSize: '100',
					newsType: '3'
				},
				success: (res) => {
					if (res.code === '0') {
						_this.newsList = res.result;
					}
				}
			});
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	#commonProblem {
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
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						>view:nth-of-type(1) {
							text-align: justify;
							display: -webkit-box;
							word-break: break-all;
							text-overflow: ellipsis;
							overflow: hidden;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3; //设置 需要显示的行数
						}
					}
				}
			}
		}
	}
</style>

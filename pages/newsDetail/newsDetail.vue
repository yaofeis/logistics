<template>
	<view id="news_detail">
		<view class="title">{{title}}</view>
		<rich-text :nodes="nodes"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				nodes: ''
			}
		},
		onLoad(params) {
			let _this = this;
			_this.request({
				url: _this.http.getNewsDetail,
				data: {
					newsId: params.newsId
				},
				success: (res) => {
					if (res.code === '0') {
						_this.title = res.result.newsTitle;
						_this.nodes = res.result.newsContent;
					}
				}
			});
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	#news_detail {
		padding: 20upx;
		font-size: $font-size-base;
		color: $text-color;

		>.title {
			text-align: center;
			font-size: $font-size-lg;
			padding-bottom: 20upx;
		}
	}
</style>

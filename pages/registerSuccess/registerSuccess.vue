<template>
	<view id="registerSuccess">
		<view>提交成功!</view>
		<view>
			恭喜您！您的信息已经提交到我公司，我们的工作人员
			会在1-3个工作日跟您联系，请您保持电话通畅，谢谢您的支持。
		</view>
		<view>
			<text @click="goBack">确认</text>
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
			goBack(){
				uni.navigateTo({
					url: "../select/select"
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	#registerSuccess {
		height: calc(100% - 80upx);
		background: $bg-color-F9F9F9;
		padding: 40upx;
		font-size: $font-size-base;
		color: $text-color;
		padding-top: 300upx;

		>view:nth-of-type(1) {
			font-size: 40upx;
			text-align: center;
		}

		>view:nth-of-type(2) {
			padding: 40upx 0;
			text-indent: 2em;
		}

		>view:nth-of-type(3) {
			display: flex;
			justify-content: center;

			>text {
				border: 1px solid $bg-color-orange;
				border-radius: 5px;
				padding: 10upx 40upx;
				background: white;
			}
		}
	}
</style>

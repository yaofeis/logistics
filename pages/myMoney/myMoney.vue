<template>
	<view id="my_money">
		<view class="top">
			<view>
				<text>当前余额:</text>
				<view>￥<text>{{money || 0}}</text></view>
			</view>
			<view @click="goGrtMoney">提现</view>
		</view>
		<view class="list">
			<view v-for="(item, index) in list" :key="index">
				<view>
					<view :class="item.dealType === 2 && 'red'">
						{{item.dealTitle}}
						<text v-if="item.dealType === 2">({{item.status === 1 ? '成功' : item.status === 2 ? '失败' : '审核中'}})</text>
					</view>
					<view>{{item.createdDate | date}}</view>
				</view>
				<view>￥<text>{{item.money}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: uni.getStorageSync("userInfo").balance,
				list: []
			}
		},
		onLoad() {
			let _this = this;
			_this.request({
				url: _this.http.getDriverDealList,
				data: {
					pageNum: '1',
					pageSize: '10000',
					driverId: uni.getStorageSync("userInfo").driverId
				},
				success: (res)=>{
					if(res.code === "0"){
						_this.list = res.result;
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message
						})
					}
				}
			})
		},
		methods: {
			goGrtMoney(){
				if(!this.money) return uni.showToast({
							icon: 'none',
							title: "无余额可提现!"
						})
				uni.navigateTo({
					url: "/pages/withdrawal/withdrawal"
				});
			}
		}
	}
</script>

<style lang="scss">
	#my_money {
		font-size: $font-size-base;
		color: $text-color;
		.top{
			background: $bg-color;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20upx 40upx;
			>view:nth-of-type(1){
				>text{
					color: white;
				}
				>view{
					color: $bg-color-orange;
					>text{
						font-size: 40upx;
					}
				}
			}
			>view:nth-of-type(2){
				background: white;
				padding: 10upx 30upx;
				border-radius: 5px;
			}
		}
		.list{
			padding: 0 40upx;
			>view{
				border-bottom: 1px solid $border-color;
				padding: 10upx 0;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				>view:nth-of-type(1){
					>view:nth-of-type(1){
						padding-bottom: 10upx;
					}
					.red{
						color: red;
						>text{
							color: $text-color;
						}
					}
				}
				>view:nth-of-type(2){
					color: $bg-color-orange;
					>text{
						font-size: 40upx;
					}
				}
			}
		}
	}
</style>

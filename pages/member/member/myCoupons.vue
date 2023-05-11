<template>
	<view class="page-index">
		<view class="header">
			<!-- 自定义导航 -->
			<cl-topbar title="我的优惠券" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
		</view>
		<unicloud-db ref="udb" :collection="collection" :where="`user_id == '${user.user_id}' && status == false`"
			v-slot:default="{data,loading,error,options}" loadtime="onready" @load="setData" :options="options">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading"></view>
			<uni-list v-else :border="true">
				<uni-list-item v-for="(coupon,index) in data" :key="index" :title="'优惠券' + (index+1)" :show-badge="true" clickable
					:note="'金额: ￥'+ (coupon.reduce/100).toFixed(2)" :rightText="'到期时间：' + coupon.end_time">
					</uni-list-item>
			</uni-list>
		</unicloud-db>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL()
	export default {
		data() {
			return {
				user: {},
				collection: "use_coupon",
				myExam: [],
				keyword: "",
			}
		},
		onLoad() {
			var user = uni.getStorageSync('user')
			if (user) this.user = user

		},
		onReady() {
			this.$refs.udb.loadData()
		},
		methods: {
			setData(data) {
				console.log(data)
				this.myExam = data
			},
			
			toDetail(order){
				uni.navigateTo({
					url:"/pages/public/my/order/orderDetail?order=" + encodeURIComponent(JSON.stringify(order))
				})
			},
			
		}
	}
</script>

<style lang="scss">
	.page-index {
		.header {
			padding-bottom: 16rpx;
			background: linear-gradient(180deg, #618cfc 0%, #f5f5f5 100%);

		}
	}
</style>
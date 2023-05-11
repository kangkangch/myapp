<template>
	<view class="page-index">
		<view class="header">
			<!-- 自定义导航 -->
			<cl-topbar title="我的订单" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
			<!-- 搜索栏 -->
			<view class="search">
				<!-- <cl-search v-model="keyword" placeholder="请输入关键词" @search="onSearch"></cl-search> -->
				<u-search v-model="keyword" height="40" :show-action="false" margin="10rpx 30rpx"
					:action-style='{  }'></u-search>
			</view>
		</view>
		<unicloud-db ref="udb" :collection="collection" :where="`user_id == '${user.user_id}'`"
			v-slot:default="{data,loading,error,options}" loadtime="onready" @load="setData" :options="options">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading"></view>
			<uni-list v-else :border="true">
				<uni-list-item v-for="(order,index) in data" :key="index" :title="order_type[order.goods_type-1] + ' ' + order_status[order.status?0:1]" :show-badge="true" clickable
					:note="'金额: ￥'+ (order.price/100).toFixed(2)" :rightText="'生成时间：' + formatDate(order.create_time)" link="reLaunch" @click="toDetail(order)">
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
				collection: "order",
				myExam: [],
				keyword: "",
				order_type: ["买课程","买会员","续费会员","参加活动"],
				order_status: ['已支付','未支付']
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
			
			formatDate(timestamp) {
			  const date = new Date(timestamp);
			  const year = date.getFullYear();
			  const month = ('0' + (date.getMonth() + 1)).slice(-2);
			  const day = ('0' + date.getDate()).slice(-2);
			  const hours = ('0' + date.getHours()).slice(-2);
			  const minutes = ('0' + date.getMinutes()).slice(-2);
			  const seconds = ('0' + date.getSeconds()).slice(-2);
			  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			}
		}
	}
</script>

<style lang="scss">
	.page-index {
		.header {
			padding-bottom: 16rpx;
			background: linear-gradient(180deg, #618cfc 0%, #f5f5f5 100%);

			.banner {
				margin: 0 auto;
				margin-top: 25rpx;
				width: 696rpx;
				height: 348rpx;
			}
		}
	}
</style>
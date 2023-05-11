<template>
	<view class="page-my">

		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="订单信息" class="title"></u-cell>
					<u-cell title="订单id" :value="order._id"></u-cell>
					<u-cell title="订单状态" :value="order_status[order.status?1:0]"></u-cell>
					<u-cell title="订单金额" :value="'￥' + (order.price/100).toFixed(2)"></u-cell>
					<!-- <u-cell title="用户密码" :value="user.password"></u-cell> -->
					<u-cell title="订单类型" :value="order_type[order.goods_type-1]"></u-cell>
					<u-cell v-if="order.status" title="支付时间" :value="formatDate(order.pay_time)"></u-cell>
					<u-cell title="订单生成时间" :value="formatDate(order.create_time)"></u-cell>
					<u-cell v-if="order.trade_no" title="交易号" :value="order.trade_no"></u-cell>
					<u-cell v-if="order.order_no" title="订单号" :value="order.order_no"></u-cell>
					<u-cell title="收货人id" class="title"></u-cell>
					<u-cell v-for="(id, index) in order.to_ids" :key="index" :title="id" style="text-align: center;"></u-cell>
				</u-cell-group>
			</view>
		</view>

	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL()

	export default {
		data() {
			return {
				order: {},
				order_type: ["买课程", "买会员", "续费会员", "参加活动"],
				order_status: ['已支付', '未支付']
			};
		},
		created() {},
		onReady() {},
		onLoad(e) {
			if (e.order) {
				this.order = JSON.parse(e.order)
				console.log(this.order)
			}

		},
		methods: {
			formatDate(timestamp) {
				console.log(timestamp);
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = ('0' + (date.getMonth() + 1)).slice(-2);
				const day = ('0' + date.getDate()).slice(-2);
				const hours = ('0' + date.getHours()).slice(-2);
				const minutes = ('0' + date.getMinutes()).slice(-2);
				const seconds = ('0' + date.getSeconds()).slice(-2);
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			}
		},
	};
</script>

<style scoped lang="scss">
	page {
		background: #f5f5f5;
	}
	
	.group_warp {
		background-color: #ffffff;
		padding-bottom: 20rpx;
		margin-top: 40rpx;

		.title {
			font-weight: 1000;
			text-align: center;
		}
	}
</style>
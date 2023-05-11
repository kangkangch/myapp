<template>
	<unicloud-db ref="udb" collection="member" @load="setData" :where="where"
		v-slot:default="{data,loading,error,options}" :options="options">
		<view v-if="error">{{error.message}}</view>
		<view v-else-if="loading">
			<view class="group_warp">
				<u-cell title="信息正在加载" class="title" />
			</view>
		</view>
		<view v-else class="page-my">
			<view  class="group_warp">
				<view class="u-page__item" style="margin: 0 10%">
					<u-cell-group>
						<u-cell title="基本信息" class="title"></u-cell>
						<u-cell title="申请日期" :value="memberInfo.create_time"></u-cell>
						<u-cell title="续费日期" :value="memberInfo.update_time"></u-cell>
						<u-cell title="到期日期" :value="memberInfo.end_time"></u-cell>
						<u-cell title="当前挂靠人数" :value="memberInfo.bind_num + ''"></u-cell>
						<u-cell title="最大挂靠数" :value="memberInfo.max_bind"></u-cell>
					</u-cell-group>
				</view>
			</view>
			<view class="group_warp">
				<view class="u-page__item" style="margin: 0 10%">
					<u-cell-group>
						<u-cell title="挂靠关系" class="title"></u-cell>
						<u-cell title="暂未挂靠" style="text-align: center;"></u-cell>
					</u-cell-group>
				</view>
			</view>

		</view>
	</unicloud-db>
</template>

<script>
	export default {
		data() {
			return {
				otherList: [{
						title: "我的证书",
						url: "/pages/public/my/certificate"
					},
					{
						title: "我的信息",
						url: "/pages/public/my/myInfo"
					},
					{
						title: "活动",
						url: "/pages/public/my/act"
					},
					{
						title: "成为会员",
						url: "/pages/student/my/beMember"
					},
				],
				user: null,
				where: "",
				memberInfo: {}
			};
		},
		created() {

		},
		onLoad(e) {
			var user = uni.getStorageSync('user')
			if (user) this.user = user
			this.where = "user_id=='" + user.user_id + "'"
		},
		onReady() {
			this.$refs.udb.loadData()
		},
		methods: {

			setData(data) {
				console.log(data);
				this.memberInfo = data[0];
			},

			//去其他服务页
			toService(url) {
				uni.navigateTo({
					url: url,
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	page {
		background: #f5f5f5;
	}

	.page-my {
		padding-bottom: 50rpx;

		.other {
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			margin-top: 24rpx;
			width: 690rpx;
			background: #ffffff;
			border-radius: 16rpx;

			.item {
				display: flex;
				padding: 40rpx 30rpx 0 30rpx;
				box-sizing: border-box;

				.mask {
					width: 44rpx;
					height: 44rpx;
				}

				.content {
					margin-left: 8rpx;
					display: flex;
					width: 100%;
					align-items: center;
					padding-bottom: 31rpx;
					justify-content: space-between;
					border-bottom: 1px solid #f5f5f5;
				}
			}
		}
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
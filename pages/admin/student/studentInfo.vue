<template>
	<view class="page-my">
		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="基本信息" class="title"></u-cell>
					<u-cell title="用户id" :value="user.id"></u-cell>
					<u-cell title="手机" :value="user.phone"></u-cell>
					<u-cell title="用户密码" :value="user.password"></u-cell>
					<u-cell title="地址" :value="user.area"></u-cell>
					<u-cell title="用户邮箱" :value="user.email"></u-cell>
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
		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="培训历史" class="title"></u-cell>
					<u-cell title="暂未参加培训" style="text-align: center;"></u-cell>
				</u-cell-group>
			</view>
		</view>
		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="已获得证件" class="title"></u-cell>
					<u-cell title="暂未获得证件" style="text-align: center;"></u-cell>
				</u-cell-group>
			</view>
		</view>

<!-- 		<view class="other">
			<view class="item" v-for="(item, index) in otherList" :key="index" @tap="toService(item.url)">
				<view :class="index == otherList.length - 1 ? 'content active' : 'content'">
					<cl-text :size="32" :value="item.title" color="#373737" bold></cl-text>
					<cl-icon name="cl-icon-arrow-right"></cl-icon>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				otherList: [{
						title: "培训历史",
						url: "/pages/public/my/certificate"
					},
					{
						title: "已报名课程",
						url: "/pages/public/my/myInfo"
					},
					{
						title: "查看证件",
						url: "/pages/public/my/act"
					},
				],
				user: null,
			};
		},
		created() {

		},
		onLoad(e) {
			let students = require('@/static/data/student.json');
			for (let item of students) {
				if (item.id == Number(e.id)) {
					this.user = item;
					break;
				}
			}
		},
		methods: {
			//去其他服务页
			toService(url) {
				uni.navigateTo({
					url: url,
				});
			},
			logout() {
				//登出逻辑
				uni.removeStorageSync('user');
				uni.switchTab({
					url: '/pages/public/home/home',
				});
			}
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
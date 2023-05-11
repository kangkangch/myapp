<template>
	<view class="page-my">
		<!-- 头部 -->
		<view class="header">
			<image class="bg" src="@/static/images/my/header-bg.png" mode="aspectFill"></image>
			<!-- 个人信息 -->
			<view class="info">
				<view class="detail">
					<cl-text :size="36" :value="'用户'+ user.user_name" color="#FFFFFF" block bold></cl-text>
					<view class="tag">ID:  {{user.user_id}}</view>
				</view>
			</view>
		</view>
		<!-- 其他服务 -->
		<view class="other">
			<view class="item" v-for="(item, index) in otherList" :key="index" @tap="toService(item.url)">
				<view :class="index == otherList.length - 1 ? 'content active' : 'content'">
					<cl-text :size="32" :value="item.title" color="#373737" bold></cl-text>
					<cl-icon name="cl-icon-arrow-right"></cl-icon>
				</view>
			</view>
		</view>
		<u-button type="warning" shape="circle" text="退出登录" customStyle="margin-top: 80rpx; width: 80%"
			@click="logout"></u-button>
		<u-tabbar :value="value" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
			<!-- <u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text" @tap="goto(item.pagePath)">-->
			<u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text" @click="$goBack(3, item.pagePath)">
				<image class="u-page__item__slot-icon" slot="active-icon" :src="item.selectedIconPath"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" :src="item.iconPath"></image>
			</u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	import { user_member } from "@/utils/tabbar.js"
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
						title: "考试情况",
						url: "/pages/public/my/exam/myExam"
					},
					{
						title: "我的订单",
						url: "/pages/public/my/order/myOrder"
					}
				],
				user: null,
				mytabbar : user_member,
				value: 3
			};
		},
		created() {
			this.user = uni.getStorageSync('user');
		},
		methods: {
			//去其他服务页
			toService(url) {
				uni.reLaunch({
					url: url
				})
			},
			logout() {
				//登出逻辑
				uni.removeStorageSync('user');
				uni.reLaunch({
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

		.header {
			position: relative;
			height: 508rpx;

			.bg {
				width: 100%;
				height: 100%;
			}

			.info {
				position: absolute;
				display: flex;
				align-items: center;
				left: 0;
				top: 203rpx;
				padding: 0 32rpx;

				.avatar {
					width: 116rpx;
					height: 117rpx;
				}

				.detail {
					margin-left: 18rpx;

					.tag {
						margin-top: 18rpx;
						display: inline-block;
						position: relative;
						padding: 6rpx 18rpx;
						color: #ffffff;
						font-size: 28rpx;
						background: rgba(255, 255, 255, 0.3);
						border-radius: 26rpx;
					}
				}
			}
		}

		.money {
			position: relative;
			padding: 40rpx 30rpx;
			box-sizing: border-box;
			margin: -120rpx auto 0 auto;
			width: 690rpx;
			background: #ffffff;
			border-radius: 16rpx;

			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 30rpx;
				border-bottom: 1px solid #f5f5f5;

				.right {
					display: flex;
					padding: 4rpx 16rpx 4rpx 20rpx;
					align-items: center;
					background: #80a3ff;
					font-size: 28rpx;
					color: #ffffff;
					border-radius: 25rpx;
				}
			}

			.msg {
				display: flex;

				.item {
					margin-top: 50rpx;
					flex: 1;
					text-align: center;
				}
			}
		}

		.advice {
			margin: 0 auto;
			text-align: center;
			margin-top: 24rpx;
			width: 690rpx;
			height: 180rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.order {
			margin: 0 auto;
			margin-top: 24rpx;
			padding: 40rpx 30rpx;
			box-sizing: border-box;
			width: 690rpx;
			background: #ffffff;
			border-radius: 16rpx;

			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 30rpx;
				border-bottom: 1px solid #f5f5f5;

				.right {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #8d8d8d;
				}
			}

			.type {
				display: flex;
				margin-top: 60rpx;
				padding: 0 25rpx;

				.item {
					text-align: center;
					margin-right: 80rpx;

					image {
						width: 54rpx;
						height: 66rpx;
					}
				}
			}
		}

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

				.active {
					border-bottom: none;
				}
			}
		}
	}
</style>
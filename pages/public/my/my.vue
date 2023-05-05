<template>
	<view class="page-my">
		<!-- 头部 -->
		<view class="header">
			<image class="bg" src="@/static/images/my/header-bg.png" mode="aspectFill"></image>
			<!-- 个人信息 -->
			<view class="info">
				<view class="detail">
					<cl-text :size="36" value="游客" color="#FFFFFF" block bold></cl-text>
					<view class="tag">游客</view>
				</view>
			</view>
		</view>
		<view class="tologin" @tap="toLogin">
			<view class="title">
				<view class="left">
					<cl-text :size="32" value="前去登录" color="#292929" bold></cl-text>
				</view>
				<!-- 				<cl-text :size="28" value="去提现" color="#FFFFFF" bold></cl-text> -->
				<view class="right">
					<cl-icon name="cl-icon-arrow-right"></cl-icon>
				</view>
			</view>
		</view>
		<u-tabbar :value="value" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
			<!-- <u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text" @tap="goto(item.pagePath)">-->
			<u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text"
				@click="$goBack(3, item.pagePath)">
				<image class="u-page__item__slot-icon" slot="active-icon" :src="item.selectedIconPath"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" :src="item.iconPath"></image>
			</u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	import {
		user_guest
	} from "@/utils/tabbar.js";
	export default {
		data() {
			return {
				mytabbar: user_guest,
				value: 2
			};

		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url: '/pages/public/loginwithP',
				})
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
	}

	.tologin {
		position: relative;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		margin: -120rpx auto 0 auto;
		width: 90%;
		background: #ffffff;
		border-radius: 16rpx;

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 0;
			padding-left: 80rpx;

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
	}
</style>
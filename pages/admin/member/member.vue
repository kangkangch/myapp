<template>
	<view class="page-my">
		<!-- 头部 -->
		<view class="header">
			<cl-topbar title="会员管理" background-color="#80a3ff" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
			<image class="bg" src="@/static/images/my/header-bg.png" mode="aspectFill"></image>
			<!-- 个人信息 -->
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
	import { user_admin } from "@/utils/tabbar.js";
	export default {
		data() {
			return {
				otherList: [{
						title: "总体信息",
						url: "/pages/admin/member/memberInfo"
					},
					{
						title: "会费管理",
						url: "/pages/public/my/myInfo"
					},
					{
						title: "挂靠信息管理",
						url: "/pages/public/my/act"
					},
				],
				mytabbar: user_admin,
				value: 1,
			};
		},
		created() {
			// console.log(user_admin);
		},
		methods: {
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

		.other {
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			margin-top: -200rpx;
			width: 690rpx;
			background: #ffffff;
			border-radius: 16rpx;
			position: relative;
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
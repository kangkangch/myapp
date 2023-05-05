<template>
	<view class="page-index">
		<view class="header">
			<!-- 自定义导航 -->
			<cl-topbar title="主页" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
			<!-- 搜索栏 -->
			<view class="search">
				<u-search v-model="keyword" height="40" :show-action="false" margin="10rpx 30rpx" :action-style= '{  }'></u-search>
				<!-- <cl-search v-model="keyword" placeholder="请输入关键词" @search="onSearch"></cl-search> -->
			</view>
		</view>
		<!-- 列表 -->
		<view class="content">
			<view class="tologin" @tap="$goBack(2,'/pages/admin/student/student_sum')">
				<view class="title">
					<view class="left">
						<cl-text :size="32" value="信息汇总" color="#292929" bold></cl-text>
					</view>
					<!-- 				<cl-text :size="28" value="去提现" color="#FFFFFF" bold></cl-text> -->
					<view class="right">
						<cl-icon name="cl-icon-arrow-right"></cl-icon>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="subject" v-for="(item, index) in content" :key="index" @click="gotoUser(item.id)">
					<view class="detail">
						<cl-text :size="32" :value="'用户 '+item.id" color="#303030" bold :ellipsis="2"></cl-text>
						<!-- 						<cl-text :size="20" :value="item.tip" color="#C5C5C5" bold block
							:margin="[8, 0, 0, 0]"></cl-text> -->
					</view>
					<u-button class="button" type="error" text="删除" customStyle="margin-top: 5rpx"
						@click.native.stop="remove"></u-button>
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
	import {
		getLdata
	} from "@/service/getLdata.js";


	export default {
		mounted() {},
		data() {
			return {
				selectIndex: 0,
				content: [],
				keyword: "", //搜索用的关键词
				uid: "",
				mytabbar: user_admin,
				value: 0,
			};
		},

		onLoad(e) {
			let uid = uni.getStorageSync('user').uId;
			if (uid) {
				this.uid = uid;
			}
			const users = require('@/static/data/student.json');
			console.log(users);
			this.content = users;
			// this.getlist()
		},

		methods: {
			toChange() {
				console.log(this.active);
			},
			gotoUser(uid) {
				uni.navigateTo({
					url: '/pages/admin/student/studentInfo?id=' + uid
				})
			},
			getlist() {
				getLdata('/static/data/course.json').then(res => {
					console.log(res)
					this.datalist = res.data;
				}).catch(err => {
					console.log(err)
				})
			},
			remove(index) {
				console.log('click', index);
				uni.showModal({
					// showCancel: false,
					title: '温馨提示',
					content: '确定要删除吗？',
					success: res => {
						if (res.confirm) {
							
						}
					}
				})
			},
		},
	};
</script>

<style scoped lang="scss">
	page {
		background: #f5f5f5;
	}

	/deep/ .cl-search {
		background-color: rgba(0, 0, 0, 0);
	}

	/deep/ .cl-button.cl-button--primary {
		border-radius: 32rpx;
		background: linear-gradient(90deg, #8ebbff 0%, #618cfc 100%);
	}

	/deep/ .cl-search__input .cl-button {
		right: 12rpx;
		top: 8rpx;
		height: 64rpx;
	}

	/deep/ .cl-input {
		height: 80rpx;
	}

	/deep/ .cl-tabs__bar-item.is-active {
		// font-size: 32rpx;
		font-weight: 600;
	}

	// /deep/ .cl-tabs__bar-item {
	// 	padding: 0px 15rpx !important;
	// }
	// /deep/ .cl-tabs.is-border .cl-tabs__header {
	// 	border-bottom: none;
	// }
	.page-index {
		.header {
			padding-bottom: 16rpx;
			background: linear-gradient(180deg, #618cfc 0%, #f5f5f5 100%);

		}

		.content {
			margin-top: 15rpx;
			background: #ffffff;

			.title {
				height: 78rpx;
			}

			.list {
				display: flex;
				flex-direction: column;

				.subject {
					margin: 0 auto;
					display: flex;
					// justify-content: space-between;
					align-items: center;
					height: 150rpx;
					width: 696rpx;
					border-bottom: 2px solid #c6c6c6;

					.picture {
						max-width: 342rpx;
						height: 192rpx;
					}

					.detail {
						// margin-left: 30rpx;
						margin-left: 10%;
					}
					
					.button {
						width: 15%;
						margin-left: 50%;
					}
				}
			}
		}
	}

	.tologin {
		position: relative;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		// margin: -120rpx auto 0 auto;
		width: 90%;
		background: #ffffff;
		border-radius: 16rpx;

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 0;
			padding-left: 80rpx;
			background-color: #e5e5e5;
			border-radius: 40rpx;

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
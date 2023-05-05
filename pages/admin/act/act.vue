<template>
	<view class="page-index">
		<view class="header">
			<!-- 自定义导航 -->
			<cl-topbar title="活动管理" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
			<!-- 搜索栏 -->
			<view class="search">
				<u-search v-model="keyword" :show-action="false"></u-search>
			</view>
		</view>
		<!-- 列表 -->
		<view class="content">
			<view class="list">
				<view class="subject" v-for="(item, index) in content" :key="index" @click="gotoAct(item.id)">
					<image class="picture" :src="item.cover_path" mode="aspectFill"></image>
					<view class="detail">
						<view>
							<cl-text :size="32" :value="item.name" color="#303030" bold :ellipsis="2"></cl-text>
						</view>
						<view>
							<cl-text :size="24" value="单价:" color="#303030"></cl-text>
							<cl-text :size="24" value="￥" color="#FF724E"></cl-text>
							<cl-text :size="40" :value="item.price" color="#FF724E" :margin="[8, 0, 0, 0]"></cl-text>
						</view>
						<view>
							<cl-text :size="24" value="活动状态:" color="#303030"></cl-text>
							<cl-text :size="30" :value="item.status" color="#FF724E" :margin="[8, 0, 0, 0]"></cl-text>
						</view>
						<u-button type="error" size="mini" text="删除" customStyle="margin-top: 5rpx"
							@click.native.stop="remove"></u-button>
					</view>
				</view>
			</view>
		</view>
		<u-tabbar :value="value" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
			<!-- <u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text" @tap="goto(item.pagePath)">-->
			<u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text" @click="goto(item.pagePath)">
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
				value: 4,
			};
		},

		onLoad(e) {
			const act = require('@/static/data/act.json');
			let uid = uni.getStorageSync('user').uId;
			if (uid) {
				this.uid = uid;
			}
			this.content = act;
			// this.getlist()
		},

		methods: {
			toChange() {
				console.log(this.active);
			},
			gotoAct(actId) {
				uni.navigateTo({
					url: '/pages/admin/act/actInfo?actId=' + actId
				})
			},
			getlist() {
				getLdata('/static/data/act.json').then(res => {
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
			goto(url){
				uni.switchTab({
					url:url
				})
			}
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
					height: 252rpx;
					width: 696rpx;
					border-bottom: 2px solid #f5f5f5;

					.picture {
						max-width: 342rpx;
						height: 192rpx;
					}

					.detail {
						// margin-left: 30rpx;
						margin-left: 10%;
					}
				}
			}
		}
	}

	.u-search {
		margin-left: 10%;
	}
</style>
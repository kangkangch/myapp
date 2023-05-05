<template>
	<view class="page-index">
		<view class="header">
			<!-- 自定义导航 -->
			<cl-topbar title="课程管理" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
			<!-- 搜索栏 -->
			<view class="search">
				<!-- <cl-search v-model="keyword" placeholder="请输入关键词" @search="onSearch"></cl-search> -->
				<u-search v-model="keyword" height="40" :show-action="false" margin="10rpx 30rpx" :action-style= '{  }'></u-search>
			</view>
		</view>
		<!-- 列表 -->
		<view class="content">
			<view class="list">
				<view class="subject" v-for="(item, index) in content" :key="index" @click="gotoCourse(item.courseId)">
					<image class="picture" :src="item.coverPath" mode="aspectFill"></image>
					<view class="detail">
						<cl-text :size="32" :value="item.name" color="#303030" bold :ellipsis="2"></cl-text>
						<!-- 						<cl-text :size="20" :value="item.tip" color="#C5C5C5" bold block
							:margin="[8, 0, 0, 0]"></cl-text> -->
						<cl-text :size="24" value="单价:" color="#303030"></cl-text>
						<cl-text :size="24" value="￥" color="#FF724E"></cl-text>
						<cl-text :size="40" :value="item.price" color="#FF724E" :margin="[8, 0, 0, 0]"></cl-text>
					</view>
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
	
	const course = require('@/static/data/course.json');

	export default {
		mounted() { },
		data() {
			return {
				selectIndex: 0,
				content: [
				],
				keyword: "", //搜索用的关键词
				uid : "",
				mytabbar: user_admin,
				value: 2,
			};
		},
		
		onLoad(e) {
			let uid = uni.getStorageSync('user').uId;
			if (uid) {
				this.uid = uid;
			}
			
			console.log(course);
			this.content = course;
			// this.getlist()
		},
		
		methods: {
			toChange() {
				console.log(this.active);
			},
			gotoCourse(courseId) {
				let user = uni.getStorageSync('user');
				if (user == '') {
					uni.showToast({
						"title": "请先登录后再查看课程",
						"icon": 'none'
					})
				} else {
					uni.navigateTo({
						url: '/pages/course/course?courseId=' + courseId
					})
				}
			},
			getlist() {
				getLdata('/static/data/course.json').then(res => {
					console.log(res)
					this.datalist = res.data;
				}).catch(err => {
					console.log(err)
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
</style>
<template>
	<view class="page-index">
		<view class="header">
			<!-- 自定义导航 -->
			<cl-topbar title="主页" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
			<!-- 搜索栏 -->
			<view class="search">
				<!-- <cl-search v-model="keyword" placeholder="请输入关键词" @search="onSearch"></cl-search> -->
				<u-search v-model="keyword" height="40" :show-action="false" margin="10rpx 30rpx"
					:action-style='{  }'></u-search>
			</view>
			<!-- 轮播图 -->
			<view class="banner">
				<cl-swiper v-model="selectIndex" :list="swiperList" height="348rpx" radius="0rpx" indicator-dots
					autoplay circular></cl-swiper>
			</view>
		</view>
		<!-- 列表 -->
		<unicloud-db ref="udb" :collection="collectionList" field="name,intro,cover_path,price,vip_price,exam_id"
			 :orderby="orderby" v-slot:default="{data,loading,error,options}"
			:options="options">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">课程正在加载...</view>
			<view v-else class="content">
				<view class="list">
					<view class="subject" v-for="(item, index) in data" :key="index"
						@click="gotoCourse(item._id)">
						<image class="picture" :src="item.cover_path" mode="aspectFill"></image>
						<view class="detail">
							<cl-text :size="32" :value="item.name" color="#303030" bold :ellipsis="2"></cl-text>
							<!-- 						<cl-text :size="20" :value="item.tip" color="#C5C5C5" bold block
							:margin="[8, 0, 0, 0]"></cl-text> -->
							<cl-text :size="24" value="单价:" color="#303030"></cl-text>
							<cl-text :size="24" value="￥" color="#FF724E"></cl-text>
							<cl-text :size="40" :value="(item.price/100).toFixed(2)" color="#FF724E" :margin="[8, 0, 0, 0]"></cl-text>
						</view>
					</view>
				</view>
			</view>
		</unicloud-db>

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
		user_guest,
		user_student,
		user_member
	} from "@/utils/tabbar.js";
	import {
		getLdata
	} from "@/service/getLdata.js";

	const course = require('@/static/data/course.json');
	const dbOrderby = 'name';

	export default {
		mounted() {},
		data() {
			return {
				collectionList: ['course'],
				selectIndex: 0,
				swiperList: [{
						url: require("@/static/images/index/banner1.png")
					},
					{
						url: require("@/static/images/index/banner2.png")
					},
					{
						url: require("@/static/images/index/banner3.png")
					},
				],
				content: [],
				orderby: dbOrderby,
				keyword: "", //搜索用的关键词
				user_id: "",
				mytabbar: user_guest,
				value: 0
			};
		},

		onLoad(e) {
			this.gettabbar();
			let user_id = uni.getStorageSync('user')._id;
			if (user_id) {
				this.user_id = user_id;
			}

			// console.log(course);
			// this.content = course;
			// this.getlist()
		},
		onReady() {
		  this.$refs.udb.loadData()
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
						url: '/pages/course/course?course_id=' + courseId
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
			gettabbar() {
				let token = uni.getStorageSync('token');
				// console.log(user.role_id);
				if (token == '') this.mytabbar = user_guest;
				else if (token.role_id == 2) this.mytabbar = user_member;
				else this.mytabbar = user_student;
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

			.banner {
				margin: 0 auto;
				margin-top: 25rpx;
				width: 696rpx;
				height: 348rpx;
			}
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
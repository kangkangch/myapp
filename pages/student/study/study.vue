<template>
	<view class="page-index">
		<view class="header">
			<!-- 自定义导航 -->
			<cl-topbar title="我的课程" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
				:show-back="false"></cl-topbar>
			<!-- 搜索栏 -->
			<view class="search">
				<!-- <cl-search v-model="keyword" placeholder="请输入关键词" @search="onSearch"></cl-search> -->
				<u-search v-model="keyword" height="40" :show-action="false" margin="10rpx 30rpx" :action-style= '{  }'></u-search>
			</view>
		</view>
		<!-- 列表 -->
		<view class="content">
			<view class="list" v-if="user != null">
				<view class="subject" v-for="(item, index) in content" :key="index">
					<image class="picture" :src="item.picture" mode="aspectFill"></image>
					<view class="detail">
						<cl-text :size="32" :value="item.name" color="#303030" bold :ellipsis="2"></cl-text>
						<!-- 						<cl-text :size="20" :value="item.tip" color="#C5C5C5" bold block
							:margin="[8, 0, 0, 0]"></cl-text>
						<cl-text :size="24" value="单价:" color="#303030"></cl-text>
						<cl-text :size="24" value="￥" color="#FF724E"></cl-text> 
						<cl-text :size="40" :value="item.price" color="#FF724E" :margin="[8, 0, 0, 0]"></cl-text>-->
					</view>
				</view>
			</view>
			<view v-else class="tologin" @tap="$goBack(2,'/pages/public/loginwithP')">
				<view class="title">
					<view class="left">
						<cl-text :size="32" value="还没有登录, 前去登录" color="#292929" bold></cl-text>
					</view>
					<!-- 				<cl-text :size="28" value="去提现" color="#FFFFFF" bold></cl-text> -->
					<view class="right">
						<cl-icon name="cl-icon-arrow-right"></cl-icon>
					</view>
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
	import { user_guest, user_member, user_student } from "@/utils/tabbar.js"
	export default {
		data() {
			return {
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
				content: [{
						name: "普通人也可执行的赚钱思路课程",
						picture: require("@/static/images/index/course1.png"),
						price: "68.0",
					},
					{
						name: "普通人也可执行的赚钱思路课程",
						picture: require("@/static/images/index/course2.png"),
						price: "52.0",
					},
					{
						name: "普通人也可执行的赚钱思路课程",
						picture: require("@/static/images/index/course3.png"),
						price: "33.0",
					},
					{
						name: "普通人也可执行的赚钱思路课程",
						picture: require("@/static/images/index/course1.png"),
						price: "68.0",
					},
					{
						name: "普通人也可执行的赚钱思路课程",
						picture: require("@/static/images/index/course2.png"),
						price: "52.0",
					},
					{
						name: "普通人也可执行的赚钱思路课程",
						picture: require("@/static/images/index/course3.png"),
						price: "33.0",
					},
				],
				keyword: "", //搜索用的关键词
				user: null,
				mytabbar: null,
				value: 1,
			};
		},
		
		
		onLoad() {
			let user = uni.getStorageSync('user');
			if(user != '') this.user = user;
			console.log(this.user);
			this.gettabbar();
		},
		
		methods: {
			toChange() {
				console.log(this.active);
			},
			gettabbar(){
				let user = uni.getStorageSync('user');
				console.log(user.role_id);
				if(user == '') this.mytabbar = user_guest;
				else if(user.role_id ==2 ) this.mytabbar = user_member;
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

	.tologin {
		position: relative;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		width: 90%;
		background: #ffffff;
		border-radius: 16rpx;

		.title {
			border: 3rpx solid red;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 30rpx 30rpx 80rpx;
			border-radius: 30rpx;
			
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
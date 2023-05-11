<!-- 1. 查看自己挂靠的非会员
2. 查看自己的免费券
3. 查看自己的会员到期时间 -->

<template>
	<view class="page-my">
		<!-- 其他服务 -->
		<view class="other">
			<view class="item" v-for="(item, index) in otherList" :key="index"
				@click="$goBack(2, item.url)">
				<view :class="index == otherList.length - 1 ? 'content active' : 'content'">
					<cl-text :size="32" :value="item.title" color="#373737" bold></cl-text>
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
		user_member
	} from "@/utils/tabbar.js"

	const db = uniCloud.databaseForJQL()
	export default {
		data() {
			return {
				otherList: [{
						//查看自己的会员的信息（到期时间，是否续费等）
						title: "我的会员",
						url: "/pages/student/my/myMember"
					},
					{
						//查看自己名下的学员
						title: "我的学员",
						url: "/pages/member/member/myStudent"
					},
					{
						//优惠券
						title: "优惠券",
						url: "/pages/member/member/myCoupons"
					},
				],
				mytabbar: user_member,
				value: 2,
				// myStudent: []
			};
		},
		created() {

		},
		methods: {
			async toMyStudent() {
				let user = uni.getStorageSync('user')
				let binds = await db.collection('bind').where({
					member_id: user.user_id
				}).get()
				let myStudents = []
				for (let bind of binds.data) {
					myStudents.push(bind.student_id)
				}
				// uni.navigateTo({
				// 	url: '/pages/member/member/myStudent?myStudents=' +
				// 		encodeURIComponent(JSON.stringify(myStudents))
				// })
			},
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

				.active {
					border-bottom: none;
				}
			}
		}
	}
</style>
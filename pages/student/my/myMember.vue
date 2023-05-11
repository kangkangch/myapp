<template>
	<view>
		<view class="vipcard-detail-header">
			<image class="bg" src="@/static/images/my/header-bg.png"></image>
			<view class="main pt20">
				<view class="flex alcenter space">
					<view v-if="user.role_id == 2" class="col3 text-center">
						<view class="ft12 cl-w8">到期日期</view>
						<view class="mt8 vipcard-num">{{memberInfo.end_time}}</view>
					</view>
					<view class="col3 flex center">
						<!-- <image class="vipcard-face" src="/static/images/my/vipcard_student.png"></image> -->
					</view>
					<!-- 					<view class="col3 text-center">
						<view class="ft12 cl-w8">{{vipLevel>1?'剩余天数':''}}</view>
						<view v-if="userinfo.dqts>=0" class="mt8 vipcard-num">{{vipLevel>1?userinfo.dqts+'天':''}}</view>
						<view v-if="userinfo.dqts<0" class="mt8 vipcard-num">{{vipLevel>1?'已经到期'+-userinfo.dqts+'天':''}}</view>
					</view> -->
				</view>

				<view class="flex center mt8">
					<view class="vipcard-level-tag ft12 cl-w8">当前等级:<text
							class="ftw600 ft12 ml4">{{user.role_id== 1?"普通学员":"尊贵会员"}}</text></view>
				</view>
			</view>
		</view>

		<view class="vipcard-detail-main">
			<view class="flex center">
				<swiper @change="changeVip" class="vipcard-swiper" previous-margin="15px" next-margin="30px"
					:indicator-dots="false" :autoplay="false">
					<swiper-item>
						<view class="swiper-item">
							<view class="card">
								<image class="bg" :src="'/static/images/my/vipcard_vip_bg_0' + user.role_id +'.png'">
								</image>
								<view class="main">
									<view class="text-center ft20 ftw600 cl-main">{{user.user_name}}</view>
									<view v-if="user.role_id == 1" class="mt20 flex center">
										<view @click="beMember" class="vipcard-info"><text
												class="ft14 ftw600 ml4 cl-main">成为会员</text></view>
										<!-- <view @click="vipcm" v-if="vipLevel == 2" class="vipcard-info">
											{{userinfo.dqts}}天后到期 续费VIP</view> -->
									</view>
									<view v-if="user.role_id == 2" class="mt20 flex center">
										<view @click="beMember" class="vipcard-info"><text
												class="ft14 ftw600 ml4 cl-main">立即续费</text></view>
										<!-- <view @click="vipcm" v-if="vipLevel == 2" class="vipcard-info">
											已经到期10天 立即续费VIP</view> -->
									</view>
								</view>
							</view>
						</view>
					</swiper-item>

				</swiper>
			</view>
			<view class="pd16_15" v-if="user.role_id == 1">
				<view class="box noshadow pd16_15">
					<view class="ft16 ftw600 cl-main">VIP会员持有权益</view>
					<view class="flex space alcenter mt16">
						<view class="vipcard-con-box pd20_15 flex alcenter"
							v-for="(item, index) in vipRightSet.slice(0,2)" :key="index">
							<image style="width: 80rpx;height: 80rpx;" :src="'/static/images/my/' + item.img_name">
							</image>
							<view class="ml10">
								<view class="ft14 ftw600 cl-main">{{item.title}}</view>
								<view class="mt6 ft12 cl-notice">{{item.value}}</view>
							</view>
						</view>
					</view>

					<view class="flex space alcenter mt16">
						<view class="vipcard-con-box pd20_15 flex alcenter"
							v-for="(item, index) in vipRightSet.slice(2,4)" :key="index">
							<image style="width: 80rpx;height: 80rpx;" :src="'/static/images/my/' + item.img_name">
							</image>
							<view class="ml10">
								<view class="ft14 ftw600 cl-main">{{item.title}}</view>
								<view class="mt6 ft12 cl-notice">{{item.value}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<unicloud-db v-if="user.role_id == 2" ref="udb" collection="member" @load="setData" :where="where"
				v-slot:default="{data,loading,error,options}" :options="options">
				<view v-if="error">{{error.message}}</view>
				<view v-else-if="loading">
					<view class="group_warp">
						<u-cell title="信息正在加载" class="title" />
					</view>
				</view>
				<view v-else class="page-my" >
					<view class="group_warp">
						<view class="u-page__item" style="margin: 0 10%">
							<u-cell-group>
								<u-cell title="基本信息" class="title"></u-cell>
								<u-cell title="申请日期" :value="memberInfo.create_time"></u-cell>
								<u-cell title="续费日期" :value="memberInfo.update_time"></u-cell>
								<u-cell title="到期日期" :value="memberInfo.end_time"></u-cell>
								<u-cell title="当前挂靠人数" :value="memberInfo.bind_num + ''"></u-cell>
								<u-cell title="最大挂靠数" :value="memberInfo.max_bind"></u-cell>
							</u-cell-group>
						</view>
					</view>

				</view>
			</unicloud-db>
<!-- 			<u-tabbar :value="user.role_id == 1? 1 : 2" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
				<u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text"
					@click="$goBack(3, item.pagePath)">
					<image class="u-page__item__slot-icon" slot="active-icon" :src="item.selectedIconPath"></image>
					<image class="u-page__item__slot-icon" slot="inactive-icon" :src="item.iconPath"></image>
				</u-tabbar-item>
			</u-tabbar> -->
		</view>
		<!-- <dialog-birthday :showOnly="true" :title="'V'+vipSetting[selectId].level +vipSetting[selectId].name + '生日礼包'"
			v-if="showBirthday" @closed="showBirthday = false"></dialog-birthday> -->
	</view>
</template>

<script>
	import {
		user_member, user_student
	} from "@/utils/tabbar.js"
	const db = uniCloud.databaseForJQL()

	export default {

		data() {
			return {
				selectId: 0,
				vipname: '',
				showBirthday: false,
				avatar: '',
				memberInfo: [],
				user: null,
				where: "",
				vipSetting: [{
						level: 1,
						name: '普通会员',
						rank_need: 100
					},
					{
						level: 2,
						name: 'VIP会员',
						rank_need: 200
					},
					// {level:3,name:'铂金会员',rank_need:300},
					// {level:4,name:'钻石会员',rank_need:400},
					// {level:5,name:'至尊会员',rank_need:500},
				],
				vipRightSet: [{
						title: "福利",
						value: "超级礼包",
						img_name: "vipcard_icon_right01.png"
					},
					{
						title: "特惠折扣",
						value: "会员专属价",
						img_name: "vipcard_icon_right02.png"
					},
					{
						title: "专属特惠",
						value: "免费视频",
						img_name: "vipcard_icon_right03.png"
					},
					{
						title: "专属顾问",
						value: "绑定成员",
						img_name: "vipcard_icon_right04.png"
					}
				],
				mytabbar: [],
				otherList: [{
						//查看自己的会员的信息（到期时间，是否续费等）
						title: "具体信息",
						url: "/pages/member/member/myMember"
					},
					{
						//查看自己名下的学员
						title: "我的学员",
						url: "/pages/public/my/myInfo"
					},
					{
						//优惠券
						title: "优惠券",
						url: "/pages/member/myCoupon"
					},
				],
			}
		},
		onLoad() {
			let user = uni.getStorageSync('user');
			if (user) this.user = user
			this.where = "user_id=='" + user.user_id + "'"
		},
		onShow() {
			// this.getUser()
		},
		onReady() {
			if(this.user.role_id == 2) this.$refs.udb.loadData()
		},
		computed: {},
		methods: {
			getUser() {
				this.user = uni.getStorageSync("user");
				// console.log(this.user);
				if (this.user.role_id == 2) {
					//获取会员信息并存入user_info
				}

			},
			async beMember() {
				var bind = await db.collection('bind').where({
					student_id: this.user.user_id
				}).get()
				console.log(bind)
				if (bind.data.length) {
					uni.showToast({
						title: "您当前已经绑定其他会员，请先解除绑定",
						icon: "none"
					})
				} else {
					var params = {
						user_id: this.user.user_id
					}
					uni.navigateTo({
						url: '/pages/student/my/beMember?user_id=' + this.user.user_id
					})
				}

			},
			setData(data) {
				console.log(data)
				this.memberInfo = data[0]
				// console.log(data)
			}

		}
	}
</script>

<style lang="scss">
	.vipcard-detail-header {
		position: relative;
		height: 480rpx;
	}

	.vipcard-detail-header .bg {
		width: 100%;
		height: 480rpx;
	}

	.vipcard-detail-header .main {
		height: 480rpx;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.vipcard-detail-header .vipcard-num {
		font-size: 24rpx;
		font-weight: bold;
		line-height: 48rpx;
		background: linear-gradient(180deg, #F2DCA9 0%, #C79556 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.vipcard-detail-header .vipcard-face {
		width: 112rpx;
		height: 112rpx;
		border: 8rpx solid rgba(255, 255, 255, 0.9);
		border-radius: 100rpx;
		background: rgba(255, 255, 255, 0.9);
	}

	.vipcard-detail-header .vipcard-level-tag {
		height: 40rpx;
		border-radius: 20rpx;
		padding: 0 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx solid rgba(255, 255, 255, .3)
	}

	.vipcard-detail-main {
		position: relative;
		margin-top: -212rpx;
	}

	.vipcard-swiper {
		height: 280rpx;
		width: 100%;
	}

	.vipcard-swiper .swiper-item {
		width: 100%;
		padding-left: 15px;
		/**就用PX了**/
	}

	.vipcard-swiper .swiper-item .card {
		height: 280rpx;
		width: 100%;
		position: relative;
		border-radius: 32rpx;
		overflow: hidden;
	}

	.vipcard-swiper .swiper-item .card .bg {
		width: 100%;
		height: 280rpx;
	}

	.vipcard-swiper .swiper-item .card .main {
		width: 100%;
		height: 280rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 72rpx;
	}

	.vipcard-swiper .swiper-item .card .main .vipcard-info {
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 0 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #ff0000;
		font-size: 30rpx;
	}

	.vipcard-swiper .swiper-item .card .vip-type-tag {
		width: 104rpx;
		height: 40rpx;
		background: linear-gradient(136deg, #4E4E4E 0%, #262728 100%);
		border-radius: 0rpx 20rpx 20rpx 0rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #F7E3C3;
		font-weight: 500;
		position: absolute;
		z-index: 3;
		left: 0;
		top: 40rpx;
	}

	.vipcard-con-box {
		width: 300rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 8rpx;
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
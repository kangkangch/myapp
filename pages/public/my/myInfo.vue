<template>
	<unicloud-db ref="udb" :collection="collection" :where="`_id == '${user.user_id}'`"
		v-slot:default="{data,loading,error,options}" loadtime="onready" @load="setData" :options="options"
		:getone="true">
		<view v-if="error">{{error.message}}</view>
		<view v-else-if="loading">
			<view class="group_warp">
				<u-cell title="信息正在加载" class="title" />
			</view>
		</view>
		<view v-else class="page-my">

			<view class="group_warp">
				<view class="u-page__item" style="margin: 0 10%">
					<u-cell-group>
						<u-cell title="基本信息" class="title"></u-cell>
						<u-cell title="用户id" :value="userInfo._id"></u-cell>
						<u-cell title="手机" :value="userInfo.phone"></u-cell>
						<!-- <u-cell title="用户密码" :value="user.password"></u-cell> -->
						<u-cell title="地址" :value="userInfo.area"></u-cell>
						<u-cell title="用户邮箱" :value="userInfo.email"></u-cell>
						<u-cell title="注册时间"
							:value="userInfo.register_time? Date(userInfo.register_time).slice(4,24):''"></u-cell>
					</u-cell-group>
				</view>
			</view>
			<view class="group_warp" v-if="user.role_id == 1">
				<view class="u-page__item" style="margin: 0 10%">
					<u-cell-group>
						<u-cell title="挂靠关系" class="title"></u-cell>
						<view v-if="myMember">
							<u-cell title="会员手机" :value="myMember.phone"></u-cell>
							<u-cell title="会员邮箱" :value="myMember.email"></u-cell>
							<u-button type="warning" @click="relieve" style="margin-top: 50rpx;">解除挂靠</u-button>
						</view>
						<u-cell v-else title="暂未挂靠" style="text-align: center;"></u-cell>
					</u-cell-group>
				</view>
			</view>

		</view>
	</unicloud-db>
</template>

<script>
	const db = uniCloud.databaseForJQL()

	export default {
		data() {
			return {
				user: null,
				userInfo: {},
				collection: 'user',
				myMember: null
			};
		},
		created() {},
		onReady() {
			this.$refs.udb.loadData()
		},
		async onLoad() {
			var user = uni.getStorageSync('user')
			if (user) this.user = user

			//如果是学员就加载挂靠关系
			if (user.role_id == 1) {
				var bind = await db.collection('bind').where({
					student_id: user.user_id
				}).get()
				if (bind.data.length) {
					var memberInfo = await db.collection('user').where({
						_id: bind.data[0].member_id
					}).field("phone, email").get()
					this.myMember = memberInfo.data[0]
				} else this.myMember = null
			}
			// this.$refs.udb.loadData()
		},
		methods: {
			setData(data) {
				this.userInfo = data
			},
			async relieve() {
				// console.log(this.user.user_id)
				await db.collection('bind').where("student_id == '" + this.user.user_id + "'").remove().then(res => {
					this.myMember = null
					console.log("解除挂靠成功", res)
				}).catch(e => {
					console.log("解除挂靠失败", e)
				})
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
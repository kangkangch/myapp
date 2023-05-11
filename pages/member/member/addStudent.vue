<template>
	<unicloud-db ref="udb" collection="user" field="_id,phone,user_name,area,email" @load="setData" :where="where"
		v-slot:default="{data,loading,error,options}" :options="options" loadtime="onready">
		<view v-if="error">{{error.message}}</view>
		<view v-else-if="loading">
			<view class="group_warp">
				<u-cell title="信息正在加载" class="title" />
			</view>
		</view>
		<view v-else class="page-my page-index">
			<view class="header">
				<!-- 自定义导航 -->
				<cl-topbar title="添加学员" background-color="rgba(0,0,0,0)" color="#FFFFFF" :border="false"
					:show-back="false"></cl-topbar>
				<!-- 搜索栏 -->
				<view class="search">
					<!-- <cl-search v-model="keyword" placeholder="请输入关键词" @search="onSearch"></cl-search> -->
					<u-search v-model="searchPhone" height="40" :show-action="false" margin="10rpx 30rpx" ma
						maxlength="11" earch="search" :clearabled="true" placeholder="请输入学员手机号"></u-search>
				</view>
			</view>
			<!-- 列表 -->
			<view class="group_warp" v-if="studentInfo">
				<view class="u-page__item" style="margin: 0 10%">
					<u-cell-group>
						<u-cell title="基本信息" class="title"></u-cell>
						<u-cell title="用户名" :value="studentInfo.user_name"></u-cell>
						<u-cell title="手机号码" :value="studentInfo.phone"></u-cell>
						<u-cell title="所在地区" :value="studentInfo.area"></u-cell>
						<u-cell title="邮箱" :value="studentInfo.email"></u-cell>
					</u-cell-group>
				</view>
			</view>
			<u-button v-if="studentInfo" @click="add()" style="margin-top: 100rpx; width: 80%;" shape="circle" type="primary">添加学员</u-button>
		</view>
	</unicloud-db>
</template>

<script>
	const db = uniCloud.databaseForJQL()
	export default {
		data() {
			return {
				searchPhone: "",
				studentInfo: null,
				where: "",
				user: null,
				bind_num: 0
			}
		},
		async onLoad(e) {
			
			const user = uni.getStorageSync('user')
			if(user) this.user = user
			
			const myBinds = await db.collection('bind').where({
				member_id : user.user_id
			}).get()
			
			this.bind_num = myBinds.data.length
			console.log(this.bind_num)
		},
		methods: {
			search() {
				this.where = `phone == '${this.searchPhone}' && role_id != 2`
				// console.log(this.studentInfo)
			},
			async add(){
				//通过id搜索该学员查看该学员是否已经绑定
				var bind = await db.collection('bind').where({
					student_id : this.studentInfo._id,
				}).get()
				//如果已经绑定
				if(bind.data.length){
					uni.showToast({
						title:"该学员已经进行绑定",
						icon:"none"
					})
				}
				else {
					uni.showModal({
						title:"提示",
						content:"是否绑定该学员？",
						success: async function (res) {
								if (res.confirm) {
									var that = this
									// console.log(that.user)
									
									let params = {
										member_id : that.user.user_id,
										student_id : that.studentInfo._id
									}
									
									uni.showLoading({
										title:"绑定中"
									})
									
									await db.collection('member').where({
										user_id : this.user.user_id
									}).update({
										bind_num : this.bind_num + 1
									})
									
									await db.collection('bind').add(params).then(res => {
										uni.hideLoading()
										console.log('绑定成功：',res)
										uni.showToast({
											title:"绑定成功",
											icon: "none"
										})
										uni.navigateTo({
											url:"/pages/member/member/myStudent"
										})
									}).catch(e=> {
										uni.hideLoading()
										console.log('绑定失败：',e)
										uni.showToast({
											title:"绑定失败",
											icon: "error"
										})
									})
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}.bind(this)
					})
				}
			},
			setData(data) {
				if (data.length) {
					this.studentInfo = data[0]
				}
				else {
					this.studentInfo = null
					console.log(data)
				}
			}
		}
	}
</script>

<style lang="scss">
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

		}
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
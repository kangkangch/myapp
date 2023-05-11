<template>
	<view>
		<unicloud-db ref="udb" collection="course" @load="setData" :where="where"
			v-slot:default="{data,loading,error,options}" :options="options">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">课程正在加载...</view>
			<view v-else class="body">


				<orderGet :key="orderGetKey" :params="params" :otherInfo="otherInfo" :order_type="1"
					@close="modal_show = false" :modal_show="modal_show"></orderGet>

				<u-row>
					<u-col span="5">
						<view>
							<image class="images" :src="course.cover_path" mode="widthFix"></image>
						</view>
					</u-col>
					<u-col span="7">
						<view class="title">
							{{course.name}}
						</view>
					</u-col>

				</u-row>
				<u-line margin="10rpx"></u-line>
				<view v-if="(user.role_id == 1 && !isBuy )|| (!isBuy || !allBuy)" class="course_price">
					<view class="freu">
						会员价：￥{{(course.vip_price/100).toFixed(2)}}
					</view>
					<view class="freu2">
						学员价： ￥{{(course.price/100).toFixed(2)}}
					</view>
				</view>

				<view class="body">
					<u-cell-group class="group_warp">
						<u-cell title="课程介绍" class="group_title"></u-cell>
						<u-cell :title="course.intro"></u-cell>
						<u-cell title="开始时间: " :value="course.begin_time"></u-cell>
						<u-cell title="结束时间: " :value="course.end_time"></u-cell>
					</u-cell-group>
				</view>
				<view class="dibu">
					<u-row customStyle="margin-bottom: 10px">
						<u-col span="12">
							<view class="goumai" v-if="course.end_time != '' && course.end_time >= getTime">该课程已经结束
							</view>
							<view v-else>
								<view v-if="exam">
									<view class="goumai2" @click="toExam">前往考试</view>
								</view>
								<view v-else>
									<view v-if="!isBuy" class="goumai" style="margin-bottom: 20rpx;" @click="getOrder">
										购买课程
									</view>
									<view v-else>
										<view class="goumai" style="margin-bottom: 20rpx;"
											v-if="user.role_id == 2 && !allBuy" @click="getOrder">为学员购买</view>
										<view class="goumai2" v-if="isBuy " @click="toExam">前往考试</view>
									</view>
								</view>


							</view>
						</u-col>
					</u-row>
				</view>
			</view>


		</unicloud-db>
	</view>
</template>

<script>
	import {
		getLdata
	} from "@/service/getLdata.js";
	import {
		onLoad
	} from "../../uni_modules/uview-ui/libs/mixin/mixin";
	import {
		oderGet
	} from "@/components/orderGet/orderGet.vue"

	const db = uniCloud.databaseForJQL();

	export default {
		components: {
			oderGet,
		},
		data() {
			return {
				user: null,
				where: "",
				course: [],
				nowPrice: 0,
				modal_show: false,
				exam: false, //判断是否是从学习页进入
				// course_id: 0,
				allBuy: false,
				//用于存放是否购买了该课程
				isBuy: false,
				to_ids: [],
				params: {}, //用于传递给订单生成组件的订单参数
				otherInfo: {}, //用于传递给订单生成组件的显示参数
				orderGetKey: 0,
				end_time: '',
				myStudentsId: [],
				myCoupons: [],
				attendCourseInfo: {}
			}
		},

		onLoad(e) {
			const course_id = e.course_id
			this.user = uni.getStorageSync('user');
			if (e.exam != "true") {
				this.where = "_id=='" + course_id + "'"
				this.allBuy = e.allBuy == 'false' ? false : true
				this.isBuy = e.isBuy == 'false' ? false : true
				this.myStudentsId = JSON.parse(decodeURIComponent(e.myStudentsId))
				// console.log(this.myStudentsId)

				this.to_ids = []
				if (!this.isBuy && this.user.role_id == 1) {
					this.to_ids.push(this.user_id);
					// this.course_id = e.course_id;
				}
			} else {
				this.exam = true
			}
			// console.log(this.exam)
			// uni.hideLoading()
		},

		created() {},

		onReady(e) {
			if (this.where)
				this.$refs.udb.loadData()
		},

		methods: {
			setData(data, ended, pagination) {
				this.course = data[0];
				console.log(this.course)
				// console.log(this.course);
			},

			async toExam() {
				var attend_course = await db.collection('attend_course').where({
					user_id: this.user.user_id,
					course_id: this.course._id
				}).get()
				this.attendCourseInfo = attend_course.data[0]
				if (this.attendCourseInfo.chance <= 0) {
					uni.showToast({
						title: "已经没有参考机会了哦",
						icon: "error"
					})
					return
				} else {
					uni.showModal({
						title: "",
						content: "确定要进入考试吗？",
						success: function(res) {
							var that = this

							if (res.confirm) {
								console.log(this.course)
								console.log('开始考试');
								uni.navigateTo({
									url: "/pages/public/my/exam/exam?course_id=" + this.course._id
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}.bind(this)
					})
				}

			},


			async getOrder() {
				//如果是学员且没买
				if (!this.isBuy && this.user.role_id == 1)
					this.nowPrice = this.course.price;
				else this.nowPrice = 0

				//判断如果是会员且所有都购买，则显示信息
				if (this.allBuy && this.isBuy) {
					uni.showToast({
						title: "您和您名下所有学员都已购买该课程，无需再次购买",
						icon: "none"
					})
				} else {

					//在生成订单前获取优惠券
					let nowTime = this.getTime()

					// var myCoupons = await db.collection('use_coupon').where(`user_id == "${this.user.user_id}" && status == false && end_time <= "${nowTime}"`).get()
					const command = db.command
					const Coupons = await db.collection('use_coupon').where({
						user_id: this.user.user_id,
						status: false,
						end_time: command.gte(nowTime)
					}).get()
					var myCoupons = Coupons.data
					console.log(myCoupons)
					

					// console.log(this.nowPrice)
					this.params = {
						user_id: this.user.user_id,
						price: this.nowPrice,
						goods_type: 1,
						goods_id: this.course._id,
						to_ids: this.to_ids,
					}

					this.orderGetKey++;
					// console.log(this.orderGetKey);

					this.otherInfo = {
						role_id: this.user.role_id,
						course_name: this.course.name,
						myStudentsId: this.myStudentsId,
						vip_price: this.course.vip_price,
						isBuy: this.isBuy,
						myCoupons: myCoupons
					}
					this.modal_show = true;
				}
			},


			getTime(time) {
				if (time) var date = time
				else var date = new Date();

				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				// hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
				// minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
				// second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				// var timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
				var timer = year + '-' + month + '-' + day
				return timer;
			}


		}
	}
</script>

<style lang="scss">
	page {
		background-color: #efefefdb;
	}

	.body {
		background-color: #FFF;
		border-radius: 10rpx;
		margin: 20rpx;
		padding: 20rpx;
	}

	.images {
		width: 100%;
		border-radius: 10rpx;
	}

	.title {
		margin-left: 20rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.f_title {
		margin-left: 20rpx;
		color: #6e6e6f;
		font-size: 26rpx;
		line-height: 40rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.freu {
		color: #ff0000;
		font-weight: 600;
		line-height: 120rpx;
		font-size: 2rem;
	}

	.freu2 {
		color: #53C21D;
		font-weight: 600;
		line-height: 120rpx;
		font-size: 1.5rem;
	}

	.jairu {
		color: #6e6e6f;
		font-size: 26rpx;
		line-height: 40rpx;

	}

	.u-content {
		padding: 24rpx;
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-line;
	}

	.dibu {
		position: fixed;
		right: 5%;
		left: 5%;
		bottom: 10%;
		background-color: #fff;
		height: 80rpx;
		border-radius: 10rpx;
		box-shadow: 10rpx 10rpx 3rpx rgba(78, 101, 153, 0.2);
	}

	.goumai {
		background-color: #2196F3;
		text-align: center;
		color: #fff;
		line-height: 80rpx;
		border-top-right-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
	}

	.goumai2 {
		background-color: #53C21D;
		text-align: center;
		color: #fff;
		line-height: 80rpx;
		border-top-right-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
	}

	.juzhong {
		padding: 10rpx 20rpx;
	}

	.group_warp {
		background-color: #ffffff;
		padding-bottom: 20rpx;
		margin-top: 40rpx;
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-line;

	}

	.group_title {
		font-weight: 1000;
		text-align: center;
	}
</style>
<template>
	<view>
		<view class="body" v-if="lx==0">
			<u-row>
				<u-col span="5">
					<view>
						<image class="images" :src="course.coverPath" mode="widthFix"></image>
					</view>
				</u-col>
				<u-col span="7">
					<view class="title">
						{{course.name}}
					</view>
				</u-col>

			</u-row>
			<u-line margin="10rpx"></u-line>
			<view class="freu">
				会员价：￥{{course.price * 0.8}}
			</view>
			<view class="freu2">
				学员价： ￥{{course.price}}
			</view>
		</view>

		<view class="body">
			<u-cell-group class="group_warp">
				<u-cell title="课程介绍" class="group_title"></u-cell>
				<u-cell :title="course.intro"></u-cell>
				<u-cell title="开始时间:" :value="course.begin"></u-cell>
				<u-cell title="结束时间:" :value="course.end"></u-cell>
			</u-cell-group>
		</view>
		<view class="dibu">
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="12">
					<view class="goumai" @click="getsc(3)">立即购买</view>
					<view class="goumai2" v-if="datalist.pay==0" @click="getsc(1)">立即加入</view>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	import {
		getLdata
	} from "@/service/getLdata.js";
	import {
		onLoad
	} from "../../uni_modules/uview-ui/libs/mixin/mixin";
	export default {
		data() {
			return {
				course: [],
				lx: 0,
				id: 0,
				uid: 0,
				//用于存放是否购买了该课程
				gm: 0,
				sc: 0,
				datalist: {},
				list4: [{
					name: '介绍',
				}],
			}
		},
		onLoad(e) {
			this.id = e.courseId;
			// let time  = new Date().getTime() + '';
			// console.log(time);
			let uid = uni.getStorageSync('user').uId;
			if (uid) {
				this.uid = uid;
			}
			this.getlist()
		},
		methods: {
			getlist() {
				// getLdata('/static/data/course.json').then(res => {
				// 	console.log(res)
				// 	this.datalist = res.data;
				// }).catch(err => {
				// 	console.log(err)
				// })
				const courses = require('@/static/data/course.json');

				courses.forEach((item) => {
					if (item.courseId == this.id) {
						this.course = item;
						return false;
					}
				})
			},
			kecheng(item) {
				// console.log(item)
				if (this.datalist.pay == 0) {
					if (this.uid == 0) {
						uni.showToast({
							title: "您还未登录！",
							icon: "none"
						})
					} else {
						this.video = item.video
						this.lx = 1
						this.addsc();
					}
				} else {
					if (this.gm == 0) {
						uni.showToast({
							title: "您还未购买此课程！",
							icon: "none"
						})
					} else {
						this.video = item.video
						this.lx = 1
						this.addsc();
					}
				}

			},
			jom(v) {
				uni.navigateTo({
					url: v
				});
			},
			addsc() {
				if (this.uid == 0) {
					uni.showToast({
						title: "您还未登录！",
						icon: "none"
					})
				} else {
					uni.$u.http.post('/courseUser/add', {
						id: this.id,
						uid: this.uid,
						lx: 2
					}).then(res => {
						this.sc = 1
					}).catch(err => {})
				}
			},
			getsc(e) {
				if (this.uid == 0) {
					uni.showToast({
						title: "您还未登录！",
						icon: "none"
					})
				} else {
					if (e == 0) {
						uni.$u.http.post('/courseUser/add', {
							id: this.id,
							uid: this.uid,
							lx: 0
						}).then(res => {
							this.sc = 1
						}).catch(err => {})
					} else if (e == 1) {
						uni.$u.http.post('/courseUser/add', {
							id: this.id,
							uid: this.uid,
							lx: 1
						}).then(res => {
							this.gm = 1
						}).catch(err => {})
					} else if (e == 2) {
						uni.$u.http.post('/courseUser/del', {
							id: this.id
						}).then(res => {
							this.sc = 0
						}).catch(err => {})
					} else if (e == 3) {

						uni.$u.http.post('/Pay/getSign', {
							id: this.id,
							uid: this.uid,
							lx: 0
						}).then(res => {
							console.log(res)
							uni.requestPayment({
								timeStamp: res.timeStamp,
								nonceStr: res.nonceStr,
								package: res.package,
								signType: res.signType,
								paySign: res.paySign,
								success: (res) => {
									uni.showToast({
										title: "支付成功!"
									})
									this.gm = 1
								},

								fail: (res) => {
									uni.showModal({
										content: "支付失败,原因为: " + res.errMsg,
										showCancel: false
									})

								}
							})

						}).catch(err => {})

					}
				}

			},

		}
	}
</script>

<style>
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
		bottom: 30rpx;
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
<template>
	<view class="pd16_15">
		<unicloud-db ref="udb" collection="member_package" orderby="month"
			v-slot:default="{data,loading,error,options}">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">套餐正在加载...</view>
			<u-radio-group v-else active-color="#19BE6B" :size="28">
				<view class="flex wrap space mt16">
					<view v-for="(item,index) in data" :key="index"
						class="mt16 box pd20_15 flex alcenter space" style="width: 330rpx;">
						<!-- <text class="ft14 cl-main ftw600"> 套餐{{item.package_type}} </text> -->
						<text
							class="ft14 cl-main ftw600">{{ item.month + '个月  (￥' + (item.price/100).toFixed(2) + ')'}}</text>
						<u-radio :icon-size="25" @change="changeNum(item,index)" :name="index" color="#00C657" />
					</view>
				</view>
			</u-radio-group>
<!-- 			<radio-group v-else @change="changeNum">
	
			</radio-group> -->
		</unicloud-db>

		<view class="form-footer-h">
			<view class="form-footer form-footer-h">
				<view v-if="user.role_id==1" class="form-footer-main pd10_15">
					<u-button @click="beMember" type="success" shape="circle" :ripple="true"
						style="height: 90%;">确定</u-button>
				</view>
				<view v-else class="form-footer-main pd10_15">
					<u-button @click="reMember" type="success" shape="circle" :ripple="true"
						style="height: 90%;">确定</u-button>
				</view>
			</view>
		</view>
		<orderGet :key="orderGetKey" :params="params" :otherInfo="otherInfo" :order_type="2" @close="modal_show = false"
			:modal_show="modal_show"></orderGet>
	</view>
</template>

<script>
	import {
		oderGet
	} from "@/components/orderGet/orderGet.vue"
	export default {
		components: {
			oderGet
		},
		data() {
			return {
				user: null,
				course: [],
				modal_show: false,
				// course_id: 0,
				//用于存放是否购买了该课程
				to_ids: [],
				params: {}, //用于传递给订单生成组件的订单参数
				otherInfo: {
					index : null,
				}, //用于传递给订单生成组件的显示参数
				orderGetKey: 0,
				radio_selected: 0,
				package: {
					price: 0,
					id : ''
				}
			}
		},
		computed: {},
		onLoad() {
			this.user = uni.getStorageSync('user');
			//会员只能给自己充值，开始时直接放进id中
			this.to_ids.push(this.user.user_id);
		},
		methods: {

			changeNum(e, index) {
				console.log(e, index);
				this.package.price = Number(e.price);
				this.package.id = e._id;
				
				this.otherInfo.index = index;

			},

			beMember() {
				if (this.package.price == 0) {
					uni.showToast({
						title: "请先选择套餐",
						icon: "error"
					})
				} else {
					
					this.params = {
						user_id: this.user.user_id,
						price: this.package.price,
						goods_type: 2,
						goods_id: this.package.id,
						to_ids: this.to_ids
					}
					
					this.orderGetKey++;
					// console.log(this.orderGetKey);
					
					this.modal_show = true;
				}

			},
			
			reMember() {
				if (this.package.price == 0) {
					uni.showToast({
						title: "请先选择套餐",
						icon: "error"
					})
				} else {
					
					this.params = {
						user_id: this.user.user_id,
						price: this.package.price,
						goods_type: 3,
						goods_id: this.package.id,
						to_ids: this.to_ids
					}
					
					this.orderGetKey++;
					// console.log(this.orderGetKey);
					
					this.modal_show = true;
				}
			
			}
		}
	}
</script>

<style>
	.tag-coupon {
		width: 100%;
		height: 80rpx;
		border-radius: 16rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
	}

	.recharge-header {
		height: 240rpx;
		width: 100%;
		position: relative;
	}

	.recharge-header image {
		width: 100%;
		height: 240rpx;
	}

	.recharge-header .main {
		position: absolute;
		width: 100%;
		height: 240rpx;
		left: 0;
		top: 0;
	}

	.tdadf {
		border: 1px solid #f8f8f8;
		padding: 10px 5px;
		background: #ffffff;
		border-radius: 8px;
		box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.04);
	}
</style>
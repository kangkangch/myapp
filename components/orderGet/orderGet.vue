<template>
	<view>
		<template v-if="order_type == 1">
			<u-modal :content="params.goods_tpye" title="课程购买" closeOnClickOverlay :show="modal_show" :zoom="false"
				:z-index="500" @confirm="buyCourse" @close="modalClose" @cancel="modalClose" :show-cancel-button="true"
				confirm-text="购买" buttonReverse>
				<uni-section title="课程名称" type="square" style="width: 100%;">
					<uni-list>
						<uni-list-item :title="otherInfo.params_name" />
					</uni-list>
				</uni-section>
				<uni-section v-if="otherInfo.role_id == 1" title="订单价格" type="line" style="width: 100%;">
					<uni-list>
						<uni-list-item :title="'￥' + (params.price/100).toFixed(2)" />
					</uni-list>
				</uni-section>
				<uni-section v-if="otherInfo.role_id == 2" title="订单价格" type="line" style="width: 100%;">
					<uni-list-item :title="'￥' + (params.price/100).toFixed(2)" />
					<uni-table v-if="otherInfo.myStudentsId.length || !otherInfo.isBuy" ref="table" border stripe type="selection"
						@selection-change="studentSelectionChange" style="min-height: 0">
						<uni-tr>
							<uni-th align="center">学员id</uni-th>
						</uni-tr>
						<uni-tr v-if="!otherInfo.isBuy">
							<uni-td align="center">为自己购买</uni-td>
						</uni-tr>
						<uni-tr v-for="(id,index) in otherInfo.myStudentsId" :key="index">
							<uni-td align="center">{{id}}</uni-td>
						</uni-tr>
					</uni-table>
					<uni-table v-if="otherInfo.myCoupons" ref="table" border stripe type="selection"
						@selection-change="couponSelectionChange" style="min-height: 0">
						<uni-tr>
							<uni-th align="center">优惠券价格</uni-th>
						</uni-tr>
						<uni-tr v-for="(coupon,index) in otherInfo.myCoupons" :key="index">
							<uni-td align="center">{{(coupon.reduce/100).toFixed(2)}}元</uni-td>
						</uni-tr>
					</uni-table>
				</uni-section>
			</u-modal>
		</template>

		<template v-if="order_type == 2">
			<u-modal :content="params.goods_tpye" title="会员购买" closeOnClickOverlay :show="modal_show" :zoom="false"
				:z-index="500" @confirm="buyMember" @close="modalClose" @cancel="modalClose" :show-cancel-button="true"
				confirm-text="购买" buttonReverse>
				<uni-section title="会员包序号" type="square" style="width: 100%;">
					<uni-list>
						<uni-list-item :title="otherInfo.index +''" />
					</uni-list>
				</uni-section>
				<uni-section title="订单价格" type="line" style="width: 100%;">
					<uni-list>
						<uni-list-item :title="'$' + (params.price/100).toFixed(2)" />
					</uni-list>
				</uni-section>
			</u-modal>
		</template>
	</view>
</template>

<template v-if="order_type == 3 ">
	<u-modal :content="params.order_type" title="续费会员" closeOnClickOverlay :show="modal_show" :zoom="false" :z-index="500"
		@confirm="reMember" @close="modalClose" @cancel="modalClose" :show-cancel-button="true"
		confirm-text="购买" buttonReverse>
		<uni-section title="会员包序号" type="square" style="width: 100%;">
			<uni-list>
				<uni-list-item :title="otherInfo.index +''" />
			</uni-list>
		</uni-section>
		<uni-section title="订单价格" type="line" style="width: 100%;">
			<uni-list>
				<uni-list-item :title="'$' + (params.price/100).toFixed(2)" />
			</uni-list>
		</uni-section>
	</u-modal>
</template>

<!-- <template v-if="order_type == 4 ">
	<u-modal :content="course.name" title="课程购买" closeOnClickOverlay :show="modal_show" :zoom="false" :z-index="500"
		@confirm="buyCourse" @close="modalClose" @cancel="modalClose" :show-cancel-button="true"
		confirm-text="购买" buttonReverse>
		<uni-section title="课程名称" type="square" style="width: 100%;">
			<uni-list>
				<uni-list-item :title="course.name" />
			</uni-list>
		</uni-section>
		<uni-section title="订单价格" type="line" style="width: 100%;">
			<uni-list>
				<uni-list-item :title="'$' + (nowPrice/100).toFixed(2)" />
			</uni-list>
		</uni-section>
		<uni-section v-if="otherInfo.role_id == 2" title="订单价格" type="line" style="width: 100%;">
			<uni-list-item :title="'$' + (nowPrice/100).toFixed(2)" />
		</uni-section>
	</u-modal>
</template> -->

<script>
	const db = uniCloud.databaseForJQL();

	export default {
		name: "orderGet",
		//props接收父组件传递得数据
		props: {
			order_type: Number,
			params: Object,
			modal_show: Boolean,
			otherInfo: Object,
		},
		data() {
			return {
				loading_show: true,
				studentSelectedIndexs: [],
				couponSelectedIndexs: [],
				user: {},
				nowReduce: 0,
				nowGoodsPrice: 0
				// order_id: ""
			};
		},

		mounted() {
			if(!this.order_type in [1,2,3,4,5])
			throw {
				errMessage: "订单类型错误"
			}
			// console.log("重新进行渲染", this.params);
			
			var user = uni.getStorageSync('user')
			if(user) this.user = user
			// console.log(this.user)
			this.nowGoodsPrice = this.params.price
			this.nowReduce = 0
			
		},
		created() {},
		onLoad() {
		},

		watch: {},

		methods: {
			modalClose() {
				this.$emit('close') //向父页面发送关闭请求
			},
			
			junglePrice(){
				if(this.params.price <= 0){
					uni.showToast({
						title:"订单价格错误",
						icon:"error"
					})
					return false
				}
				return true
			},

			//购买课程
			async buyCourse() {
				
				if(!this.junglePrice()){
					return
				}

				if (this.user.role_id == 2) {
					this.params.to_ids = []
					//如果买了，index正常计算，不然index就是myStudentsId[index-1]
					if (this.otherInfo.isBuy) {
						for (let index of this.studentSelectedIndexs) {
							this.params.to_ids.push(this.otherInfo.myStudentsId[index])
						}
					} else {
						for (let index of this.studentSelectedIndexs) {
							if(index == 0) {
								this.params.to_ids.push(this.user.user_id)
							} 
							else this.params.to_ids.push(this.otherInfo.myStudentsId[index-1])
						}
					}
				}

				let order_params = this.params;
				
				// console.log("this.params", this.params)

				uni.showLoading({
					title: '订单生成中'
				});

				await uniCloud.callFunction({
						name: 'generateOrder',
						data: order_params
					})
					.then(res => {
						console.log('已经生成订单', res);

						let order_id = res.result.order_id

						uni.hideLoading();
						this.modalClose();

						uni.showModal({
							title: '是否支付该订单',
							content: '订单金额为:   $' + (order_params.price / 100).toFixed(2),
							success: async function(res) {
								if (res.confirm) {
									var that = this;

									console.log('用户已经支付');
									//修改订单状态，添加参加课程表
									uni.showLoading({
										title: '订单支付中'
									});

									var that = this;

									// console.log(order_id);

									console.log('用户开始支付');
									await uniCloud.callFunction({
										name: 'payOrder',
										data: {
											order_id: order_id
										}
									}).then(res => {
										uni.hideLoading();
										uni.showToast({
											title: '订单支付成功',
											icon: 'success'
										})
										uni.switchTab({
											url: '/pages/public/home/home',
											success: function(e) {
												window.location.reload();
											}
										})
									}).catch(e => {
										console.log("e", e);
										uni.hideLoading();
										uni.showToast({
											title: '订单支付失败',
											icon: 'error'
										})
									})

								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}.bind(this)
						})

					}).catch(e => {
						uni.hideLoading();
						console.log("e:", e);
					});
			},

			//购买会员
			async buyMember() {
				
				if(!this.junglePrice()){
					return
				}

				let order_params = this.params;

				uni.showLoading({
					title: '订单生成中'
				});


				await uniCloud.callFunction({
						name: 'generateOrder',
						data: order_params
					})
					.then(res => {

						let order_id = res.result.order_id

						console.log('已经生成订单', res);

						this.modalClose();
						uni.hideLoading();

						uni.showModal({
							title: '是否支付该订单',
							content: '订单金额为:   $' + (order_params.price / 100).toFixed(2),
							success: async function(res) {
								if (res.confirm) {

									uni.showLoading({
										title: '订单支付中'
									});

									var that = this;

									console.log('用户开始支付');
									await uniCloud.callFunction({
										name: 'payOrder',
										data: {
											order_id: order_id
										}
									}).then(res => {

										var user = uni.getStorageSync('user');
										user.role_id = 2;
										uni.setStorageSync('user', user);

										uni.showToast({
											title: '订单支付成功',
											icon: 'success'
										})
										uni.switchTab({
											url: '/pages/public/home/home',
											success: function(e) {
												window.location.reload();
											}
										})
									}).catch(e => {
										uni.showToast({
											title: '订单支付失败',
											icon: 'error'
										})
									})

								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}.bind(this)
						})

					}).catch(e => {
						uni.hideLoading();
						console.log(e);
					});
			},
			
			async reMember() {
				
				if(!this.junglePrice()){
					return
				}
			
				let order_params = this.params;
			
				uni.showLoading({
					title: '订单生成中'
				});
			
			
				await uniCloud.callFunction({
						name: 'generateOrder',
						data: order_params
					})
					.then(res => {
			
						let order_id = res.result.order_id
			
						console.log('已经生成订单', res);
			
						this.modalClose();
						uni.hideLoading();
			
						uni.showModal({
							title: '是否支付该订单',
							content: '订单金额为:   $' + (order_params.price / 100).toFixed(2),
							success: async function(res) {
								if (res.confirm) {
			
									uni.showLoading({
										title: '订单支付中'
									});
			
									var that = this;
			
									console.log('用户开始支付');
									await uniCloud.callFunction({
										name: 'payOrder',
										data: {
											order_id: order_id
										}
									}).then(res => {
			
										var user = uni.getStorageSync('user');
										user.role_id = 2;
										uni.setStorageSync('user', user);
			
										uni.showToast({
											title: '订单支付成功',
											icon: 'success'
										})
										uni.navigateTo({
											url: '/pages/student/my/myMember',
											success: function(e) {
												window.location.reload();
											}
										})
									}).catch(e => {
										uni.showToast({
											title: '订单支付失败',
											icon: 'error'
										})
									})
			
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}.bind(this)
						})
			
					}).catch(e => {
						uni.hideLoading();
						console.log(e);
					});
			},

			studentSelectionChange(e) {
				// console.log(this.otherInfo)
				this.studentSelectedIndexs = e.detail.index
				this.nowGoodsPrice = e.detail.index.length * this.otherInfo.vip_price
				this.params.price = this.nowGoodsPrice - this.nowReduce
				console.log(e)
			},
			
			couponSelectionChange(e) {
				// console.log(this.otherInfo)
				this.couponSelectedIndexs = e.detail.index
				this.nowReduce = 0
				for(let index of e.detail.index){
					this.nowReduce += this.otherInfo.myCoupons[index].reduce
				}
				this.params.price = this.nowGoodsPrice - this.nowReduce
				console.log(e)
			},
		}
	}
</script>

<style>

</style>
<!-- ?actId=1 -->
<template>
	<view class="page-my">
		<view class="header_warp">
			<u-button class="button" type="primary" text="修改活动" shape="circle" @click="changeAct"></u-button>
			<u-button class="button" type="success" text="排位管理" shape="circle"></u-button>
		</view>
		
		<u-modal
			:content="act.name"
			title="活动内容修改"
			closeOnClickOverlay
			:show="modal_show"
			:zoom="false"
			:z-index = "500"
			@confirm="changeConfirm"
			@close = "modal_show = false"
		>
		<u--form
			labelPosition="left"
			:model="form"
			ref="form1"
		>
		<view class="u-page__upload-item">
		<u-upload
		    :fileList="cover_pic"
		    @afterRead="afterRead"
		    @delete="deletePic"
		    name="3"
			width="150"
			height="150"
		    :multiple = "false"
			max-count="1"
		    :previewFullImage="true"
		></u-upload>
		</view>
			<u-form-item
				label="活动名称"
				prop="name"
				borderBottom
				ref="item1"
			>
				<u--input
					v-model="form.name"
					border="none"
					placeholder="活动名称"
				></u--input>
			</u-form-item>
			<u-form-item
				label="活动内容"
				prop="content"
				borderBottom
				ref="item3"
			>
				<u--textarea
					placeholder="活动内容"
					v-model="form.content"
					count
				></u--textarea>
			</u-form-item>
			<u-form-item
				label="报名开始时间"
				prop="start_time"
				labelWidth="110"
				borderBottom
				@click="showbeginCalendar = true; hideKeyboard()"
			>
				<u--input
					v-model="form.start_time"
					disabled
					disabledColor="#ffffff"
					placeholder="报名开始时间"
					border="none"
				></u--input>
				<u-icon
					slot="right"
					name="arrow-right"
				></u-icon>
			</u-form-item>
			<u-form-item
				label="报名结束时间"
				prop="end_time"
				labelWidth="110"
				borderBottom
				@click="showendCalendar = true; hideKeyboard()"
			>
				<u--input
					v-model="form.end_time"
					disabled
					disabledColor="#ffffff"
					placeholder="报名结束时间"
					border="none"
				></u--input>
				<u-icon
					slot="right"
					name="arrow-right"
				></u-icon>
			</u-form-item>
			<u-form-item
				label="活动最大人数"
				prop="max_people"
				borderBottom
				ref="item1"
				labelWidth="110"
			>
				<u--input
					v-model="form.max_people"
					border="none"
					placeholder="活动最大人数"
				></u--input>
			</u-form-item>
			<u-form-item
				label="活动现有人数"
				prop="now_people"
				borderBottom
				labelWidth="110"
				ref="item1"
			>	
				<u--input
					v-model="form.now_people"
					border="none"
					disabled
				></u--input>
			</u-form-item>
			</u--form>
			<u-datetime-picker
				:show="showbeginCalendar"
				:value="form.start_time"
				mode="date"
				closeOnClickOverlay
				@confirm="beginCalendarConfirm"
				@cancel="beginCalendarClose"
				@close="beginCalendarClose"
			></u-datetime-picker>
			<u-datetime-picker
				:show="showendCalendar"
				:value="form.end_time"
				mode="date"
				closeOnClickOverlay
				@confirm="endCalendarConfirm"
				@cancel="endCalendarClose"
				@close="endCalendarClose"
			></u-datetime-picker>
		</u-modal>
		
		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="课程封面" class="title"></u-cell>
					<view class="main-wrap">
					    <view class="img-wrap">
			<image :src="act.cover_path" @click="TanPreviewImage(act.cover_path)" mode=""></image>
					    </view>
					</view>  
				</u-cell-group>
				<u-cell-group>
					<u-cell title="基本信息" class="title"></u-cell>
					<u-cell title="活动id" :value="act.id"></u-cell>
					<u-cell title="活动名称" :value="act.name"></u-cell>
					<u-cell title="报名开始时间" :value="act.start_time"></u-cell>
					<u-cell title="报名结束时间" :value="act.end_time"></u-cell>
					<u-cell title="活动最大人数" :value="act.max_people"></u-cell>
					<u-cell title="已报名人数" :value="act.now_people"></u-cell>
				</u-cell-group>
			</view>
		</view>
		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="活动内容" class="title"></u-cell>
				</u-cell-group>
				<text class="item_text">{{ act.content }}</text>
			</view>
			
		</view>
<!-- 		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="培训历史" class="title"></u-cell>
					<u-cell title="暂未参加培训" style="text-align: center;"></u-cell>
				</u-cell-group>
			</view>
		</view>
		<view class="group_warp">
			<view class="u-page__item" style="margin: 0 10%">
				<u-cell-group>
					<u-cell title="已获得证件" class="title"></u-cell>
					<u-cell title="暂未获得证件" style="text-align: center;"></u-cell>
				</u-cell-group>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				otherList: [{
						title: "培训历史",
						url: "/pages/public/my/certificate"
					},
					{
						title: "已报名课程",
						url: "/pages/public/my/myInfo"
					},
					{
						title: "查看证件",
						url: "/pages/public/my/act"
					},
				],
				modal_show: false,
				act: null,
				form: null, 
				//用于选择活动开始和结束时间的时间选择器显示
				showbeginCalendar: false,
				showendCalendar: false,
				cover_pic : [], 
			};
		},
		created() {

		},
		onLoad(e) {
			let act = require('@/static/data/act.json');
			// console.log(act);
			for (let item of act) {
				if (item.id == Number(e.actId)) {
					this.act = JSON.parse(JSON.stringify(item));
					this.form = JSON.parse(JSON.stringify(item));
					break;
				}
			}
			// console.log(this.act)
		},
		methods: {
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
			},
			changeAct(){
				this.form = JSON.parse(JSON.stringify(this.act));
				this.modal_show = true;
			},
			TanPreviewImage(imageUrl){ 
			        var images = [];
			        images.push(imageUrl);
			        uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://192.168.100.251:8970/6_1597822634094.png"]
			            current:0,
			            urls:images,
			        });
			    },
			setBeginTime(e) {
				this.form.start_time = e.result;
			},
			setEndTime(e) {
				this.form.end_time = e.result;
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			beginCalendarClose() {
				this.showbeginCalendar = false
				this.showendCalendar = false
				// this.$refs.form.validateField('start_time')
			},
			endCalendarClose() {
				this.showbeginCalendar = false
				this.showendCalendar = false
				// this.$refs.form.validateField('end_time')
			},
			beginCalendarConfirm(e) {
				this.showbeginCalendar = false
				this.form.start_time = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
				// this.$refs.form.validateField('start_time')
			},
			endCalendarConfirm(e) {
				this.showendCalendar = false
				this.form.end_time = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
				// this.$refs.form.validateField('end_time')
			},
			formValid() {
				if(Number(this.form.max_people) < Number(this.form.now_people)){
					uni.showToast({
						title:"活动最大人数低于已报名人数",
						icon: "none"
					})
					return false;
				}
				return true;
			},
			// 删除图片
			deletePic(event) {
				this.cover_pic.splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				console.log(lists);
				let fileListLen = this.cover_pic.length
				lists.map((item) => {
					this.cover_pic.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this.cover_pic[fileListLen]
					this.cover_pic.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://www.example.com/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			changeConfirm() {
				if(this.formValid()){
				this.modal_show = false;
				this.act = JSON.parse(JSON.stringify(this.form));
				}
			},
		},
	};
</script>

<style scoped lang="scss">
	/deep/ .uni-system-preview-image {
		z-index: 10086 !important;
	}
	
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
		.item_text {
			padding-top: 15rpx;
			font-size: 1.1rem;
			word-wrap: break-word;
			word-break: break-all;
		}
	}
	
	.header_warp {
		display: flex;
		.button {
			width: 20%;
			margin-top: 20rpx;
			margin-left: 25%;
			
			// float: right;
		}
	}
	
	
</style>
<template>
	<view class="content">

		<!-- <view class="login_img"><image mode="aspectFill" src="/static/image/iamhe.png"></image></view> -->

		<view class="login_from">


			<u-form :model="data" ref="uForm" label-position="left">

				<u-form-item label="手机号码" prop="codeLoginPhone" borderBottom label-width="150rpx">
					<u-input v-model="data.codeLoginPhone" placeholder="请输入手机号" border="none" />
				</u-form-item>

				<u-form-item label="验证码" prop="codeLoginCode" labelWidth="80" borderBottom>
					<u--input v-model="data.codeLoginCode" border="none" placeholder="请填写验证码"></u--input>
					<u-button slot="right" @tap="getCode" :text="tips" type="success" size="mini"
						:disabled="disabled1"></u-button>
				</u-form-item>

				<u-code ref="uCode" @change="codeChange" seconds="20" @start="disabled1 = true"
					@end="disabled1 = false"></u-code>
				
			</u-form>
			<u-button  type="primary" text="登录" shape="circle" customStyle="margin-top: 50px" @click="submit"></u-button>
			<u-button  type="error" text="重置" shape="circle" customStyle="margin-top: 10px" @click="reset"></u-button>
<!-- 
			<view class="login_from_dl">
				<button @click="regist">注册</button>
			</view> -->


		</view>

	</view>
</template>
<script>
	export default {

		data() {
			let data = {
				//手机验证码注册
				codeLoginPhone: "",
				codeLoginCode: "",
			}
			return {
				data,
				rules: {
					codeLoginPhone: [{
							required: true,
							message: '请输入手机号码',
							len: 11,
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						{
							pattern: /^[0-9]*$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '请输入正确格式'
						}
					],
					codeLoginCode: [{
						type: 'string',
						required: true,
						len: 4,
						message: '请填写4位验证码',
						trigger: ['blur']
					}, ]
				},
				tips: '',
				disabled1: false,
				// showArea: false,
		}
	},
	onLoad() {},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {

			login() {
				uni.showToast({
					"title": "账号不存在",
					"icon": 'none'
				})
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')
					this.login();
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			reset() {
				this.$refs.uForm.resetFields()
				this.$refs.uForm.clearValidate()
				setTimeout(()=>{
					this.$refs.uForm.clearValidate()
					// 或者使用 this.$refs.uForm.clearValidate()
				},10)
			},


			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			codeChange(text) {
				this.tips = text;
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			
			// 所属地区选择 start
			handleTap(picker) {
				this.$refs[picker].show()
			},
			handleChange(e) {
				console.log('change::', e)
			},
			handleConfirm(e) {
				console.log('confirm::', e)
				if (e) {
					const name = e.dataset.name
					const label = e.item.map(m => m.label).join('-')
					if (name && label) {
						this[name] = label
					}
				}
			},
			handleCancel(e) {
				console.log('cancel::', e)
			}
			// 所属地区选择 end
		},

	}
</script>
<style>
	page {
		background: #fff;
	}

	.login_img {
		width: 100%;
		height: auto;
		margin-top: 90upx;
	}

	.login_img image {
		width: 170upx;
		height: 170upx;
		display: block;
		margin: 0px auto;
		border-radius: 50%;
	}

	.login_from {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 20upx 8%;
	}

	.login_from_input {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px #eee solid;
		padding: 40upx 0px;
		margin: 0px auto;
	}

	.login_from_name {
		width: 20%;
	}

	.login_from_fun {
		width: 80%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.login_from_fun input {
		width: 100%;
		text-align: left;
		font-size: 14px;
	}


	.login_from_dl {
		width: 100%;
		height: 50px;
		line-height: 50px;
		margin-top: 150upx;
	}

	.login_from_dl button {
		width: 100%;
		height: 50px;
		line-height: 50px;
		background: #FF3B00;
		color: #fff;
		border-radius: 50px;
	}

	.cuIcon-squarecheckfill {
		color: #FF3B00;
	}

	.logo_text text {
		color: #FF3B00;
	}

	.getyzm {
		width: 60%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		color: #FF3B00;
	}

	.cuicon {
		font-size: 18px;
	}

	.regFrom_tom_yzlabel {
		width: 60%;
		text-align: right;
	}

	.cuIcon-squarecheckfill {
		background: #FF3B00;
		position: relative;
		border: 2px #ccc solid;
		box-sizing: border-box;
		border-radius: 3px;
	}

	.cuIcon-square {
		background: #fff;
		border: 2px #ccc solid;
		box-sizing: border-box;
		border-radius: 3px;
	}
</style>
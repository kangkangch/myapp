<template>
	<view class="content">
		<!-- <view class="login_img"><image mode="aspectFill" src="/static/image/iamhe.png"></image></view> -->
		<view class="login_from">

			<u-form :model="data" ref="uForm" label-position="left">
				<u-form-item label="手机号码" prop="passwordPhone" borderBottom label-width="150rpx">
					<u-input v-model="data.passwordPhone" placeholder="请输入手机号" border="none" maxlength="11" />
				</u-form-item>
				<u-form-item label="密码" prop="passwordPassword" borderBottom>
					<u-input v-model="data.passwordPassword" placeholder="请输入密码" border="none" maxlength="14" />
				</u-form-item>
			</u-form>
			<!-- 			<view class="login_from_dl">
				<button @click="login">登录</button>
			</view> -->
			<u-button type="primary" text="登录" customStyle="margin-top: 50px" @click="login"></u-button>
			<u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button>
			<u-button type="success" shape="circle" text="还没有账号？点击注册" customStyle="margin-top: 40px"
				@click="$goBack(2,'/pages/public/regist')"></u-button>
			<u-button type="warning" shape="circle" text="用手机验证码方式登录" customStyle="margin-top: 10px"
				@click="$goBack(2,'/pages/public/loginwithC')"></u-button>
		</view>
	</view>
</template>
<script>
	export default {

		data() {
			let data = {
				//手机密码登录
				passwordPhone: "",
				passwordPassword: "",
			}
			return {
				data,
				rules: {
					passwordPhone: [{
							required: true,
							message: '请输入手机号码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						{
							len: 11,
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: 'blur',
						}
					],
					passwordPassword: [{
							min: 8,
							max: 14,
							message: '密码长度错误',
							trigger: 'change',
						},
						// 正则判断为字母或数字
						{
							pattern: /^[0-9a-zA-Z]*$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '只能包含字母或数字'
						},
					]
				},
			}
		},
		onLoad() {},
		methods: {

			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},

			login() {
				//登录逻辑判断
				const user = uni.getStorageSync(this.data.passwordPhone);
				if (user != '') {
					// console.log(typeof(user.codeRegisterPassword),typeof(this.data.passwordPassword));
					if (user.codeRegisterPassword == this.data.passwordPassword) {
						let data = this.data;
						data['role_id'] = user.role_id;
						data['uId'] = user.uId;
						uni.setStorageSync('user', data);
						uni.showToast({
							"title": "登录成功",
							"icon": 'none'
						})
						if (user.role_id == 1) {
							uni.reLaunch({
								url: '/pages/admin//student/student'
							})

							// uni.switchTab({
							// 	url:'/pages/admin/my/my'
							// })
						} else {
							// uni.switchTab({
							// 	url:'/pages/public/home/home'
							// })
							uni.reLaunch({
								url: '/pages/public/home/home'
							})
						}
						setTimeout(() => {
							this.$router.go(0)
						}, 0)
					} else {
						uni.showToast({
							"title": "密码错误",
							"icon": 'none'
						})
					}
				} else {
					if (this.data.passwordPhone == '') {
						uni.showToast({
							"title": "请输入手机号",
							"icon": 'none'
						})
					} else {
						uni.showToast({
							"title": "账号不存在",
							"icon": 'none'
						})
					}
				}
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
				setTimeout(() => {
					this.$refs.uForm.clearValidate()
					// 或者使用 this.$refs.uForm.clearValidate()
				}, 10)
			},

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
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

	.login_from_dl uni-button {
		width: 100%;
		height: 50px;
		line-height: 50px;
		/* background: #FF3B00; */
		/* color: #fff; */
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
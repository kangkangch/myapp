<template>
	<view class="uni-content">
		<!-- 顶部文字 -->
		<text class="title title-box">用户名密码注册</text>
		<uni-forms :value="formData" ref="uForm" :rules="rules" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="phone" required>
				<uni-easyinput :inputBorder="false" class="input-box" placeholder="请输入手机号" v-model="formData.phone"
					maxlength="11" trim="both" />
			</uni-forms-item>

			<uni-forms-item name="password" v-model="formData.password" required>
				<uni-easyinput :inputBorder="false" class="input-box" maxlength="16" :placeholder="'请输入8-16位密码'"
					type="password" v-model="formData.password" trim="both" />
			</uni-forms-item>

			<button class="uni-btn" type="primary" @click="submit">登录</button>
			<button @click="$goBack(1, 1)" class="register-back">返回</button>
			<view class="link-box">
				<!-- 			<view v-if="!config.isAdmin">
								<text class="forget">忘记了？</text>
								<text class="link" @click="toRetrievePwd">找回密码</text>
							</view> -->
				<text class="link" @click="$goBack(2, '/pages/public/loginwithC')">短信验证码登录</text>
				<text class="link" @click="$goBack(2, '/pages/public/regist')">注册账号</text>

			</view>
		</uni-forms>
	</view>
</template>
<script>
	const userIo = uniCloud.importObject("user-io");
	export default {

		data() {
			let formData = {
				//手机密码登录
				phone: "",
				password: ""
			}
			return {
				data: "",
				formData,
				rules: {
					"phone": {
						"rules": [{
								required: true,
								errorMessage: '请输入手机号',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									// console.log(value);
									if (!/^1\d{10}$/.test(value)) {
										callback('请输入正确手机号')
									};
									return true
								}
							}
						],
						"label": "手机号"
					},
					"password": {
						"rules": [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								minLength: 8,
								maxLength: 16,
								errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符'
							}, {
								validateFunction: function(rule, value, data, callback) {
									// console.log(value);
									if (/^[^\u4e00-\u9fa5 ]$/.test(value)) {
										callback('密码不能包含中文和空格');
									}
									return true;
								}
							}
						],
						"label": "密码"
					},
				},
			}
		},
		onLoad() {},
		methods: {

			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},

			async login() {
				try {
					this.data = this.formData;
					const user = await userIo.loginwithpwd(this.data);
					// console.log(11111111,user);
					uni.setStorageSync('user', user);
					uni.showToast({
						title: "登录成功",
						icon: "none"
					})
					uni.switchTab({
						url: '/pages/public/home/home',
						success() {
							window.location.reload();
						}
					})
				} catch (e) {
					console.log("登录失败",e.message);
				}

			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					console.log('校验通过：', res);
					this.login();
				}).catch(errors => {
					uni.showToast({
						title: errors[0].errorMessage,
						icon: "none"
					})
					console.log(errors)
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
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";

	@media screen and (max-width: 300px) {
		.uni-content {
			margin-top: 15px;
			height: 100%;
			background-color: #fff;
		}
	}

	@media screen and (min-width: 300px) {
		.uni-content {
			padding: 30px 40px 60px;
			max-height: 530px;
		}

		.link-box {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			justify-content: space-between;
			margin-top: 10px;
		}

		.link {
			font-size: 12px;
		}
	}

	.uni-content ::v-deep .uni-forms-item__label {
		position: absolute;
		left: -15px;
	}

	button {
		margin-top: 15px;
	}

	page {
		background: #fff;
	}
</style>
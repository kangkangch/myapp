<template>
	<view class="content">

		<!-- <view class="login_img"><image mode="aspectFill" src="/static/image/iamhe.png"></image></view> -->

		<view class="login_from">


			<u-form :model="data" ref="uForm" label-position="left">

				<u-form-item label="手机号码" prop="codeRegisterPhone" borderBottom label-width="150rpx">
					<u-input v-model="data.codeRegisterPhone" placeholder="请输入手机号" border="none" maxlength="11" />
				</u-form-item>

				<u-form-item label="密码" prop="codeRegisterPassword" borderBottom>
					<u-input v-model="data.codeRegisterPassword" type="password" placeholder="请输入密码" border="none"
						maxlength="14" />
				</u-form-item>

				<u-form-item label="邮箱" prop="codeRegisterEmail" borderBottom>
					<u-input v-model="data.codeRegisterEmail" placeholder="请填写邮箱" border="none" />
				</u-form-item>

				<u-form-item label="验证码" prop="codeRegisterCode" labelWidth="80" borderBottom>
					<u--input v-model="data.codeRegisterCode" border="none" placeholder="请填写验证码"></u--input>
					<u-button slot="right" @tap="getCode" :text="tips" type="success" size="mini"
						:disabled="disabled1"></u-button>
				</u-form-item>

				<view class="login_from_input" @tap="handleTap('picker3')">
					<view class="login_from_name">地区：</view>
					<view class="login_from_fun" style="justify-content: center">
						<picker @change="bindPickerChange" :value="index" :range="areaOptions">
							<view class="uni-input">{{areaOptions[index]}}</view>
						</picker>
					</view>

				</view>

				<u-code ref="uCode" @change="codeChange" seconds="20" @start="disabled1 = true"
					@end="disabled1 = false"></u-code>

			</u-form>
			<u-button type="primary" text="注册" shape="circle" customStyle="margin-top: 50px" @click="regist"></u-button>
			<u-button type="error" text="重置" shape="circle" customStyle="margin-top: 10px" @click="reset"></u-button>
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
				codeRegisterPhone: "",
				codeRegisterPassword: "",
				codeRegisterCode: "",
				codeRegisterArea: "",
				codeRegisterEmail: "",
			}
			return {
				data,
				areaOptions: ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省",
					"福建省",
					"江西省", "山东省 ", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省 ", "重庆市", "四川省", "贵州省", "云南省", "西藏自治区 ",
					"陕西省", "甘肃省 青海省", "宁夏回族自治区", "新疆维吾尔自治区", " 香港特别行政区", "澳门特别行政区", "台湾省",
				],
				rules: {
					codeRegisterPhone: [{
							required: true,
							message: '请输入手机号码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: 'blur',
						},
						{
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
					codeRegisterPassword: [
						{
								required: true,
								message: '请输入密码',
								// 可以单个或者同时写两个触发验证方式 
								trigger: 'blur',
							},
						{
							min: 8,
							max: 14,
							message: '密码长度错误',
							trigger: 'blur',
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
					],
					codeRegisterCode: [{
						type: 'string',
						required: true,
						len: 4,
						message: '请填写4位验证码',
						trigger: ['blur']
					}, ],
					codeRegisterEmail: [{
						type: 'string',
						required: true,
						message: '请填写邮箱',
						trigger: ['blur']
					}, {
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// this.$u.test.mobile()就是返回true或者false的
							return this.$u.test.email(value);
						},
						message: '邮箱不正确',
						// 触发器可以同时用blur和change
						trigger: ['blur'],
					}]
				},
				tips: '',
				selectShow: true,
				disabled1: false,
				// showArea: false,
				index: 0,
			}
		},
		onLoad() {},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {

			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},

			regist() {
				this.data.codeRegisterArea = this.areaOptions[this.index];
				console.log(this.data);
				//模拟注册判断逻辑
				let Phone = uni.getStorageSync(this.data.codeRegisterPhone);
				console.log(Phone);
				//如果用户不存在，可以进行注册
				if (Phone == '') {
					let data = this.data;
					//模拟后端数据
					data['roleId'] = 3;
					data['uId'] = 3;
					uni.setStorageSync(this.data.codeRegisterPhone, this.data);
					uni.navigateTo({
						url: '/pages/public/loginwithP',
					})
				} else {
					uni.showToast({
						"title": "账号存在",
						"icon": 'none'
					})
				}
			},

			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						return true;
					} else {
						console.log('验证失败');
						return false;
					}
				});
			},
			reset() {
				this.index = 0
				this.$refs.uForm.resetFields()
				this.$refs.uForm.clearValidate()
				setTimeout(() => {
					this.$refs.uForm.clearValidate()
					// 或者使用 this.$refs.uForm.clearValidate()
				}, 10)
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
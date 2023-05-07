<template>
	<view class="uni-content">
		<!-- 顶部文字 -->
		<text class="title title-box">用户名密码注册</text>
		<uni-forms :value="formData" ref="uForm" :rules="rules" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="phone" required>
				<uni-easyinput :inputBorder="false" class="input-box" placeholder="请输入手机号" v-model="formData.phone"
					maxlength="11" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="user_name">
				<uni-easyinput :inputBorder="false" class="input-box" placeholder="请输入用户昵称" v-model="formData.user_name"
					trim="both" />
			</uni-forms-item>
			<uni-forms-item name="email">
				<uni-easyinput :inputBorder="false" class="input-box" placeholder="请输入邮箱" v-model="formData.email"
					trim="both" />
			</uni-forms-item>
			<uni-forms-item name="password" v-model="formData.password" required>
				<uni-easyinput :inputBorder="false" class="input-box" maxlength="16" :placeholder="'请输入8-16位密码'"
					type="password" v-model="formData.password" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="password2" v-model="formData.password2" required>
				<uni-easyinput :inputBorder="false" class="input-box" placeholder="再次输入密码" maxlength="16"
					type="password" v-model="formData.password2" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="area" v-model="formData.password2" required>
				<uni-data-select v-model="formData.area" placeholder="请选择注册地区"
					:localdata="areaOptions"></uni-data-select>
			</uni-forms-item>

			<button class="uni-btn" type="primary" @click="submit">注册</button>
			<button @click="$goBack(1, 1)" class="register-back">返回</button>
			<view class="link-box">
				<text class="link" @click="$goBack(2, '/pages/public/loginwithP')">已有账号？点此登录</text>
			</view>
		</uni-forms>
	</view>

</template>
<script>
	const userIo = uniCloud.importObject("user-io");

	export default {
		data() {
			let formData = {
				phone: "",
				user_name: "",
				password: "",
				area: "",
				email: "",
				password2: ""
			}
			return {
				data: null,
				formData,
				areaOptions: [{
						value: "北京",
						text: "北京",
					},
					{
						value: "天津",
						text: "天津",
					},
					{
						value: "上海",
						text: "上海",
					},
					{
						value: "重庆",
						text: "重庆",
					},
					{
						value: "新疆",
						text: "新疆",
					},
					{
						value: "西藏",
						text: "西藏",
					},
					{
						value: "宁夏",
						text: "宁夏",
					},
					{
						value: "内蒙古",
						text: "内蒙古",
					},
					{
						value: "广西",
						text: "广西",
					},
					{
						value: "黑龙江",
						text: "黑龙江",
					},
					{
						value: "吉林",
						text: "吉林",
					},
					{
						value: "辽宁",
						text: "辽宁",
					},
					{
						value: "河北",
						text: "河北",
					},
					{
						value: "山东",
						text: "山东",
					},
					{
						value: "江苏",
						text: "江苏",
					},
					{
						value: "安徽",
						text: "安徽",
					},
					{
						value: "浙江",
						text: "浙江",
					},
					{
						value: "福建",
						text: "福建",
					},
					{
						value: "广东",
						text: "广东",
					},
					{
						value: "海南",
						text: "海南",
					},
					{
						value: "云南",
						text: "云南",
					},
					{
						value: "贵州",
						text: "贵州",
					},
					{
						value: "四川",
						text: "四川",
					},
					{
						value: "湖南",
						text: "湖南",
					},
					{
						value: "湖北",
						text: "湖北",
					},
					{
						value: "河南",
						text: "河南",
					},
					{
						value: "山西",
						text: "山西",
					},
					{
						value: "陕西",
						text: "陕西",
					},
					{
						value: "甘肃",
						text: "甘肃",
					},
					{
						value: "青海",
						text: "青海",
					},
					{
						value: "江西",
						text: "江西",
					},
					{
						value: "台湾",
						text: "台湾",
					},
					{
						value: "香港",
						text: "香港",
					},
					{
						value: "澳门",
						text: "澳门",
					},
				],
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
					"password2": {
						"rules": [{
							required: true,
							errorMessage: '请再次输入密码'
						}]
					},
					"area": {
						"rules": [{
							required: true,
							errorMessage: '请选择地区'
						}]
					},
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

			register() {
				this.data = this.formData;
				if (this.data.password != this.data.password2) {
					uni.showToast({
						title: "两次输入密码不一致",
						icon: "none"
					})
					return;
				}
				// console.log(this.data);

				userIo.registerUser(this.data).then(e => {
						console.log(e);
					})
					.catch(e => {
						console.log(e.message);
						//更好的体验：登录错误，直接刷新验证码
					})


			},

			submit() {
				// uni.showLoading();
				this.$refs.uForm.validate().then(res => {
					// uni.hideLoading();
					// console.log('表单数据信息：', res);
					this.register();
				}).catch(err => {
					// uni.hideLoading();
					uni.showToast({
						title: err,
						icon: "none"
					})
					console.log('表单错误信息：', err);
				})
			},

			hideKeyboard() {
				uni.hideKeyboard()
			},
		},

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
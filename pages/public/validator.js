import passwordMod from '@/uni_modules/uni-id-pages/common/password.js'
export default {
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
				maxLength: 14,
				errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符'
			}, {


				validateFunction: function(rule, value, data, callback) {
					// console.log(value);
					if (/^[^\u4e00-\u9fa5 ]$/.test(value)) {
						return true;
					}
					callback('密码不能包含中文和空格');
				}
			}
		],
		"label": "密码"
	},
	//不需要配置昵称规则
	// "nickname": {
	// 	"rules": [{
	// 			minLength: 3,
	// 			maxLength: 32,
	// 			errorMessage: '昵称长度在 {minLength} 到 {maxLength} 个字符',
	// 		},
	// 		{
	// 			validateFunction: function(rule, value, data, callback) {
	// 				// console.log(value);
	// 				if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
	// 					callback('昵称不能是：手机号或邮箱')
	// 				};
	// 				if (/^\d+$/.test(value)) {
	// 					callback('昵称不能为纯数字')
	// 				};
	// 				if(/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)){
	// 					callback('昵称不能包含中文')
	// 				}
	// 				return true
	// 			}
	// 		}
	// 	],
	// 	"label": "昵称"
	// },
	...passwordMod.getPwdRules()
}
// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

const db = uniCloud.database()
const userCollection = db.collection('user')

module.exports = {

	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
   
   /**
    * 新增用户
    * @param {Object}  params
    * @param {String}  params.user_name       用户名
    * @param {String}  params.password       密码
    * @param {String}  params.nickname       昵称
    * @param {Array}   params.authorizedApp  允许登录的AppID列表
    * @param {Array}   params.role           用户角色列表
    * @param {String}  params.mobile         手机号
    * @param {String}  params.email          邮箱
    * @param {Array}   params.tags           用户标签
    * @param {Number}  params.status         用户状态
    * @returns
    */
	registerUser: fuction(user) {
		if(userCollection.)
		userCollection.add(user, {
			toastTitle: '新增成功', // toast提示语
			success: (res) => { // 新增成功后的回调
				const {
					code,
					message
				} = res
			},
			fail: (err) => { // 新增失败后的回调
				const {
					message
				} = err
			},
			complete: () => { // 完成后的回调
			}
		})
	}
}
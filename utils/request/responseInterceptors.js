/**
 * 响应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
uni.$u.http.interceptors.response.use((response) => {
		let res = response.data
		let message = res.message
		let code = res.code
		if (response.status && response.status === 200) { //成功，那就判读后端自定义响应码
			if (code === 401 || code === 403) { //401表示身份认证失败、403拒绝服务
				uni.showToast({
					title: '后端请求失败',
					icon: 'error',
				});
				return;
			} else if (code === 0) { //0表示不显示
				if (response.config.responseType === 'blob') { // 返回的类型是文件
					return res
				}
				if (typeof res === 'string') { // 返回的是字符串/或者JSON
					res = res ? JSON.parse(res) : res
				}
				return res;
			} else { //如果是其他的，基本上只有200和201
				uni.showToast({
					title: message,
					icon: res.code === 200 ? "success" : "error",
				});
				if (response.config.responseType === 'blob') { // 返回的类型是文件
					return res
				}
				if (typeof res === 'string') {
					res = res ? JSON.parse(res) : res
				}
				return res;
			}
		}
	},
	(error) => {
		if (!error.response) {
			uni.showToast({
				title: "请求发送异常",
				icon: "error",
			});
		} else if (error.response.code == 504 || error.response.data == 404) {
			uni.showToast({
				title: "没有找到服务器",
				icon: "error",
			});
		} else if (error.response.code == 403) {
			uni.showToast({
				title: "权限不足禁止访问",
				icon: "error",
			});
		} else if (error.response.code == 401) {
			uni.showToast({
				title: "请先登录",
				icon: "error",
			});
		} else {
			if (error.response.data.message) {
				uni.showToast({
					title: error.response.data.message,
					icon: "error",
				});
			} else {
				uni.showToast({
					title: "未知错误",
					icon: "error",
				});
			}
		}
		return Promise.reject(error);
	})
}
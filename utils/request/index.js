// import axios from 'axios';
// import adapter from 'uniapp-axios-adapter';

// axios.defaults.adapter = adapter;
// axios.defaults.baseURL = window.location.protocol + "//" + window.location.port;
// axios.defaults.timeout = 5000;

uni.$u.http.setConfig((defaultConfig) => {
	/* defaultConfig 为默认全局配置 */
	defaultConfig.baseURL = "http://8084"
	// defaultConfig.baseURL = window.location.protocol + "//" + window.location.port
	// baseURL: window.location.protocol + "//" + window.location.port /* 根域名 */
	defaultConfig.timeout = 5000
	// header: {
	// 	'content-type': 'application/json;charset=UTF-8'
	// }
	return defaultConfig

})

module.exports = (vm) => {
	require('./requestInterceptors')(vm)
	require('./responseInterceptors')(vm)
}
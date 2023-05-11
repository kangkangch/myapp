<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			uni.hideTabBar({})
		},
		onShow: function() {
			console.log('App Show')
			uni.hideTabBar({})
		},
		onHide: function() {
			console.log('App Hide')
			
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	@import "@/uni_modules/uview-ui/index.scss";
	
	@import "@/node_modules/cl-uni/index.scss";
	
	@import url("./static/css/common.css");
	
	@import '@/common/uni.css';
	// @import '@/common/uni-icons.css';
	// @import '@/common/admin-icons.css';
	// @import '@/common/theme.scss';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
		
	//设置tabbar样式	
	.u-tabbar{
			.u-page {
				padding: 0;
			
				&__item {
			
					&__title {
						color: $u-tips-color;
						background-color: $u-bg-color;
						padding: 15px;
						font-size: 15px;
			
						&__slot-title {
							color: $u-primary;
							font-size: 18px;
						}
					}
			
					&__slot-icon {
						width: 22px;
						height: 22px;
					}
				}
			}
			
			.u-tabbar-item {
			
				&__text {
					font-size: 15px;
				}
			
			}
		}
	
</style>
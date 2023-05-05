<template name="myTabbar">
	<view class="">
		<u-tabbar :value="value"  :fixed="true" :placeholder="true"
			:safeAreaInsetBottom="true">
			<!-- <u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text" @tap="goto(item.pagePath)">-->
			<u-tabbar-item v-for="(item, index) in mytabbar" :key="index" :text="item.text" >
				<image class="u-page__item__slot-icon" slot="active-icon" :src="item.selectedIconPath"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" :src="item.iconPath"></image>
			</u-tabbar-item>
		</u-tabbar>
	</view>

</template>

<script>
	import {
		user_admin,
		user_guest,
		user_member,
		user_student,
	} from "@/utils/tabbar.js";

	import {
		goBack
	} from "@/utils/common.js";


	export default {
		name: "myTabbar",
		props: {
			pagePath: String
		},


		data() {
			return {
				page: 'contact',
				showPage: false,
				group_id: null,
				mytabbar: null,
				value: 0,
			};
		},
		watch: {
			pagePath: {

				handler(val) {
					// console.log('pagePath监听===val', val);
				},
				immediate: true
			}
		},
		onShow() {

		},
		created() {
			// 根据自己的业务需求判断条件，替换即可
			let qx = 0;
			const user = uni.getStorageSync('user');
			if (user == '') qx = 0;
			else qx = user.roleId;
			console.log('当前用户权限等级为:' + qx);
			if (qx === 0) {
				this.mytabbar = user_guest;
			} else if (qx === 1) {
				this.mytabbar = user_admin;
			} else if (qx === 2) {
				this.mytabbar = user_student;
			} else if (qx === 3) {
				this.mytabbar = user_member;
			}
		},
		onLoad() {},
		mounted() {},
		methods: {
			changeTab(item) {
				this.page = item.pagePath;
				console.log(this.page);
				// const token = uni.getStorageSync('token');
				// if (!token) {
				// 	uni.reLaunch({
				// 		url: '/subpackages/login/login',
				// 	});
				// }
				// 使用reLaunch关闭所有的页面，打开新的栏目页面
				uni.switchTab({
					url: this.page,
					success: function(e) {
						var page = getCurrentPages().pop();
						if (page == undefined || page == null) return;
					}
				})
				//切忌:勿用switchTab 方式 跳转  :原因-去看看 switchTab 方式跳转做了什么
			},
			tabchange(e){
				
			},
			goto(e) {
				// let url = this.mytabbar[e].pagePath;
				// this.value = e;
				// console.log(url);
				// console.log(this.value, 111,e)
				
				if (this.value != e) {
					this.value = e;
					let url = this.mytabbar[e].pagePath;
					uni.switchTab({
						url: url,
					});
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
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
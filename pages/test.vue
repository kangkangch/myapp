<template>
	<view class="pd24_20">
		<view  v-if="isLogin == false" @click="showLoginAct" class="flex alcenter space">
			<view   class="flex alcenter">
				<view class="member-face">
					<image class="face" :src="statics.defaultFace"></image>
				</view>
				<view class="ml15">
					<view class="ft16 cl-main">暂未登录</view>
					<view class="mt12 ft12 cl-notice">点击登录 享受更多会员特惠</view>
				</view>
			</view>
			<text class="iconfont iconicon_arrow_small ft12 cl-notice"></text>	
		</view>
		<view  v-else class="flex alcenter space">
			<view class="flex alcenter" @click="opsets">
				<view class="member-face">
					<image class="face" :src="avatar"></image>
					<image class="vip-level" :src="userinfo.group_id>1?statics.vipLevelImg[0]:''"></image>
				</view>
				<view class="ml15">
					<view class="ft16 cl-main">{{ userinfo.nickname || '' }}</view>
					<view class="mt12 ft12 cl-notice">ID:{{ userinfo.user_id || '' }}</view>
				</view>
			</view>
			<view class="btn-mini opsetads" @click="opset">
				<text class="yticon icon-shezhi ft24 cl-notice"></text>
			</view>
		</view>
		<view style="width: 100%; height: 30upx;"></view>
		<home-vipcard :userinfo="userinfo" @loginAct="showLoginAct" @qrcode="showQrcode = true"></home-vipcard>
		<view class="mt24">
			<home-banner :banners="banners"></home-banner>
		</view>
		<view class="flex wrap space mt16">
			<view v-for="(item,index) in getMenus" :key="index" :class="index > 1 ? 'mt16': ''">
				<view v-if="item.type == 'link'" :data-index="index" @click="memberLinkTo" class="box pd16_15 flex alcenter" style="width: 320rpx;" >
					<image :src="item.icon" style="width: 64rpx;height: 64rpx;"></image>
					<text class="ml15 ft14 ftw500 cl-main">{{item.name}}</text>
				</view>
				<view v-else style="width: 320rpx;">
					<button class="box pd16_15 flex alcenter" :open-type="item.type" style="padding: 32rpx 30rpx; margin: 0;">
						<image :src="item.icon" style="width: 64rpx;height: 64rpx;"></image>
						<text class="ml15 ft14 ftw500 cl-main">{{item.name}}</text>
					</button>
				</view>
			</view>
		</view>
		
		
		<com-copyright></com-copyright>
		
		<!-- <com-footer model="member"></com-footer> -->
		
		<dialog-birthday v-if="showBirthday" @closed="showBirthday = false"></dialog-birthday>
		<dialog-login v-if="showLogin" @loginYes="loginYes" @closed="showLogin = false"></dialog-login>
		<dialog-qrcode v-if="showQrcode" @closed="showQrcode = false"></dialog-qrcode>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				isLogin:false,
				showLogin:false,
				isBirthday:true,
				showBirthday:false,
				showQrcode:false,
				avatar:'',
				userinfo:[],
				banners:[],
				vipLevel:0,
				iskq:0,
				memberMenus:[
					{name:'我的会员',type:'link',model:'',link:'/pages/client/vipcard/index',icon:this.$config.staticUrl + 'vipcard_icon_my_card@2x.png',show:1},
					{name:'我的订单',type:'link',model:'',link:'/pages/client/order/index',icon:this.$config.staticUrl + 'vipcard_icon_my_order@2x.png',show:1},
					{name:'收货地址',type:'link',model:'',link:'/pages/client/member/address',icon:this.$config.staticUrl + 'vipcard_icon_my_address@2x.png',show:0},
					{name:'官方商城',type:'link',model:'',link:'/pages/client/shop',icon:this.$config.staticUrl + 'vipcard_icon_my_integral@2x.png',show:0},
					{name:'我的邀请',type:'link',model:'',link:'/pages/client/mytuandui',icon:this.$config.staticUrl + 'vipcard_icon_my_invite@2x.png',show:1},
					{name:'意见反馈',type:'link',model:'',link:'/pages/client/member/feedback',icon:this.$config.staticUrl + 'vipcard_icon_my_advise@2x.png',show:0},
					{name:'专属顾问',type:'link',model:'',link:'/pages/client/vipcard/adviser',icon:this.$config.staticUrl + 'vipcard_icon_my_advise@2x.png',show:1},
				],
			}
		},
		computed:{
			getMenus(){
				let arr = new Array;
				for(var a  in this.memberMenus){
					if(this.memberMenus[a].show == 1){
						arr.push(this.memberMenus[a]);
					}
				}
				return arr;
			}
		},
		onLoad(){
			
		},
		onShow() {
			if(uni.getStorageSync("userinfo").token){
				this.isLogin =true; 
				this.ongrzlTap();
			}else{
				this.isLogin =false; 
			}
			this.banners=uni.getStorageSync("config").banner
			this.getList();
		},
		onShareAppMessage(e){
			
		},
		onShareTimeline(e){
			
		},
		methods:{
			opset(){
				uni.navigateTo({
					url:'/pages/set/set'
				})
			},
			opsets(){
				uni.navigateTo({
					url:'/pages/set/grzl/grzl'
				})
			},
			async ongrzlTap(){
				let data = {};
				data.token = uni.getStorageSync("userinfo").token;
				data.uid = uni.getStorageSync("userinfo").id;
				uni.request({
					url: this.configs.webUrl+'/api/user/index',
					data: data,
					success: res =>{
						if(res.data.code==1){
							let ionfo=res.data.data
							ionfo.isLogin=true
							this.userinfo=ionfo
							uni.setStorage({//缓存配置信息
								key: 'userinfo',  
								data: res.data.data
							})
							if(res.data.data.avatar){
									var str = res.data.data.avatar;
									if(str.indexOf("data:image") != -1){
										this.avatar='';
									}else{
										if(str.indexOf("http") != -1){
											this.avatar=res.data.data.avatar;
										}else{
											this.avatar=this.configs.imgUrl+res.data.data.avatar;
										}
									}
								}else{
									this.avatar='';
								}
								uni.setStorage({//缓存配置信息
									key: 'avatar',  
									data: this.avatar
								})
						}else{
							uni.showToast({ title: res.data.msg,icon:"none" });
						}
					},
					fail: (data, code) => {
						//console.log('fail' + JSON.stringify(data));
					}
				});		
			},
			getList() {
				let data = {};
				var limit=15;
				data.limit=limit
				data.ishot=2
				uni.request({
					url: this.configs.webUrl+'/api/video/lists',
					data: data,
					success: data => {
						//console.log(data.data)
						uni.setStorage({//缓存配置信息
							key: 'config',  
							data: data.data.config
						})
						if(uni.getStorageSync("config").iskq){
							this.iskq=uni.getStorageSync("config").iskq;
						}
					},
					fail: (data, code) => {
					}
				});
			},
			memberLinkTo(e){
				let index =  parseInt(e.currentTarget.dataset.index);
				if(this.isLogin == false&& this.getMenus[index].model != 'integral'){
					this.showLogin = true;
				}else{
					if(this.getMenus[index].link != ''){
						if(this.getMenus[index].model == 'integral'){
							uni.redirectTo({
								url:this.getMenus[index].link 
							})
						}else{
							uni.navigateTo({
								url:this.getMenus[index].link 
							})
						}
					}
				}
			},
			birthdayAct(){
				if(this.isBirthday){
					uni.navigateTo({
						url:'/pages/client/member/birthday'
					})
				}else{
					uni.navigateTo({
						url:'/pages/client/member/info'
					})
				}
			},
			showLoginAct(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			loginYes(){
				
			},
			outlogin(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
				    		uni.clearStorageSync();
							
				    		setTimeout(()=>{
				    			this.isLogin =false; 
								this.userinfo.isLogin=false
				    		}, 200)
				    	}
				    }
				});
			}
		}
	}
</script>

<style>
	.opsetads{
		background: #FFFFFF;
		color:#000000; 
		width: 70upx; 
		line-height: 70upx; 
		height: 70upx; 
		text-align: center; 
		border-radius: 100%;
		animation: rotate 10s linear infinite;
	}
	@keyframes rotate{
	    0%{
	        transform:rotate(0deg) skew(0deg) scale(1);
	        -ms-transform:rotate(0deg) skew(0deg) scale(1);     /* IE 9 */
	        -moz-transform:rotate(0deg) skew(0deg) scale(1);     /* Firefox */
	        -webkit-transform:rotate(0deg) skew(0deg) scale(1); /* Safari  Chrome */
	        -o-transform:rotate(0deg) skew(0deg) scale(1); 
	    }
	    100%{
	        transform:rotate(360deg) skew(0deg) scale(1);
	        -ms-transform:rotate(360deg) skew(0deg) scale(1);     /* IE 9 */
	        -moz-transform:rotate(360deg) skew(0deg) scale(1);     /* Firefox */
	        -webkit-transform:rotate(360deg) skew(0deg) scale(1); /* Safari  Chrome */
	        -o-transform:rotate(360deg) skew(0deg) scale(1); 
	    }
	}
	.member-face{
		position: relative;
	}
	.member-face .vip-level{
		height: 48rpx;
		width: 48rpx;
		position: absolute;
		left: calc(50% - 24rpx);
		top: -30rpx;
	}
	.member-face .face{
		width: 160rpx;
		height: 160rpx;
		border:6rpx solid #FFFFFF;
		background: #FFFFFF;
		border-radius: 100rpx;
		box-shadow: 0rpx 24rpx 48rpx 0rpx rgba(197, 202, 219, 0.3);
	}
	.miniapp-icon{
		width: 48rpx;
		height: 48rpx;
		border-radius: 24rpx;
		background: #F2F2F2;
	}
</style>
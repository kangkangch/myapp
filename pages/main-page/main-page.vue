<template>
	<!-- 顶部导航区域 -->
	<view class="box-bg">
		<uni-nav-bar>
			<template v-slot:left style="width: 0%;">
				<view class="city">
					<uni-icons type="arrowdown" color="#666" size="18" />
				</view>
			</template>
			<view class="input-view">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入需要查找的课程"
					@confirm="confirm" />
				<button class="mini-btn" type="primary" size="mini" @click="confirm" >搜索</button>
			</view>
			<template v-slot:right>
				<view class="icon-item">
					<uni-icons type="notification" color="#5e6d82" size="30" />
				</view>
			</template>
		</uni-nav-bar>
	</view>
	<!-- 项目介绍图区域 -->
	
	<!-- 课程列表区域 -->
	<!-- <view class="" style="height: 1000px;">	</view> -->
</template>

<script>
	export default {

		data() {
			return {

			}
		},
		methods: {
			confirm() {
				uni.showToast({
					title: '搜索'
				})
			}
		}
	}
</script>

<style lang="scss">
	$nav-height: 30px;

	.uni-page-head-hd {
		display: none;
	}

	.box-bg {
		background-color: #F5F5F5;
		padding: 5px 0;
		position: -webkit-sticky;
		position: sticky;
		top: var(--window-top);
		z-index: 99;
	}

	.city {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		// width: 160rpx;
		margin-left: 4px;
	}

	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// width: 500rpx;
		flex: 1;
		background-color: #f8f8f8;
		height: $nav-height;
		border-radius: 15px;
		border:1px solid #1aaa10;
		padding: 0  0 0 15px;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: $nav-height;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.nav-bar-input {
		height: $nav-height;
		line-height: $nav-height;
		/* #ifdef APP-PLUS-NVUE */
		width: 370rpx;
		/* #endif */
		padding: 0 5px;
		font-size: 12px;
		background-color: #f8f8f8;
	}

	.mini-btn {
		border-radius: 15px;
		margin-right: 0.03rem;
		margin-top: 0.03rem;
		margin-bottom: 0.03rem;
		background-color: #1aaa10;
		padding: 0 1em;
	}

	.icon-item {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		width: calc(100% / 4);
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 187rpx;
		/* #endif */
		align-items: center;
		padding: 10px;
		text-align: center;
		flex-direction: column;
	}
</style>
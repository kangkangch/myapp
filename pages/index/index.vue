<template>
	<view class="container">

		<view class="intro">本项目已包含uni ui组件，无需import和注册，可直接使用。在代码区键入字母u，即可通过代码助手列出所有可用组件。光标置于组件名称处按F1，即可查看组件文档。</view>
		<text class="intro">详见：</text>
		<uni-link :href="href" :text="href"></uni-link>
		<u-button text="成功按钮" size="normal" type="success"></u-button>
		<my-tabbar></my-tabbar>
	</view>
</template>

<script>
	import myTabbar from "@/components/my-tabbar/my-tabbar.vue";
	export default {
		components: {
			myTabbar,
		},
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		methods: {

		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
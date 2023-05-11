<template>
	<div class="certificate-container">
		<canvas ref="canvas" style="width: 100%;height: 500px; " canvas-id="imgCanvas"
			class="certificate-canvas" @click="getImg"></canvas>
		<!-- <button type="primary" class="save-button" @click="saveCertificate">Save Certificate</button> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				backgroundImageUrl: '/static/images/my/model1.png',
				recipientName: "John Doe",
				awardDate: "May 11, 2023",
				certificateText: "This certifies that John Doe has successfully completed the UniApp course.",
				screenW: 0,
				screenH: 0,
				name: "xxx",
				time: "2023-05-11",
				content: "恭喜你完成了xxx课程，并在考试中取得了优异成绩，准予结业",
				lineHeight: 20
			};
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.screenW = res.windowWidth
					this.screenH = res.windowHeight
					// console.log(res)
					// http://game.gtimg.cn/images/yxzj/act/a20160510story/relavance/heroes/hero48.jpg
				}
			})
			this.drawCertificate();
		},
		methods: {
			drawCertificate() {
				var that = this
				uni.getImageInfo({
					src: "/static/images/my/model1.png",
					success(res) {
						const imgHeight = that.screenW * res.height / res.width

						var ctx = uni.createCanvasContext("imgCanvas") // 使用画布创建上下文 图片
						ctx.drawImage(res.path, 0, 0, that.screenW, imgHeight)
						ctx.setFontSize(15) //设置字体大小，默认10
						ctx.fillText(that.name, that.screenW * 0.413, imgHeight * 0.533); //文字内容、x坐标，y坐标
						ctx.setFontSize(12);
						// ctx.fillText(that.content, that.screenW * 0.18, imgHeight * 0.61); // 添加内容
						that.wrapText(ctx, that.content, that.screenW * 0.18, imgHeight * 0.61, that.screenW * 0.7,
							that.lineHeight)
						ctx.setFontSize(8);
						ctx.setFillStyle("#9a773d")
						ctx.fillText(that.time, that.screenW * 0.2, imgHeight * 0.815);
						// ctx.fillText(date, 50, 80); // 添加日期
						// ctx.setFontSize(16);
						// ctx.setFillStyle('#333');
						// ctx.fillText(content, 50, 120); 
						ctx.save(); //保存
						ctx.draw() //绘制
					}
				})

			},

			getImg() {
				uni.canvasToTempFilePath({
					canvasId: 'imgCanvas',
					success: (res) => {
						console.log(res)
						uni.previewImage({
							urls: [res.tempFilePath],
							rotate: 90
						})
					},
					fail(e) {
					}
				},  this.$scope)
			},

			wrapText(ctx, text, x, y, maxWidth, lineHeight) {
				var words = text.split('');
				var line = '';
				for (var i = 0; i < words.length; i++) {
					var testLine = line + words[i] + ' ';
					var metrics = ctx.measureText(testLine);
					var testWidth = metrics.width;
					if (testWidth > maxWidth && i > 0) {
						ctx.fillText(line.trim(), x, y);
						line = words[i] + ' ';
						y += lineHeight;
					} else {
						line = testLine;
					}
				}
				ctx.fillText(line.trim(), x, y);
			}
		}
	}
</script>

<style>
	.certificate-container {
		position: relative;
	}

	.certificate-canvas {
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
	}

	.save-button {
		z-index: 2;
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
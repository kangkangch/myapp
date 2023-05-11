<template>
	<view v-if="isExam">
		<pxingExam :isSubmit="props.issubmit" :fullScore='props.fullScore' :nownum='props.nownum' :submitType='props.submitType' :examlist='testlist' :duration='props.duration' @getEveryAnswer='getEveryAnswer' @getLastAnswer='getLastAnswer' @finishExam='finishExam'></pxingExam>
	</view>
</template>

<script>
	import pxingExam from '@/components/exam/pxing-exam.vue';
	
	const db = uniCloud.databaseForJQL();
	
	export default {
		components: {
			pxingExam
		},
		data() {
			return {
				passScore: 10000,
				isExam: false,
				user: {},
				attend_course : {},
				testlist:[],
				exam: {},
				beginTime: 0,
				course_id : "",
				props: {
					issubmit: false,
					fullScore: 0,
					duration:70, // 考试时长，需要动态获取.单位为s
					submitType: 1 ,//0-一题一题提交，1-一次全部提交,
					nownum:0,  //从第几题开始
				}
			}
		},
		async onLoad(e) {
			if(e.user_answer){
				this.props.issubmit = true
				this.testlist = JSON.parse(decodeURIComponent(e.user_answer))
				return 
			}
			if(!e.course_id){
				return
			} else {
				this.isExam = true
			}
			
			this.course_id = e.course_id
			this.beginTime = new Date().getTime()
			
			var user = uni.getStorageSync('user')
			if(user){
				this.user= user
			}
			
			//开始考试就修改考试次数
			var attend_course =  await db.collection('attend_course').where({
				user_id : user.user_id,
				course_id : e.course_id
			}).get()
			this.attend_course = attend_course.data[0]
			var chance = this.attend_course.chance
			if(chance <= 0){
				console.log("考试机会已经耗尽")
				uni.navigateBack()
				return
			}
			this.attend_course.chance--
			await db.collection('attend_course').where({
				user_id : user.user_id,
				course_id : e.course_id
			}).update({
				chance: this.attend_course.chance
			})
			
			this.getData()
		},
		created(){
			
		},
		methods: {
			async getData(){
				var exam = await db.collection('exam').where({
					course_id : this.course_id
				}).get()
				this.exam = exam.data[0]
				this.props.fullScore = exam.data[0].score
				this.props.duration = exam.data[0].term
				this.passScore = exam.data[0].pass
				
				var templist = await db.collection('question').where({
					course_id : this.course_id
				}).limit(5).get()
				this.testlist = templist.data;
				// console.log(this.exam)
				
				
				// 添加userAnswer属性
				for (let item of this.testlist) {
					item.userAnswer = ''
				}
			},
			getLastAnswer(e){
				console.log(e)
			},
			getEveryAnswer(e){
				console.log(e)
			},
			async finishExam(examList, score){
				// todo：在这里执行考试结束后的操作，包括上传记录到attend_course,跳转到
				
				uni.showLoading({
					title:"考试结束，正在提交试卷"
				})
				var user_answer = JSON.stringify(examList)
				
				var params = {
					create_time : this.beginTime,
					user_id : this.user.user_id,
					user_answer: user_answer,
					score: score,
					course_id : this.course_id,
					exam_id : this.exam._id
				}
				
				//判断是否是最高分
				var attend_course = await db.collection('attend_course').where({
					course_id : this.course_id
				}).get()
				
				if(attend_course.data[0].score < score){
					await db.collection('attend_course').where({
						course_id : this.course_id,
						user_id : this.user.user_id
					}).update({
						score : score
					})
				}
				console.log("更新分数完成")
				
				
				await db.collection('attend_exam').add(params)
				
				uni.hideLoading()
				
				if(score >=　this.passScore){
					uni.showToast({
						title:'本次考试得分为' + score + '分，通过考试'
					})
					
				}
				
				console.log("考试结束");
				
				uni.switchTab({
					url:"/pages/public/home/home"
				})
			}
		}
	}
</script>

<style>

</style>

<template>
	<view>
		<view class="uni-header">
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<!-- 				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button> -->
				<button class="uni-button" type="default" size="mini"
					@click="toAdd">新增</button>
				<button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length"
					@click="myDelTable">批量删除</button>
				<!--        <download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData" :type="exportExcel.type" :name="exportExcel.filename">
          <button class="uni-button" type="primary" size="mini">导出 Excel</button>
        </download-excel> -->
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" :collection="collectionList" field="user_name,phone,area,email" :where="where"
				page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error,options}"
				:options="options" loadtime="onready" @load="onqueryload">
				<uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe
					type="selection" @selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center" @filter-change="filterChange($event, 'user_name')" sortable
							@sort-change="sortChange($event, 'user_name')">用户名</uni-th>
						<!-- <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'password')" sortable @sort-change="sortChange($event, 'password')">密码</uni-th> -->
						<uni-th align="center" @filter-change="filterChange($event, 'phone')" sortable
							@sort-change="sortChange($event, 'phone')">电话</uni-th>
						<!-- <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'register_time')" sortable @sort-change="sortChange($event, 'register_time')">注册时间</uni-th> -->
						<uni-th align="center" @filter-change="filterChange($event, 'area')" sortable
							@sort-change="sortChange($event, 'area')">所在地区</uni-th>
						<!-- <uni-th align="center" filter-type="select" :filter-data="options.filterData.role_id_localdata"
							@filter-change="filterChange($event, 'role_id')">角色id</uni-th> -->
						<uni-th align="center" @filter-change="filterChange($event, 'email')" sortable
							@sort-change="sortChange($event, 'email')">邮箱</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.user_name}}</uni-td>
						<!-- <uni-td align="center">{{item.password}}</uni-td> -->
						<uni-td align="center">{{item.phone}}</uni-td>
						<!-- <uni-td align="center">
              <uni-dateformat :threshold="[0, 0]" :date="item.register_time"></uni-dateformat>
            </uni-td> -->
						<uni-td align="center">{{item.area}}</uni-td>
						<!-- <uni-td align="center">{{options.role_id_valuetotext[item.role_id]}}</uni-td> -->
						<uni-td align="center">
							<uni-link :href="'mailto:'+item.email" :text="item.email"></uni-link>
						</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<!-- <button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini" type="primary">修改</button> -->
								<button @click="myConfirmDelete(item._id)" class="uni-button" size="mini"
									type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
	import {
		enumConverter,
		filterToWhere
	} from '@/js_sdk/validator/user.js';

	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = ['user_name', 'area'] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1

	const orderByMapping = {
		"ascending": "asc",
		"descending": "desc"
	}

	export default {
		data() {
			return {
				collectionList: "user",
				query: '',
				where: '',
				orderby: dbOrderBy,
				orderByFieldName: "",
				selectedIndexs: [],
				options: {
					pageSize,
					pageCurrent,
					filterData: {
						"role_id_localdata": [{
								"text": "学员",
								"value": 1
							},
							{
								"text": "会员",
								"value": 2
							}
						]
					},
					...enumConverter
				},
				imageStyles: {
					width: 64,
					height: 64
				},
				myBinds: [],
				user: null,
				memberInfo: {}
				
			}
		},
		async onLoad(e) {
			let user = uni.getStorageSync('user')
			if(user) this.user = user
			this._filter = {}
			
			var info = await db.collection('member').where({
				user_id : user.user_id
			}).get()
			// console.log('info',info)
			this.memberInfo = info.result.data[0]
			
		},
		async onReady() {
			this.getMyStudent()
		},
		methods: {
			async getMyStudent() {
				let binds = await db.collection('bind').where({
					member_id: this.user.user_id
				}).get()
				// console.log(binds.result.data);
				var myBinds = []
				for (let bind of binds.result.data) {
					myBinds.push(bind.student_id)
				}
				this.myBinds = myBinds
				var where = "_id in " + JSON.stringify(this.myBinds)
				this.where = where
				// console.log(this.$refs.udb.$data.dataList)

				// var selectValue = []
				// var command = db.command
				// for (let student of this.myBinds) {
				// 	selectValue.push(command.eq(student))
				// }
				// // console.log(selectValue);
				// if (selectValue.length) {
				// 	where["_id"] = command.or(selectValue)
				// }

			},
			
			toAdd(){
				if(this.memberInfo.bind_num >= this.memberInfo.max_bind){
					uni.showToast({
						title:"绑定人数已达上限"
					})
				}
				else {
					uni.navigateTo({
						url: "/pages/member/member/addStudent"
					})
				}
			},

			//多选删除
			async myDelTable() {
				console.log(this.selectedItems())
				var newWhere = "student_id in " + JSON.stringify(this.selectedItems())

				uni.showModal({
					title: '提示',
					content: '确定要删除这些选项吗？',
					success: async function(res) {
						if (res.confirm) {
							
							await db.collection('member').where({
								user_id : this.user.user_id
							}).update({
								bind_num : this.myBinds.length - this.selectedItems().length
							})

							await db.collection('bind').where(newWhere).remove().then(res => {
								uni.showToast({
									title: "删除成功",
									icon: "none"
								})
								return this.getMyStudent()
							}).catch(e => {
								console.log("删除失败:", e)
								uni.showToast({
									title: "删除失败",
									icon: "none"
								})
							})

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}.bind(this)
				})

			},

			//单选删除
			async myConfirmDelete(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该项吗？',
					success: async function(res) {
						if (res.confirm) {
							
							await db.collection('member').where({
								user_id : this.user.user_id
							}).update({
								bind_num : this.myBinds.length - 1
							})

							await db.collection('bind').where("student_id == '" + id + "'").remove().then(
								res => {
									uni.showToast({
										title: "删除成功",
										icon: "none"
									})
									return this.getMyStudent()
								}).catch(e => {
								console.log("删除失败:", e)
								uni.showToast({
									title: "删除失败",
									icon: "none"
								})
							})

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}.bind(this)
				})
			},

			onqueryload(data) {
				// console.log(data)
				// console.log(this.where)
				// this.exportExcelData = data
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				console.log(dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || '))
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere()
				this.where = newWhere
				this.$nextTick(() => {
					this.loadData()
				})
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			onPageChanged(e) {
				this.selectedIndexs.length = 0
				this.$refs.table.clearSelection()
				this.$refs.udb.loadData({
					current: e.current
				})
			},
			navigateTo(url, clear) {
				// clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
						}
					}
				})
			},
			// 多选处理
			selectedItems() {
				var dataList = this.$refs.udb.dataList
				return this.selectedIndexs.map(i => dataList[i]._id)
			},

			// 批量删除
			delTable() {
				this.$refs.udb.remove(this.selectedItems(), {
					success: (res) => {
						this.$refs.table.clearSelection()
					}
				})
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			confirmDelete(id) {
				this.$refs.udb.remove(id, {
					success: (res) => {
						this.$refs.table.clearSelection()
					}
				})
			},
			sortChange(e, name) {
				this.orderByFieldName = name;
				if (e.order) {
					this.orderby = name + ' ' + orderByMapping[e.order]
				} else {
					this.orderby = ''
				}
				this.$refs.table.clearSelection()
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			},
			filterChange(e, name) {
				this._filter[name] = {
					type: e.filterType,
					value: e.filter
				}
				let newWhere = filterToWhere(this._filter, db.command)
				console.log("newhere", newWhere)
				if (Object.keys(newWhere).length) {
					this.where = newWhere
				} else {
					this.where = ''
				}
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			}
		}
	}
</script>

<style>
</style>
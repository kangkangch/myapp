export default {
	name: 'ws-table',
	props: {
		config: {
			type: Array,
			default: () => {
				return []
			}
		},
		tableData: {
			type: Array,
			default: () => {
				return []
			}
		},
		showTableFilter: {
			type: Boolean,
			default: true
		},
		showSummary: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			itemHeight: 90,
			fixedKey: [], // 固定列
			noFixedKey: [], // 非固定列
			sumRow: {}, // 合计行数据
			scrollLeft: 0,
			listQuery: {}, // 搜索条件
			showOptions: false,
			options: [],
			optionKey: '',
			navBarHeight: 46
		}
	},
	computed: {
	    headerTop() {
	        // #ifdef H5
			return this.navBarHeight + 'px'
			// #endif
			// #ifdef MP-WEIXIN
			return '0px'
			// #endif
	    }
	},
	mounted() {
		this.getSystemInfo()
		this.initConfig()
	},
	methods: {
		refresh(e) {
			console.log('刷新',e)
		},
		getSystemInfo() {
			const info = uni.getSystemInfoSync()
			this.navBarHeight = info.system.indexOf('iOS') > -1 ? 44 : 46
		},
		bindPickerChange(e, item) {
			const index = e.detail.value
			const options = item.filter.options
			const key = item.filter.key ? item.filter.key : item.key
			this.listQuery[key] = options[index].value
			this.listQuery = JSON.parse(JSON.stringify(this.listQuery))
			this.$emit('getQuery', this.listQuery)
		},
		touchmove(e, item) {
			// const offsetLeft = e.target.offsetLeft
			// console.log(e)
		},
		setUpxToPx(val) {
			return uni.upx2px(val ? val : 100) + 'px'
		},
		initConfig() {
			this.config.forEach(v => {
				this.getKeys(v)
				this.initSumRow(v)
			})
			this.countSum()
		},
		getQueryKey(item) {
			return this.listQuery[item.filter && item.filter.key ? item.filter.key : item.key]
		},
		// 区分固定列、非固定列
		getKeys(v) {
			if (v.isShow !== false) {
				if (v.isFixed) {
					this.fixedKey.push(v)
				} else {
					this.noFixedKey.push(v)
				}
			}
		},
		// 初始化合计项
		initSumRow(v) {
			this.sumRow[v.key] = v.isSum ? 0 : ''
		},
		// 合计
		countSum() {
			Object.keys(this.sumRow).forEach(key => {
				this.sumRow[key] = this.sumRow[key] === '' ? '' : 0
			})
			this.tableData.forEach(item => {
				Object.keys(this.sumRow).forEach(key => {
					if (this.sumRow[key] !== '') {
						this.sumRow[key] += Number(item[key])
					}
				})
			})
			// console.log(this.sumRow)
		},
		scrollXFunc(e) {
		    this.scrollLeft = e.detail.scrollLeft
		},
		scrollToLeft(e) {
		    // console.log(e)
		    if (e.detail.direction === 'left') {
		      this.scrollLeft = 0
		    }
		},
		onKeyInput(e, key) {
			this.listQuery[key] = e.detail.value
			this.listQuery = JSON.parse(JSON.stringify(this.listQuery))
		},
		inputConfirm() {
			this.$emit('getQuery', this.listQuery)
		},
		focus(e) {
			// console.log('focus')
			// console.log(e)
		},
		blur(e) {
			// console.log('blur')
			// console.log(e)
		},
		clearValue(key) {
			this.listQuery[key] = ''
			this.listQuery = JSON.parse(JSON.stringify(this.listQuery))
			this.$emit('getQuery', this.listQuery)
		},
		getDictText(item) {
			if (item.filter && item.filter.options) {
				const options = item.filter.options
				const key = item.filter.key ? item.filter.key : item.key
				const index = options.findIndex(v => v.value === this.listQuery[key])
				if (index > -1) {
					return options[index].label
				}
			}
			return '-'
		},
		showDictText(options, value) {
			let label = ''
			if (options && options.length > 0 && value) {
				options.forEach(item => {
					if (item.value === value) {
						label = item.label
					}
				})
			}
			return label ? label : '未知'
		},
		getTagClass(value) {
			let name = ''
			switch(value) {
				case 'Y':
					name = 'ok'
					break
				case 'N':
					name = 'error'
					break
			}
			return name
		}
	}
}

<template>
	<div>
		<el-card>
			<div slot="header">
				<el-row type="flex" justify="space-between" align="middle">
					<el-col :span="12">
						<el-row type="flex" align="middle">
							<el-col :span="6">
								<span>教工积分管理</span>
							</el-col>
							<el-col :span="12">
								<el-input clearable class="search-input" placeholder="教工编号/姓名(搜索)" v-model="infoSearch"></el-input>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="12" class="btn-area">
						<el-button type="primary">导出数据</el-button>
						<el-button v-if="user.logo===1 || user.id==='1345995188715585537'" type="primary" @click="dialogAttendanceVisible = true">导入考勤信息</el-button>
						<el-button type="primary" @click="showBatchModifyDialog">批量修改</el-button>
					</el-col>
				</el-row>
			</div>
			<el-table v-loading="loading"
			          :data="tchListCompute.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)" ref="multipleTable"
			          :header-cell-style="headerCellStyle" :row-key="getRowKey"
			          @selection-change="handleSelectionChange" @sort-change="handleSortChange">
				<el-table-column type="selection" reserve-selection></el-table-column>
				<el-table-column label="教工编号" prop="no"></el-table-column>
				<el-table-column label="教工姓名" prop="name"></el-table-column>
				<el-table-column label="专项积分" prop="mapList">
					<el-table-column v-for="(item,index) in classifyList" :key="index"
					                 :label="item.classify">
						<template slot-scope="scope">{{scope.row.mapList[index].score}}</template>
					</el-table-column>
				</el-table-column>
				<el-table-column sortable label="平均专项积分" prop="scoreSpecialAverage" width="140px"></el-table-column>
				<el-table-column sortable label="年度积分" prop="scoreAnnual"></el-table-column>
				<el-table-column sortable label="平均年度积分" prop="scoreAnnualAverage" width="140px"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="showModifyDialog(scope.row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
			<my-pagination :current-page="currentPage" :page-size="pageSize" :total="tchListCompute.length"
			               @handleCurrentChange="handleCurrentChange"
			               @handleSizeChange="handleSizeChange">
			</my-pagination>
		</el-card>
		<el-dialog :visible.sync="dialogModifyVisible" :title="title" @closed="closeModifyDialog">
			<el-form :model="tchDto" label-width="100px" label-position="right" class="modify-form">
				<el-form-item prop="no" label="教工编号：" v-if="!ifBatch">
					{{ tchDto.no }}
				</el-form-item>
				<el-form-item prop="name" label="教工姓名：" v-if="!ifBatch">
					{{ tchDto.name }}
				</el-form-item>
				<el-form-item label="记分分类：">
					<el-select v-model="classify">
						<el-option v-for="(item,index) in classifyOption" :key="index"
						           :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="记分理由：">
					<el-select v-model="ruleDto" value-key="id" @change="handleSelectChange">
						<el-option v-for="(item,index) in classifyCompute" :key="index"
						           :label="item.reason" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="加分额度：" v-if="ruleDto.addLimit">
					{{ ruleDto.addLimit }}
				</el-form-item>
				<el-form-item label="扣分额度：" v-if="ruleDto.desLimit">
					{{ ruleDto.desLimit }}
				</el-form-item>
				<el-form-item label="说明：" v-if="ruleDto.illustrate">
					{{ ruleDto.illustrate }}
				</el-form-item>
				<el-form-item label="加分："  v-if="ruleDto.addLimit">
					<el-input v-model="record.addScore"></el-input>
				</el-form-item>
				<el-form-item label="扣分：" v-if="ruleDto.desLimit">
					<el-input v-model="record.desScore" placeholder="扣分填正数即可(扣5分输入5)"></el-input>
				</el-form-item>
				<el-form-item label="备注(可空)：">
					<el-input v-model="record.remark" type="textarea" :rows="4"
					          maxlength="255" show-word-limit>
					</el-input>
				</el-form-item>
			</el-form>
			<div class="btn-area">
				<el-button type="primary" @click="tchModifyCommit">确认</el-button>
				<el-button type="primary" @click="closeModifyDialog">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="dialogAttendanceVisible" :title="'导入考勤信息'">
			<el-image :src="attendanceFormat"></el-image>
			<div>
				<p class="attention">注意(格式错误将导致导入全部失败)</p>
				<p>表头顺序任意但是不可缺</p>
			</div>
			<div class="btn-area-flex">
				<el-button type="primary" @click="downloadTemplate">模板下载</el-button>
				<el-upload action="" :before-upload="beforeUpload" :http-request="uploadAttendanceFile" :show-file-list="false">
					<el-button type="primary">文件上传(.xlsx)</el-button>
				</el-upload>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import attendanceFormat from '../assets/images/attendanceFormat.png'
import MyPagination from "../components/MyPagination";
export default {
  name: "ScoreManage",
  components: {MyPagination},
  data() {
    return {
      attendanceFormat,
      user: this.$store.state.user,
      tchList: [],
      dialogModifyVisible: false,
      currentPage: 1,
      pageSize: 10,
      selectionList: [],
      infoSearch: '',
      rule: [],
      classifyOption: [],
      classify: '',
      record: {
        tchId: '',
        executorId: '',
        ruleId: '',
        addScore: 0,
        desScore: 0,
        remark: ''
      },
      tchDto: {
        no: '',
        name: ''
      },
      ruleDto: {
        id: '',
        classify: '',
        reason: '',
        addLimit: '',
        desLimit: '',
        illustrate: ''
      },
      ifBatch: false, // 是否是批量修改模式
      title: '积分修改',
      dialogAttendanceVisible: false,
	    loading: true,
	    classifyList: [],
    }
  },
  methods: {
    headerCellStyle(obj) {
      if (obj.columnIndex === 3) {
        return 'textAlign: center'
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    getRowKey(row) {
      return row.id
    },
    sortBy(field,order) {
      if (order === 'ascending') {
        return (x, y) => {
          return x[field] - y[field];
        }
      } else {
        return (x, y) => {
          return y[field] - x[field];
        }
      }
    },
    handleSelectionChange(val) {
      this.selectionList = val
    },
    handleSortChange(column) {
      this.tchList.sort(this.sortBy(column.prop,column.order))
    },
    showModifyDialog(row) {
      this.ifBatch = false
      this.record.tchId = row.id
      this.tchDto.no = row.no
      this.tchDto.name = row.name
      this.dialogModifyVisible = true
      this.title = '积分修改'
    },
    showBatchModifyDialog() {
      this.ifBatch = true
      this.dialogModifyVisible = true
      this.title = '积分批量修改'
    },
    closeModifyDialog() {
      this.ifBatch = false
      this.dialogModifyVisible = false
      this.classify = ''
      this.record = {
        tchId: '',
        executorId: '',
        ruleId: '',
        addScore: 0,
        desScore: 0,
        remark: '',
      }
      this.ruleDto = {
        id: '',
        classify: '',
        reason: '',
        addLimit: '',
        desLimit: '',
        illustrate: ''
      }
    },
    tchModifyCommit() {
      this.record.executorId = this.user.id
      this.record.addScore = this.record.addScore || 0
      this.record.desScore = this.record.desScore === '' ? 0 : -this.record.desScore
      if (this.ifBatch) {
        if (this.selectionList.length > 0) {
          this.$api.modifyScoreBatch({record:this.record,tchList:this.selectionList}).then(res => {
            this.getAllUser()
            this.$showMsg('success',res.description)
          })
        } else {
          this.$showMsg('error','请选择要批量修改的用户')
        }
      } else {
        this.$api.modifyScore(this.record).then(res => {
          this.$showMsg('success',res.description)
          this.getAllUser()
        })
      }
      this.closeModifyDialog()
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectChange(val) {
      this.record.ruleId = val.id
	    this.record.addScore = 0
	    this.record.desScore = 0
	    this.record.remark = ''
    },
    getAllUser() {
      let formData = new FormData()
      formData.append('userId',this.user.id)
      this.$api.getAllUser(formData).then(res => {
        this.tchList = res.data ? res.data.filter(item => {
          return item.logo === -1
        }) : []
	      this.tchList.map(item => {
          item.mapList.sort((a, b)=> a.classify.localeCompare(b.classify, 'zh'))
	      })
        console.log(this.tchList)
	      if (this.tchList.length > 0) {
          this.classifyList = this.tchList[0].mapList
	      }
      }).finally(() => {
        this.loading = false
      })
    },
    getRule() {
      let formData = new FormData();
      formData.append("userId",this.user.id)
      this.$api.getRule(formData).then(res => {
        this.rule = res.data ? res.data : []
        this.classifyOption = Object.keys(this.countClassify(this.rule)).map(item => {
          return {
            label: item,
            value: item
          }
        })
      })
    },
    beforeUpload(file) {
      let hz = file.name.split(".")[1]
      if (hz !== 'xlsx' && hz !== 'xls') {
        this.$showMsg('error','文件格式错误')
        return false;
      }
    },
    uploadAttendanceFile(item) {
      let formData = new FormData;
      formData.append('file',item.file)
	    formData.append('executorId',this.user.id)
      this.$api.uploadAttendanceFile(formData).then(res => {
        this.$showMsg('success',res.description)
	      this.getAllUser()
      })
    },
    countClassify(arr) {
      return arr.reduce((prev, next) => {
        prev[next.classify] = (prev[next.classify] + 1) || 1;
        return prev;
      },{})
    },
    downloadTemplate() {
      window.location.href='http://172.29.5.152/cdfz/excel/download/attendanceFormat.xlsx'
    }
  },
  watch: {},
  computed: {
    tchListCompute() {
      if (this.infoSearch) {
        return this.tchList.filter((item,index) => {
          return (item.no === this.infoSearch || item.name === this.infoSearch)
        })
      }
      return this.tchList
    },
    classifyCompute() {
      return this.rule.filter(item => {
        return (item.classify === this.classify)
      })
    }
  },
  created() {
    this.getAllUser()
    this.getRule()
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
	.btn-area {
		text-align: right;
	}
	.search-input {
		width: 60%;
	}
	.modify-form {
		.el-input {
			width: 60%;
		}
	}
	.download-link {
		color: #ffffff;
		text-decoration: none;
	}
	.btn-area-flex {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
		button:first-child {
			margin-right: 10px;
		}
	}
	.attention {
		font-size: 14px;
		font-weight: bolder;
	}
</style>
<template>
	<div>
		<el-card>
			<div slot="header">
				<el-row type="flex" align="middle">
					<el-col :span="4">
						<span>教工申诉管理</span>
					</el-col>
					<el-col :span="20" style="text-align: right">
						<el-input clearable class="search-input" placeholder="教工编号/姓名(搜索)" v-model="infoSearch"></el-input>
						<el-select style="margin: 0 10px" v-model="classify" placeholder="计分分类" clearable>
							<el-option v-for="(item,index) in classifyOption"
							           :label="item.label" :value="item.value" :key="index">
							</el-option>
						</el-select>
						<el-select style="margin: 0 10px" v-model="year" placeholder="学年" clearable>
							<el-option v-for="(item,index) in yearOption"
							           :label="item.label" :value="item.value" :key="index">
							</el-option>
						</el-select>
						<el-date-picker v-model="timeSearch" type="daterange" unlink-panels
						                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-col>
				</el-row>
				<el-row style="text-align: right;margin-top: 20px">
					<el-button type="primary" @click="admitRemoveAppealBatch" v-if="user.logo === 1">批量删除</el-button>
				</el-row>
			</div>
			<el-table v-loading="loading" :data="appealCompute.slice((currentPage-1)*pageSize,currentPage*pageSize)"
			          border @selection-change="handleSelectionChange" :row-key="getRowKeys" ref="table">
				<el-table-column
						v-if="user.logo === 1"
						type="selection"
						width="55"
						:reserve-selection="true">
				</el-table-column>
				<el-table-column prop="tchName" label="申诉人姓名"></el-table-column>
				<el-table-column prop="executorName" label="执行部门"></el-table-column>
				<el-table-column prop="classify" label="计分分类"></el-table-column>
				<el-table-column prop="ruleReason" label="计分原因"></el-table-column>
				<el-table-column prop="addScore" label="加分"></el-table-column>
				<el-table-column prop="desScore" label="减分"></el-table-column>
				<el-table-column prop="remark" label="备注"></el-table-column>
				<el-table-column prop="reason" label="申诉原因"></el-table-column>
				<el-table-column prop="year" label="学年"></el-table-column>
				<el-table-column prop="gmtRecord" label="记录时间">
					<template slot-scope="scope">
						{{ scope.row.gmtRecord | dateFilter}}
					</template>
				</el-table-column>
				<el-table-column prop="gmtCreate" label="申诉时间">
					<template slot-scope="scope">
						{{ scope.row.gmtCreate | dateFilter}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button v-if="scope.row.status===0" type="text" @click="showDialog(scope.row.id)">处理</el-button>
						<el-button v-else type="text" @click="showDialog(scope.row.id)">重新处理</el-button>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<span style="color: #bb162b" v-if="scope.row.status===0">未处理</span>
						<div v-else>
							<el-button type="text" @click="showHandleResult(scope.row.feedback)">已处理</el-button><br />
							<span>{{scope.row.gmtSolve | dateFilter}}</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<my-pagination :total="appealCompute.length" :current-page="currentPage" :page-size="pageSize"
			               @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></my-pagination>
			<el-dialog :visible.sync="dialogHandleAppealVisible" :title="'处理申诉'" @close="closeDialog">
				<el-input v-model="feedback" type="textarea" :rows="8"></el-input>
				<div class="btn-area">
					<el-button type="primary" @click="handleAppeal">确认</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogHandleResultVisible" :title="'处理结果'">
				<el-input v-model="handleResult" type="textarea" :rows="8" readonly></el-input>
				<div class="btn-area">
					<el-button type="primary" @click="dialogHandleResultVisible = false">关闭</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
import MyPagination from "../components/MyPagination";
export default {
  name: "AppealManage",
  components: {MyPagination},
  data() {
    return {
      user: this.$store.state.user,
      appealList: [],
      currentPage: 1,
      pageSize: 10,
      infoSearch: '',
      timeSearch: '',
      classify: '',
      classifyOption: [],
      dialogHandleAppealVisible: false,
      dialogHandleResultVisible: false,
      appealId: '',
      feedback: '',
      handleResult: '',
	    loading: true,
	    year: '',
      yearOption: [],
      removeSelection: []
    }
  },
  methods: {
    getDepartmentAppeal() {
      let formData = new FormData();
      formData.set("userId",this.user.id)
      this.$api.getDepartmentAppeal(formData).then(res => {
        this.appealList = res.data ? res.data : []
      }).finally(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    showDialog(id) {
      this.dialogHandleAppealVisible = true
      this.appealId = id
      this.feedback = ''
    },
    closeDialog() {
      this.dialogHandleAppealVisible = false
      this.feedback = ''
    },
    handleAppeal() {
      let formData = new FormData();
      formData.set("appealId",this.appealId)
      formData.set("feedback",this.feedback)
      this.$api.handleAppeal(formData).then(res => {
        this.$showMsg('success',res.description)
        this.getDepartmentAppeal();
        this.dialogHandleAppealVisible = false
      })
    },
    showHandleResult(handleResult) {
      this.dialogHandleResultVisible = true
      this.handleResult = handleResult
    },
	  getYearOption() {
      this.$api.getAppealYearOption().then(res => {
        this.yearOption = res.data ? res.data.map(item => {
          return {
            label: item,
	          value: item
          }
        }):[]
      })
	  },
    handleSelectionChange(val) {
      this.removeSelection = val.map(item => item.id)
    },
    getRowKeys(row) {
      return row.id
    },
    getClassify() {
      this.$api.getClassify().then(res => {
        this.classifyOption = res.data.map(item => {
          return {
            label: item,
            value: item
          }
        })
      })
    },
    admitRemoveAppealBatch() {
      this.$confirm('确定删除已选择记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.admitRemoveAppealBatch(this.removeSelection).then(res => {
          this.$showMsg('success',res.description)
          this.$refs.table.clearSelection();
          this.getDepartmentAppeal()
        })
      }).catch(() => {
        this.$showMsg('info','已取消删除')
      })
    }
  },
  computed: {
    appealCompute() {
      this.currentPage = 1
      this.pageSize = 10
      if (this.infoSearch || this.classify || this.year ||this.timeSearch.length > 1) {
        return this.appealList.filter(item => {
          let date = new Date(item.gmtCreate)
          return (
              (this.infoSearch ? (item.tchName === this.infoSearch || item.executorName ===this.infoSearch) : true)
              && (this.classify ? (item.classify === this.classify) : true)
              && (this.timeSearch.length > 1 ? (date.getTime() >= this.timeSearch[0].getTime() && date.getTime() <= this.timeSearch[1].getTime()) : true)
              && (this.year ? (item.year===this.year) : true))
        })
      }
      return this.appealList
    }
  },
  mounted() {
    this.getDepartmentAppeal()
	  this.getYearOption()
	  this.getClassify()
  },
}
</script>

<style scoped>
	.search-input {
		width: 20%;
	}
	.btn-area {
		text-align: right;
		margin-top: 20px;
	}
</style>

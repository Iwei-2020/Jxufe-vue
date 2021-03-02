<template>
  <div>
    <el-card>
      <div slot="header">
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>教工积分修改记录</span>
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
          <el-button type="primary" @click="admitRemoveRecordBatch" v-if="user.logo === 1">批量删除</el-button>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="recordCompute.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
                border @selection-change="handleSelectionChange" :row-key="getRowKeys" ref="table">
        <el-table-column
            v-if="user.logo === 1"
            type="selection"
            width="55"
            :reserve-selection="true">
        </el-table-column>
        <el-table-column prop="tchNo" label="教工编号"></el-table-column>
        <el-table-column prop="tchName" label="教工姓名"></el-table-column>
        <el-table-column prop="executorName" label="计分部门名"></el-table-column>
        <el-table-column prop="classify" label="计分分类"></el-table-column>
        <el-table-column prop="reason" label="计分理由" width="200px"></el-table-column>
        <el-table-column prop="remark" label="备注" width="200px">
          <template slot-scope="scope">
            <el-button @click="showAttendanceDialog(scope.row.attendanceId)" type="text" v-if="scope.row.type === 1">对应考勤记录</el-button>
            <span v-else>{{scope.row.remark ? scope.row.remark : '无'}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="addScore" label="加分"></el-table-column>
        <el-table-column prop="desScore" label="扣分"></el-table-column>
        <el-table-column prop="year" label="学年"></el-table-column>
        <el-table-column prop="gmtRecord" label="时间">
          <template slot-scope="scope">
            {{ scope.row.gmtRecord | dateFilter }}
          </template>
        </el-table-column>
      </el-table>
      <my-pagination :total="recordCompute.length" :current-page="currentPage" :page-size="pageSize"
                     @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></my-pagination>
      <el-dialog :visible.sync="dialogSeeAttendanceVisible">
        <el-table :data="attendance" border>
          <el-table-column prop="attDate" label="日期"></el-table-column>
          <el-table-column prop="timeWork1" label="上班1打卡时间"></el-table-column>
          <el-table-column prop="workResult1" label="上班1打卡结果"></el-table-column>
          <el-table-column prop="timeOff1" label="下班1打卡时间"></el-table-column>
          <el-table-column prop="offResult1" label="下班1打卡结果"></el-table-column>
          <el-table-column prop="timeWork2" label="上班2打卡时间"></el-table-column>
          <el-table-column prop="workResult2" label="上班2打卡结果"></el-table-column>
          <el-table-column prop="timeOff2" label="下班2打卡时间"></el-table-column>
          <el-table-column prop="offResult2" label="下班2打卡结果"></el-table-column>
        </el-table>
        <div class="btn-area">
          <el-button type="primary" @click="closeAttendanceDialog">关闭</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import MyPagination from "../components/MyPagination";
export default {
  name: "ModifyLog",
  components: {MyPagination},
  data() {
    return {
      user: this.$store.state.user,
      infoSearch: '',
      timeSearch: '',
      classify: '',
      classifyOption: [],
      recordList: [
        {
          tchNo: '',
          tchName: '',
          executorNo: '',
          executorName: '',
          classify: '',
          reason: '',
          remark: '',
          addScore: '',
          desScore: '',
          gmtRecord: ''
        }
      ],
      currentPage: 1,
      pageSize: 10,
      loading: true,
      dialogSeeAttendanceVisible: false,
      attendance: [],
      yearOption: [],
      year: '',
      removeSelection: []
    };
  },
  methods: {
    getDepartmentRecord() {
      let formData = new FormData();
      formData.set("userId",this.user.id)
      this.$api.getDepartmentRecord(formData).then(res => {
        this.recordList = res.data ? res.data:[]
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
    showAttendanceDialog(id) {
      this.dialogSeeAttendanceVisible = true
      let formData = new FormData();
      formData.append('id',id)
      this.$api.getSpecialAttendance(formData).then(res => {
        console.log(res.data)
        this.attendance = res.data ? [res.data] : []
      })
    },
    closeAttendanceDialog() {
      this.attendance = []
      this.dialogSeeAttendanceVisible = false
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
    getYearOption() {
      this.$api.getRecordYearOption().then(res => {
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
    admitRemoveRecordBatch() {
      this.$confirm('确定删除已选择记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.admitRemoveRecordBatch(this.removeSelection).then(res => {
          this.$showMsg('success',res.description)
          this.$refs.table.clearSelection();
          this.getDepartmentRecord()
        })
      }).catch(() => {
        this.$showMsg('info','已取消删除')
      })
    }
  },
  mounted() {
    this.getDepartmentRecord()
    this.getClassify()
    this.getYearOption()
  },
  computed: {
    recordCompute() {
      this.currentPage = 1
      this.pageSize = 10
      if (this.infoSearch || this.classify || this.year || this.timeSearch.length > 1) {
        return this.recordList.filter(item => {
          let date = new Date(item.gmtRecord)
          return (
            (this.infoSearch ? (item.tchNo === this.infoSearch || item.tchName === this.infoSearch || item.executorNo === this.infoSearch || item.executorName ===this.infoSearch) : true)
            && (this.classify ? (item.classify === this.classify) : true)
            && (this.timeSearch.length > 1 ? (date.getTime() >= this.timeSearch[0].getTime() && date.getTime() <= this.timeSearch[1].getTime()) : true)
            && (this.year ? (item.year === this.year) : true))
        })
      }
      return this.recordList
    }
  }
};
</script>

<style lang="scss" scoped>
  .search-input {
    width: 20%;
  }
  .btn-area {
    margin-top: 30px;
    text-align: right;
  }
</style>



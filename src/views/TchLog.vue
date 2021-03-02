<template>
  <div>
    <el-card>
      <div slot="header">
        <el-row type="flex" align="middle" justify="space-between">
          <el-col :span="4">
            <span>我的积分修改记录</span>
          </el-col>
          <el-col :span="18" class="col-search">
            <el-select v-model="classify" placeholder="计分分类" clearable>
              <el-option v-for="(item,index) in classifyOption"
                         :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
            <div class="time-search">
              <el-date-picker v-model="timeSearch" type="daterange" unlink-panels
                              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="recordCompute.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)" border>
        <el-table-column prop="executorName" label="执行部门"></el-table-column>
        <el-table-column prop="classify" label="计分分类"></el-table-column>
        <el-table-column prop="reason" label="计分原因"></el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-button @click="showAttendanceDialog(scope.row.attendanceId)" type="text" v-if="scope.row.type === 1">对应考勤记录</el-button>
            <span v-else>{{scope.row.remark ? scope.row.remark : '无'}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="addScore" label="加分"></el-table-column>
        <el-table-column prop="desScore" label="减分"></el-table-column>
        <el-table-column prop="gmtRecord" label="时间">
          <template slot-scope="scope">
            {{ scope.row.gmtRecord | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button v-if="scope.row.status === 0" type="text" @click="showDialog(scope.row.id)">申诉</el-button>
              <el-button v-if="scope.row.status === 1" type="text" @click="cancelAppeal(scope.row.id)">撤销申诉</el-button>
              <el-button v-if="scope.row.status === 2" type="text" @click="showDialog(scope.row.id)">再次申诉</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.status === 0">无</span>
              <el-button v-if="scope.row.status === 1" type="text" @click="seeAppeal(scope.row.id)">申诉中</el-button>
              <el-button v-if="scope.row.status === 2" type="text" @click="seeFeedback(scope.row.id)">查看反馈</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination :current-page="currentPage" :page-size="pageSize" :total="recordCompute.length"
                     @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></my-pagination>
      <el-dialog :visible.sync="dialogAppealVisible" :title="'申诉'" @close="closeDialog">
        <el-input v-model="appeal.reason" type="textarea"
                  :rows="8" placeholder="请输入申诉原因" maxlength="255" show-word-limit></el-input>
        <div class="btn-area">
          <el-button type="primary" @click="commitAppeal">提交</el-button>
          <el-button type="primary" @click="closeDialog">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogSeeAppealVisible" :title="'申诉原因'">
        <el-input v-model="appealText" type="textarea" :rows="8" readonly></el-input>
        <div class="btn-area">
          <el-button type="primary" @click="dialogSeeAppealVisible = false">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogSeeFeedbackVisible" :title="'查看反馈'">
        <el-input v-model="feedbackText" type="textarea" :rows="8" readonly></el-input>
        <div class="btn-area">
          <el-button type="primary" @click="dialogSeeFeedbackVisible = false">关闭</el-button>
        </div>
      </el-dialog>
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
  name: "AppealManage",
  components: {MyPagination},
  data() {
    return {
      user: this.$store.state.user,
      records: [],
      currentPage: 1,
      pageSize: 10,
      dialogAppealVisible: false,
      appeal: {
        recordId: '',
        reason: '',
        status: 0
      },
      appealText: '',
      feedbackText: '',
      dialogSeeAppealVisible: false,
      dialogSeeFeedbackVisible: false,
      classify: '',
      classifyOption: [],
      timeSearch: '',
      attendance: [],
      dialogSeeAttendanceVisible: false,
      loading: true
    }
  },
  methods: {
    getTchRecord() {
      let formData = new FormData();
      formData.set("id",this.user.id)
      this.$api.getTchRecord(formData).then(res => {
        this.records = res.data ? res.data : []
      }).finally(() => {
        this.loading = false
      })
    },
    closeDialog() {
      this.dialogAppealVisible = false
      this.appeal.reason = ''
    },
    showDialog(recordId) {
      this.dialogAppealVisible = true
      this.appeal.recordId = recordId
    },
    commitAppeal() {
      this.$api.tchAppeal(this.appeal).then(res => {
        this.$showMsg('success',res.description)
        this.closeDialog()
        this.getTchRecord()
      })
    },
    cancelAppeal(recordId) {
      this.$confirm('确定取消申诉?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let formData = new FormData();
        formData.set('recordId',recordId)
        this.$api.cancelAppeal(formData).then(res => {
          this.$showMsg('success', res.description)
          this.getTchRecord()
        })
      })
    },
    seeAppeal(recordId) {
      this.dialogSeeAppealVisible = true
      let formData = new FormData();
      formData.set("recordId",recordId)
      this.$api.seeAppeal(formData).then(res => {
        this.appealText = res.data
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    seeFeedback(recordId) {
      this.dialogSeeFeedbackVisible = true
      let formData = new FormData();
      formData.set("recordId",recordId)
      this.$api.seeFeedback(formData).then(res => {
        this.feedbackText = res.data
      })
    },
    showAttendanceDialog(id) {
      this.dialogSeeAttendanceVisible = true
      let formData = new FormData();
      formData.append('id',id)
      this.$api.getSpecialAttendance(formData).then(res => {
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
    }
  },
  computed: {
    recordCompute() {
      if (this.classify || this.timeSearch.length > 1) {
        return this.records.filter(item => {
          let date = new Date(item.gmtRecord)
          return ((this.classify ? (item.classify === this.classify) : true)
            && (this.timeSearch.length > 1 ? (date.getTime() >= this.timeSearch[0].getTime() && date.getTime() <= this.timeSearch[1].getTime()) : true))
        })
      }
      return this.records
    }
  },
  mounted() {
    this.getTchRecord()
    this.getClassify()
  }
}
</script>

<style scoped>
  .btn-area {
    margin-top: 20px;
    text-align: right;
  }
  .col-search {
    text-align: right;
  }
  .time-search {
    display: inline-block;
    margin-left: 20px;
  }
</style>


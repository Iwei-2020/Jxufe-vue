<template>
	<div>
		<el-card>
			<div slot="header">
				<el-row type="flex" align="middle" justify="space-between">
					<el-col :span="4">
						<span>我的考勤记录</span>
					</el-col>
					<el-col :span="18" class="col-search">
						<el-select v-model="weekday" placeholder="星期(搜索)" clearable>
							<el-option v-for="(item,index) in weekdayOption"
							           :label="item.label" :value="item.value" :key="index">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
			</div>
			<el-table v-loading="loading"
			          :data="attendanceComputed.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
			          border>
				<el-table-column prop="attDate" label="日期"></el-table-column>
				<el-table-column prop="timeWork1" label="上班1打卡时间"></el-table-column>
				<el-table-column prop="workResult1" label="上班1打卡结果">
					<template slot-scope="scope">
						<span :class="handleWorkResultColor(scope.row.workResult1)">{{scope.row.workResult1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="timeOff1" label="下班1打卡时间"></el-table-column>
				<el-table-column prop="offResult1" label="下班1打卡结果">
					<template slot-scope="scope">
						<span :class="handleWorkResultColor(scope.row.offResult1)">{{scope.row.offResult1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="timeWork2" label="上班2打卡时间"></el-table-column>
				<el-table-column prop="workResult2" label="上班2打卡结果">
					<template slot-scope="scope">
						<span :class="handleWorkResultColor(scope.row.workResult2) ">{{scope.row.workResult2}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="timeOff2" label="下班2打卡时间"></el-table-column>
				<el-table-column prop="offResult2" label="下班2打卡结果">
					<template slot-scope="scope">
						<span :class="handleWorkResultColor(scope.row.offResult2) ">{{scope.row.offResult2}}</span>
					</template>
				</el-table-column>
			</el-table>
			<my-pagination :current-page="currentPage" :page-size="pageSize" :total="attendanceComputed.length"
			               @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange">
			</my-pagination>
		</el-card>
	</div>
</template>

<script>
import MyPagination from "../components/MyPagination";
export default {
  name: "TchAttendance",
	components: {MyPagination},
  data() {
    return {
      user: this.$store.state.user,
      currentPage: 1,
      pageSize: 10,
	    attendance: [],
	    loading: true,
      weekdayOption: [
	      {
	        label: '星期一',
		      value: '星期一'
	      },
        {
          label: '星期二',
          value: '星期二'
        },
        {
          label: '星期三',
          value: '星期三'
        },
        {
          label: '星期四',
          value: '星期四'
        },
        {
          label: '星期五',
          value: '星期五'
        },
        {
          label: '星期六',
          value: '星期六'
        },
        {
          label: '星期日',
          value: '星期日'
        }
      ],
	    weekday: ''
    }
  },
  methods: {
    getTchAttendance() {
      let formData = new FormData();
      formData.append("id", this.user.id)
	    this.$api.getTchAttendance(formData).then(res => {
        this.attendance = res.data ? res.data : []
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
	  handleWorkResultColor(result) {
      if (result === '迟到' || result === '缺卡') {
        return 'darkred'
      }
      return ''
	  }
  },
  computed: {
    attendanceComputed() {
      if (this.weekday) {
        return this.attendance.filter(item => {
	        let index = item.attDate.lastIndexOf(' ') + 1
	        return (this.weekday ? item.attDate.substring(index) === this.weekday : true)
	      })
      }
      return this.attendance
    }
  },
	mounted() {
    this.getTchAttendance();
  }
}
</script>

<style scoped>
	.col-search {
		text-align: right;
	}
	.time-search {
		display: inline-block;
		margin-left: 20px;
	}
	.darkred {
		color: #c93756;
		font-weight: bolder;
	}
</style>
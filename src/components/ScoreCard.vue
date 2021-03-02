<template>
	<div id="score-card" :style="{background: color}">
		<div @click="showDialog">
			<el-row type="flex" align="middle">
				<el-col :span="18">
					<p class="content">{{mapList.classify}}</p>
					<span class="number">
            <span>{{mapList.score}}</span>
            <span class="unit">(分)</span>
          </span>
				</el-col>
				<el-col :span="6">
					<div class="flex-div">
						<svg-icon :icon-class="icon" class="icon"></svg-icon>
					</div>
				</el-col>
			</el-row>
		</div>
		<el-dialog :visible.sync="vis" :title="'记录详情'" @close="closeDialog">
			<el-row class="select-row">
				<el-col :span="16">
					<el-date-picker v-model="timeSearch" type="daterange"
					                start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期">
					</el-date-picker>
				</el-col>
			</el-row>
			<el-table :data="recordCompute.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)" :title="'记录明细'" border>
				<el-table-column label="执行人" prop="executorName"></el-table-column>
				<el-table-column label="计分分类" prop="classify"></el-table-column>
				<el-table-column label="计分原因" prop="reason"></el-table-column>
				<el-table-column label="加分" prop="addScore"></el-table-column>
				<el-table-column label="扣分" prop="desScore">
					<template slot-scope="scope">
						{{ scope.row.desScore > 0 ? -scope.row.desScore : scope.row.desScore }}
					</template>
				</el-table-column>
				<el-table-column label="时间" prop="gmtRecord">
					<template slot-scope="scope">
						{{ scope.row.gmtRecord | dateFilter }}
					</template>
				</el-table-column>
			</el-table>
			<my-pagination :total="recordCompute.length" :current-page="currentPage" :page-size="pageSize"
			               @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></my-pagination>
		</el-dialog>
	</div>
</template>
<script>
import MyPagination from "./MyPagination";
export default {
  name: "ScoreCard",
  components: {MyPagination},
  props: {
    index: {
      type: Number
    },
		mapList: {
      type: Object,
			default: () => {}
		},
    visible: {
      type: Boolean
    },
    records: {
      type: Array,
      default: () => []
    },
    color: {
      type: String
    },
    icon: {
      type: String
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
  },
  data() {
    return {
      vis: false,
      selection: '',
      selectionOption: [],
      timeSearch: []
    }
  },
  methods: {
    showDialog() {
      if (this.index < 5) {
        this.$emit('showDialog',this.index)
      }

    },
    closeDialog() {
      if (this.index < 5) {
        this.$emit('closeDialog',this.index)
      }
    },
    handleCurrentChange(val) {
      this.$emit('handleSubCurrentChange',val,this.index)
    },
    handleSizeChange(val) {
      this.$emit('handleSubSizeChange',val,this.index)
    },
  },
  watch: {
    visible(newValue, oldValue) {
      this.vis = newValue
    }
  },
  computed: {
    recordCompute() {
      if (this.timeSearch.length > 1) {
        return this.records.filter(item => {
          let date = new Date(item.gmtRecord)
          return (this.timeSearch.length > 1 ? (date.getTime() >= this.timeSearch[0].getTime() && date.getTime() <= this.timeSearch[1].getTime()) : true)
        })
      }
      return this.records
    }
  },
  filters: {
    dateFilter: function (dateStr) {
      let date = new Date(dateStr);
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
  }
}
</script>

<style scoped lang="scss">
	#score-card {
		cursor: pointer;
		width: 160px;
		font-size: 14px;
		border-radius: 6px;
		padding: 10px;
		color:#fff;
		.content {
			font-size: 14px;
		}
		.number {
			font-size: 22px;
		}
		.unit {
			font-size: 8px
		}
	}
	.icon {
		font-size: 32px;
	}
	.select-row {
		margin-bottom: 10px;
	}
</style>

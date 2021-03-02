<template>
	<div>
		<key-index :data="keyIndex"></key-index>
		<el-row class="menu-div" type="flex" justify="space-between">
			<el-col :span="20">
				<el-menu default-active="0" mode="horizontal" @select="handleSelect">
					<el-menu-item v-for="(item,index) in classifyList"
					              :index="`${index}`" :key="index">{{item}}</el-menu-item>
				</el-menu>
			</el-col>
			<el-col :span="3" class="flex-row">
				<el-button type="primary">导出数据</el-button>
			</el-col>
		</el-row>
		<el-card>
			<div class="animate__animated animate__fadeInRight">
				<a-chart :chartData="chartData" @paramConfig="showDialog"></a-chart>
			</div>
		</el-card>
		<el-dialog :visible.sync="dialogVisible" :title="'图表参数配置'" @click="cancelConfig">
			<el-form label-width="100px" label-position="right">
				<el-form-item v-for="(item,index) in sectionText"
				              :label="item" :key="index">
					<el-row>
						<el-col :span="5">
							<el-input v-model="sectionValue[index]"></el-input>
						</el-col>
						<el-col :span="1" style="text-align: center">-</el-col>
						<el-col :span="5">
							<el-input v-model="sectionValue[index+1]"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<div class="btn-area">
				<el-button type="primary" @click="getGraphData">确定</el-button>
				<el-button type="primary" @click="cancelConfig">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import KeyIndex from "../components/KeyIndex";
import AChart from "../components/AChart";
export default {
  name: "DataStatistics",
  components: {KeyIndex,AChart},
  data() {
    return {
      chartData: {},
      keyIndex: [],
      dialogVisible: false,
      sectionText: ['区间1:','区间2:','区间3:','区间4:','区间5:'],
      sectionValue: [0,50,100,150,200,300],
      classify: '',
	    classifyList: []
    }
  },
  methods: {
    handleSelect(key,keyPath) {
      this.classify = this.classifyList[key]
      if (key === '4' || key === '5') {
        this.chartData = {
          title: {
            text: this.chartTitleList[key],
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: ['2018', '2019', '2020', '2021']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [120, 200, 150, 80],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        }
      } else {
        this.chartInit(key)
      }
    },
    getSpecialAverage() {
      this.$api.getSpecialAverage(null).then(res => {
        this.keyIndex = res.data ? res.data:[]
      })
    },
    chartInit(key) {
      this.chartData = {
        title: {
          text: this.classifyList[key] + '区间统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: '区间占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.getGraphData()
    },
    showDialog() {
      this.dialogVisible = true
    },
    getGraphData() {
      this.$api.getGraphData({paramArray:this.sectionValue,classify: this.classify}).then(res => {
        if (res.data) {
          this.chartData.legend.data = res.data.map(item => {
            return item.name
          })
          this.chartData.series[0].data = res.data
	        this.dialogVisible = false
        }
      })
    },
    getClassify() {
      this.$api.getClassify().then(res => {
        this.classifyList = res.data
	      this.classify = this.classifyList[0]
        this.chartInit(0)
      })
    },
    cancelConfig() {
      this.dialogVisible = false
	    this.sectionValue = [0,50,100,150,200,300]
    }
  },
  computed: {},
  mounted() {
    this.getSpecialAverage()
	  this.getClassify()
  },

};
</script>

<style lang="scss" scoped>
	.el-menu-item.is-active {
		border-right: none;
	}
	.btn-area {
		text-align: right;
	}
	.menu-div {
		margin: 10px 0
	}
	.flex-row {
		display: flex;
		justify-content: flex-end;
	}
	.btn-area {
		margin-top: 20px;
		text-align: right;
	}
</style>



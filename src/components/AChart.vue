<template>
	<div class="chartWrap">
		<div class="btn-div" v-if="showConfig">
			<el-button type="primary" @click="paramConfig">参数配置</el-button>
		</div>
		<div :id="chartId" class="chart-div"></div>
	</div>
</template>
<script>
export default {
  name: "AChart",
  props: {
    chartData: {
      type: Object,
      required: true,
      default() { // 对象或数组默认值必须从一个工厂函数获取
        return {};
      }
    },
	  showConfig: {
      type: Boolean,
		  default: true
    }
  },
  data() {
    return {
      myChartData: this.chartData
    };
  },
  methods: {
    renderChart() { // 每次渲染前，得先清除掉上一次渲染的配置数据
      this.myChart.clear();
      let _options = Object.assign(
          {
            color: this.colorArr
          },
          this.myChartData
      );
      this.myChart.setOption(_options);
    },
    paramConfig() {
      this.$emit('paramConfig')
    }
  },
  computed: {
    chartId() { // 生成随机字符，保证每个图表实例的ID都是唯一的
      return Math.random()
          .toString(36)
          .substr(2);
    },
    myChart() { // 根据唯一的ID，初始化一个图表实例
      return this.$echarts.init(document.getElementById(this.chartId));
    },
    colorArr() { // 图表主题色
      return this.$store.state.chartTheme;
    }
  },
  mounted() {
    window.onresize = () => { // 监听窗口变化，一旦变化，立刻调用echarts的API，进行重新渲染
      this.myChart.resize();
    };
  },
  beforeDestroy() {
    window.onresize = null; // 销毁前取消监听
  },
  watch: { // 深度监听传入的数据变化，一定加deep属性哦
    chartData: {
      handler(v, o) {
        this.myChartData = v;
        this.renderChart();
      },
      deep: true
    },
    colorArr(n, o) {
      this.renderChart();
    }
  }
};
</script>
<style lang="scss">
	#myChartWrap {
		width: 100%;
		height: 55vh;
	}
	.chart-div {
		height: 360px;
	}
	.btn-div {
		text-align: right
	}
</style>

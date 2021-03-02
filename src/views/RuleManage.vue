<template>
	<div>
		<el-card>
			<div slot="header">
				<el-row type="flex" justify="space-between" align="middle">
					<el-col :span="12">
						<span>计分规则管理</span>
						<el-select v-model="classify" style="margin-left: 20px">
							<el-option v-for="(item,index) in classifyOption" :key="index"
							           :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>
					<el-col :span="8" class="btn-area">
						<el-dropdown style="margin-right: 20px">
							<el-button type="primary">
								删除系列积分分类<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(item,index) in classifyOption" :key="index">
									<el-button type="text" @click="deleteClassifyRule(item.value)">删除{{item.value}}系列积分分类</el-button>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-dropdown style="margin-right: 20px">
							<el-button type="primary">
								新增<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item>
									<el-button type="text" @click="addRule">新增原有计分分类</el-button>
								</el-dropdown-item>
								<el-dropdown-item>
									<el-button type="text" @click="dialogAddNewClassifyRule = true">新增新的计分分类</el-button>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-button type="primary" @click="saveRule">保存</el-button>
					</el-col>
				</el-row>
			</div>
			<vxe-table border resizable show-overflow :data="rulesComputed"
			           :edit-config="{trigger: 'dblclick', mode: 'cell'}" :highlight-hover-row="true">
				<vxe-table-column type="seq" width="60"></vxe-table-column>
				<vxe-table-column width="100" field="classify" title="计分分类"></vxe-table-column>
				<vxe-table-column width="300" field="reason" title="计分理由" :edit-render="{name: 'input', attrs:{type: 'text'}}"></vxe-table-column>
				<vxe-table-column width="200" field="addLimit" title="加分额度" :edit-render="{name: 'input', attrs:{type: 'text'}}"></vxe-table-column>
				<vxe-table-column width="200" field="desLimit" title="扣分额度" :edit-render="{name: 'input', attrs:{type: 'text'}}"></vxe-table-column>
				<vxe-table-column field="illustrate" title="说明" :edit-render="{name: 'input', attrs:{type: 'text'}}"></vxe-table-column>
				<vxe-table-column title="操作" width="100">
					<template v-slot="{ row }">
							<el-button type="text" @click="deleteRule(row.id)">删除</el-button>
					</template>
				</vxe-table-column>
			</vxe-table>
			<el-dialog :visible.sync="dialogAddNewClassifyRule" :title="'新增新的计分分类规则'">
				<el-form label-position="right" label-width="100px">
					<el-form-item label="计分分类：">
						<el-input v-model="newClassifyRule.classify"></el-input>
					</el-form-item>
					<el-form-item label="计分理由：">
						<el-input v-model="newClassifyRule.reason"></el-input>
					</el-form-item>
					<el-form-item label="加分额度：">
						<el-input v-model="newClassifyRule.addLimit"></el-input>
					</el-form-item>
					<el-form-item label="扣分额度：">
						<el-input v-model="newClassifyRule.desLimit"></el-input>
					</el-form-item>
					<el-form-item label="说明：">
						<el-input v-model="newClassifyRule.illustrate"></el-input>
					</el-form-item>
					<el-form-item>
						<div class="btn-area">
							<el-button type="primary" @click="addNewClassifyRule">确定</el-button>
							<el-button @click="cancelAddNewClassifyRule">取消</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
export default {
  name: "dashboard",
  data() {
    return {
      user: this.$store.state.user,
      rules: [],
	    classify: '',
      classifyOption: [],
      dialogAddNewClassifyRule: false,
	    newClassifyRule: {
        classify: '',
		    reason: '',
		    addLimit: '',
		    desLimit: '',
		    illustrate: ''
	    }
    };
  },
  methods: {
    getRule() {
      let formData = new FormData();
      formData.append("userId",this.user.id)
      this.$api.getRule(formData).then(res => {
        this.classify = res.data[0].classify
        this.rules = res.data
        this.classifyOption = Object.keys(this.countClassify(res.data)).map(item => {
          return {
            label: item,
	          value: item
          }
        })
      })
    },
    saveRule() {
      this.$api.saveRule(this.rules).then(res => {
				this.$showMsg('success',res.description)
      })
    },
	  countClassify(arr) {
      return arr.reduce((prev, next) => {
        prev[next.classify] = (prev[next.classify] + 1) || 1;
        return prev;
      },{})
	  },
    addRule() {
      this.rules.push({classify: this.classify})
    },
    deleteRule(ruleId) {
      this.$confirm('确定删除该规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData();
        formData.append('ruleId',ruleId)
        this.$api.deleteRule(formData).then(res => {
          this.$showMsg('success',res.description)
	        this.getRules()
        })
      }).catch(() => {
        this.$showMsg('info','已取消删除')
      });
    },
    addNewClassifyRule() {
      this.$api.addNewClassifyRule(this.newClassifyRule).then(res => {
        this.$showMsg('success',res.description)
	      this.getRules()
	      this.dialogAddNewClassifyRule = false
      })
    },
    cancelAddNewClassifyRule() {
      this.dialogAddNewClassifyRule = false
      this.newClassifyRule = {
        classify: '',
        reason: '',
        addLimit: '',
        desLimit: '',
        illustrate: ''
      }
    },
    deleteClassifyRule(classify) {
      this.$confirm('确定删除该系列规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData();
        formData.append('classify',classify)
        this.$api.deleteClassifyRule(formData).then(res => {
					this.$showMsg('success',res.description)
	        this.getRule()
        })
      }).catch(() => {
        this.$showMsg('info','已取消删除')
      });
    }
  },
  computed: {
    rulesComputed() {
      return this.rules.filter(item => {
        return item.classify === this.classify
      })
    }
  },
  mounted() {
    this.getRule()
  },
};
</script>

<style lang="scss" scoped>
	.btn-area {
		text-align: right;
	}
</style>



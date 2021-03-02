<template>
	<div>
		<el-card>
			<div slot="header">
				<el-row type="flex" align="middle" justify="space-between">
					<el-col :span="12">部门管理</el-col>
					<el-col :span="12" class="btn-area">
						<el-button type="primary" @click="dialogAssignRuleDialog = true">为部门分配规则权限</el-button>
					</el-col>
				</el-row>
			</div>
			<vxe-table border resizable show-overflow :data="departments"
			           :highlight-hover-row="true"
			           :span-method="mergeRowMethod" align="center">
				<vxe-table-column type="seq" width="60"></vxe-table-column>
				<vxe-table-column field="name" title="部门名">
					<template v-slot:header>
						部门名 <i class="el-icon-plus pointer" @click="showDialogAddDepartment"></i>
					</template>
				</vxe-table-column>
				<vxe-table-column field="affiliate1" title="子部门">
					<template v-slot:header>
						子部门 <i class="el-icon-plus pointer" @click="addAffiliate1"></i>
					</template>
				</vxe-table-column>
				<vxe-table-column field="affiliate2" title="子子部门">
					<template v-slot:header>
						子子部门 <i class="el-icon-plus pointer" @click="addAffiliate2"></i>
					</template>
				</vxe-table-column>
			</vxe-table>
		</el-card>
		<el-dialog :visible.sync="dialogDepartmentVisible" @close="cancelAddDepartment" :title="'新增部门'">
			<el-form class="form-new-department" label-width="100px" label-position="left">
				<el-form-item label="部门名：" v-if="ifAddDepartment">
					<el-input v-model="newDepartment.name" style="width: 50%"></el-input>
				</el-form-item>
				<el-form-item label="父部门：" v-if="ifAddAffiliate1">
					<el-select v-model="newDepartment.supDepartment">
						<el-option v-for="(item,index) in optionComputedAffiliate1"
						           :label="item.label" :value="item.value" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="父父部门：" v-if="ifAddAffiliate2">
					<el-select v-model="newDepartment.supSupDepartment">
						<el-option v-for="(item,index) in optionComputedAffiliate2"
						           :label="item.label" :value="item.value" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户名：">
					<el-input v-model="newDepartment.username"></el-input>
				</el-form-item>
				<el-form-item label="密码：">
					<el-input type="password" v-model="newDepartment.password"></el-input>
				</el-form-item>
				<el-form-item label="部门电话：">
					<el-input v-model="newDepartment.phone"></el-input>
				</el-form-item>
				<el-form-item>
					<div class="btn-area">
						<el-button type="primary" @click="addDepartment">确定</el-button>
						<el-button @click="cancelAddDepartment">取消</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog :visible.sync="dialogAssignRuleDialog" :title="'为部门分配规则权限'" @close="cancelDepartmentAddRule">
			<el-form label-width="100px" label-position="right">
				<el-form-item label="选择部门：">
					<el-select v-model="departmentRule.department">
						<el-option v-for="(item,index) in departmentOption" :key="index"
						           :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="计分分类：">
					<el-select v-model="departmentRule.classify">
						<el-option v-for="(item,index) in classifyOption" :key="index"
						           :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择权限：">
					<el-checkbox-group v-model="departmentRule.ruleCheckList">
						<el-checkbox v-for="(item,index) in ruleCompute" :label="item.reason" :key="index"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<div class="btn-area">
						<el-button type="primary" @click="departmentAddRule">确定</el-button>
						<el-button @click="cancelDepartmentAddRule">取消</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import XEUtils from 'xe-utils'
export default {
  name: "RuleManage",
  data() {
    return {
      user: this.$store.state.user,
      departments: [],
      dialogDepartmentVisible: false,
      value1: '',
	    ifAddDepartment: false,
	    ifAddAffiliate1: false,
      ifAddAffiliate2: false,
	    newDepartment: {
        name: '',
		    supSupDepartment: '',
		    supDepartment: '',
		    username: '',
		    password: '',
		    phone: '',
        logo: null
	    },
      dialogAssignRuleDialog: false,
	    departmentOption: [],
	    classifyOption: [],
	    departmentRule: {
        department: '',
		    classify: '',
        ruleCheckList: []
	    },
	    rules: []
    }
  },
  methods: {
    getDepartments() {
      this.$api.getDepartments().then(res => {
	      this.departments = res.data.sort((a, b)=> a.name.localeCompare(b.name, 'zh'))
      })
    },
    mergeRowMethod ({ row, _rowIndex, column, visibleData }) {
      const fields = ['name','affiliate1']
      const cellValue = XEUtils.get(row, column.property)
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1]
        let nextRow = visibleData[_rowIndex + 1]
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    showDialogAddDepartment() {
      this.dialogDepartmentVisible = true
			this.ifAddDepartment = true
	    this.newDepartment.logo = 2
    },
    addAffiliate1() {
      this.dialogDepartmentVisible = true
      this.ifAddDepartment = true
			this.ifAddAffiliate1 = true
      this.newDepartment.logo = 3
    },
    addAffiliate2() {
      this.dialogDepartmentVisible = true
      this.ifAddDepartment = true
      this.ifAddAffiliate1 = true
			this.ifAddAffiliate2 = true
      this.newDepartment.logo = 4
    },
    cancelAddDepartment() {
      this.ifAddDepartment = false
      this.ifAddAffiliate1 = false
      this.ifAddAffiliate2 = false
      this.dialogDepartmentVisible = false
	    this.newDepartment = {
        name: '',
        affiliate1: '',
        affiliate2: '',
        username: '',
        password: '',
        phone: '',
        logo: null
      }
    },
    // 去重函数
    arrDistinctByProp(arr,prop){
      let obj = {};
      return arr.reduce(function(preValue,item){
        let _ = obj[item[prop]] ? '' : obj[item[prop]] = preValue.push(item);
        return preValue
      },[])

    },
    addDepartment() {
      this.$api.addDepartment(this.newDepartment).then(res => {
        this.$showMsg('success',res.description)
	      this.getDepartments()
	      this.cancelAddDepartment()
      })
    },
    getDepartmentOption() {
      this.$api.getDepartmentOption().then(res => {
        this.departmentOption = res.data
      })
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
	  getRule() {
      let formData = new FormData();
      formData.append("userId",this.user.id)
			this.$api.getRule(formData).then(res => {
        this.rules = res.data
			})
	  },
    departmentAddRule() {
      this.$api.departmentAddRule(this.departmentRule).then(res => {
				this.$showMsg('success',res.description)
	      this.cancelDepartmentAddRule()
      })
    },
    cancelDepartmentAddRule() {
      this.dialogAssignRuleDialog = false
	    this.departmentRule = {
        department: '',
        classify: '',
        ruleCheckList: []
      }
    },
	  getCheckRuleList(department) {
      let formData = new FormData();
      formData.append("department",department)
      this.$api.getCheckRuleList(formData).then(res => {
	      this.departmentRule.ruleCheckList = res.data ? res.data : []
      })
	  }
  },
  computed: {
    optionComputedAffiliate1() {
      return this.arrDistinctByProp(this.departments,this.ifAddAffiliate2 ? 'affiliate1':'name')
		      .map(item => {
        return {
          label: this.ifAddAffiliate2 ? item.affiliate1 : item.name,
          value: this.ifAddAffiliate2 ? item.affiliate1 : item.name
        }
      })
    },
    optionComputedAffiliate2() {
      return this.arrDistinctByProp(this.departments,'name').map(item => {
        return {
          label: item.name,
          value: item.name
        }
      })
    },
	  ruleCompute() {
      return this.rules.filter(item => item.classify===this.departmentRule.classify)
	  }
  },
	mounted() {
    this.getDepartments()
		this.getDepartmentOption()
		this.getClassify()
		this.getRule()
  },
  watch: {
    'departmentRule.department'(newValue, oldValue) {
      if (newValue) {
        this.getCheckRuleList(newValue)
      }
    }
  },
}
</script>

<style scoped lang="scss">
	.btn-area {
		text-align: right;
	}
	.pointer {
		cursor: pointer;
	}
	.form-new-department {
		.el-input {
			width: 50%;
		}
	}
</style>
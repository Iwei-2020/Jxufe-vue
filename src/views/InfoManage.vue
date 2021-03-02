<template>
	<div>
		<el-card>
			<div slot="header" class="header">
				<el-row type="flex" justify="space-between" align="middle" style="margin-bottom: 20px">
					<el-col :span="6">
						<span>教工信息管理</span>
					</el-col>
					<el-col :span="18" style="text-align: right;">
						<el-select v-if="user.logo===1" v-model="userFilter" style="margin-right: 20px;" placeholder="用户类别过滤">
							<el-option v-for="(item,index) in baseOption.userOption" :key="index"
							           :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						<el-select v-if="userFilter && user.logo===1" v-model="departmentSearch" multiple clearable
						           placeholder="部门类别过滤">
							<el-option v-for="(item,index) in baseOption.departmentOption" :key="index"
							           :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						<el-input class="search-input" v-model="infoSearch" placeholder="教工编号/教工姓名/部门名" clearable></el-input>
					</el-col>
				</el-row>
				<el-row type="flex" justify="end">
					<el-col :span="18" class="btn-area">
						<el-button v-if="user.logo===1" type="primary" @click="dialogObj.dialogTagAdministrativeTchVisible = true">标记行政人员</el-button>
						<el-button v-if="user.logo===1||user.id==='1329748820162101249'||user.id==='1329748820287930370'"
						           type="primary" @click="dialogObj.dialogImportScheduleVisible = true">导入课程表</el-button>
						<el-button v-if="user.logo===1" type="primary" @click="dialogObj.dialogExportDataVisible = true">导出数据</el-button>
						<el-button v-if="user.logo===1" type="primary" @click="dialogObj.dialogAddUserBatchVisible = true">批量添加用户</el-button>
						<el-button v-if="user.logo===1" type="primary" @click="dialogObj.dialogAddUserVisible = true">添加用户</el-button>
					</el-col>
				</el-row>
			</div>
			<el-table v-loading="loading"
			          :data="tchListCompute.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
			          border ref="myTable" @expand-change="handleExpandChange" :key="Math.random()">
				<el-table-column v-if="userFilter" type="expand">
					<template slot-scope="props">
						<el-row type="flex">
							<el-col :span="10">
								<a-chart :chartData="chartData" :show-config="false"></a-chart>
							</el-col>
							<el-col :span="12">
								<key-index :data="keyIndexData" :hover="false"></key-index>
							</el-col>
							<el-col :span="2" class="btn-area">
								<el-button type="primary" @click="showDialogSchedule(props.row.id)">课程表</el-button>
							</el-col>
						</el-row>
						<el-dialog :visible.sync="dialogObj.dialogScheduleVisible" :title="'查看课程表'" :lock-scroll="false">
							<vxe-table border resizable show-overflow :data="schedule" :highlight-hover-row="true"
							           :cell-class-name="cellClassName">
								<vxe-table-column field="no" title="节" width="60">
									<template v-slot="{ row }">
										第{{ row.no }}节
									</template>
								</vxe-table-column>
								<vxe-table-column field="monday" title="星期一"></vxe-table-column>
								<vxe-table-column field="tuesday" title="星期二"></vxe-table-column>
								<vxe-table-column field="wednesday" title="星期三"></vxe-table-column>
								<vxe-table-column field="thursday" title="星期四"></vxe-table-column>
								<vxe-table-column field="friday" title="星期五"></vxe-table-column>
							</vxe-table>
							<div class="btn-area" style="margin-top: 20px">
								<el-button @click="closeDialogSchedule" type="primary">关闭</el-button>
							</div>
						</el-dialog>
					</template>
				</el-table-column>
				<el-table-column v-if="userFilter" label="教工编号" prop="no"></el-table-column>
				<el-table-column label="教工姓名/部门名" prop="name"></el-table-column>
				<el-table-column label="用户类别" prop="userClass">
					<template slot-scope="scope">
						{{scope.row.logo > 1 ? '部门账号':'教师'}}
						{{scope.row.tagTch === 1 ? '(行政)' : ''}}
					</template>
				</el-table-column>
				<el-table-column v-if="userFilter" label="所属部门" prop="departments" width="200px"></el-table-column>
				<el-table-column v-if="userFilter" label="性别" prop="gender">
					<template slot-scope="scope">{{ scope.row.gender | genderFilter }}</template>
				</el-table-column>
				<el-table-column label="用户名" prop="username"></el-table-column>
				<el-table-column label="密码" prop="password">
					<template slot="header" slot-scope="slot">
						<span>密码 <i class="el-icon-view pointer" @click="seePassword = !seePassword"></i></span>
					</template>
					<template slot-scope="scope">
						{{seePassword ? scope.row.password : '******'}}
					</template>
				</el-table-column>
				<el-table-column label="电话" prop="phone"></el-table-column>
				<el-table-column label="操作" width="160px" v-if="user.logo===1">
					<template slot-scope="scope">
						<el-button type="text" @click="showModifyUserInfoDialog(scope.row)">修改信息</el-button>
						<el-button type="text" @click="deleteUser(scope.row.id)">删除用户</el-button>
					</template>
				</el-table-column>
			</el-table>
			<my-pagination :total="tchListCompute.length" :current-page="currentPage" :page-size="pageSize"
			               @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></my-pagination>
			<el-dialog :visible.sync="dialogObj.dialogAddUserVisible" :title="'添加用户'" @close="cancelAddNewUser">
				<el-form id="add-new-user" :model="newUser" label-position="right" label-width="100px">
					<el-form-item prop="no" label="教工编号：">
						<el-input v-model="newUser.no" clearable></el-input>
					</el-form-item>
					<el-form-item prop="name" label="真实姓名：">
						<el-input v-model="newUser.name" clearable></el-input>
					</el-form-item>
					<el-form-item prop="username" label="用户名：">
						<el-input v-model="newUser.username" clearable></el-input>
					</el-form-item>
					<el-form-item prop="password" label="密码：">
						<el-input type="password" v-model="newUser.password" clearable></el-input>
					</el-form-item>
					<el-form-item label="用户类别：">
						<span>教工账号</span>
					</el-form-item>
					<el-form-item prop="departments" label="部门：">
						<el-select v-model="newUser.departments" multiple >
							<el-option v-for="(item,index) in baseOption.departmentOption" :key="index"
							           :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="gender" label="性别：">
						<el-select v-model="newUser.gender">
							<el-option v-for="(item,index) in baseOption.genderOption" :key="index"
							           :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="phone" label="电话：">
						<el-input v-model="newUser.phone" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<div class="btn-area">
							<el-button type="primary" @click="addUser">确认</el-button>
							<el-button @click="cancelAddNewUser">取消</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-dialog>
			<el-dialog :visible.sync="dialogObj.dialogAddUserBatchVisible" :title="'批量添加用户'">
				<el-image :src="images[0]"></el-image>
				<div>
					<p class="attention">注意(格式错误将导致部分数据导入失败)</p>
					<p>1. 表头顺序任意但是不可缺</p>
					<p>2. 教工编号和用户名不能重复</p>
					<p>3. 部门必须是已有的部门</p>
				</div>
				<div class="btn-area-flex">
					<el-button @click="downloadTemplate" type="primary">下载模板</el-button>
					<el-upload action="" :before-upload="beforeUpload" :http-request="addUserBatch" :show-file-list="false">
						<el-button type="primary">文件上传(.xlsx)</el-button>
					</el-upload>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogObj.dialogModifyUserInfoVisible"
			           :title="'修改用户信息'" @close="cancelModifyUserInfo">
				<el-form :model="tempUser" label-position="right" label-width="100px">
					<el-form-item v-if="tempUser.logo===-1" prop="no" label="教工编号：">
						<el-input v-model="tempUser.no"></el-input>
					</el-form-item>
					<el-form-item prop="name" label="教工姓名：">
						<el-input v-model="tempUser.name"></el-input>
					</el-form-item>
					<el-form-item v-if="tempUser.logo===-1" prop="gender" label="性别：">
						<el-select v-model="tempUser.gender">
							<el-option v-for="(item,index) in baseOption.genderOption" :key="index"
							           :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="logo" label="用户类别：">
						<span>{{tempUser.logo > 1 ? '部门账号':'教师'}}</span>
					</el-form-item>
					<el-form-item v-if="tempUser.logo===-1" prop="departments" label="部门：">
						<span>{{tempUser.departments}}</span>
					</el-form-item>
					<el-form-item v-if="tempUser.logo===-1" label="新增部门：">
						<el-select v-model="tempUser.newDepartments" multiple>
							<el-option v-for="(item,index) in baseOption.tempDepartmentOption" :key="index"
							           :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="username" label="用户名：">
						<el-input v-model="tempUser.username"></el-input>
					</el-form-item>
					<el-form-item prop="password" label="密码：">
						<el-input v-model="tempUser.password" type="password"></el-input>
					</el-form-item>
					<el-form-item prop="phone" label="电话：">
						<el-input v-model="tempUser.phone"></el-input>
					</el-form-item>
					<el-form-item>
						<div class="btn-area">
							<el-button type="primary" @click="userModifyCommit">确定</el-button>
							<el-button @click="cancelModifyUserInfo">取消</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-dialog>
			<el-dialog :visible.sync="dialogObj.dialogImportScheduleVisible" :title="'导入课程表'">
				<el-image :src="images[1]"></el-image>
				<div>
					<p class="attention">注意(格式错误将导致全部数据导入失败)</p>
				</div>
				<div class="btn-area-flex">
					<el-button @click="downloadTemplateSchedule" type="primary">下载模板</el-button>
					<el-upload action="" :before-upload="beforeUpload" :http-request="importSchedule" :show-file-list="false">
						<el-button type="primary">文件上传(.xlsx)</el-button>
					</el-upload>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogObj.dialogTagAdministrativeTchVisible"
			           :title="'标记行政人员'" @close="cancelAdminTagTch">
				<el-form>
					<el-form-item label="选择标记为行政人员的教师：">
						<el-checkbox-group v-model="tchAdminGroup">
							<el-checkbox v-for="(item,index) in tchGroup" :label="item" :key="index"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item>
						<div class="btn-area">
							<el-button type="primary" @click="admitTagTch">确定</el-button>
							<el-button @click="cancelAdminTagTch">取消</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
import ScoreCard from "../components/ScoreCard";
import MyPagination from "../components/MyPagination";
import formatAddBatchUser from '../assets/images/formatAddBatchUser.png'
import formatImportSchedule from '../assets/images/formatImportSchedule.png'

import AChart from "../components/AChart";
import KeyIndex from "../components/KeyIndex";
export default {
  name: "InfoManage",
  components: {KeyIndex, AChart, MyPagination, ScoreCard},
  data() {
    return {
	    images: [formatAddBatchUser,formatImportSchedule],
      user: this.$store.state.user,
      tchList: [],
      schedule: [],
	    dialogObj: {
        dialogAddUserVisible: false,
        dialogAddUserBatchVisible: false,
        dialogScheduleVisible: false,
        dialogExportDataVisible: false,
        dialogModifyUserInfoVisible: false,
		    dialogImportScheduleVisible: false,
		    dialogTagAdministrativeTchVisible: false
	    },
      newUser: {
        no: '',
        name: '',
        departments: [],
        username: '',
        password: '',
        gender: null,
        phone: ''
      },
      baseOption: {
        genderOption: [
          {
            label: '男',
            value: 1
          },
          {
            label: '女',
            value: 0
          }
        ],
        roleOption: [
          {
            label: '管理员',
            value: '管理员'
          },
          {
            label: '教师',
            value: '教师'
          }
        ],
        departmentOption: [],
        userOption: [
          {
            label: '教工账号',
            value: true
          },
          {
            label: '部门账号',
            value: false
          }
        ],
	      tempDepartmentOption: []
      },
      infoSearch: '',
	    departmentSearch: [],
      currentPage: 1,
      pageSize: 10,
      chartData: {},
	    keyIndexData: [],
	    loading: true,
	    selectedDepartmentOption: {}, // 已选中部门的临时变量
      userFilter: true, // torBar的第一个select
	    tempUser: {
        id: '',
        no: '',
        name: '',
        gender: null,
        username: '',
        password: '',
        departments: '',
        phone: '',
		    logo: null,
        newDepartments: []
	    },
      seePassword: false,
	    tchGroup: [],
	    tchAdminGroup: []
    }
  },
  methods: {
    closeDialog(index) {
      this.$set(this.visibleList,index,false)
    },
    showDialog(index) {
      this.$set(this.visibleList,index,true)
    },
    addUser() {
      this.$api.addUser(this.newUser).then(res => {
        this.$showMsg('success',res.description)
        this.dialogObj.dialogAddUserVisible = false
        this.newUser = {
          no: '',
          name: '',
          departments: [],
          username: '',
          password: '',
          gender: null,
          phone: ''
        }
        this.getAllUser()
      })
    },
    addUserBatch(item) {
      let formData = new FormData();
      formData.append('file',item.file)
      this.$api.addUserBatch(formData).then(res => {
        this.$showMsg('success', res.description)
        this.dialogObj.dialogAddUserBatchVisible = false
        this.getAllUser()
      })
    },
    getDepartmentOption() {
      this.$api.getDepartmentOption().then(res => {
	      this.baseOption.departmentOption = res.data
      })
    },
    beforeUpload(file) {
      let hz = file.name.split(".")[1]
      if (hz !== 'xlsx' && hz !== 'xls') {
        this.$showMsg('error','文件格式错误')
        return false;
      }
    },
    getAllUser() {
      let formData = new FormData()
      formData.append('userId',this.user.id)
      this.$api.getAllUser(formData).then(res => {
        console.log(res.data)
        this.tchList = res.data ? res.data : []
	      this.tchGroup = res.data ? res.data.filter(item => {
	        return item.logo === -1
	      }) : []
	      this.tchGroup = this.tchGroup.map(item => {
            return item.name
	      })
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
	  chartInit(classifyList,scoreList) {
      this.chartData = {
        title: {
          text: '专项积分',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: classifyList
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: scoreList,
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
	  },
    handleExpandChange(row,expandedRow) {
	    if (expandedRow.length > 0) {
	      if (expandedRow.length > 1) {
	        this.$refs.myTable.toggleRowExpansion(expandedRow[0],false)
	      }
        this.$nextTick(() => {
          this.keyIndexData.length = 0
          this.keyIndexData.push({
            title: '平均专项积分',
            num: row.scoreSpecialAverage
          })
          this.keyIndexData.push({
            title: '年度积分',
            num: row.scoreAnnual
          })
          this.keyIndexData.push({
            title: '平均年度积分',
            num: row.scoreAnnualAverage
          })
	        let scoreList = row.mapList.map(item => {
	          return {
	            name: item.classify,
		          value: item.score
	          }
	        })
          this.chartInit(row.classifyList,scoreList)
        })
	    }
    },
    showDialogSchedule(id) {
      this.getUserSchedule(id)
      this.dialogObj.dialogScheduleVisible = true
    },
    closeDialogSchedule() {
      this.dialogObj.dialogScheduleVisible = false
    },
    cellClassName(obj) {
      if (obj.columnIndex === 0) {
        return 'bold'
      }
    },
	  getUserSchedule(id) {
      let formData = new FormData();
      formData.append("userId",id)
      this.$api.getUserSchedule(formData).then(res => {
				this.schedule = res.data ? res.data : []
        console.log(res.data)
      })
	  },
    deleteUser(id) {
      this.$confirm('确定删除改用户角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData();
        formData.append('id',id)
        this.$api.deleteUser(formData).then(res => {
          this.getAllUser()
          this.$showMsg('success',res.description)
        })
      }).catch(() => {
        this.$showMsg('info','已取消删除')
      });
    },
    showModifyUserInfoDialog(row) {
      this.dialogObj.dialogModifyUserInfoVisible = true
      if (row.logo === -1) {
        let departmentArray = row.departments.split("、")
        this.baseOption.tempDepartmentOption = this.baseOption.departmentOption.filter(item => {
          return !departmentArray.includes(item.value)
        })
      }
      let {id,no,name,gender,username,password,phone,logo,departments} = row
	    this.tempUser = {id,no,name,gender,username,password,phone,logo,departments}
    },
    cancelAddNewUser() {
      this.dialogObj.dialogAddUserVisible = false
	    this.newUser = {
        no: '',
        name: '',
        departments: [],
        username: '',
        password: '',
        gender: null,
        phone: ''
      }
    },
    downloadTemplate() {
      window.location.href='http://172.29.5.152/cdfz/excel/download/formatAddBatchUser.xlsx'
    },
    cancelModifyUserInfo() {
      this.dialogObj.dialogModifyUserInfoVisible = false
	    this.tempUser = {
        no: '',
        name: '',
        gender: null,
        username: '',
        password: '',
        departments: '',
        phone: '',
        logo: null
      }
    },
    userModifyCommit() {
			this.$api.userModify(this.tempUser).then(res => {
			  this.$showMsg('success',res.description)
				this.cancelModifyUserInfo()
				this.getAllUser()
			})
    },
    downloadTemplateSchedule() {
      window.location.href='http://172.29.5.152/cdfz/excel/download/addFormatUserSchedule.xlsx'
    },
	  importSchedule(item) {
      let formData = new FormData();
      formData.append('file',item.file)
      this.$api.importSchedule(formData).then(res => {
        this.$showMsg('success', res.description)
        this.dialogObj.dialogImportScheduleVisible = false
        this.getAllUser()
      })
	  },
    admitTagTch() {
      this.$api.admitTagTch(this.tchAdminGroup).then(res => {
        this.$showMsg('success',res.description)
	      this.cancelAdminTagTch()
      })
    },
    cancelAdminTagTch() {
      this.dialogObj.dialogTagAdministrativeTchVisible = false
      this.getAdminTch()
    },
	  getAdminTch() {
			this.$api.getAdminTch().then(res => {
			  this.tchAdminGroup = res.data ? res.data : []
			})
	  }
  },
  computed: {
    tchListCompute() {
      this.currentPage = 1
      this.pageSize = 10
      let tchList = this.tchList
      if (this.userFilter) {
        tchList = tchList.filter(item => {
          return item.logo === -1
        })
      } else {
        tchList = tchList.filter(item => {
          return item.logo > 1
        })
      }
      if (this.infoSearch || this.departmentSearch.length > 0) {
        return tchList.filter(item => {
          let tempBool;
          if (item.logo === -1) {
            let departmentArray = item.departments.split("、")
            tempBool = this.departmentSearch.every(val => departmentArray.includes(val))
          }
          return (this.infoSearch ? (item.no === this.infoSearch || item.name === this.infoSearch) : true)
		          && (this.departmentSearch.length > 0 ? tempBool : true)
        })
      }
      return tchList
    }
  },
  created() {
    this.getAllUser()
    this.getDepartmentOption()
	  this.getAdminTch()
  },
  mounted() {},
  filters: {
    genderFilter: function (gender) {
      return (gender === 1 ? '男':'女');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common.css";
	.flex-div {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.score-card {
			margin: 5px;
		}
	}
	.btn-area {
		text-align: right;
	}
	.attention {
		font-size: 14px;
		font-weight: bolder;
	}
	.btn-area-flex {
		display: flex;
		justify-content: flex-end;
		button:first-child {
			margin-right: 10px;
		}
	}
	.search-input {
		margin-left: 20px;
		width: 220px;
	}
	.schedule {
		width: 80%;
		margin: 0 auto;
	}
	#add-new-user {
		.el-input {
			width: 50%
		}
	}
	.pointer {
		cursor: pointer;
	}
</style>
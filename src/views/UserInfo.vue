<template>
  <div>
    <el-row>
      <el-card>
        <div slot="header" class="flex-div" v-if="user.logo===-1">
          <score-card class="score-card" v-for="(item,index) in scoreList" :visible="visibleList[index]"
                      :map-list="scoreList[index]" :key="index" :records="records"
                      :index="index" :color="colorList[index]" :icon="iconList[index]"
                      @closeDialog="closeDialog" @showDialog="showDialog"
                      @handleSubCurrentChange="handleSubCurrentChange" @handleSubSizeChange="handleSubSizeChange"
                      :current-page="currentPage[index]" :page-size="pageSize[index]">
          </score-card>
        </div>
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="6">
            <el-form :data="user" label-position="right" label-width="100px">
              <el-form-item label="教职工编号：" v-if="user.logo===-1">
                <span>{{user.no}}</span>
              </el-form-item>
              <el-form-item label="教工姓名：">
                <span v-if="visible[1]">{{user.name}}</span>
                <i class="el-icon-edit my-icon" v-if="visible[1]&&user.logo===1" @click="modifyPro(1)"></i>
                <el-input class="input-80" v-if="!visible[1]" v-model="nameComputed"></el-input>
                <i class="el-icon-check my-icon inline-block-icon"
                   v-if="!visible[1]" @click="confirmModify(1,'name')"></i>
              </el-form-item>
              <el-form-item label="用户名：">
                <span v-if="visible[2]">{{user.username}}</span>
                  <i class="el-icon-edit my-icon" v-if="visible[2]&&user.logo<=1" @click="modifyPro(2)"></i>
                <el-input class="input-80" v-if="!visible[2]" v-model="usernameComputed"></el-input>
                <i class="el-icon-check my-icon inline-block-icon"
                   v-if="!visible[2]" @click="confirmModify(2,'username')"></i>
              </el-form-item>
              <el-form-item label="密码：">
                <span v-if="visible[3]">******</span>
                <i class="el-icon-edit my-icon" v-if="visible[3]&&user.logo<=1" @click="modifyPro(3)"></i>
                <el-input class="input-80" v-if="!visible[3]" v-model="passwordComputed"></el-input>
                <i class="el-icon-check my-icon inline-block-icon"
                   v-if="!visible[3]" @click="confirmModify(3,'password')"></i>
              </el-form-item>
              <el-form-item label="性别：">
                <span v-if="visible[4]">{{user.gender | genderFilter}}</span>
                <i class="el-icon-edit my-icon" v-if="visible[4]&&user.logo<=1" @click="modifyPro(4)"></i>
                <el-select class="input-80" v-model="genderComputed" v-if="!visible[4]">
                  <el-option v-for="(item,index) in genderOption"
                             :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
                <i class="el-icon-check my-icon inline-block-icon" v-if="!visible[4]"
                   @click="confirmModify(4,'gender')"></i>
              </el-form-item>
              <el-form-item label="电话：">
                <span v-if="visible[5]">{{user.phone}}</span>
                <i class="el-icon-edit my-icon" v-if="visible[5]&&user.logo<=1" @click="modifyPro(5)"></i>
                <el-input class="input-80" v-if="!visible[5]" v-model="phoneComputed"></el-input>
                <i class="el-icon-check my-icon inline-block-icon" v-if="!visible[5]" @click="confirmModify(5,'phone')"></i>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="14" v-if="user.logo===-1">
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
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import ScoreCard from "../components/ScoreCard";
export default {
  name: "UserInfo",
  components: {ScoreCard},
  data() {
    return {
      user: this.$store.state.user,
      visibleList: [false,false,false,false,false,false,false,false],
      schedule: [],
      records: [],
      visible: [true,true,true,true,true,true],
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
      colorList: ['#FFA3A1','#84d9d2','#87DE75','#a5e7f0','#93b7e3','#edafda','#8c99e0','#FFA3A1'],
      iconList: ['food-pistachio','food-strawberry','food-popsicle','doughnut','bread','cookie','macaron','food-pistachio'],
      currentPage: [1,1,1,1,1,1,1,1],
      pageSize: [10,10,10,10,10,10,10,10],
      scoreList: []
    }
  },
  methods: {
    getTchRecord() {
      let formData = new FormData();
      formData.set("id",this.user.id)
      this.$api.getTchRecord(formData).then(res => {
        this.records = res.data
      })
    },
    showDialog(index) {
      this.$set(this.visibleList,index,true)
    },
    closeDialog(index) {
      this.$set(this.visibleList,index,false)
    },
    modifyPro(index) {
      this.$set(this.visible,index,false)
    },
    confirmModify(index, changePro) {
      this.$set(this.visible,index,true)
      let formData = new FormData();
      formData.set('id',this.user.id)
      formData.set('changePro',changePro)
      formData.set('proValue', this.user[changePro])
      this.$api.modifyInfo(formData).then(res => {
        this.$showMsg('success',res.description)
      })
    },
    cellClassName(obj) {
      if (obj.columnIndex === 0) {
        return 'bold'
      }
    },
    getUserSchedule() {
      let formData = new FormData();
      formData.append("userId",this.user.id)
      this.$api.getUserSchedule(formData).then(res => {
        this.schedule = res.data ? res.data : []
      })
    },
    handleSubCurrentChange(val,index) {
      this.$set(this.currentPage,index,val)
    },
    handleSubSizeChange(val,index) {
      this.$set(this.pageSize,index,val)
    },
  },
  computed: {
    noComputed: {
      get() {
        // 这里也是用了Vuex里的 modules 大家可以当成普通的变量来看
        return this.$store.state.user.no
      },
      set(proValue) {
        this.$store.commit('modifyUser', {changePro: 'no', proValue})
      }
    },
    nameComputed: {
      get() {
        // 这里也是用了Vuex里的 modules 大家可以当成普通的变量来看
        return this.$store.state.user.name
      },
      set(proValue) {
        this.$store.commit('modifyUser', {changePro: 'name', proValue})
      }
    },
    usernameComputed: {
      get() {
        // 这里也是用了Vuex里的 modules 大家可以当成普通的变量来看
        return this.$store.state.user.username
      },
      set(proValue) {
        this.$store.commit('modifyUser', {changePro: 'username', proValue})
      }
    },
    passwordComputed: {
      get() {
        // 这里也是用了Vuex里的 modules 大家可以当成普通的变量来看
        return this.$store.state.user.password
      },
      set(proValue) {
        this.$store.commit('modifyUser', {changePro: 'password', proValue})
      }
    },
    genderComputed: {
      get() {
        // 这里也是用了Vuex里的 modules 大家可以当成普通的变量来看
        return this.$store.state.user.gender
      },
      set(proValue) {
        this.$store.commit('modifyUser', {changePro: 'gender', proValue})
      }
    },
    phoneComputed: {
      get() {
        // 这里也是用了Vuex里的 modules 大家可以当成普通的变量来看
        return this.$store.state.user.phone
      },
      set(proValue) {
        this.$store.commit('modifyUser', {changePro: 'phone', proValue})
      }
    }
  },
  filters: {
    genderFilter: function (gender) {
      return gender === 1 ? '男':'女';
    }
  },
  created() {
    if (this.user.logo === -1) {
      this.scoreList = Object.assign([],this.user.mapList)
      this.scoreList.push(
          {classify: '平均专项积分',score: this.user.scoreSpecialAverage},
          {classify: '年度积分',score: this.user.scoreAnnual},
          {classify: '平均年度积分',score: this.user.scoreAnnualAverage})
      this.getUserSchedule()
    }
  },
  mounted() {
    this.getTchRecord()
  }
}
</script>

<style scoped lang="scss">
  @import "../assets/css/common.css";
  .flex-div {
    display: flex;
    justify-content: space-between;
    .score-card {
      margin: 0 5px;
    }
  }
  .my-icon {
    font-size: 20px;
    margin-left: 10px;
    cursor: pointer;
  }
  .inline-block-icon {
    display: inline-block;
  }
  .input-80 {
    width: 80%;
  }
</style>

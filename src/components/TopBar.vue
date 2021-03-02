<template>
	<div id="topBar-wrap" :class="{ topCollapsed: isCollapse }">
		<el-row type="flex" justify="space-between" align="middle">
			<el-col :span="2">
				<i class="toggle-btn el-icon-s-fold" :style="iconStyle"  @click="toggleSideBar"></i>
			</el-col>
			<el-col :span="8">
				系统学年: {{user.systemYear}}
				<el-tooltip class="item" effect="dark" content="将更新为2020-2021学年" placement="bottom">
					<el-button type="text" style="margin-left: 20px;font-weight: bolder;"
					           @click="updateSystemYear" disabled>
						学年变更
					</el-button>
				</el-tooltip>
			</el-col>
			<el-col :span="12">
				<el-row type="flex" class="row-right" justify="end" style="margin-right:-15px" align="middle">
					<el-col :span="8">
						<a class="animate__animated animate__fadeIn">
							嗨，{{user.logo > 1 ? `${user.name}管理员`:user.name }}
						</a>
					</el-col>
					<el-col :span="2">
						<el-popover placement="bottom" width="450" trigger="hover">
							<my-weather></my-weather>
							<svg-icon slot="reference" icon-class="weather"></svg-icon>
						</el-popover>
					</el-col>
					<el-col :span="2">
						<svg-icon icon-class="inform" @click="goAppealManage"></svg-icon>
					</el-col>
					<el-col :span="2">
						<lang-switcher></lang-switcher>
					</el-col>
					<el-col :span="2">
						<colors-picker style="margin-top:3px"></colors-picker>
					</el-col>
					<el-col :span="2">
						<svg-icon @click.prevent="logout" icon-class="logout"></svg-icon>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import ColorsPicker from "./ColorsPicker"
import LangSwitcher from "./LangSwitcher"
import generateRoutes from "../router/parse"
import bus from '../utils/bus'
import router from "../router"
import MyWeather from "./MyWeather";
export default {
  name: "topBar",
  data() {
    return {
      user: this.$store.state.user,
	    nextSystemYear: null
    };
  },
  components: {
    MyWeather,
    ColorsPicker,
    LangSwitcher
  },
  computed: {
    isCollapse() {
      return this.$store.state.isCollapse;
    },
    iconStyle() {
      return {
        transform: this.isCollapse ? "rotate(0deg)" : "rotate(180deg)"
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.commit("toggleSideBar");
    },
    logout() {
      let _temp = localStorage.curColor;
      localStorage.clear();
      localStorage.curColor = _temp;
      this.$store.commit('remove')
      this.$router.push("signIn");
      this.$showMsg('success','退出登录成功!')
    },
    goAppealManage() {
      this.$router.push({path: 'AppealManage'})
    },
    updateSystemYear() {
      this.$confirm('是否确定更新学年为' + this.nextSystemYear, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData();
        formData.append("nextSystemYear",this.nextSystemYear)
        this.$api.updateSystemYear(formData).then(res => {
          this.$showMsg('success',res.description)
        })
      }).catch(() => {
        this.$showMsg('info','已取消删除')
      });
    }
  },
  watch: {
    roleCompute(newValue, oldValue) {
      this.user = newValue
    }
  },
	created() {
    let year = parseInt(this.user.systemYear.substring(5,9));
    this.nextSystemYear = year + '-' + (year + 1)
  }
};
</script>
<style scoped lang="scss">
	#topBar-wrap {
		overflow: hidden;
		border-bottom: 1px solid #efefef;
		background: #fff;
		color: #353d47;
		padding: 0 15px;
		z-index: 4;
		box-sizing: border-box;
		a {
			line-height: 60px;
		}
		i {
			font-size: 20px;
			line-height: 60px;
			transition: all 0.5s;
			&:hover {
				color: #bb162b;
				cursor: pointer;
			}
		}
		.toggle-btn {
			vertical-align: middle;
			display: inline-block;
			margin-right: 20px;
		}

		.logout {
			text-decoration: none;
		}
	}
	.row-right > div {
		text-align: center;
	}
</style>

<template>
	<div class="bg" v-loading="loading">
		<div class="login-wrap animated fadeIn">
			<h3>财大附中</h3>
			<p>教工积分制管理系统</p>
			<el-form :model="loginDto" :rules="rules" label-width="0px" ref="form">
				<el-form-item prop="username">
					<el-input clearable placeholder="用户名" v-model="loginDto.username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input clearable placeholder="密码" type="password" v-model="loginDto.password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="login('form')" type="primary">登 录</el-button>
				</el-form-item>
			</el-form>
		</div>
		<vue-particles :clickEffect="true"
		               :hoverEffect="true"
		               :lineLinked="true" :lineOpacity="0.4"
		               :linesDistance="150"
		               :linesWidth="2"
		               :moveSpeed="3"
		               :particleOpacity="0.7"
		               :particleSize="5"
		               :particlesNumber="30"
		               clickMode="push"
		               color="#fff"
		               hoverMode="grab"
		               linesColor="#fff"
		               shapeType="star"></vue-particles>
	</div>
</template>
<script>
import router from "../router/index";
import generateRoutes from "../router/parse";
export default {
  name: "SignIn",
  data() {
    return {
      loginDto: {
        username: '',
        password: ''
      },
      rules: {
        username: {required: true, message: '请输入用户名', trigger: "blur"},
        password: {required: true, message: '请输入密码', trigger: "blur"}
      },
	    loading: false
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.$api.login({loginDto: this.loginDto}).then(res => {
            if (res.code === 1) {
              console.log(res.data)
              let logo = res.data.logo
              this.$store.commit('initUser', res.data)
              this.$store.commit('initToken', res.data.token)
              this.$showMsg('success', res.description)
              if (logo === -1) {
                this.getMenu("getTchMenu")
              } else if(logo === 1) {
                this.getMenu("getAdminMenu");
              } else {
                this.getMenu("getMenu");
              }
            } else {
              this.$showMsg('error', res.description)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false;
        }
      });
    },
    getMenu(url) {
      this.$api.getMenu(url).then(res => {
        // 提取菜单数组，交给本地存储
        console.log('menu:' + res);
        let menu = res.data.menu;
        // 将原始数据进行本地存储
        this.$store.commit('initMenu', menu)
        // 解析出路由配置表
        const _routes = generateRoutes(menu);
        // 动态加载路由配置表
        router.addRoutes(_routes);
        // 跳转到首页
        this.$router.push("/UserInfo");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
	.bg {
		position: relative;
		overflow: hidden;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url("../assets/img/chalk.jpg");
		background-repeat: no-repeat;
		background-size: cover;

		#particles-js {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}

	.login-wrap {
		width: 310px;
		padding: 30px;
		z-index: 3;
		margin-right: -50%;
		position: relative;
		background: rgba(100, 100, 100, 0.5);

		.el-form-item {
			margin-bottom: 25px !important;
		}

		h3 {
			text-align: center;
			color: #ebedef;
			margin-top: 0;
			margin-bottom: 5px;
			font-size: 22px;

			span {
				color: #20a0ff;
			}
		}

		p {
			text-align: center;
			color: #fff;
			margin: 0;
			letter-spacing: 1px;
		}

		form {
			margin-top: 25px;

			.el-form-item {
				margin-bottom: 15px;
			}
		}

		a {
			text-decoration: none;
			color: #1f2d3d;
		}

		button {
			width: 100%;
			font-weight: 600;
			border: none;
			border-radius: 0;
			margin-top: 20px;
			background-color: #bb162b;
		}
	}
</style>

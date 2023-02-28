<template>
  <div>
    <div class="login_contain">
      <div class="login_box">
        <!-- logo区域 -->
        <div class="avatar">
          <img src="../assets/cat.png" alt="" />
        </div>
        <!-- 登录表单区域 -->
        <el-form
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
          class="login_form"
        >
          <el-form-item label="" prop="username">
            <el-input
              v-model="loginForm.username"
              class="login_user"
              prefix-icon="iconfont icon-jurassic_user"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="iconfont icon-mima-on"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="login_type">
          <el-button type="primary" round class="login_btn" @click="login"
            >登录</el-button
          >
          <el-button type="info" round class="login_btn">注册</el-button>
        </div>
      </div>
      <!-- 底部背景图 -->
      <div class="foot_img">
        <img
          src="../assets/images/btbg.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 对象的验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login() {
      console.log(this);
      this.$refs.loginFormRef.validate( async valid=> {
        if(!valid) return;
        const{data:res}=await this.$http.post("login",this.loginForm);
        console.log(res)
        if(res.meta.status!==200)return console.log("登录失败");
        console.log("登录成功")
        // 获取token
        window.sessionStorage.setItem("token",res.data.token);
        this.$router.push("/home")
      })

    },
  },
};
</script>

<style lang="less" scoped>
.login_contain {
  height: 100%;
  width: 100%;
  background: url(../assets/images/bg.jpg);
  margin: 0;
  padding: 0;
  // background-size: 100% 100%;
    position: fixed;
}
.login_box {
  position: relative;
  width: 450px;
  height: 300px;
  transform: translate(-50%, -50%);
  top: 40%;
  left: 50%;
  background-color: #ace1ff;
  border-radius: 10%;
}
.avatar {
  text-align: center;
}
.avatar img {
  width: 100px;
  height: 100px;
  margin-top: -40px;
}
.login_form {
  margin-top: 20px;
  padding: 0 40px;
}
.login_user {
  margin-bottom: 10px;
}
.login_type {
  margin-top: 32px;
  text-align: center;
}
.login_btn {
  margin-right: 20px;
}
.foot_img {
  position: absolute;
  width: 800px;
  height: 300px;
  transform: translateX(-50%);
  left: 50%;
  bottom: 0;
}
.foot_img img {
  width: 100%;
  height: 100%;
}
</style>

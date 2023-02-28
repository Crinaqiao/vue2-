<template>
  <el-container class="container_home">
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img src="../assets/cat.png" alt="">
        <span>宠物买埋系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <div class="collapse" @click="collapse">| | |</div>
        <el-menu :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true"
          :default-active="activePath" class="el-menu-vertical-demo" background-color="#8cc5ff" text-color="#fff"
          active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconlist[item.id]"></i>
              <!-- 文字 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"
              @click="savaNevStatus('/' + subitem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文字 -->
                <span>{{ subitem.authName }}</span>

              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: {},
      iconlist: {
        '125': 'iconfont icon-quanxianguanli',
        '103': 'iconfont icon-shangpinguanli',
        '101': 'iconfont icon-dingdanguanli',
        '102': 'iconfont icon-shujutongji',
        '145': 'iconfont icon-a-icon-person-nan2'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenulist(),
      this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenulist() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error()
      this.menulist = res.data
    },
    // 控制折叠
    collapse() {
      this.isCollapse = !this.isCollapse
    }
    ,
    //点击二级菜单 保存的激活状态
    savaNevStatus(activePath) {
      window.sessionStorage.setItem('activePath', activePath),
        this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.container_home {
  height: 100%;
  width: 100%;
  // position: fixed;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #66b1ff;
  color: #fff;
  font-size: 20px;

  >div {
    display: flex;
    align-items: center;
  }

}

.el-aside {
  background-color: #8cc5ff;

  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #d9ecff;
}

.logo img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.iconfont {
  margin-right: 10px;
}

.collapse {
  color: #fff;
  text-align: center;
  padding: 5px;
  background-color: #7cbbff;
  cursor: pointer; //鼠标变小手

}

.el-aside,
.el-main {
  overflow: auto;
}
</style>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  min-width: 1366px;
}

.el-breadcrumb {
  margin-bottom: 15px;
}

// 改变面包屑颜色，级层逐渐降低
// .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link,.el-breadcrumb__inner,.el-breadcrumb__item:last-child .el-breadcrumb__inner{
//   color: #fff !important;

// }
.el-row {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}

.el-steps {
  margin: 15px 0;
}

.el-step__title {
  font-size: 13px !important;
}

.el-step__head.is-success,
.el-step__title.is-success{
  color: #66b1ff !important;
  border-color: #66b1ff !important;}

  .ql-editor {
  height: 300px !important;
}

</style>

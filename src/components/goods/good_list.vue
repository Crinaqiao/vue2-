<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 -->
      <el-col style="margin-bottom: 15px">
        <el-input placeholder="请输入内容" v-model="goodsList.query" style="margin-top: 15px;width:450px;" clearable @clear="getGoodList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="primary" style="margin-left:10px" @click="goToAdd">添加按钮</el-button>
      </el-col>
      <!-- 表单区域 -->
      <el-table :data="goodsListTableData.goods" :border="true" style="width: 100%"  height="450">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除操作 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="goodsList.pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="goodsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="goodsListTableData.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表
      goodsListTableData: [],
      goodsList: {
        query: '',
        // 当前页码
        pagenum: 1,
        //当页条数
        pagesize: 6
      },
      // 搜索输入框内容
      inputSreach: ''
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    // 获取表格
    async getGoodList() {
      const { data: res } = await this.$http.get('goods', { params: this.goodsList })
      console.log(res)
      if (res.meta.status == !200)
        return this.$message.error('获取失败！')
      this.goodsListTableData = res.data
    },
    // 删除操作
    async deleteGoods(id) {
      // console.log(id)
      const confirmStr = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmStr)
      if (confirmStr === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        this.$message.success('删除成功')
        this.getGoodList()
      }
    },
    // 每页多少条
    handleSizeChange(newSize) {
      this.goodsList.pagesize = newSize
      this.getGoodList()
    },
    //当前第几页
    handleCurrentChange(newPage) {
      this.goodsList.pagenum = newPage
      this.getGoodList()
    },
    // 点击添加按钮跳转页面
    goToAdd(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>

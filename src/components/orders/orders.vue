<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <!-- 搜索框 -->
    <el-col style="margin-bottom: 15px">
      <el-input placeholder="请输入内容" style="margin-top: 15px;width:450px;" clearable v-model="ordersForm.query"
        @clear="getOrder">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </el-col>
    <!-- 表单区域 -->
    <el-table :data="orderTable" :border="true" style="width: 100%">
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="order_number" label="订单编号">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格">
      </el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status==0" type="danger">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货">
      </el-table-column>
      <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">
          {{scope.row.create_time|formaDate}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="showAdressDialog"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页功能 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="ordersForm.pagenum" :page-sizes="[2, 4, 6, 12]" :page-size="ordersForm.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 编辑弹窗功能 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item label="省市区/景" prop="adress" label-width="100px">
          <el-cascader v-model="orderTable" :options="cityData" :props="{ expandTrigger: 'hover' }" style="width:100%">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail_adress" label-width="100px">
          <el-input v-model="editForm.detail_adress"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流弹窗 -->
    <el-dialog title="物流进度" :visible.sync="AdressDialog" width="30%">
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 表单存放数据
      orderTable: [],
      ordersForm: {
        query:'',
        pagenum: 1,
        pagesize: 6
      },
      total: 0,
      // 修改地址的显示与隐藏
      editDialogVisible: false,
      // 表单数据双向绑定
      editForm: {
        detail_adress: '',
        adress: '',

      },
      // 表单信息验证
      editFormRules: {
        detail_adress: [{
          required: true, message: '请填写详细信息', trigger: 'blur'
        }],
        adress: [{
          required: true, message: '请填选择地址', trigger: 'blur'
        }]
      },
      // 修改地址的数据源
      cityData,
      AdressDialog: false,
      //时间线上true是正序，false倒序
      reverse: false,
      // 时间线信息
      activities: [{
        "time": "2018-05-10 09:39:00",
        "ftime": "2018-05-10 09:39:00",
        "context": "已签收,感谢使用顺丰,期待再次为您服务",
        "location": ""
      },
      {
        "time": "2018-05-10 08:23:00",
        "ftime": "2018-05-10 08:23:00",
        "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
        "location": ""
      },
      {
        "time": "2018-05-10 07:32:00",
        "ftime": "2018-05-10 07:32:00",
        "context": "快件到达 [北京海淀育新小区营业点]",
        "location": ""
      },
      {
        "time": "2018-05-10 02:03:00",
        "ftime": "2018-05-10 02:03:00",
        "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
        "location": ""
      },
      {
        "time": "2018-05-09 23:05:00",
        "ftime": "2018-05-09 23:05:00",
        "context": "快件到达 [北京顺义集散中心]",
        "location": ""
      },
      {
        "time": "2018-05-09 21:21:00",
        "ftime": "2018-05-09 21:21:00",
        "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
        "location": ""
      },
      {
        "time": "2018-05-09 13:07:00",
        "ftime": "2018-05-09 13:07:00",
        "context": "顺丰速运 已收取快件",
        "location": ""
      },
      {
        "time": "2018-05-09 12:25:03",
        "ftime": "2018-05-09 12:25:03",
        "context": "卖家发货",
        "location": ""
      },
      {
        "time": "2018-05-09 12:22:24",
        "ftime": "2018-05-09 12:22:24",
        "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
        "location": ""
      },
      {
        "time": "2018-05-08 21:36:04",
        "ftime": "2018-05-08 21:36:04",
        "context": "商品已经下单",
        "location": ""
      }]
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    //获取商品列表
    async getOrder() {
      const { data: res } = await this.$http.get('orders', { params: this.ordersForm })
      this.orderTable = res.data.goods
      this.total = res.data.total
      // console.log(this.total)
      if (res.meta.status !== 200) { return this.$message.error('获取失败！') }
      console.log(this.ordersForm)
    },
    // 监听分页页面条数的函数
    handleSizeChange(newSize) {
      this.ordersForm.pagesize = newSize
      this.getOrder()

    },
    //监听当页
    handleCurrentChange(newPage) {
      this.ordersForm.pagenum = newPage
      this.getOrder()
    },
    // 点击修改地址触发函数
    showEditDialog() {
      this.editDialogVisible = true
    },
    // 点击物流地址触发函数
    async showAdressDialog() {
      this.AdressDialog = true
    },
    // 搜索功能
    search(){
      console.log('1')
      this.getOrder()
    }
  }
}
</script>
<style lang="less" scoped>

</style>

<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAdddialog">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 卡片区域 -->
    <!-- <el-table :data="goodsCateData" stripe :border="true" style="width: 100%">
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="cat_name" label="分类名称">
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
      </el-table-column>
      <el-table-column prop="cat_level" label="排序">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cat_level=='0'">
            一级
          </el-tag>
          <el-tag v-else>

          </el-tag>

        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.cat_id)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table> -->
    <!-- 用依赖的配件-卡片区域 -->
    <tree-table :data="goodsCateData" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true"
      index-text="#" :border="true">
      <!-- 是否有效 -->
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:greenyellow;"></i>
        <i class="el-icon-error" v-else style="color:red;"></i>
      </template>
      <!-- 排序 -->
      <template slot="sort" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level=='0'">
          一级
        </el-tag>
        <el-tag v-else-if="scope.row.cat_level=='1'" type="success">
          二级
        </el-tag>
        <el-tag v-else-if="scope.row.cat_level=='2'" type="danger">
          三级
        </el-tag>
      </template>
      <!-- 操作 -->
      <template slot-scope="scope" slot="opt">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row)">删除
        </el-button>
      </template>

    </tree-table>
    <!-- 分页功能 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="this.goodsCateList.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="this.goodsCateList.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 添加功能 -->
    <el-dialog title="添加商品分类" :visible.sync="addGoodsdialogVisible" width="30%" @close="addCateClose">
      <el-form ref="addGoodsFormRef" :model="addGoodsForm" label-width="80px" :rules="addGoodsFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addGoodsForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- option 是指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader  v-model="SelectedOption" :options="parentList" :props="cascaderProps"
            @change="handleChange">
          </el-cascader>
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="addGoodsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


export default {

  data() {
    return {
      goodsCateData: [],
      goodsCateList: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 表单列数
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 定义当前列为模板列
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        // 定义当前列为模板列
        type: 'template',
        template: 'sort',
      }, {
        label: '操作',
        // 定义当前列为模板列
        type: 'template',
        template: 'opt'
      }

      ],
      //添加弹窗
      addGoodsdialogVisible: false,
      //添加功能的表单数据
      addGoodsForm: {
        cat_name: '',
        cat_pid: '',
        cat_level: ''
      },
      //验证
      addGoodsFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 指定数据源
      parentList: [],
      //指定配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 选中的数值id分类数组
      SelectedOption: []
    };
  },

  created() {
    this.getGoodsCate()
  },

  methods: {
    // 获取商品列表信息
    async getGoodsCate() {
      const { data: res } = await this.$http.get('categories', { params: this.goodsCateList })
      if (res.meta.status !== 200) return this.$message.error('获取失败信息！')
      this.goodsCateData = res.data.result
      this.total = res.data.total
      console.log(res)
    },
    // 删除列表信息
    async deleteGoods(idInfo) {
      const confirmStr = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmStr)
      if (confirmStr === 'confirm') {
        const { data: res } = await this.$http.delete('categories/' + idInfo.cat_id)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        this.$message.success('删除成功！')
        this.getGoodsCate()
      }
    },
    // 分页功能
    handleSizeChange(newsize) {
      this.goodsCateList.pagesize = newsize
      this.getGoodsCate()

    },
    handleCurrentChange(newpage) {
      this.goodsCateList.pagenum = newpage
      this.getGoodsCate()

    },
    // 点击添加按钮
    showAdddialog() {
      this.addGoodsdialogVisible = true
      this.getfather()
    },
    // 获取父级
    async getfather() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res)
      this.parentList = res.data
    },
    // 监听选择项的改变
    handleChange() {
      // console.log(this.SelectedOption)
      // 选择父级
      if (this.SelectedOption.length > 0) {
        this.addGoodsForm.cat_pid = this.SelectedOption[this.SelectedOption.length - 1]
        //为当前的分类登记赋值
        this.addGoodsForm.cat_level = this.SelectedOption.length
      }
      //未选择父级
      else {
        this.addGoodsForm.cat_pid = 0
        this.addGoodsForm.cat_level = 0
      }
    },
    // 点击确定按钮，发起添加请求
    addCate() {
      console.log(this.addGoodsForm)
      this.$refs.addGoodsFormRef.validate( async valid => {
        if (!valid) return
        const{data:res}=await this.$http.post('categories',this.addGoodsForm)
        if(res.meta.status!==201)return this.$message.error('添加失败！')
        this.$message.success('添加成功！')
        this.getGoodsCate()
        this.addGoodsdialogVisible = false
      })
    },
    // 监听弹窗关闭事件
    addCateClose() {
      this.$refs.addGoodsFormRef.resetFields()
      this.SelectedOption = []
      this.addGoodsForm.cat_level = 0
      this.addGoodsForm.cat_pid = 0
    }
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

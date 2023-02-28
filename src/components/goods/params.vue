<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert title="注意只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>
      <!-- 选择项 -->
      <el-row>
        <el-col class="selectCard">
          <span class="selectCardSpan">选择商品分类</span>
          <!-- 选择商品分类的级联 -->
          <!-- props用来指定配置对象 -->
          <el-cascader v-model="seclectData" :options="cateList" :props="cascaderProps" @change="handleChange"
            clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数列表 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisplay" class="addBtn" @click="addList">添加参数
          </el-button>
          <!-- 表格区域 -->
          <el-table :data="manyList" :border="true" stripe>
            <!-- 展开项 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-tag :key="i" v-for=" (item,i) in scope.row.attr_vals" closable @close="closeTag(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- id数字项 -->
            <el-table-column label="#" type="index"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <!-- 删除和编辑操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row.attr_id)">
                </el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteMesBox(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数列表 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnDisplay" type="primary" size="mini" @click="addList">
            添加属性
          </el-button>
          <!-- 表格区域 -->
          <el-table :data="onlyList" :border="true" stripe>
            <!-- 展开项 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-tag :key="i" v-for=" (item,i) in scope.row.attr_vals" closable @close="closeTag(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- id数字项 -->
            <el-table-column label="#" type="index"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <!-- 删除和编辑操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <!-- 修改操作 -->
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row.attr_id)">
                </el-button>
                <!-- 删除操作 -->
                <el-button @click="deleteMesBox(scope.row)" type="danger" size="mini" icon="el-icon-delete"></el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数弹出框 -->
    <el-dialog :title="'添加'+titleChange" :visible.sync="AddDialogVisible" width="30%" @close="closeAddForm">
      <!-- form表单区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item :label="titleChange" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendAddInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog :title="'修改'+titleChange" :visible.sync="editDialogVisible" width="30%" @close="closeeditForm">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleChange" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 数据源
      cateList: [],
      //指定配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择器双向绑定的数据
      seclectData: '',
      // 标签页双向绑定的数据
      activeName: 'many',
      // 动态参数列表
      manyList: [],
      // 静态参数列表
      onlyList: [],
      // 添加弹窗的显示或隐藏
      AddDialogVisible: false,
      // 添加参数表单的内容
      addFormRef: '',
      // 双向绑定的数据
      addForm: {
        attr_name: '',
        attr_vals: ''
      },
      // 参数验证
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 修改参数
      editDialogVisible: false,
      // 修改参数表单
      editForm: {
        attr_name: '',
        attr_id: ''
      },
      // 修改参数验证表
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取选项信息
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取信息失败')
      this.cateList = res.data
    },
    // 监听选项的改变
    async handleChange(seclectData) {
      this.getParamsList()

    },
    // 标签页被点击后触发的函数
    async handleClick() {
      console.log(this.activeName)
      this.getParamsList()
    },
    // 获取参数列表
    async getParamsList() {
      if (this.seclectData.length !== 3) {
        this.seclectData = []
        this.manyList = []
        this.onlyList = []
        return
      }


      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      // 分割attr_vals的数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        // 展开层的文本框内容
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyList = res.data
        console.log(this.manyList)
      }
      else {
        this.onlyList = res.data
        console.log(this.onlyList)

      }

    },
    // 点击添加按钮触发的事件
    addList() {
      this.AddDialogVisible = true
    },
    // 点击添加弹窗的确定按钮,发送请求
    sendAddInfo() {
      this.$refs.addFormRef.validate(async valid => {
        //当都填入数据 valid为true
        if (!valid) return;
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.AddDialogVisible = false
        this.getParamsList()
      })
    },
    // 监听对话框关闭
    closeAddForm() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击修改按钮触发事件
    async editClick(attr_id) {
      console.log(attr_id)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.editForm = res.data
      this.editDialogVisible = true

    },
    // 点击修改弹出框的确定按钮
    editSure() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改失败！')
        this.$message.success('修改成功！')
        this.getParamsList()
        this.editDialogVisible = false
      })


    },
    // 删除参数事件
    async deleteMesBox(mesg) {
      const confirmStr = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmStr)
      if (confirmStr === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${mesg.cat_id}}/attributes/${mesg.attr_id}`)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功！')
        this.getParamsList()
      }
    },
    // 监听修改弹出框的关闭
    closeeditForm() {
      this.$refs.editFormRef.resetFields()
    },
    //输入框，键盘离开和失去焦点
    async handleInputConfirm(mesg) {
      if (mesg.inputValue.trim().length === 0) {
        mesg.inputValue = ''
        mesg.inputVisible = false
        return
      } mesg.attr_vals.push(mesg.inputValue.trim())
      mesg.inputValue = ''
      mesg.inputVisible = false

      // 如果没有return,则证明输入的内容。需要做后续处理。
      this.saveMsql(mesg)
    },
    // 标签操作保存到数据库中
    async saveMsql(mesg) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${mesg.attr_id}`, { attr_name: mesg.attr_name, attr_sel: mesg.attr_sel, attr_vals: mesg.attr_vals.join(' ') })
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error('操作失败')
      this.$message.success('操作成功')

    },
    // 点击标签触发事件,展开输入框
    showInput(row) {
      row.inputVisible = true
      // 输入框自动获取焦点
      //$nextTick方法作用是。当页面元素重新渲染之后。执行回调函数的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除标签页的操作
    closeTag(i, mesg) {
      mesg.attr_vals.splice(i, 1)
      this.saveMsql(mesg)
    }
  },
  computed: {
    // 若按钮被禁用则返回true,否则返回false
    isBtnDisplay() {
      if (this.seclectData.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.seclectData.length === 3) {
        return this.seclectData[2]
      }
    },
    titleChange() {
      if (this.activeName === 'many')
        return '动态参数'
      else {
        return '静态属性'
      }
    }
  }

}

</script>
<style lang="less" scoped>
.selectCard {
  margin: 10px;
}

.selectCardSpan {
  margin-right: 10px;
}

.addBtn {
  margin-bottom: 10px;
}

.el-tag {
  margin: 5px 10px;
}

.input-new-tag {
  width: 150px;
}
</style>

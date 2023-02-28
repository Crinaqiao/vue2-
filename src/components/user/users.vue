<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-tabs type="border-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="querryinfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户表单区域 -->
      <el-table stripe :data="userlist" :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRole(scope.row)"></el-button>
            </el-tooltip>
          </template>

        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="querryinfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="querryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加用户弹窗 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" :modal="false" @close="closeDialog">
        <!-- 主体信息 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addForm.username" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <span slot="footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="hideForm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹窗 -->
      <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%" :modal="false">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialog">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色弹窗 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @close="closeSetRoleDialogVisible">
        <p><span>用户名称：</span>{{userRoleInfo.username}}</p>
        <p><span>用户角色：</span>{{userRoleInfo.role_name}}</p>
        <!-- 选择项 -->
        <el-select v-model="selectedRole" placeholder="请选择">
          <el-option v-for="item in roleTypeList" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click=" submitSetRole">确 定</el-button>
        </span>
      </el-dialog>

    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义验证规则 邮箱 手机
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^(0|86|17951)?(13[0-9]|15(012356789)|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      querryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加对话框的显示与隐藏
      dialogVisible: false,
      // 添加用户的信息
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 添加用户信息的验证规则
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 10, message: '请输入6~10个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, { validator: checkPhone, trigger: 'blur' }]
      },
      // 修改用户的隐藏与显示
      editDialogVisible: false,
      // 修改用户的信息
      editForm: {},
      //修改用户信息的验证规则
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }], mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, { validator: checkPhone, trigger: 'blur' }]

      },
      // 分配角色弹窗的显示与隐藏
      setRoleDialogVisible: false,
      // 分配角色获取当前节点的信息
      userRoleInfo: {},
      // 角色类型
      roleTypeList: [],
      selectedRole: ''
    }
  },
  created() {
    this.getuserlist()
  },
  methods: {
    // 获取用户信息列表
    async getuserlist() {
      const { data: res } = await this.$http.get('/users', { params: this.querryinfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      // console.log(this.$message)
      // console.log(res.data.users)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听页面数目
    handleSizeChange(newsize) {
      // console.log(newsize)
      this.querryinfo.pagesize = newsize
      this.getuserlist()
    },
    // 监听页面改变
    handleCurrentChange(newpage) {
      this.querryinfo.pagenum = newpage
      this.getuserlist()
    },
    async changeStatus(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新状态失败！')
      }
      // this.$message.success('更新状态成功')
    },
    // 控制添加信息的隐藏与显示
    // 表单预验证
    hideForm() {
      // this.dialogVisible = false
      this.$refs.addFormRef.validate(async vaild => {
        // console.log(vaild)
        if (!vaild) return
        // 发起真正的请求
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        // this.$message.error('添加用户失败')
        // return this.$message.success('添加用户成功')
        // this.dialogVisible = false

      })

    },
    // 监听添加用户信息的关闭，然后清空
    closeDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户信息
    async showEditDialog(id) {
      this.editDialogVisible = true
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      this.editForm = res.data
      // console.log(this.editForm)
    },
    // 修改用户信息的预验证
    editDialog() {
      this.$refs.editFormRef.validate(async vaild => {
        // console.log(vaild)
        if (!vaild) return console.log('修改失败')
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        console.log(res)
        if (res.meta.status !== 200) { return this.$message.error('修改失败') }
        this.editDialogVisible = false
        return this.$message.success('修改成功')
      })
    },
    //删除信息提示
    async deleteUser(id) {
      const confirmStr = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消返回的是cancel
      //确定返回的是confirm
      // console.log(confirmStr)

      if (confirmStr !== 'confirm') { return this.$message.info('已取消删除！') }
      // return
      const { data: res } = await this.$http.delete('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功')
      this.getuserlist()
    },
    // 点击分配角色
    async showSetRole(userRoleInfo) {
      this.userRoleInfo = userRoleInfo
      // 获取角色信息roleTypeList
      const { data: res } = await this.$http.get('roles')
      this.roleTypeList = res.data
      console.log(this.roleTypeList)
      console.log(userRoleInfo)
      this.setRoleDialogVisible = true
    },
    // 点击分配角色确定触发事件
    async submitSetRole() {
      if (!this.selectedRole) return this.$message.error('请选择角色')
      const { data: res } = await this.$http.put(`users/${this.userRoleInfo.id}/role`, { rid: this.selectedRole })
      if (res.meta.status !== 200) return this.$message.error('更新角色失败！')
      this.$message.success('更新角色成功')
      this.getuserlist()
      // console.log(res)
       this. setRoleDialogVisible = false
    },
    // 监听弹窗关闭事件
    closeSetRoleDialogVisible(){
      this.selectedRole=''
    }
  }
}
</script>

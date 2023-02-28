<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 卡片区域 -->
    <el-table :data="rolesList" :border="true" style="width: 100%" stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- <pre>
            {{scope.row}}
          </pre> -->
          <!-- 一行24列 -->
          <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children"
            :key="item1.id">
            <!-- 一级，占5列 -->
            <el-col :span="5" class="mleft">
              <el-tag closable @close="deleteTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级和三级 占剩余的19列-->
            <el-col :span="19">
              <el-row v-for="(item2,i2) in item1.children" :key="item2.id">
                <!-- 二级 -->
                <el-col :span="6" :class="[i2===0?'':'bdtop','vcenter']">
                  <el-tag type="warning" closable @close="deleteTag(scope.row,item2.id)">{{item2.authName}}</el-tag> <i
                    class="el-icon-caret-right"></i>

                </el-col>
                <!-- 三级 -->
                <el-col :span="18">
                  <el-row v-for="(item3,i3) in item2.children" :key="item3.id" :class="i3===0?'':'bdtop'">
                    <el-col>
                      <el-tag type="success" closable @close="deleteTag(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag> <i class="el-icon-caret-right"></i>

                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRow(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-star-off" size="mini" @click="getAssignForm(scope.row)">分配权限</el-button>

        </template>
      </el-table-column>

    </el-table>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
      <el-tree :data="rightList" :props="AssignRoles" show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" ref="rightListRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加信息 -->
    <el-dialog title="添加角色信息" :visible.sync="addDialogVisible" width="30%" modal @close="refFormData">
      <el-form :model="addRolesForm" ref="addRolesFormRefs" label-width="100px" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>

    </el-dialog>
    <!-- 编辑信息 -->
    <el-dialog title="编辑角色信息" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  // name: 'VueShopCrinaRoles',

  data() {
    return {
      // 获取角色列表对象
      rolesList: [],
      // 是否显示添加信息
      addDialogVisible: false,
      // 添加用户信息表
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 验证添加表单信息
      addFormRules: { roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] },
      // 控制编辑信息弹框的显示与隐藏
      editDialogVisible: false,
      // 编辑表单信息
      editForm: {},
      // 验证编辑表单信息
      editFormrules: { roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] },
      // 分配权限的显示与yinc
      dialogVisible: false,
      //分配权限数据绑定
      rightList: {},
      // 分配权限属性绑定
      AssignRoles: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中数组
      defKeys:[],
      // 第一项的id
      rolesId:''
    };
  },

  created() {
    this.getRolesLists()
  },

  methods: {
    // 获取列表信息
    async getRolesLists() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    // 获取添加接口
    async submitAddForm() {
      const { data: res } = await this.$http.post('roles', { roleName: this.addRolesForm.roleName, roleDesc: this.addRolesForm.roleDesc })
      console.log(res)

      if (res.meta.status !== 201) return this.$message.error('添加失败')
      this.getRolesLists()
      this.addDialogVisible = false
    },
    //重置添加表单数据
    refFormData() {
      this.$refs.addRolesFormRefs.resetFields()
    },
    // 根据id查询信息并赋给编辑表单
    async showEditForm(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      this.editForm = res.data
      console.log(res)
      console.log(this.editForm)

      // console.log(res)
    },
    // 提交编辑信息
    async submitEditForm() {
      const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
      if (res.meta.status !== 200) return this.$message.error('编辑失败！')
      this.$message.success('编辑成功！')
      this.getRolesLists()
      this.editDialogVisible = false
    },
    // 删除角色信息
    async deleteRow(id) {
      const confirmStr = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmStr == 'confirm') {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功！')
        this.getRolesLists()
      }
    },
    // 删除展开项
    async deleteTag(roles, rightId) {
      const confirmStr = await this.$confirm('此操作将永久删除该角色标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmStr === 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('取消权限失败！')
        this.$message.success('取消权限成功！')
        roles.children = res.data
        console.log(res)
      }
    },
    // 获取分配名单
    async getAssignForm(roles) {
      this.rolesId=roles.id
      console.log(roles)
      const { data: res } = await this.$http.get('rights/tree')
      this.rightList = res.data
      // 调用递归函数
      this.getLeafKeys(roles,this.defKeys)
      console.log(this.defKeys)
      this.dialogVisible = true
    },
    // 递归函数查找三级标签
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys)
    },
    //更新角色权限
    async updateRight(){
      // 将选中和半选中的拼接到一起
      const key=[
        ...this.$refs.rightListRef.getCheckedKeys(),
        ...this.$refs.rightListRef.getHalfCheckedKeys()
      ]
      const keyId=key.join(',')
      console.log(key)
      console.log(keyId)
      const {data:res}=await this.$http.post(`roles/${this.rolesId}/rights`,{rids:keyId})
      if(res.meta.status!==200){return this.$message.error('分配权限失败')}
      this.$message.success('分配权限成功!')
      this.dialogVisible = false
      this.getRolesLists()
      console.log(res)
    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin-top: 10px;
}

.bdtop {
  border-top: 1px solid #ccc;
}

.bdbottom {
  border-bottom: 1px solid #ccc;
}

.el-icon-caret-right {
  margin-left: 15px;
}

.vcenter {
  display: flex;
  align-items: center;
}

.mleft {
  margin-left: 50px;
}
</style>

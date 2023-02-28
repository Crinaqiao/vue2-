<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示语句 -->
      <el-alert title="添加商品信息" type="info" :closable="false" show-icon center>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单不能放在tabs里面 -->
      <!-- 左侧标签页 -->
      <el-form :model="goodsForm" :rules="goodsFormRules" ref="goodsFormRef" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="goodsForm.goods_cat" :options="cateList" :props="cateListProp"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item,i) in manyList" :key="i" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item2" v-for="(item2,j) in item.attr_vals" :key="j" :border="true" size="mini">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyList" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>

            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-demo" :action="uploadAction" :on-preview="handlePreview" :on-remove="handleRemove"
              :on-success="handleSuccess" :headers="headerObj" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>

            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodsForm. goods_introduce"></quill-editor>
            <el-button type="primary" size="small" class="Addbtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewFile" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      // 当前步骤
      activeIndex: '0',
      // 表单数据
      goodsForm: {
        goods_name: '',
        goods_price: '0',
        goods_weight: '0',
        goods_number: '0',
        // 商品分类
        goods_cat: [],
        // 图片数组
        pics: [],
        goods_introduce: '',
        attrs: []

      },
      // 表单验证
      goodsFormRules: {
        goods_name: [{
          required: true, message: '请输入商品名称', trigger: 'blur'
        }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{
          required: true, message: '请输入商品重量', trigger: 'blur'
        }],
        goods_number: [{
          required: true, message: '请输入商品重量', trigger: 'blur'
        }],
        goods_cat: [{
          required: true, message: '请输入商品重量', trigger: 'blur'
        }]
      },
      // 选项列表的数据源
      cateList: [],
      // 当前选中的数据
      cateListProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //存放参数的表单
      manyList: [{
      }],
      // 存放属性的表单
      onlyList: [{
      }],
      // 路径存放参数
      uploadAction: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的路径
      previewFile: '',
      previewVisible: false,


    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败！')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 监听选中项改变触发的项目
    handleChange() {
      if (this.goodsForm.goods_cat.length !== 3) {
        return this.goodsForm.goods_cat = []
      }
    },
    //判断是否切换分页
    beforeLeave(activeName, oldActiveName) {
      // console.log(oldActiveName)
      // console.log(activeName)
      if (oldActiveName === '0' && this.goodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择分类！')
        return false
      }
    },
    // 点击标签页触发函数
    async tabClick() {
      // 参数页
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        res.data.forEach(item => { item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ') })
        this.manyList = res.data
      }
      //属性页
      else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取失败！')
        this.onlyList = res.data
        console.log(this.onlyList)
      }
    },
    // 图片预览
    handlePreview(file) {
      this.previewFile = file.response.data.url
      console.log(this.previewFile)
      this.previewVisible = true

    },
    // 图片移除
    handleRemove(file) {
      console.log(file)
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pic数组中，找到对应的索引值
      const i = this.goodsForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用数组的splice方法，把信息对象，从pic数组中移除
      this.goodsForm.pics.splice(i, 1)
    },
    // 监听成功上传图片事件
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.goodsForm.pics.push(picInfo)
      console.log(this.goodsForm)

    },
    add() {
      this.$refs.goodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请完善必填项')
        }   // 添加执行
        const form = _.cloneDeep(this.goodsForm)
        form.goods_cat = form.goods_cat.join(',')
        //处理动态属性
        this.manyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.goodsForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.goodsForm.attrs.push(newInfo)
        })
        form.attrs = this.goodsForm.attrs
        //发起请求添加商品，商品的名称是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if(res.meta.status!==201){return this.$message.error('添加失败，请检查你添加的信息！')}
        this.$message.success('添加成功！')
        //页面跳转
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.goodsForm.goods_cat.length === 3) {
        //0,1,2 2是第三项的数字
        console.log(this.goodsForm.goods_cat[2])
        return this.goodsForm.goods_cat[2]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Addbtn {
  margin-top: 10px;
}
</style>

<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- //2.渲染 -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//1.引入
// import echarts from 'echarts'
import * as echarts from 'echarts'
// 深拷贝合并数据
import _ from 'lodash'
export default {
  data() {
    return {
      // 合并到图表的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 3,基于准备好的dom,初始化echart实例
    var myChart = echarts.init(document.getElementById('main'));
    // 获取图表数据
    const { data: res } = await this.$http.get(`reports/type/1`)
    console.log(res)
    if (res.meta.status !== 200) return this.$message.error('获取失败!')
    // 合并数据
    const result =_.merge(res.data,this.options)
    // 4.指定图表的配置项和数据
    var option =result

    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
}
</script>
<style lang="less" scoped>

</style>

<template>
  <div class="dashboard">
    <el-row :gutter="24">
      <el-col :span="6" v-for="stat in stats" :key="stat.key">
        <el-card class="stat-card">
          <div class="stat-icon" :style="{ background: stat.iconBg }">
            <el-icon :size="32">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div v-if="stat.growth" class="stat-growth" :class="stat.growth > 0 ? 'positive' : 'negative'">
              <el-icon><TrendCharts /></el-icon>
              {{ Math.abs(stat.growth) }}%
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="12">
        <el-card class="chart-card" body-style="padding: 20px">
          <div class="chart-header">用户增长趋势</div>
          <div class="chart-container">
            <div ref="userChartRef" style="width: 100%; height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" body-style="padding: 20px">
          <div class="chart-header">销售趋势</div>
          <div class="chart-container">
            <div ref="salesChartRef" style="width: 100%; height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="8">
        <el-card class="chart-card" body-style="padding: 20px">
          <div class="chart-header">会员等级分布</div>
          <div class="chart-container">
            <div ref="levelChartRef" style="width: 100%; height: 250px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card" body-style="padding: 20px">
          <div class="chart-header">课程分类统计</div>
          <div class="chart-container">
            <div ref="categoryChartRef" style="width: 100%; height: 250px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card" body-style="padding: 20px">
          <div class="chart-header">支付方式统计</div>
          <div class="chart-container">
            <div ref="paymentChartRef" style="width: 100%; height: 250px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { mockDataService } from '@/api/mock'

const stats = ref([
  { key: 'totalUsers', label: '总用户数', value: '12,580', icon: 'UserFilled', iconBg: '#f0f9eb' },
  { key: 'totalCourses', label: '总课程数', value: '256', icon: 'Document', iconBg: '#e6f7ff' },
  { key: 'totalActivities', label: '总活动数', value: '48', icon: 'CalendarFilled', iconBg: '#fff7e6' },
  { key: 'totalOrders', label: '总订单数', value: '8,956', icon: 'PriceTag', iconBg: '#fff1f0' },
  { key: 'totalIncome', label: '总收入', value: '¥1,258,000', icon: 'Coin', iconBg: '#f6ffed' },
  { key: 'totalVips', label: 'VIP会员数', value: '2,580', icon: 'VipCard', iconBg: '#f0f5ff' },
  { key: 'totalDistributors', label: '分销商数', value: '368', icon: 'Share', iconBg: '#fff0f6' },
  { key: 'todayNewUsers', label: '今日新增用户', value: '125', icon: 'UserFilled', iconBg: '#e6f4ff' }
])

const userChartRef = ref<HTMLElement>()
const salesChartRef = ref<HTMLElement>()
const levelChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()
const paymentChartRef = ref<HTMLElement>()

let userChart: echarts.ECharts
let salesChart: echarts.ECharts
let levelChart: echarts.ECharts
let categoryChart: echarts.ECharts
let paymentChart: echarts.ECharts

function initUserChart() {
  if (!userChartRef.value) return

  userChart = echarts.init(userChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '活跃用户']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330]
      },
      {
        name: '活跃用户',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310, 282, 291, 334, 390, 430]
      }
    ]
  }
  userChart.setOption(option)
}

function initSalesChart() {
  if (!salesChartRef.value) return

  salesChart = echarts.init(salesChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}元'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120000, 132000, 101000, 134000, 90000, 230000, 210000, 182000, 191000, 234000, 290000, 330000],
        type: 'bar',
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }
  salesChart.setOption(option)
}

function initLevelChart() {
  if (!levelChartRef.value) return

  levelChart = echarts.init(levelChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '会员等级',
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        data: [
          { value: 1048, name: '普通用户' },
          { value: 735, name: '付费用户' },
          { value: 580, name: 'VIP会员' },
          { value: 95, name: '分销商' }
        ]
      }
    ]
  }
  levelChart.setOption(option)
}

function initCategoryChart() {
  if (!categoryChartRef.value) return

  categoryChart = echarts.init(categoryChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '课程分类',
        type: 'pie',
        radius: ['40%', '70%'],
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        data: [
          { value: 335, name: '专业课' },
          { value: 310, name: '家长必修' },
          { value: 234, name: '精品专题' },
          { value: 135, name: 'VIP专区' }
        ]
      }
    ]
  }
  categoryChart.setOption(option)
}

function initPaymentChart() {
  if (!paymentChartRef.value) return

  paymentChart = echarts.init(paymentChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '支付方式',
        type: 'pie',
        radius: '60%',
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        data: [
          { value: 735, name: '微信支付' },
          { value: 274, name: '支付宝' }
        ]
      }
    ]
  }
  paymentChart.setOption(option)
}

function resizeCharts() {
  if (userChart) userChart.resize()
  if (salesChart) salesChart.resize()
  if (levelChart) levelChart.resize()
  if (categoryChart) categoryChart.resize()
  if (paymentChart) paymentChart.resize()
}

onMounted(async () => {
  const data = await mockDataService.getStatistics()
  stats.value[0].value = data.totalUsers.toLocaleString()
  stats.value[3].value = data.totalOrders.toLocaleString()
  stats.value[4].value = `¥${data.totalIncome.toLocaleString()}`
  stats.value[5].value = data.totalVips.toLocaleString()
  stats.value[6].value = data.totalDistributors.toLocaleString()
  stats.value[7].value = data.todayNewUsers.toLocaleString()

  initUserChart()
  initSalesChart()
  initLevelChart()
  initCategoryChart()
  initPaymentChart()

  window.addEventListener('resize', resizeCharts)
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;

      .el-icon {
        color: #fff;
      }
    }

    .stat-content {
      flex: 1;

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #999;
      }

      .stat-growth {
        font-size: 12px;
        margin-top: 4px;

        &.positive {
          color: #67c23a;
        }

        &.negative {
          color: #f56c6c;
        }
      }
    }
  }

  .chart-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .chart-header {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .chart-container {
      width: 100%;
      height: 300px;
    }
  }
}
</style>
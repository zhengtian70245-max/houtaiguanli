<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户统计</h2>
    </div>
    <div class="page-content">
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
            <div class="chart-header">用户等级分布</div>
            <div class="chart-container">
              <div ref="levelChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const stats = ref([
  { key: 'totalUsers', label: '总用户数', value: '12,580', icon: 'UserFilled', iconBg: '#f0f9eb' },
  { key: 'todayNewUsers', label: '今日新增用户', value: '125', icon: 'Plus', iconBg: '#e6f7ff' },
  { key: 'weekGrowth', label: '周增长', value: '1,258', icon: 'TrendCharts', iconBg: '#fff7e6' },
  { key: 'monthGrowth', label: '月增长', value: '5,896', icon: 'Calendar', iconBg: '#f6ffed' },
  { key: 'vipUsers', label: 'VIP用户数', value: '2,580', icon: 'VipCard', iconBg: '#f0f5ff' },
  { key: 'distributors', label: '分销商数', value: '368', icon: 'Share', iconBg: '#fff0f6' },
  { key: 'activeUsers', label: '活跃用户数', value: '8,580', icon: 'User', iconBg: '#e6f4ff' },
  { key: 'growthRate', label: '增长率', value: '12.5%', icon: 'TrendCharts', iconBg: '#f6ffed' }
])

const userChartRef = ref<HTMLElement>()
const levelChartRef = ref<HTMLElement>()

let userChart: echarts.ECharts
let levelChart: echarts.ECharts

function initUserChart() {
  if (!userChartRef.value) return

  userChart = echarts.init(userChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
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
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }
  userChart.setOption(option)
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
        name: '等级',
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          formatter: '{b}: {d}%'
        },
        data: [
          { value: 1048, name: '普通用户', itemStyle: { color: '#909399' } },
          { value: 735, name: '付费用户', itemStyle: { color: '#409eff' } },
          { value: 580, name: 'VIP会员', itemStyle: { color: '#e6a23c' } },
          { value: 95, name: '分销商', itemStyle: { color: '#f56c6c' } }
        ]
      }
    ]
  }
  levelChart.setOption(option)
}

function resizeCharts() {
  if (userChart) userChart.resize()
  if (levelChart) levelChart.resize()
}

onMounted(() => {
  initUserChart()
  initLevelChart()

  window.addEventListener('resize', resizeCharts)
})
</script>

<style scoped lang="scss">
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
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
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
}
</style>
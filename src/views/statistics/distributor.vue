<template>
  <div class="page-container">
    <div class="page-header">
      <h2>分销统计</h2>
    </div>
    <div class="page-content">
      <a-row :gutter="[24, 24]">
        <a-col :span="6" v-for="stat in stats" :key="stat.key">
          <a-card class="stat-card">
            <div class="stat-icon" :style="{ background: stat.iconBg }">
              <component :is="stat.icon" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[24, 24]" style="margin-top: 24px;">
        <a-col :span="12">
          <a-card class="chart-card" :body-style="{ padding: '20px' }">
            <div class="chart-header">分销商发展趋势</div>
            <div class="chart-container">
              <div ref="distributorChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card class="chart-card" :body-style="{ padding: '20px' }">
            <div class="chart-header">佣金发放分布</div>
            <div class="chart-container">
              <div ref="commissionChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import {
  IconUser,
  IconPlus,
  IconCalendar,
  IconDollarCircle,
  IconBarChart
} from '@arco-design/web-vue/es/icon'

const stats = ref([
  { key: 'totalDistributors', label: '总分销商数', value: '368', icon: IconUser, iconBg: '#f0f9eb' },
  { key: 'todayNewDistributors', label: '今日新增分销商', value: '12', icon: IconPlus, iconBg: '#e6f7ff' },
  { key: 'weekDistributors', label: '周分销商', value: '156', icon: IconCalendar, iconBg: '#fff7e6' },
  { key: 'monthDistributors', label: '月分销商', value: '543', icon: IconCalendar, iconBg: '#f6ffed' },
  { key: 'totalCommissions', label: '总佣金发放', value: '¥1,258,000', icon: IconDollarCircle, iconBg: '#f5f0f8' },
  { key: 'todayCommissions', label: '今日佣金', value: '¥12,580', icon: IconBarChart, iconBg: '#fff0f6' },
  { key: 'weekCommissions', label: '周佣金发放', value: '¥85,690', icon: IconCalendar, iconBg: '#f6ffed' },
  { key: 'monthCommissions', label: '月佣金发放', value: '¥1,258,000', icon: IconBarChart, iconBg: '#fff7e6' }
])

const distributorChartRef = ref<HTMLElement>()
const commissionChartRef = ref<HTMLElement>()

let distributorChart: echarts.ECharts
let commissionChart: echarts.ECharts

function initDistributorChart() {
  if (!distributorChartRef.value) return

  distributorChart = echarts.init(distributorChartRef.value)
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
        name: '新增分销商',
        type: 'line',
        data: [20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 110],
        itemStyle: {
          color: '#f56c6c'
        }
      }
    ]
  }
  distributorChart.setOption(option)
}

function initCommissionChart() {
  if (!commissionChartRef.value) return

  commissionChart = echarts.init(commissionChartRef.value)
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
        name: '佣金发放',
        type: 'bar',
        data: [12000, 13200, 10100, 13400, 9000, 23000, 21000, 18200, 19100, 23400, 29000, 33000],
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }
  commissionChart.setOption(option)
}

function resizeCharts() {
  if (distributorChart) distributorChart.resize()
  if (commissionChart) commissionChart.resize()
}

onMounted(() => {
  initDistributorChart()
  initCommissionChart()

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

    :deep(.arco-icon) {
      font-size: 32px;
      color: #409eff;
    }
  }

  .stat-content {
    flex: 1;

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--arco-text-color-1);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: var(--arco-text-color-3);
    }
  }
}

.chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .chart-header {
    font-size: 16px;
    font-weight: 600;
    color: var(--arco-text-color-1);
    margin-bottom: 16px;
  }
}
</style>
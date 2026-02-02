<template>
  <div class="page-container">
    <div class="page-header">
      <h2>VIP统计</h2>
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
            <div class="chart-header">VIP发展趋势</div>
            <div class="chart-container">
              <div ref="vipChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card class="chart-card" :body-style="{ padding: '20px' }">
            <div class="chart-header">VIP等级分布</div>
            <div class="chart-container">
              <div ref="levelChartRef" style="width: 100%; height: 300px;"></div>
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
  { key: 'totalVipUsers', label: '总VIP用户数', value: '2,580', icon: IconUser, iconBg: '#f0f9eb' },
  { key: 'todayNewVip', label: '今日新增VIP', value: '25', icon: IconPlus, iconBg: '#e6f7ff' },
  { key: 'weekNewVip', label: '周新增VIP', value: '156', icon: IconCalendar, iconBg: '#fff7e6' },
  { key: 'monthNewVip', label: '月新增VIP', value: '543', icon: IconCalendar, iconBg: '#f6ffed' },
  { key: 'totalVipIncome', label: '总VIP收入', value: '¥1,258,000', icon: IconDollarCircle, iconBg: '#f5f0f8' },
  { key: 'todayVipIncome', label: '今日VIP收入', value: '¥25,880', icon: IconBarChart, iconBg: '#fff0f6' },
  { key: 'weekVipIncome', label: '周VIP收入', value: '¥125,800', icon: IconCalendar, iconBg: '#f6ffed' },
  { key: 'monthVipIncome', label: '月VIP收入', value: '¥543,210', icon: IconBarChart, iconBg: '#fff7e6' }
])

const vipChartRef = ref<HTMLElement>()
const levelChartRef = ref<HTMLElement>()

let vipChart: echarts.ECharts
let levelChart: echarts.ECharts

function initVipChart() {
  if (!vipChartRef.value) return

  vipChart = echarts.init(vipChartRef.value)
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
        name: '新增VIP',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        itemStyle: {
          color: '#e6a23c'
        }
      }
    ]
  }
  vipChart.setOption(option)
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
          { value: 580, name: 'VIP会员', itemStyle: { color: '#e6a23c' } },
          { value: 95, name: '分销商', itemStyle: { color: '#f56c6c' } },
          { value: 735, name: '付费用户', itemStyle: { color: '#409eff' } },
          { value: 1048, name: '普通用户', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  levelChart.setOption(option)
}

function resizeCharts() {
  if (vipChart) vipChart.resize()
  if (levelChart) levelChart.resize()
}

onMounted(() => {
  initVipChart()
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
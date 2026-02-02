<template>
  <div class="page-container">
    <div class="page-header">
      <h2>订单统计</h2>
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
            <div class="chart-header">订单发展趋势</div>
            <div class="chart-container">
              <div ref="orderChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card class="chart-card" :body-style="{ padding: '20px' }">
            <div class="chart-header">支付方式分布</div>
            <div class="chart-container">
              <div ref="paymentChartRef" style="width: 100%; height: 300px;"></div>
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
  IconTags,
  IconCalendar,
  IconDollarCircle,
  IconBarChart
} from '@arco-design/web-vue/es/icon'

const stats = ref([
  { key: 'totalOrders', label: '总订单数', value: '2,456', icon: IconTags, iconBg: '#f0f9eb' },
  { key: 'todayOrders', label: '今日订单', value: '85', icon: IconCalendar, iconBg: '#e6f7ff' },
  { key: 'weekOrders', label: '周订单', value: '526', icon: IconCalendar, iconBg: '#f0f9eb' },
  { key: 'monthOrders', label: '月订单', value: '1,856', icon: IconCalendar, iconBg: '#e6f7ff' },
  { key: 'totalAmount', label: '总销售额', value: '¥536,800', icon: IconDollarCircle, iconBg: '#f5f0f8' },
  { key: 'todayAmount', label: '今日销售额', value: '¥18,560', icon: IconBarChart, iconBg: '#f5f0f8' },
  { key: 'weekAmount', label: '周销售额', value: '¥116,800', icon: IconCalendar, iconBg: '#f0f9eb' },
  { key: 'monthAmount', label: '月销售额', value: '¥536,800', icon: IconBarChart, iconBg: '#e6f7ff' }
])

const orderChartRef = ref<HTMLElement>()
const paymentChartRef = ref<HTMLElement>()

let orderChart: echarts.ECharts
let paymentChart: echarts.ECharts

function initOrderChart() {
  if (!orderChartRef.value) return

  orderChart = echarts.init(orderChartRef.value)
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
        name: '订单数',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        itemStyle: {
          color: '#409eff'
        }
      },
      {
        name: '销售额',
        type: 'bar',
        data: [12000, 13200, 10100, 13400, 9000, 23000, 21000, 18200, 19100, 23400, 29000, 33000],
        itemStyle: {
          color: '#f56c6c'
        }
      }
    ]
  }
  orderChart.setOption(option)
}

function initPaymentChart() {
  if (!paymentChartRef.value) return

  paymentChart = echarts.init(paymentChartRef.value)
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
        name: '支付方式',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 100, name: '微信支付', itemStyle: { color: '#67c23a' } },
          { value: 50, name: '支付宝', itemStyle: { color: '#f56c6c' } },
          { value: 10, name: '银行卡', itemStyle: { color: '#409eff' } },
          { value: 5, name: '其他', itemStyle: { color: '#909399' } }
        ],
        label: {
          formatter: '{b}: {d}%'
        }
      }
    ]
  }
  paymentChart.setOption(option)
}

function resizeCharts() {
  if (orderChart) orderChart.resize()
  if (paymentChart) paymentChart.resize()
}

onMounted(() => {
  initOrderChart()
  initPaymentChart()

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
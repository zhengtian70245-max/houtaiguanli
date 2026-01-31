<template>
  <div class="page-container">
    <div class="page-header">
      <h2>销售统计</h2>
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
                { Math.abs(stat.growth) }%
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <el-col :span="12">
          <el-card class="chart-card" body-style="padding: 20px">
            <div class="chart-header">销售额趋势</div>
            <div class="chart-container">
              <div ref="salesChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card" body-style="padding: 20px">
            <div class="chart-header">支付方式分布</div>
            <div class="chart-container">
              <div ref="paymentChartRef" style="width: 100%; height: 300px;"></div>
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
  { key: 'totalOrders', label: '总订单数', value: '8,956', icon: 'List', iconBg: '#f0f9eb' },
  { key: 'totalIncome', label: '总收入', value: '¥1,258,000', icon: 'Coin', iconBg: '#f0f5ff' },
  { key: 'todayOrders', label: '今日订单', value: '89', icon: 'Plus', iconBg: '#e6f7ff' },
  { key: 'todayIncome', label: '今日收入', value: '¥12,580', icon: 'TrendCharts', iconBg: '#fff7e6' },
  { key: 'weekOrders', label: '周订单', value: '2,586', icon: 'Calendar', iconBg: '#f6ffed' },
  { key: 'weekIncome', label: '周收入', value: '¥1,896,000', icon: 'CalendarFilled', iconBg: '#f5f0f8' },
  { key: 'monthOrders', label: '月订单', value: '5,896', icon: 'Calendar', iconBg: '#fff7e6' },
  { key: 'monthIncome', label: '月收入', value: '¥1,258,000', icon: 'TrendCharts', iconBg: '#f6ffed' }
])

const salesChartRef = ref<HTMLElement>()
const paymentChartRef = ref<HTMLElement>()

let salesChart: echarts.ECharts
let paymentChart: echarts.ECharts

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
        name: '销售额',
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
          {
            value: 735,
            name: '微信支付',
            itemStyle: {
              color: '#07c160'
            }
          },
          {
            value: 274,
            name: '支付宝',
            itemStyle: {
              color: '#1677ff'
            }
          }
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
  if (salesChart) salesChart.resize()
  if (paymentChart) paymentChart.resize()
}

onMounted(() => {
  initSalesChart()
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
<template>
  <div class="page-container">
    <div class="page-header">
      <h2>活动统计</h2>
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
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <el-col :span="12">
          <el-card class="chart-card" body-style="padding: 20px">
            <div class="chart-header">活动发展趋势</div>
            <div class="chart-container">
              <div ref="activityChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card" body-style="padding: 20px">
            <div class="chart-header">活动类型分布</div>
            <div class="chart-container">
              <div ref="typeChartRef" style="width: 100%; height: 300px;"></div>
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
  { key: 'totalActivities', label: '总活动数', value: '128', icon: 'Calendar', iconBg: '#f0f9eb' },
  { key: 'todayNewActivities', label: '今日新增活动', value: '2', icon: 'Plus', iconBg: '#e6f7ff' },
  { key: 'weekActivities', label: '周活动', value: '56', icon: 'Calendar', iconBg: '#fff7e6' },
  { key: 'monthActivities', label: '月活动', value: '128', icon: 'CalendarFilled', iconBg: '#f6ffed' },
  { key: 'totalRegistrations', label: '总报名数', value: '5,680', icon: 'Tickets', iconBg: '#f5f0f8' },
  { key: 'todayRegistrations', label: '今日报名', value: '128', icon: 'Plus', iconBg: '#fff0f6' },
  { key: 'weekRegistrations', label: '周报名', value: '2,580', icon: 'Calendar', iconBg: '#f6ffed' },
  { key: 'monthRegistrations', label: '月报名', value: '5,680', icon: 'TrendCharts', iconBg: '#f0f5ff' }
])

const activityChartRef = ref<HTMLElement>()
const typeChartRef = ref<HTMLElement>()

let activityChart: echarts.ECharts
let typeChart: echarts.ECharts

function initActivityChart() {
  if (!activityChartRef.value) return

  activityChart = echarts.init(activityChartRef.value)
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
        name: '新增活动',
        type: 'line',
        data: [12, 13, 10, 13, 9, 23, 21, 18, 19, 23, 29, 33],
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }
  activityChart.setOption(option)
}

function initTypeChart() {
  if (!typeChartRef.value) return

  typeChart = echarts.init(typeChartRef.value)
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
        name: '活动类型',
        type: 'pie',
        radius: '50%',
        data: [
          {
            value: 48,
            name: '读书会',
            itemStyle: {
              color: '#67c23a'
            }
          },
          {
            value: 32,
            name: '研修班',
            itemStyle: {
              color: '#409eff'
            }
          },
          {
            value: 24,
            name: '训练营',
            itemStyle: {
              color: '#e6a23c'
            }
          },
          {
            value: 24,
            name: '其他活动',
            itemStyle: {
              color: '#909399'
            }
          }
        ],
        label: {
          formatter: '{b}: {d}%'
        }
      }
    ]
  }
  typeChart.setOption(option)
}

function resizeCharts() {
  if (activityChart) activityChart.resize()
  if (typeChart) typeChart.resize()
}

onMounted(() => {
  initActivityChart()
  initTypeChart()

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
<template>
  <div class="page-container">
    <div class="page-header">
      <h2>课程统计</h2>
    </div>
    <div class="page-content">
      <a-row :gutter="24">
        <a-col :span="6" v-for="stat in stats" :key="stat.key">
          <a-card class="stat-card">
            <div class="stat-icon" :style="{ background: stat.iconBg }">
              <a-icon :icon="stat.icon" :size="32" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="24" style="margin-top: 24px;">
        <a-col :span="12">
          <a-card class="chart-card" body-style="padding: 20px">
            <div class="chart-header">课程学习趋势</div>
            <div class="chart-container">
              <div ref="courseChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card class="chart-card" body-style="padding: 20px">
            <div class="chart-header">课程分类分布</div>
            <div class="chart-container">
              <div ref="categoryChartRef" style="width: 100%; height: 300px;"></div>
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
import { IconDocument, IconReading, IconCalendar, IconCalendarFilled, IconView, IconTrendCharts } from '@arco-design/web-vue/es/icon'

const stats = ref([
  { key: 'totalCourses', label: '总课程数', value: '458', icon: IconDocument, iconBg: '#f0f9eb' },
  { key: 'todayLearning', label: '今日学习人数', value: '1,258', icon: IconReading, iconBg: '#e6f7ff' },
  { key: 'weekLearning', label: '周学习人数', value: '2,568', icon: IconCalendar, iconBg: '#fff7e6' },
  { key: 'monthLearning', label: '月学习人数', value: '8,586', icon: IconCalendarFilled, iconBg: '#f6ffed' },
  { key: 'totalViews', label: '总浏览量', value: '58,696', icon: IconView, iconBg: '#f5f0f8' },
  { key: 'todayViews', label: '今日浏览量', value: '1,568', icon: IconTrendCharts, iconBg: '#fff0f6' },
  { key: 'weekViews', label: '周浏览量', value: '8,568', icon: IconCalendar, iconBg: '#f6ffed' },
  { key: 'monthViews', label: '月浏览量', value: '35,689', icon: IconTrendCharts, iconBg: '#f0f5ff' }
])

const courseChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()

let courseChart: echarts.ECharts
let categoryChart: echarts.ECharts

function initCourseChart() {
  if (!courseChartRef.value) return

  courseChart = echarts.init(courseChartRef.value)
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
        name: '学习人数',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        itemStyle: {
          color: '#67c23a'
        }
      }
    ]
  }
  courseChart.setOption(option)
}

function initCategoryChart() {
  if (!categoryChartRef.value) return

  categoryChart = echarts.init(categoryChartRef.value)
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
        name: '分类',
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
          { value: 182, name: '专业课', itemStyle: { color: '#67c23a' } },
          { value: 124, name: '家长必修', itemStyle: { color: '#409eff' } },
          { value: 82, name: '精品专题', itemStyle: { color: '#e6a23c' } },
          { value: 70, name: 'VIP专区', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  categoryChart.setOption(option)
}

function resizeCharts() {
  if (courseChart) courseChart.resize()
  if (categoryChart) categoryChart.resize()
}

onMounted(() => {
  initCourseChart()
  initCategoryChart()

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
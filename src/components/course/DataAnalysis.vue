<template>
  <div class="data-analysis">
    <!-- 数据概览 -->
    <div class="data-overview">
      <el-card shadow="hover" class="overview-card">
        <template #header>
          <div class="card-header">
            <span>学习数据</span>
          </div>
        </template>
        <div class="overview-stats">
          <div class="stat-item">
            <div class="stat-value">{{ course.stats?.learningData?.viewCount || 0 }}</div>
            <div class="stat-label">浏览量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ course.stats?.learningData?.userCount || 0 }}</div>
            <div class="stat-label">学习人数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ course.stats?.learningData?.payCount || 0 }}</div>
            <div class="stat-label">购买人数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ (course.stats?.learningData?.conversionRate || 0).toFixed(2) }}%</div>
            <div class="stat-label">转化率</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="overview-card">
        <template #header>
          <div class="card-header">
            <span>销售数据</span>
          </div>
        </template>
        <div class="overview-stats">
          <div class="stat-item">
            <div class="stat-value">¥{{ course.stats?.learningData?.payAmount || 0 }}</div>
            <div class="stat-label">支付金额</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ course.stats?.learningData?.orderCount || 0 }}</div>
            <div class="stat-label">订单量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ course.stats?.distributionData?.commission || 0 }}</div>
            <div class="stat-label">推广佣金</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ course.stats?.distributionData?.actualIncome || 0 }}</div>
            <div class="stat-label">实际收入</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 数据选项卡 -->
    <el-tabs v-model="activeDataTab" class="data-tabs">
      <el-tab-pane label="学习数据" name="learning">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>学习数据趋势</span>
              <el-select v-model="dateRange" class="date-select">
                <el-option label="近7天" :value="7" />
                <el-option label="近30天" :value="30" />
                <el-option label="近90天" :value="90" />
                <el-option label="近180天" :value="180" />
                <el-option label="近365天" :value="365" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <el-chart :option="learningChartOption" />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="流量数据" name="traffic">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>流量数据趋势</span>
              <el-select v-model="dateRange" class="date-select">
                <el-option label="近7天" :value="7" />
                <el-option label="近30天" :value="30" />
                <el-option label="近90天" :value="90" />
                <el-option label="近180天" :value="180" />
                <el-option label="近365天" :value="365" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <el-chart :option="trafficChartOption" />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="分销数据" name="distribution">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>分销数据趋势</span>
              <el-select v-model="dateRange" class="date-select">
                <el-option label="近7天" :value="7" />
                <el-option label="近30天" :value="30" />
                <el-option label="近90天" :value="90" />
                <el-option label="近180天" :value="180" />
                <el-option label="近365天" :value="365" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <el-chart :option="distributionChartOption" />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="转化分析" name="conversion">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>转化漏斗</span>
            </div>
          </template>
          <div class="chart-container">
            <el-chart :option="conversionChartOption" />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="用户分析" name="user">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户画像</span>
            </div>
          </template>
          <div class="user-analysis">
            <div class="analysis-section">
              <h3>用户类型分布</h3>
              <div class="chart-container small">
                <el-chart :option="userTypeChartOption" />
              </div>
            </div>
            <div class="analysis-section">
              <h3>会员等级分布</h3>
              <div class="chart-container small">
                <el-chart :option="vipLevelChartOption" />
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const props = defineProps<{
  course: any
}>()

// 状态管理
const activeDataTab = ref('learning')
const dateRange = ref(30)

// 学习数据图表配置
const learningChartOption = computed(() => {
  const data = props.course.stats?.learningData?.chartData || []
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['浏览量', '学习人数', '购买人数']
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
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '浏览量',
        type: 'line',
        data: data.map(item => item.value * 5),
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '学习人数',
        type: 'line',
        data: data.map(item => item.value * 2),
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        name: '购买人数',
        type: 'line',
        data: data.map(item => item.value),
        smooth: true,
        itemStyle: {
          color: '#fa8c16'
        }
      }
    ]
  }
})

// 流量数据图表配置
const trafficChartOption = computed(() => {
  const data = props.course.stats?.trafficData?.chartData || []
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['流量数据']
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
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '流量数据',
        type: 'line',
        data: data.map(item => item.value),
        smooth: true,
        itemStyle: {
          color: '#722ed1'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(114, 46, 209, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(114, 46, 209, 0.1)'
            }
          ])
        }
      }
    ]
  }
})

// 分销数据图表配置
const distributionChartOption = computed(() => {
  const data = props.course.stats?.distributionData?.chartData || []
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['订单量', '推广佣金', '实际收入']
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
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '订单量',
        type: 'line',
        data: data.map(item => item.value),
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '推广佣金',
        type: 'line',
        data: data.map(item => item.value * 20),
        smooth: true,
        itemStyle: {
          color: '#fa8c16'
        }
      },
      {
        name: '实际收入',
        type: 'line',
        data: data.map(item => item.value * 80),
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        }
      }
    ]
  }
})

// 转化漏斗图表配置
const conversionChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '转化漏斗',
        type: 'funnel',
        left: '10%',
        width: '80%',
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 1000, name: '浏览' },
          { value: 600, name: '点击' },
          { value: 300, name: '咨询' },
          { value: 150, name: '意向' },
          { value: 80, name: '购买' }
        ]
      }
    ]
  }
})

// 用户类型分布图表配置
const userTypeChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '用户类型',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 60, name: '购买用户' },
          { value: 30, name: '会员用户' },
          { value: 10, name: '试用用户' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})

// 会员等级分布图表配置
const vipLevelChartOption = computed(() => {
  return {
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
        radius: '50%',
        data: [
          { value: 40, name: '普通用户' },
          { value: 25, name: '付费学员' },
          { value: 15, name: '终身学员' },
          { value: 10, name: '架构学套餐学员' },
          { value: 8, name: '全家福套餐学员' },
          { value: 2, name: '自动自发家族成员' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})

// 初始化
onMounted(() => {
  // 检查是否有ECharts
  if (typeof window.echarts === 'undefined') {
    ElMessage.warning('ECharts 未加载，图表可能无法显示')
  }
})
</script>

<style scoped lang="scss">
.data-analysis {
  .data-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .overview-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .overview-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 16px;

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #1890ff;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  .data-tabs {
    margin-top: 24px;

    .el-tabs__header {
      margin-bottom: 24px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .date-select {
        width: 120px;
      }
    }
  }

  .chart-container {
    height: 400px;
    margin-top: 16px;

    &.small {
      height: 300px;
    }
  }

  .user-analysis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;

    .analysis-section {
      h3 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
        color: #303133;
      }
    }
  }
}

@media (max-width: 768px) {
  .data-analysis {
    .data-overview {
      grid-template-columns: 1fr;
    }

    .overview-card {
      .overview-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .user-analysis {
      grid-template-columns: 1fr;
    }
  }
}
</style>
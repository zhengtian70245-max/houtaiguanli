<template>
  <div class="page-container">
    <!-- 顶部信息区 -->
    <div class="detail-header">
      <div class="detail-basic-info">
        <div class="detail-icon">
          <a-icon :name="iconName" size="48" />
        </div>
        <div class="detail-info">
          <h1 class="detail-title">{{ title }}</h1>
          <div class="detail-meta">
            <a-tag color="blue">{{ typeName }}</a-tag>
            <span class="detail-id">ID：{{ id }}</span>
          </div>
          <div class="detail-stats">
            <span class="stat-item">
              <a-icon name="eye" />
              {{ Math.floor(Math.random() * 1000) }} 浏览
            </span>
            <span class="stat-item">
              <a-icon name="shopping-cart" />
              {{ Math.floor(Math.random() * 100) }} 购买
            </span>
            <span class="stat-item">
              <a-icon name="user" />
              {{ Math.floor(Math.random() * 50) }} 用户
            </span>
          </div>
        </div>
      </div>
      <div class="detail-actions">
        <a-button type="primary" @click="handleEdit">
          <template #icon>
            <a-icon name="edit" />
          </template>
          编辑信息
        </a-button>
        <a-button type="default" @click="handleBack">
          <template #icon>
            <a-icon name="arrow-left" />
          </template>
          返回列表
        </a-button>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="detail-content">
      <a-tabs v-model="activeTab" class="detail-tabs">
        <a-tab-pane key="basic" title="基本信息">
          <div class="tab-content">
            <a-card title="详细信息">
              <a-descriptions :column="2">
                <a-descriptions-item label="创建时间">{{ formatDate() }}</a-descriptions-item>
                <a-descriptions-item label="更新时间">{{ formatDate() }}</a-descriptions-item>
                <a-descriptions-item label="状态">{{ statusName }}</a-descriptions-item>
                <a-descriptions-item label="类型">{{ typeName }}</a-descriptions-item>
                <a-descriptions-item label="描述">
                  <p>这是一个通用的详情页面，用于展示各种类型的项目信息。</p>
                  <p>当前查看的是 {{ title }} 的详细信息。</p>
                </a-descriptions-item>
                <a-descriptions-item label="备注">
                  <p>该页面为通用概念页面，适用于所有列表的详情查看。</p>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </div>
        </a-tab-pane>
        <a-tab-pane key="data" title="数据统计">
          <div class="tab-content">
            <a-card title="统计数据">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ Math.floor(Math.random() * 10000) }}</div>
                  <div class="stat-label">总浏览量</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ Math.floor(Math.random() * 1000) }}</div>
                  <div class="stat-label">总购买量</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ Math.floor(Math.random() * 100) }}</div>
                  <div class="stat-label">转化率</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ Math.floor(Math.random() * 50000) }}</div>
                  <div class="stat-label">总收入</div>
                </div>
              </div>
            </a-card>
          </div>
        </a-tab-pane>
        <a-tab-pane key="logs" title="操作日志">
          <div class="tab-content">
            <a-card title="最近操作">
              <a-list>
                <a-list-item v-for="(log, index) in logs" :key="index">
                  <a-list-item-meta>
                    <template #title>
                      <div>{{ log.action }}</div>
                    </template>
                    <template #description>
                      <div>{{ log.time }} - {{ log.user }}</div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import message from '@arco-design/web-vue/es/message'
import {
  IconEdit,
  IconArrowLeft,
  IconEye,
  IconShoppingCart,
  IconUser,
  IconDocument,
  IconUserFilled,
  IconPriceTag,
  IconCollectionTag,
  IconCalendarFilled
} from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()
const activeTab = ref('basic')

// 从路由中获取信息
const id = computed(() => route.params.id || '未知')
const path = computed(() => route.path)

// 根据路径判断类型
const typeInfo = computed(() => {
  if (path.value.includes('/course/')) {
    return {
      type: 'course',
      title: `课程 ${id.value}`,
      typeName: '课程',
      iconName: 'Document'
    }
  } else if (path.value.includes('/user/')) {
    return {
      type: 'user',
      title: `用户 ${id.value}`,
      typeName: '用户',
      iconName: 'UserFilled'
    }
  } else if (path.value.includes('/order/')) {
    return {
      type: 'order',
      title: `订单 ${id.value}`,
      typeName: '订单',
      iconName: 'PriceTag'
    }
  } else if (path.value.includes('/column/')) {
    return {
      type: 'column',
      title: `专栏 ${id.value}`,
      typeName: '专栏',
      iconName: 'CollectionTag'
    }
  } else if (path.value.includes('/activity/')) {
    return {
      type: 'activity',
      title: `活动 ${id.value}`,
      typeName: '活动',
      iconName: 'CalendarFilled'
    }
  } else {
    return {
      type: 'other',
      title: `详情 ${id.value}`,
      typeName: '项目',
      iconName: 'Document'
    }
  }
})

const title = computed(() => typeInfo.value.title)
const typeName = computed(() => typeInfo.value.typeName)
const iconName = computed(() => typeInfo.value.iconName)
const statusName = computed(() => Math.random() > 0.5 ? '正常' : '禁用')

// 模拟操作日志
const logs = ref([
  { action: '创建项目', time: '2024-01-01 10:00:00', user: '管理员' },
  { action: '更新信息', time: '2024-01-02 14:30:00', user: '管理员' },
  { action: '修改状态', time: '2024-01-03 09:15:00', user: '管理员' }
])

// 格式化日期
function formatDate() {
  return new Date().toLocaleString('zh-CN')
}

// 编辑信息
function handleEdit() {
  message.info(`编辑 ${title.value} 的信息`)
  // 根据类型跳转到对应的编辑页面
  if (typeInfo.value.type === 'course') {
    router.push(`/course/edit/${id.value}`)
  } else {
    message.info('编辑功能开发中')
  }
}

// 切换状态
function handleToggleStatus() {
  message.success(`状态已切换`)
}

// 返回列表
function handleBack() {
  // 根据类型返回对应的列表页面
  if (path.value.includes('/course/')) {
    router.push('/course/list')
  } else if (path.value.includes('/user/')) {
    router.push('/user/list')
  } else if (path.value.includes('/order/')) {
    router.push('/order/list')
  } else if (path.value.includes('/column/')) {
    router.push('/column/list')
  } else if (path.value.includes('/activity/')) {
    router.push('/activity/list')
  } else {
    router.push('/dashboard')
  }
}

// 选项卡切换
function handleTabClick(activeKey: string) {
  console.log('切换到选项卡：', activeKey)
}

// 初始化加载
onMounted(() => {
  console.log('加载详情页面，ID:', id.value)
  console.log('路径:', path.value)
  console.log('类型:', typeInfo.value)
})
</script>

<style scoped lang="scss">
.detail-header {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  .detail-basic-info {
    display: flex;
    gap: 24px;
    flex: 1;

    .detail-icon {
      width: 80px;
      height: 80px;
      background: #e6f7ff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1890ff;
    }

    .detail-info {
      flex: 1;

      .detail-title {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: #262626;
      }

      .detail-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .detail-id {
          font-size: 14px;
          color: #8c8c8c;
        }
      }

      .detail-stats {
        display: flex;
        gap: 24px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: #595959;

          :deep(.arco-icon) {
            font-size: 16px;
          }
        }
      }
    }
  }

  .detail-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }
}

.detail-content {
  .detail-tabs {
    margin-bottom: 24px;
  }

  .tab-content {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 16px;

  .stat-card {
    background: #f5f7fa;
    padding: 24px;
    border-radius: 8px;
    text-align: center;

    .stat-value {
      font-size: 32px;
      font-weight: 600;
      color: #1890ff;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #8c8c8c;
    }
  }
}

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: stretch;

    .detail-basic-info {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .detail-actions {
      justify-content: center;
    }
  }

  .detail-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
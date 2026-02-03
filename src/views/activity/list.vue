<template>
  <div class="page-container">
    <div class="page-header">
      <h2>活动列表</h2>
      <a-button type="primary" @click="handleAdd">添加活动</a-button>
    </div>
    <div class="page-content">
      <a-card class="search-card" :bordered="false">
        <a-form :model="queryForm" layout="inline">
          <a-form-item label="活动标题">
            <a-input v-model="queryForm.title" placeholder="请输入活动标题" allow-clear />
          </a-form-item>
          <a-form-item label="活动类型">
            <a-select v-model="queryForm.type" placeholder="请选择活动类型" allow-clear>
              <a-option label="全部" :value="0" />
              <a-option label="读书会" :value="1" />
              <a-option label="研修班" :value="2" />
              <a-option label="训练营" :value="3" />
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-model="queryForm.status" placeholder="请选择状态" allow-clear>
              <a-option label="全部" :value="-1" />
              <a-option label="进行中" :value="1" />
              <a-option label="已结束" :value="0" />
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">搜索</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>

      <div class="activity-card-list" v-loading="loading">
        <div 
          v-for="activity in tableData" 
          :key="activity.id"
          class="activity-card"
        >
          <div class="card-image">
            <img 
              :src="activity.poster || 'https://via.placeholder.com/400x200?text=活动海报'" 
              :alt="activity.title"
            />
            <div class="card-status">
              <a-tag :color="activity.status === 1 ? 'green' : activity.status === 2 ? 'red' : 'gray'">
                {{ activity.status === 1 ? '进行中' : activity.status === 2 ? '已结束' : '草稿' }}
              </a-tag>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ activity.title }}</h3>
            <div class="card-meta">
              <a-tag size="small" class="activity-type">
                {{ activity.type === 1 ? '读书会' : activity.type === 2 ? '研修班' : activity.type === 3 ? '训练营' : '其他活动' }}
              </a-tag>
              <span class="activity-date">{{ formatDate(activity.startDateTime) }}</span>
              <span class="activity-location">{{ activity.locationName }}</span>
            </div>
            <div class="card-info">
              <div class="info-item">
                <span class="info-label">价格：</span>
                <span class="info-value price">¥{{ activity.price.toFixed(2) }}</span>
                <span v-if="activity.memberPrice > 0" class="info-value member-price">会员价：¥{{ activity.memberPrice.toFixed(2) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">报名：</span>
                <span class="info-value">{{ activity.registrationCount }} / {{ activity.maxParticipants }}</span>
              </div>
              <div class="info-item" v-if="activity.tags">
                <span class="info-label">标签：</span>
                <span class="info-value tags">{{ activity.tags }}</span>
              </div>
            </div>
            <div class="card-actions">
              <a-button type="primary" size="small" @click="handleEdit(activity)">编辑</a-button>
              <a-button type="success" size="small" @click="viewRegistration(activity)">查看报名</a-button>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :show-total="true"
          :show-jumper="true"
          :show-page-size="true"
          :page-size-options="[10, 20, 50, 100]"
          @change="handleCurrentChange"
          @page-size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const loading = ref(false)

const queryForm = reactive({
  title: '',
  type: 0,
  status: -1
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

// 格式化日期函数
function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 不同活动类型的真实图片链接
const activityImages = {
  // 读书会
  1: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1517983000954-6634762bd0a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80'
  ],
  // 研修班
  2: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1573164574506-a3f94691b83b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1551232864-3f0890e592d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80'
  ],
  // 训练营
  3: [
    'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80'
  ],
  // 其他活动
  4: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1492538399531-1715264818ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200&q=80'
  ]
}

function fetchData() {
  const list = Array.from({ length: pagination.size }).map((_, index) => {
    const offset = (pagination.page - 1) * pagination.size
    const id = index + offset + 1
    const status = Math.floor(Math.random() * 3)
    const type = Math.floor(Math.random() * 4) + 1
    const basePrice = Math.floor(Math.random() * 999) + 100
    
    // 随机选择对应活动类型的图片
    const typeImages = activityImages[type]
    const randomImageIndex = Math.floor(Math.random() * typeImages.length)
    const posterImage = typeImages[randomImageIndex]
    
    return {
      id,
      title: `活动标题 ${id} - ${type === 1 ? '读书会' : type === 2 ? '研修班' : type === 3 ? '训练营' : '其他活动'}`,
      type,
      status,
      startDateTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDateTime: new Date(Date.now() + (Math.random() * 30 + 1) * 24 * 60 * 60 * 1000).toISOString(),
      locationName: `地点 ${id}`,
      locationAddress: `详细地址 ${id}`,
      price: basePrice,
      memberPrice: basePrice * 0.8,
      earlyBirdPrice: basePrice * 0.7,
      maxParticipants: Math.floor(Math.random() * 100) + 20,
      registrationCount: Math.floor(Math.random() * 50),
      tags: type === 1 ? '阅读,学习,交流' : type === 2 ? '专业,提升,研修' : type === 3 ? '训练,实践,成长' : '综合,活动',
      poster: posterImage,
      images: []
    }
  })
  tableData.value = list
  pagination.total = 100
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  queryForm.title = ''
  queryForm.type = 0
  queryForm.status = -1
  pagination.page = 1
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  fetchData()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  fetchData()
}

function handleAdd() {
  router.push('/activity/edit')
}

function handleEdit(row: any) {
  router.push(`/activity/edit/${row.id}`)
}

function viewRegistration(row: any) {
  router.push('/activity/register')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.activity-card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.activity-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .activity-card:hover & img {
    transform: scale(1.05);
  }

  .card-status {
    position: absolute;
    top: 12px;
    left: 12px;
  }
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  .activity-type {
    flex-shrink: 0;
  }

  .activity-date,
  .activity-location {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.card-info {
  margin-bottom: 16px;

  .info-item {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .info-label {
    font-size: 12px;
    color: #999;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 13px;
    color: #333;

    &.price {
      font-weight: 600;
      color: #ff4d4f;
    }

    &.member-price {
      font-size: 12px;
      color: #1890ff;
    }

    &.tags {
      color: #666;
    }
  }
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

// 响应式设计
@media (max-width: 768px) {
  .activity-card-list {
    grid-template-columns: 1fr;
  }

  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .card-actions {
    flex-direction: column;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .activity-card-list {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}
</style>
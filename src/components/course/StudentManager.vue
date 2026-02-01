<template>
  <div class="student-manager">
    <!-- 操作栏 -->
    <div class="student-actions">
      <a-button @click="handleExportStudents">
        <template #icon>
          <icon-download />
        </template>
        导出学员
      </a-button>
      <a-button @click="handleRefresh">
        <template #icon>
          <icon-refresh />
        </template>
        刷新
      </a-button>
    </div>

    <!-- 搜索筛选 -->
    <a-form :model="searchForm" class="search-form">
      <a-form-item label="学员姓名">
        <a-input v-model="searchForm.name" placeholder="请输入学员姓名" allow-clear />
      </a-form-item>
      <a-form-item label="学员类型">
        <a-select v-model="searchForm.type" placeholder="请选择学员类型" allow-clear>
          <a-option label="全部" :value="0" />
          <a-option label="购买用户" :value="1" />
          <a-option label="会员用户" :value="2" />
          <a-option label="试用用户" :value="3" />
        </a-select>
      </a-form-item>
      <a-form-item label="会员等级">
        <a-select v-model="searchForm.vipLevel" placeholder="请选择会员等级" allow-clear>
          <a-option label="全部" :value="0" />
          <a-option label="普通用户" :value="1" />
          <a-option label="付费学员" :value="2" />
          <a-option label="终身学员" :value="3" />
          <a-option label="架构学套餐学员" :value="4" />
          <a-option label="全家福套餐学员" :value="5" />
          <a-option label="自动自发家族成员" :value="6" />
        </a-select>
      </a-form-item>
      <a-form-item label="学习状态">
        <a-select v-model="searchForm.status" placeholder="请选择学习状态" allow-clear>
          <a-option label="全部" :value="0" />
          <a-option label="学习中" :value="1" />
          <a-option label="已完成" :value="2" />
          <a-option label="未开始" :value="3" />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-form-item>
    </a-form>

    <!-- 统计概览 -->
    <div class="student-stats">
      <a-card class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ filteredStudents.length }}</div>
          <div class="stats-label">总学员数</div>
        </div>
      </a-card>
      <a-card class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ completedStudents.length }}</div>
          <div class="stats-label">已完成</div>
        </div>
      </a-card>
      <a-card class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ learningStudents.length }}</div>
          <div class="stats-label">学习中</div>
        </div>
      </a-card>
      <a-card class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ (avgProgress).toFixed(2) }}%</div>
          <div class="stats-label">平均进度</div>
        </div>
      </a-card>
    </div>

    <!-- 学员列表 -->
    <a-table
      :loading="loading"
      :data="paginatedStudents"
      border
      stripe
    >
      <a-table-column data-index="userId" title="用户ID" width="100" align="center" />
      <a-table-column title="学员信息" min-width="200">
        <template #cell="{ record }">
          <div class="student-info">
            <div class="student-avatar" v-if="record.avatar">
              <img :src="record.avatar" alt="学员头像" />
            </div>
            <div class="student-avatar placeholder" v-else>
              <icon-user />
            </div>
            <div class="student-details">
              <div class="student-name">{{ record.userName }}</div>
              <div class="student-id">ID: {{ record.userId }}</div>
            </div>
          </div>
        </template>
      </a-table-column>
      <a-table-column data-index="studentType" title="学员类型" width="120" align="center" />
      <a-table-column data-index="level" title="会员等级" width="100" align="center" />
      <a-table-column title="学习进度" width="180" align="center">
        <template #cell="{ record }">
          <div class="progress-info">
            <a-progress
              :percent="record.learningProgress"
              :status="getProgressStatus(record.learningProgress)"
              :stroke-width="10"
            />
            <span class="progress-text">{{ record.learningProgress }}%</span>
          </div>
        </template>
      </a-table-column>
      <a-table-column data-index="learningTime" title="学习时长(分钟)" width="120" align="center" />
      <a-table-column data-index="joinTime" title="加入时间" width="180" align="center" />
      <a-table-column title="操作" width="200" align="center">
        <template #cell="{ record }">
          <a-button size="small" @click="handleViewDetail(record)">
            <template #icon>
              <icon-eye />
            </template>
            详情
          </a-button>
          <a-button size="small" @click="handleSendMessage(record)">
            <template #icon>
              <icon-message />
            </template>
            消息
          </a-button>
          <a-button size="small" @click="handleViewProgress(record)">
            <template #icon>
              <icon-bar-chart />
            </template>
            进度
          </a-button>
        </template>
      </a-table-column>
    </a-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="pagination.page"
        v-model:page-size="pagination.size"
        :page-size-options="[10, 20, 50, 100]"
        :total="filteredStudents.length"
        show-total
        show-jumper
        show-size-changer
        @page-size-change="handleSizeChange"
        @page-change="handleCurrentChange"
      />
    </div>

    <!-- 学员详情对话框 -->
    <a-modal
      v-model:visible="detailDialogVisible"
      title="学员详情"
      :width="600"
    >
      <div class="student-detail" v-if="currentStudent">
        <div class="detail-header">
          <div class="student-avatar" v-if="currentStudent.avatar">
            <img :src="currentStudent.avatar" alt="学员头像" />
          </div>
          <div class="student-avatar placeholder" v-else>
            <icon-user />
          </div>
          <div class="student-info">
            <h3>{{ currentStudent.userName }}</h3>
            <div class="student-meta">
              <a-tag>{{ currentStudent.studentType }}</a-tag>
              <a-tag>{{ currentStudent.level }}</a-tag>
              <a-tag :type="currentStudent.status === '已完成' ? 'success' : 'default'">
                {{ currentStudent.status }}
              </a-tag>
            </div>
          </div>
        </div>
        <div class="detail-content">
          <a-descriptions :column="2">
            <a-descriptions-item label="用户ID">{{ currentStudent.userId }}</a-descriptions-item>
            <a-descriptions-item label="学习进度">{{ currentStudent.learningProgress }}%</a-descriptions-item>
            <a-descriptions-item label="学习时长">{{ currentStudent.learningTime }} 分钟</a-descriptions-item>
            <a-descriptions-item label="加入时间">{{ currentStudent.joinTime }}</a-descriptions-item>
            <a-descriptions-item label="推荐人" :span="2">{{ currentStudent.referrer || '无' }}</a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="detailDialogVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 学习进度对话框 -->
    <a-modal
      v-model:visible="progressDialogVisible"
      title="学习进度详情"
      :width="800"
    >
      <div class="progress-detail" v-if="currentStudent">
        <h3>{{ currentStudent.userName }} 的学习进度</h3>
        <div class="progress-summary">
          <div class="summary-item">
            <span class="summary-label">总体进度</span>
            <span class="summary-value">{{ currentStudent.learningProgress }}%</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">学习时长</span>
            <span class="summary-value">{{ currentStudent.learningTime }} 分钟</span>
          </div>
        </div>
        <a-table :data="mockProgressData" border>
          <a-table-column data-index="chapter" title="章节" min-width="200" />
          <a-table-column data-index="courseware" title="课件" min-width="200" />
          <a-table-column title="学习状态" width="120" align="center">
            <template #cell="{ record }">
              <a-tag :type="record.status === '已完成' ? 'success' : 'default'">
                {{ record.status }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="学习进度" width="150" align="center">
            <template #cell="{ record }">
              <a-progress
                :percent="record.progress"
                :stroke-width="8"
              />
            </template>
          </a-table-column>
          <a-table-column data-index="lastTime" title="最后学习时间" width="180" align="center" />
        </a-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="progressDialogVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 发送消息对话框 -->
    <a-modal
      v-model:visible="messageDialogVisible"
      title="发送消息"
      :width="500"
    >
      <a-form :model="messageForm" label-col="80px">
        <a-form-item label="消息类型">
          <a-select v-model="messageForm.type" placeholder="请选择消息类型">
            <a-option label="系统消息" :value="1" />
            <a-option label="学习提醒" :value="2" />
            <a-option label="活动通知" :value="3" />
          </a-select>
        </a-form-item>
        <a-form-item label="消息标题">
          <a-input v-model="messageForm.title" placeholder="请输入消息标题" />
        </a-form-item>
        <a-form-item label="消息内容">
          <a-input
            v-model="messageForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入消息内容"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="messageDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="handleSendMessageConfirm">发送消息</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconDownload,
  IconRefresh,
  IconEye,
  IconMessage,
  IconBarChart,
  IconUser
} from '@arco-design/web-vue/es/icon'

const props = defineProps<{
  course: any
}>()

// 状态管理
const loading = ref(false)
const detailDialogVisible = ref(false)
const progressDialogVisible = ref(false)
const messageDialogVisible = ref(false)

// 搜索筛选
const searchForm = reactive({
  name: '',
  type: 0,
  vipLevel: 0,
  status: 0
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10
})

// 学员详情
const currentStudent = ref<any>(null)

// 消息表单
const messageForm = reactive({
  type: 1,
  title: '',
  content: ''
})

// 模拟进度数据
const mockProgressData = ref([
  {
    chapter: '第一章：JavaScript基础',
    courseware: '1.1 JavaScript简介',
    status: '已完成',
    progress: 100,
    lastTime: '2026-01-30 14:30:00'
  },
  {
    chapter: '第一章：JavaScript基础',
    courseware: '1.2 变量和数据类型',
    status: '已完成',
    progress: 100,
    lastTime: '2026-01-30 15:15:00'
  },
  {
    chapter: '第二章：ES6+新特性',
    courseware: '2.1 let和const',
    status: '学习中',
    progress: 65,
    lastTime: '2026-01-31 10:20:00'
  },
  {
    chapter: '第二章：ES6+新特性',
    courseware: '2.2 箭头函数',
    status: '未开始',
    progress: 0,
    lastTime: ''
  }
])

// 过滤后的学员列表
const filteredStudents = computed(() => {
  let students = [...(props.course.students || [])]
  
  // 按名称筛选
  if (searchForm.name) {
    students = students.filter(student => 
      student.userName.includes(searchForm.name)
    )
  }
  
  // 按类型筛选
  if (searchForm.type) {
    students = students.filter(student => 
      searchForm.type === 1 && student.studentType === '购买用户' ||
      searchForm.type === 2 && student.studentType === '会员用户' ||
      searchForm.type === 3 && student.studentType === '试用用户'
    )
  }
  
  // 按会员等级筛选
  if (searchForm.vipLevel) {
    students = students.filter(student => {
      if (searchForm.vipLevel === 1) return student.level === '普通用户'
      if (searchForm.vipLevel === 2) return student.level === '付费学员'
      if (searchForm.vipLevel === 3) return student.level === '终身学员'
      if (searchForm.vipLevel === 4) return student.level === '架构学套餐学员'
      if (searchForm.vipLevel === 5) return student.level === '全家福套餐学员'
      if (searchForm.vipLevel === 6) return student.level === '自动自发家族成员'
      return true
    })
  }
  
  // 按学习状态筛选
  if (searchForm.status) {
    students = students.filter(student => {
      if (searchForm.status === 1) return student.status === '学习中'
      if (searchForm.status === 2) return student.status === '已完成'
      if (searchForm.status === 3) return student.status === '未开始'
      return true
    })
  }
  
  return students
})

// 分页后的学员列表
const paginatedStudents = computed(() => {
  const start = (pagination.page - 1) * pagination.size
  const end = start + pagination.size
  return filteredStudents.value.slice(start, end)
})

// 已完成的学员数量
const completedStudents = computed(() => {
  return filteredStudents.value.filter(student => student.status === '已完成').length
})

// 学习中的学员数量
const learningStudents = computed(() => {
  return filteredStudents.value.filter(student => student.status === '学习中').length
})

// 平均学习进度
const avgProgress = computed(() => {
  if (filteredStudents.value.length === 0) return 0
  const totalProgress = filteredStudents.value.reduce((sum, student) => sum + student.learningProgress, 0)
  return totalProgress / filteredStudents.value.length
})

// 获取进度状态
function getProgressStatus(progress: number): string {
  if (progress >= 100) return 'success'
  if (progress >= 60) return 'warning'
  return 'error'
}

// 导出学员
function handleExportStudents() {
  Message.success('导出成功')
}

// 刷新
function handleRefresh() {
  Message.success('刷新成功')
}

// 搜索
function handleSearch() {
  pagination.page = 1
  Message.success('搜索成功')
}

// 重置
function handleReset() {
  searchForm.name = ''
  searchForm.type = 0
  searchForm.vipLevel = 0
  searchForm.status = 0
  pagination.page = 1
  Message.success('重置成功')
}

// 查看详情
function handleViewDetail(student: any) {
  currentStudent.value = student
  detailDialogVisible.value = true
}

// 发送消息
function handleSendMessage(student: any) {
  currentStudent.value = student
  messageForm.type = 1
  messageForm.title = ''
  messageForm.content = ''
  messageDialogVisible.value = true
}

// 查看学习进度
function handleViewProgress(student: any) {
  currentStudent.value = student
  progressDialogVisible.value = true
}

// 发送消息确认
function handleSendMessageConfirm() {
  if (!messageForm.title) {
    Message.error('请输入消息标题')
    return
  }
  
  if (!messageForm.content) {
    Message.error('请输入消息内容')
    return
  }
  
  Message.success('消息发送成功')
  messageDialogVisible.value = false
}

// 分页变化
function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
}

function handleCurrentChange(page: number) {
  pagination.page = page
}
</script>

<style scoped lang="scss">
.student-manager {
  .student-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .student-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    .stats-card {
      .stats-item {
        text-align: center;

        .stats-value {
          font-size: 24px;
          font-weight: 600;
          color: #1890ff;
          margin-bottom: 4px;
        }

        .stats-label {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  .student-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .student-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .student-avatar.placeholder {
    background: #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;

    :deep(.arco-icon) {
      font-size: 24px;
    }
  }

  .student-details {
    .student-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .student-id {
      font-size: 12px;
      color: #909399;
    }
  }

  .progress-info {
    width: 100%;

    .progress-text {
      display: block;
      text-align: right;
      margin-top: 4px;
      font-size: 12px;
      color: #606266;
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .student-detail {
    .detail-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e4e7ed;

      .student-avatar {
        width: 80px;
        height: 80px;
      }

      .student-info {
        flex: 1;

        h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .student-meta {
          display: flex;
          gap: 8px;
        }
      }
    }
  }

  .progress-detail {
    h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .progress-summary {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;

      .summary-item {
        .summary-label {
          font-size: 14px;
          color: #606266;
          margin-right: 8px;
        }

        .summary-value {
          font-size: 16px;
          font-weight: 600;
          color: #1890ff;
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
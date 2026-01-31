<template>
  <div class="student-manager">
    <!-- 操作栏 -->
    <div class="student-actions">
      <el-button @click="handleExportStudents">
        <el-icon><Download /></el-icon>
        导出学员
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="学员姓名">
        <el-input v-model="searchForm.name" placeholder="请输入学员姓名" clearable />
      </el-form-item>
      <el-form-item label="学员类型">
        <el-select v-model="searchForm.type" placeholder="请选择学员类型" clearable>
          <el-option label="全部" :value="0" />
          <el-option label="购买用户" :value="1" />
          <el-option label="会员用户" :value="2" />
          <el-option label="试用用户" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="会员等级">
        <el-select v-model="searchForm.vipLevel" placeholder="请选择会员等级" clearable>
          <el-option label="全部" :value="0" />
          <el-option label="普通用户" :value="1" />
          <el-option label="付费学员" :value="2" />
          <el-option label="终身学员" :value="3" />
          <el-option label="架构学套餐学员" :value="4" />
          <el-option label="全家福套餐学员" :value="5" />
          <el-option label="自动自发家族成员" :value="6" />
        </el-select>
      </el-form-item>
      <el-form-item label="学习状态">
        <el-select v-model="searchForm.status" placeholder="请选择学习状态" clearable>
          <el-option label="全部" :value="0" />
          <el-option label="学习中" :value="1" />
          <el-option label="已完成" :value="2" />
          <el-option label="未开始" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 统计概览 -->
    <div class="student-stats">
      <el-card shadow="hover" class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ filteredStudents.length }}</div>
          <div class="stats-label">总学员数</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ completedStudents.length }}</div>
          <div class="stats-label">已完成</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ learningStudents.length }}</div>
          <div class="stats-label">学习中</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ (avgProgress).toFixed(2) }}%</div>
          <div class="stats-label">平均进度</div>
        </div>
      </el-card>
    </div>

    <!-- 学员列表 -->
    <el-table
      v-loading="loading"
      :data="paginatedStudents"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="userId" label="用户ID" width="100" align="center" />
      <el-table-column label="学员信息" min-width="200">
        <template #default="{ row }">
          <div class="student-info">
            <div class="student-avatar" v-if="row.avatar">
              <img :src="row.avatar" alt="学员头像" />
            </div>
            <div class="student-avatar placeholder" v-else>
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="student-details">
              <div class="student-name">{{ row.userName }}</div>
              <div class="student-id">ID: {{ row.userId }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="studentType" label="学员类型" width="120" align="center" />
      <el-table-column prop="level" label="会员等级" width="100" align="center" />
      <el-table-column label="学习进度" width="180" align="center">
        <template #default="{ row }">
          <div class="progress-info">
            <el-progress
              :percentage="row.learningProgress"
              :color="getProgressColor(row.learningProgress)"
              :stroke-width="10"
            />
            <span class="progress-text">{{ row.learningProgress }}%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="learningTime" label="学习时长(分钟)" width="120" align="center" />
      <el-table-column prop="joinTime" label="加入时间" width="180" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }">
          <el-button size="small" @click="handleViewDetail(row)">
            <el-icon><View /></el-icon>
            详情
          </el-button>
          <el-button size="small" @click="handleSendMessage(row)">
            <el-icon><ChatLineRound /></el-icon>
            消息
          </el-button>
          <el-button size="small" @click="handleViewProgress(row)">
            <el-icon><DataAnalysis /></el-icon>
            进度
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredStudents.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 学员详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="学员详情"
      width="600px"
    >
      <div class="student-detail" v-if="currentStudent">
        <div class="detail-header">
          <div class="student-avatar" v-if="currentStudent.avatar">
            <img :src="currentStudent.avatar" alt="学员头像" />
          </div>
          <div class="student-avatar placeholder" v-else>
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="student-info">
            <h3>{{ currentStudent.userName }}</h3>
            <div class="student-meta">
              <el-tag>{{ currentStudent.studentType }}</el-tag>
              <el-tag>{{ currentStudent.level }}</el-tag>
              <el-tag :type="currentStudent.status === '已完成' ? 'success' : 'info'">
                {{ currentStudent.status }}
              </el-tag>
            </div>
          </div>
        </div>
        <div class="detail-content">
          <el-descriptions :column="2">
            <el-descriptions-item label="用户ID">{{ currentStudent.userId }}</el-descriptions-item>
            <el-descriptions-item label="学习进度">{{ currentStudent.learningProgress }}%</el-descriptions-item>
            <el-descriptions-item label="学习时长">{{ currentStudent.learningTime }} 分钟</el-descriptions-item>
            <el-descriptions-item label="加入时间">{{ currentStudent.joinTime }}</el-descriptions-item>
            <el-descriptions-item label="推荐人" :span="2">{{ currentStudent.referrer || '无' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 学习进度对话框 -->
    <el-dialog
      v-model="progressDialogVisible"
      title="学习进度详情"
      width="800px"
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
        <el-table :data="mockProgressData" style="width: 100%" border>
          <el-table-column prop="chapter" label="章节" min-width="200" />
          <el-table-column prop="courseware" label="课件" min-width="200" />
          <el-table-column label="学习状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '已完成' ? 'success' : 'info'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="学习进度" width="150" align="center">
            <template #default="{ row }">
              <el-progress
                :percentage="row.progress"
                :stroke-width="8"
              />
            </template>
          </el-table-column>
          <el-table-column prop="lastTime" label="最后学习时间" width="180" align="center" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="progressDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发送消息对话框 -->
    <el-dialog
      v-model="messageDialogVisible"
      title="发送消息"
      width="500px"
    >
      <el-form :model="messageForm" label-width="80px">
        <el-form-item label="消息类型">
          <el-select v-model="messageForm.type" placeholder="请选择消息类型">
            <el-option label="系统消息" :value="1" />
            <el-option label="学习提醒" :value="2" />
            <el-option label="活动通知" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="消息标题">
          <el-input v-model="messageForm.title" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input
            v-model="messageForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入消息内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="messageDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSendMessageConfirm">发送消息</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Refresh,
  View,
  ChatLineRound,
  DataAnalysis,
  UserFilled
} from '@element-plus/icons-vue'

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

// 获取进度颜色
function getProgressColor(progress: number): string {
  if (progress >= 100) return '#67c23a'
  if (progress >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 导出学员
function handleExportStudents() {
  ElMessage.success('导出成功')
}

// 刷新
function handleRefresh() {
  ElMessage.success('刷新成功')
}

// 搜索
function handleSearch() {
  pagination.page = 1
  ElMessage.success('搜索成功')
}

// 重置
function handleReset() {
  searchForm.name = ''
  searchForm.type = 0
  searchForm.vipLevel = 0
  searchForm.status = 0
  pagination.page = 1
  ElMessage.success('重置成功')
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
    ElMessage.error('请输入消息标题')
    return
  }
  
  if (!messageForm.content) {
    ElMessage.error('请输入消息内容')
    return
  }
  
  ElMessage.success('消息发送成功')
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

    .el-icon {
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
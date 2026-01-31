<template>
  <div class="page-container">
    <!-- 顶部课程信息区 -->
    <div class="course-header">
      <div class="course-basic-info">
        <div class="course-cover" v-if="course.cover">
          <img :src="course.cover" alt="课程封面" />
        </div>
        <div class="course-cover placeholder" v-else>
          <el-icon><PictureFilled /></el-icon>
          <span>无封面</span>
        </div>
        <div class="course-info">
          <h1 class="course-title">{{ course.title }}</h1>
          <div class="course-meta">
            <el-tag :type="course.status === 1 ? 'success' : 'danger'">
              {{ course.status === 1 ? '已发布' : '未发布' }}
            </el-tag>
            <el-tag>{{ course.type === 1 ? '视频课程' : '音频课程' }}</el-tag>
            <el-tag>{{ course.categoryName || '未分类' }}</el-tag>
            <span class="course-id">编号：{{ course.id }}</span>
          </div>
          <div class="course-stats">
            <span class="stat-item">
              <el-icon><View /></el-icon>
              {{ course.stats?.learningData?.viewCount || 0 }} 浏览
            </span>
            <span class="stat-item">
              <el-icon><ShoppingCart /></el-icon>
              {{ course.stats?.learningData?.payCount || 0 }} 购买
            </span>
            <span class="stat-item">
              <el-icon><VideoCameraFilled /></el-icon>
              {{ course.totalCoursewares || 0 }} 课件
            </span>
            <span class="stat-item">
              <el-icon><Document /></el-icon>
              {{ course.totalChapters || 0 }} 章节
            </span>
          </div>
        </div>
      </div>
      <div class="course-actions">
        <el-button type="primary" @click="handleEditBasicInfo">
          <el-icon><Edit /></el-icon>
          编辑基本信息
        </el-button>
        <el-button :type="course.status === 1 ? 'danger' : 'success'" @click="handleToggleStatus">
          <el-icon>
            <Delete v-if="course.status === 1" />
            <Check v-else />
          </el-icon>
          {{ course.status === 1 ? '下架' : '上架' }}
        </el-button>
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
      </div>
    </div>

    <!-- 选项卡导航 -->
    <el-tabs v-model="activeTab" class="course-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="视频管理" name="videos">
        <div class="tab-content">
          <video-manager :course="course" @update:course="updateCourse" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="章节管理" name="chapters">
        <div class="tab-content">
          <chapter-manager :course="course" @update:course="updateCourse" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="设置管理" name="settings">
        <div class="tab-content">
          <course-settings :course="course" @update:course="updateCourse" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="评论管理" name="comments">
        <div class="tab-content">
          <comment-manager :course="course" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据分析" name="analytics">
        <div class="tab-content">
          <data-analysis :course="course" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="学员管理" name="students">
        <div class="tab-content">
          <student-manager :course="course" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Edit,
  Delete,
  Check,
  ArrowLeft,
  View,
  ShoppingCart,
  VideoCameraFilled,
  Document,
  PictureFilled
} from '@element-plus/icons-vue'

// 导入子组件
import VideoManager from '@/components/course/VideoManager.vue'
import ChapterManager from '@/components/course/ChapterManager.vue'
import CourseSettings from '@/components/course/CourseSettings.vue'
import CommentManager from '@/components/course/CommentManager.vue'
import DataAnalysis from '@/components/course/DataAnalysis.vue'
import StudentManager from '@/components/course/StudentManager.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab as string || 'videos')

// 课程数据
const course = reactive({
  id: 0,
  title: '加载中...',
  subtitle: '',
  type: 1,
  categoryId: 0,
  categoryName: '',
  cover: '',
  intro: '',
  detail: '',
  price: 0,
  originalPrice: 0,
  vipPrice: 0,
  vipLevelRequired: 0,
  totalDuration: 0,
  totalCoursewares: 0,
  totalChapters: 0,
  status: 0,
  columnId: 0,
  columnName: '',
  settings: {
    infoCollection: false,
    entryGuide: false,
    inviteSettings: {
      inviteCodeCount: 0,
      inviteCount: 0
    },
    relatedSettings: {
      keywords: [],
      sellingPoints: [],
      categories: [],
      tags: [],
      relatedBooks: [],
      relatedCircles: []
    }
  },
  chapters: [],
  coursewares: [],
  stats: {
    learningData: {
      userCount: 0,
      viewCount: 0,
      payCount: 0,
      payAmount: 0,
      conversionRate: 0,
      orderCount: 0,
      chartData: []
    },
    trafficData: {
      chartData: []
    },
    distributionData: {
      payAmount: 0,
      orderCount: 0,
      commission: 0,
      conversionRate: 0,
      actualIncome: 0,
      chartData: []
    }
  },
  students: [],
  createTime: '',
  updateTime: '',
  publishTime: ''
})

// 加载课程数据
async function loadCourseData() {
  const id = route.params.id
  if (!id) {
    ElMessage.error('课程ID不存在')
    router.push('/course/list')
    return
  }

  try {
    // 模拟加载课程数据
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    Object.assign(course, {
      id: Number(id),
      title: '高级JavaScript开发实战',
      subtitle: '从入门到精通的全面指南',
      type: 1,
      categoryId: 1,
      categoryName: '前端开发',
      cover: 'https://via.placeholder.com/150x150',
      intro: '本课程将带你深入了解JavaScript的高级特性和最佳实践',
      detail: '详细介绍JavaScript的各种高级概念和应用场景',
      price: 299,
      originalPrice: 399,
      vipPrice: 199,
      vipLevelRequired: 2,
      totalDuration: 1200,
      totalCoursewares: 20,
      totalChapters: 5,
      status: 1,
      columnId: 0,
      columnName: '',
      chapters: [
        {
          id: 1,
          title: '第一章：JavaScript基础回顾',
          order: 1,
          coursewareIds: [1, 2, 3, 4]
        },
        {
          id: 2,
          title: '第二章：ES6+新特性',
          order: 2,
          coursewareIds: [5, 6, 7]
        }
      ],
      coursewares: [
        {
          id: 1,
          title: '1.1 JavaScript简介',
          type: 1,
          url: 'https://example.com/video1.mp4',
          duration: 600,
          size: 1024 * 1024 * 100,
          status: 2,
          chapterId: 1,
          description: 'JavaScript的历史和发展',
          uploadTime: '2026-01-01 10:00:00'
        },
        {
          id: 2,
          title: '1.2 变量和数据类型',
          type: 1,
          url: 'https://example.com/video2.mp4',
          duration: 480,
          size: 1024 * 1024 * 80,
          status: 2,
          chapterId: 1,
          description: 'JavaScript的变量声明和数据类型',
          uploadTime: '2026-01-01 11:00:00'
        }
      ],
      stats: {
        learningData: {
          userCount: 156,
          viewCount: 892,
          payCount: 78,
          payAmount: 23322,
          conversionRate: 8.7,
          orderCount: 85,
          chartData: [
            { date: '2026-01-01', value: 10 },
            { date: '2026-01-02', value: 15 },
            { date: '2026-01-03', value: 12 },
            { date: '2026-01-04', value: 20 },
            { date: '2026-01-05', value: 18 }
          ]
        },
        trafficData: {
          chartData: [
            { date: '2026-01-01', value: 50 },
            { date: '2026-01-02', value: 65 },
            { date: '2026-01-03', value: 58 },
            { date: '2026-01-04', value: 75 },
            { date: '2026-01-05', value: 70 }
          ]
        },
        distributionData: {
          payAmount: 5600,
          orderCount: 20,
          commission: 1120,
          conversionRate: 2.5,
          actualIncome: 4480,
          chartData: [
            { date: '2026-01-01', value: 5 },
            { date: '2026-01-02', value: 7 },
            { date: '2026-01-03', value: 3 },
            { date: '2026-01-04', value: 8 },
            { date: '2026-01-05', value: 5 }
          ]
        }
      },
      students: [
        {
          id: 1,
          userId: 101,
          userName: '张三',
          avatar: 'https://via.placeholder.com/40x40',
          studentType: '购买用户',
          level: '终身学员',
          status: '学习中',
          learningProgress: 65,
          learningTime: 120,
          joinTime: '2026-01-01 10:00:00'
        },
        {
          id: 2,
          userId: 102,
          userName: '李四',
          avatar: 'https://via.placeholder.com/40x40',
          studentType: '会员用户',
          level: '架构学套餐学员',
          status: '已完成',
          learningProgress: 100,
          learningTime: 240,
          joinTime: '2026-01-02 14:30:00'
        }
      ],
      createTime: '2026-01-01 00:00:00',
      updateTime: '2026-01-15 00:00:00',
      publishTime: '2026-01-10 00:00:00'
    })
  } catch (error) {
    ElMessage.error('加载课程数据失败')
  }
}

// 更新课程数据
function updateCourse(newCourseData: any) {
  Object.assign(course, newCourseData)
  ElMessage.success('课程数据已更新')
}

// 编辑基本信息
function handleEditBasicInfo() {
  router.push(`/course/edit/${course.id}`)
}

// 切换课程状态
function handleToggleStatus() {
  ElMessage.confirm(
    course.status === 1 ? '确定要下架该课程吗？' : '确定要发布该课程吗？',
    '操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: course.status === 1 ? 'warning' : 'success'
    }
  ).then(() => {
    course.status = course.status === 1 ? 0 : 1
    ElMessage.success(course.status === 1 ? '课程已发布' : '课程已下架')
  }).catch(() => {})
}

// 返回列表
function handleBack() {
  router.push('/course/list')
}

// 选项卡切换
function handleTabClick(tab: any) {
  console.log('切换到选项卡：', tab.paneName)
  // 可以在这里添加选项卡切换时的逻辑
}

// 初始化加载
onMounted(() => {
  loadCourseData()
})
</script>

<style scoped lang="scss">
.course-header {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  .course-basic-info {
    flex: 1;
    display: flex;
    gap: 24px;

    .course-cover {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .course-cover.placeholder {
      background: #e4e7ed;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #909399;

      .el-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }
    }

    .course-info {
      flex: 1;

      .course-title {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: #303133;
      }

      .course-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .course-id {
          font-size: 14px;
          color: #909399;
        }
      }

      .course-stats {
        display: flex;
        align-items: center;
        gap: 24px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #606266;

          .el-icon {
            font-size: 16px;
          }
        }
      }
    }
  }

  .course-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.course-tabs {
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding-left: 24px;
  .el-tabs__header {
    margin: 0;
    border-bottom: 1px solid #e4e7ed;

    .el-tabs__nav {
      padding: 0 24px;
    }

    .el-tabs__item {
      font-size: 16px;
      padding: 0 20px;
      height: 56px;
      line-height: 56px;
    }

    .el-tabs__active-bar {
      height: 3px;
      background: #1890ff;
    }
  }

  .el-tabs__content {
    padding: 24px;
  }
}

.tab-content {
  min-height: 600px;
}

@media (max-width: 768px) {
  .course-header {
    flex-direction: column;
    align-items: stretch;

    .course-basic-info {
      flex-direction: column;

      .course-cover,
      .course-cover.placeholder {
        width: 100%;
        height: 200px;
      }
    }

    .course-actions {
      flex-direction: row;
      justify-content: flex-end;
    }
  }
}
</style>
<template>
  <div class="page-container">
    <!-- 顶部课程信息区 -->
    <div class="course-header">
      <div class="course-basic-info">
        <div class="course-cover" v-if="course.cover">
          <img :src="course.cover" alt="课程封面" />
        </div>
        <div class="course-cover placeholder" v-else>
          <IconImage />
          <span>无封面</span>
        </div>
        <div class="course-info">
          <h1 class="course-title">{{ course.title }}</h1>
          <div class="course-meta">
            <a-tag :color="course.status === 1 ? 'success' : 'danger'">
              {{ course.status === 1 ? '已发布' : '未发布' }}
            </a-tag>
            <a-tag>{{ course.type === 1 ? '视频课程' : '音频课程' }}</a-tag>
            <a-tag>{{ course.categoryName || '未分类' }}</a-tag>
            <span class="course-id">编号：{{ course.id }}</span>
          </div>
          <div class="course-stats">
            <span class="stat-item">
              <IconFile />
              {{ course.stats?.learningData?.viewCount || 0 }} 浏览
            </span>
            <span class="stat-item">
              <IconFile />
              {{ course.stats?.learningData?.payCount || 0 }} 购买
            </span>
            <span class="stat-item">
              <IconFile />
              {{ course.totalCoursewares || 0 }} 课件
            </span>
            <span class="stat-item">
              <IconFile />
              {{ course.totalChapters || 0 }} 章节
            </span>
          </div>
        </div>
      </div>
      <div class="course-actions">
        <a-button type="primary" @click="handleEditBasicInfo">
          <template #icon>
            <IconEdit />
          </template>
          编辑基本信息
        </a-button>
        <a-button :type="course.status === 1 ? 'danger' : 'success'" @click="handleToggleStatus">
          <template #icon>
            <IconStop v-if="course.status === 1" />
            <IconCheck v-else />
          </template>
          {{ course.status === 1 ? '下架' : '上架' }}
        </a-button>
        <a-button @click="handleBack">
          <template #icon>
            <IconArrowLeft />
          </template>
          返回列表
        </a-button>
      </div>
    </div>

    <!-- 选项卡导航 -->
    <a-tabs v-model="activeTab" class="course-tabs" @change="handleTabClick">
      <a-tab-pane key="videos" title="视频管理">
        <div class="tab-content">
          <video-manager :course="course" @update:course="updateCourse" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="chapters" title="章节管理">
        <div class="tab-content">
          <chapter-manager :course="course" @update:course="updateCourse" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="settings" title="设置管理">
        <div class="tab-content">
          <course-settings :course="course" @update:course="updateCourse" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="comments" title="评论管理">
        <div class="tab-content">
          <comment-manager :course="course" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="analytics" title="数据分析">
        <div class="tab-content">
          <data-analysis :course="course" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="students" title="学员管理">
        <div class="tab-content">
          <student-manager :course="course" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from '@arco-design/web-vue'
import message from '@arco-design/web-vue/es/message'
import {
  IconFile,
  IconImage,
  IconEdit,
  IconStop,
  IconCheck,
  IconArrowLeft
} from '@arco-design/web-vue/es/icon'

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
  console.log('loadCourseData 函数被调用')
  const id = route.params.id
  console.log('课程ID:', id)
  if (id === undefined || id === null || id === '') {
    message.error('课程ID不存在')
    router.push('/course/list')
    return
  }

  try {
    // 模拟加载课程数据
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    console.log('开始更新课程数据')
    Object.assign(course, {
      id: Number(id) || 1,
      title: '高级JavaScript开发实战',
      subtitle: '从入门到精通的全面指南',
      type: 1,
      categoryId: 1,
      categoryName: '前端开发',
      cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=JavaScript%20course%20cover%20with%20modern%20design%2C%20programming%20concepts%2C%20blue%20theme&image_size=square',
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
    message.error('加载课程数据失败')
  }
}

// 更新课程数据
function updateCourse(newCourseData: any) {
  // 直接更新课程数据，不使用 nextTick，避免在组件销毁后仍然执行代码
  Object.assign(course, newCourseData)
}

// 编辑基本信息
function handleEditBasicInfo() {
  router.push(`/course/edit/${course.id}`)
}

// 切换课程状态
function handleToggleStatus() {
  Modal.confirm({
    title: '操作确认',
    content: course.status === 1 ? '确定要下架该课程吗？' : '确定要发布该课程吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      course.status = course.status === 1 ? 0 : 1
      message.success(course.status === 1 ? '课程已发布' : '课程已下架')
    }
  })
}

// 返回列表
function handleBack() {
  router.push('/course/list')
}

// 选项卡切换
function handleTabClick(activeKey: string) {
  console.log('切换到选项卡：', activeKey)
  // 可以在这里添加选项卡切换时的逻辑
}

// 初始化加载
onMounted(() => {
  loadCourseData()
})
</script>

<style scoped lang="scss">
// 全局样式变量
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$text-color-primary: #303133;
$text-color-secondary: #606266;
$text-color-tertiary: #909399;
$border-color: #e4e7ed;
$background-color: #f5f7fa;
$card-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
$transition: all 0.3s ease;

// 页面容器
.page-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

// 课程头部信息区域
.course-header {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  box-shadow: $card-shadow;
  transition: $transition;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  }

  // 课程基本信息
  .course-basic-info {
    flex: 1;
    display: flex;
    gap: 32px;
    align-items: flex-start;

    // 课程封面
    .course-cover {
      width: 160px;
      height: 160px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: $transition;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: $transition;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    // 无封面占位
    .course-cover.placeholder {
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $text-color-tertiary;
      border: 2px dashed $border-color;
      transition: $transition;

      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }

      :deep(.arco-icon) {
        font-size: 48px;
        margin-bottom: 12px;
        transition: $transition;
      }

      span {
        font-size: 14px;
        font-weight: 500;
      }
    }

    // 课程信息
    .course-info {
      flex: 1;
      min-width: 0;

      // 课程标题
      .course-title {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 20px 0;
        color: $text-color-primary;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      // 课程元信息
      .course-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;

        // 标签样式
        :deep(.arco-tag) {
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 16px;
          font-weight: 500;
          transition: $transition;

          &:hover {
            transform: translateY(-1px);
          }
        }

        // 课程编号
        .course-id {
          font-size: 14px;
          color: $text-color-tertiary;
          background-color: $background-color;
          padding: 4px 12px;
          border-radius: 16px;
        }
      }

      // 课程统计信息
      .course-stats {
        display: flex;
        align-items: center;
        gap: 32px;
        flex-wrap: wrap;

        // 统计项
        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: $text-color-secondary;
          background-color: $background-color;
          padding: 8px 16px;
          border-radius: 20px;
          transition: $transition;

          &:hover {
            background-color: #e6f7ff;
            color: $primary-color;
            transform: translateY(-1px);
          }

          :deep(.arco-icon) {
            font-size: 18px;
            color: $primary-color;
          }

          // 数字部分
          span {
            font-weight: 600;
            margin-left: 4px;
          }
        }
      }
    }
  }

  // 操作按钮组
  .course-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 180px;

    // 按钮样式统一
    :deep(.arco-button) {
      font-size: 14px;
      font-weight: 500;
      padding: 10px 24px;
      border-radius: 8px;
      transition: $transition;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      }

      // 主要按钮
      &.arco-button-primary {
        background-color: $primary-color;
        border-color: $primary-color;

        &:hover {
          background-color: #40a9ff;
          border-color: #40a9ff;
        }
      }

      // 危险按钮
      &.arco-button-danger {
        background-color: $error-color;
        border-color: $error-color;

        &:hover {
          background-color: #ff4d4f;
          border-color: #ff4d4f;
        }
      }

      // 次要按钮
      &.arco-button-default {
        background-color: #fff;
        border-color: $border-color;

        &:hover {
          border-color: $primary-color;
          color: $primary-color;
        }
      }
    }
  }
}

// 选项卡导航区域
.course-tabs {
  background: #fff;
  border-radius: 12px;
  box-shadow: $card-shadow;
  overflow: hidden;
  transition: $transition;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  }

  // 选项卡头部
  :deep(.arco-tabs-header) {
    margin: 0;
    border-bottom: 1px solid $border-color;
    background-color: #fafafa;

    // 选项卡导航
    .arco-tabs-nav {
      padding: 0 32px;
      height: 64px;
      align-items: center;
    }

    // 选项卡项
    .arco-tabs-tab {
      font-size: 16px;
      font-weight: 500;
      padding: 0 24px;
      height: 64px;
      line-height: 64px;
      color: $text-color-secondary;
      transition: $transition;

      &:hover {
        color: $primary-color;
      }

      &.arco-tabs-tab-active {
        color: $primary-color;
        font-weight: 600;
      }
    }

    // 激活条
    .arco-tabs-active-bar {
      height: 3px;
      background: $primary-color;
      border-radius: 3px;
    }
  }

  // 选项卡内容
  :deep(.arco-tabs-content) {
    padding: 32px;
  }
}

// 标签内容区域
.tab-content {
  min-height: 600px;
  background-color: #fff;
}

// 响应式设计
@media (max-width: 1200px) {
  .course-header {
    flex-direction: column;
    align-items: stretch;

    .course-basic-info {
      flex-direction: column;
      align-items: center;
      text-align: center;

      .course-cover,
      .course-cover.placeholder {
        width: 200px;
        height: 200px;
      }

      .course-info {
        .course-stats {
          justify-content: center;
        }
      }
    }

    .course-actions {
      flex-direction: row;
      justify-content: center;
      margin-top: 16px;

      :deep(.arco-button) {
        flex: 1;
        max-width: 200px;
      }
    }
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 12px;
  }

  .course-header {
    padding: 20px;
    gap: 20px;

    .course-basic-info {
      gap: 20px;

      .course-cover,
      .course-cover.placeholder {
        width: 150px;
        height: 150px;
      }

      .course-info {
        .course-title {
          font-size: 24px;
        }

        .course-meta {
          gap: 12px;
        }

        .course-stats {
          gap: 16px;

          .stat-item {
            font-size: 13px;
            padding: 6px 12px;
          }
        }
      }
    }

    .course-actions {
      flex-direction: column;
      align-items: stretch;

      :deep(.arco-button) {
        max-width: none;
      }
    }
  }

  .course-tabs {
    :deep(.arco-tabs-header) {
      .arco-tabs-nav {
        padding: 0 16px;
        height: 56px;
      }

      .arco-tabs-tab {
        font-size: 14px;
        padding: 0 16px;
        height: 56px;
        line-height: 56px;
      }
    }

    :deep(.arco-tabs-content) {
      padding: 20px;
    }
  }
}
</style>
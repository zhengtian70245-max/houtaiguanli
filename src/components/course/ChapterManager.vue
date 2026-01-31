<template>
  <div class="chapter-manager">
    <!-- 操作栏 -->
    <div class="chapter-actions">
      <el-button type="primary" @click="handleAddChapter">
        <el-icon><Plus /></el-icon>
        添加章节
      </el-button>
      <el-button @click="handleBatchDelete" :disabled="selectedChapterIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
      <el-button @click="handleSortChapters">
        <el-icon><Top /></el-icon>
        排序章节
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 章节列表 -->
    <div class="chapter-list">
      <el-card
        v-for="chapter in props.course.chapters"
        :key="chapter.id"
        class="chapter-card"
      >
        <template #header>
          <div class="chapter-header">
            <div class="chapter-info">
              <el-checkbox v-model="selectedChapterIds" :label="chapter.id" />
              <span class="chapter-order">{{ chapter.order }}.</span>
              <span class="chapter-title">{{ chapter.title }}</span>
              <el-tag size="small" class="courseware-count">
                {{ getChapterCoursewareCount(chapter.id) }} 个课件
              </el-tag>
            </div>
            <div class="chapter-actions">
              <el-button size="small" @click="handleEditChapter(chapter)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" @click="handleAddCourseware(chapter.id)">
                <el-icon><VideoCameraFilled /></el-icon>
                添加课件
              </el-button>
              <el-button size="small" @click="handleDeleteChapter(chapter)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
              <el-button size="small" @click="handleMoveUp(chapter)">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button size="small" @click="handleMoveDown(chapter)">
                <el-icon><ArrowDown /></el-icon>
              </el-button>
            </div>
          </div>
        </template>
        
        <!-- 章节内课件列表 -->
        <div class="courseware-list">
          <el-empty v-if="getChapterCoursewares(chapter.id).length === 0" description="暂无课件" />
          <div v-else class="courseware-items">
            <div
              v-for="courseware in getChapterCoursewares(chapter.id)"
              :key="courseware.id"
              class="courseware-item"
            >
              <el-icon :size="16">
                  <VideoCameraFilled v-if="courseware.type === 1" />
                  <Headset v-else />
                </el-icon>
              <span class="courseware-title">{{ courseware.title }}</span>
              <span class="courseware-duration">{{ formatDuration(courseware.duration) }}</span>
              <el-button
                size="small"
                circle
                @click="handleRemoveCourseware(chapter.id, courseware.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
      
      <el-empty v-if="props.course.chapters.length === 0" description="暂无章节" />
    </div>

    <!-- 添加章节对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加章节"
      width="400px"
    >
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="章节名称" required>
          <el-input v-model="addForm.title" placeholder="请输入章节名称" />
        </el-form-item>
        <el-form-item label="排序位置">
          <el-input-number
            v-model="addForm.order"
            :min="1"
            :max="props.course.chapters.length + 1"
            :step="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmAdd">确定添加</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑章节对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑章节"
      width="400px"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="章节名称" required>
          <el-input v-model="editForm.title" placeholder="请输入章节名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmEdit">确定修改</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加课件到章节对话框 -->
    <el-dialog
      v-model="addCoursewareDialogVisible"
      title="添加课件到章节"
      width="600px"
    >
      <div class="add-courseware-content">
        <h4>选择要添加的课件</h4>
        <el-checkbox-group v-model="selectedCoursewareIds">
          <el-checkbox
            v-for="courseware in getUnassignedCoursewares"
            :key="courseware.id"
            :label="courseware.id"
            class="courseware-checkbox"
          >
            <div class="courseware-info">
              <el-icon :size="16">
                <VideoCameraFilled v-if="courseware.type === 1" />
                <Headset v-else />
              </el-icon>
              <span class="courseware-title">{{ courseware.title }}</span>
              <span class="courseware-meta">
                {{ formatDuration(courseware.duration) }} · {{ formatFileSize(courseware.size) }}
              </span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
        <el-empty v-if="getUnassignedCoursewares.length === 0" description="暂无未分配的课件" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCoursewareDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmAddCourseware" :disabled="selectedCoursewareIds.length === 0">
            确定添加
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 排序章节对话框 -->
    <el-dialog
      v-model="sortDialogVisible"
      title="排序章节"
      width="400px"
    >
      <el-form label-width="80px">
        <div
          v-for="chapter in sortedChapters"
          :key="chapter.id"
          class="sort-item"
        >
          <el-form-item :label="chapter.title">
            <el-input-number
              v-model="chapter.order"
              :min="1"
              :max="props.course.chapters.length"
              :step="1"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sortDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmSort">确定排序</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Delete,
  Top,
  Refresh,
  Edit,
  VideoCameraFilled,
  ArrowUp,
  ArrowDown,
  Headset
} from '@element-plus/icons-vue'

const props = defineProps<{
  course: any
}>()

const emit = defineEmits<{
  'update:course': [course: any]
}>()

// 状态管理
const selectedChapterIds = ref<number[]>([])
const selectedCoursewareIds = ref<number[]>([])
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addCoursewareDialogVisible = ref(false)
const sortDialogVisible = ref(false)

// 表单数据
const addForm = ref({
  title: '',
  order: 1
})

const editForm = ref({
  id: 0,
  title: ''
})

const currentChapterId = ref(0)

// 排序章节数据
const sortedChapters = ref<any[]>([])

// 获取章节的课件数量
function getChapterCoursewareCount(chapterId: number): number {
  return props.course.coursewares.filter(
    (courseware: any) => courseware.chapterId === chapterId
  ).length
}

// 获取章节的课件列表
function getChapterCoursewares(chapterId: number): any[] {
  return props.course.coursewares.filter(
    (courseware: any) => courseware.chapterId === chapterId
  )
}

// 获取未分配的课件
const getUnassignedCoursewares = computed(() => {
  return props.course.coursewares.filter(
    (courseware: any) => !courseware.chapterId || courseware.chapterId === 0
  )
})

// 格式化时长
function formatDuration(seconds: number): string {
  if (!seconds) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 添加章节
function handleAddChapter() {
  addForm.value.title = ''
  addForm.value.order = props.course.chapters.length + 1
  addDialogVisible.value = true
}

// 编辑章节
function handleEditChapter(chapter: any) {
  editForm.value.id = chapter.id
  editForm.value.title = chapter.title
  editDialogVisible.value = true
}

// 删除章节
function handleDeleteChapter(chapter: any) {
  const coursewareCount = getChapterCoursewareCount(chapter.id)
  
  if (coursewareCount > 0) {
    ElMessageBox.confirm(
      `该章节包含 ${coursewareCount} 个课件，删除章节会将这些课件设为未分配状态。确定要删除该章节吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }
    ).then(() => {
      performDeleteChapter(chapter.id)
    }).catch(() => {})
  } else {
    ElMessageBox.confirm(
      '确定要删除该章节吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }
    ).then(() => {
      performDeleteChapter(chapter.id)
    }).catch(() => {})
  }
}

// 执行删除章节
function performDeleteChapter(chapterId: number) {
  // 从章节列表中删除
  const updatedChapters = props.course.chapters.filter(
    (chapter: any) => chapter.id !== chapterId
  )
  
  // 更新剩余章节的排序
  const reorderedChapters = updatedChapters.map((chapter: any, index: number) => ({
    ...chapter,
    order: index + 1
  }))
  
  // 将章节内的课件设为未分配
  const updatedCoursewares = props.course.coursewares.map((courseware: any) => {
    if (courseware.chapterId === chapterId) {
      return { ...courseware, chapterId: 0 }
    }
    return courseware
  })
  
  const updatedCourse = {
    ...props.course,
    chapters: reorderedChapters,
    coursewares: updatedCoursewares
  }
  
  emit('update:course', updatedCourse)
  ElMessage.success('章节删除成功')
}

// 批量删除章节
function handleBatchDelete() {
  if (selectedChapterIds.value.length === 0) return
  
  ElMessageBox.confirm(
    `确定要删除选中的${selectedChapterIds.value.length}个章节吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    // 从章节列表中删除
    const updatedChapters = props.course.chapters.filter(
      (chapter: any) => !selectedChapterIds.value.includes(chapter.id)
    )
    
    // 更新剩余章节的排序
    const reorderedChapters = updatedChapters.map((chapter: any, index: number) => ({
      ...chapter,
      order: index + 1
    }))
    
    // 将章节内的课件设为未分配
    const updatedCoursewares = props.course.coursewares.map((courseware: any) => {
      if (selectedChapterIds.value.includes(courseware.chapterId)) {
        return { ...courseware, chapterId: 0 }
      }
      return courseware
    })
    
    const updatedCourse = {
      ...props.course,
      chapters: reorderedChapters,
      coursewares: updatedCoursewares
    }
    
    emit('update:course', updatedCourse)
    selectedChapterIds.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

// 排序章节
function handleSortChapters() {
  sortedChapters.value = [...props.course.chapters].sort((a, b) => a.order - b.order)
  sortDialogVisible.value = true
}

// 刷新
function handleRefresh() {
  ElMessage.success('刷新成功')
}

// 向上移动章节
function handleMoveUp(chapter: any) {
  if (chapter.order === 1) return
  
  const updatedChapters = props.course.chapters.map((c: any) => {
    if (c.order === chapter.order - 1) {
      return { ...c, order: c.order + 1 }
    }
    if (c.id === chapter.id) {
      return { ...c, order: c.order - 1 }
    }
    return c
  })
  
  const updatedCourse = { ...props.course, chapters: updatedChapters }
  emit('update:course', updatedCourse)
  ElMessage.success('章节已上移')
}

// 向下移动章节
function handleMoveDown(chapter: any) {
  if (chapter.order === props.course.chapters.length) return
  
  const updatedChapters = props.course.chapters.map((c: any) => {
    if (c.order === chapter.order + 1) {
      return { ...c, order: c.order - 1 }
    }
    if (c.id === chapter.id) {
      return { ...c, order: c.order + 1 }
    }
    return c
  })
  
  const updatedCourse = { ...props.course, chapters: updatedChapters }
  emit('update:course', updatedCourse)
  ElMessage.success('章节已下移')
}

// 添加课件到章节
function handleAddCourseware(chapterId: number) {
  currentChapterId.value = chapterId
  selectedCoursewareIds.value = []
  addCoursewareDialogVisible.value = true
}

// 从章节中移除课件
function handleRemoveCourseware(chapterId: number, coursewareId: number) {
  ElMessageBox.confirm(
    '确定要将该课件从章节中移除吗？',
    '移除课件',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const updatedCoursewares = props.course.coursewares.map((courseware: any) => {
      if (courseware.id === coursewareId) {
        return { ...courseware, chapterId: 0 }
      }
      return courseware
    })
    
    const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
    emit('update:course', updatedCourse)
    ElMessage.success('课件已移除')
  }).catch(() => {})
}

// 确认添加章节
function handleConfirmAdd() {
  if (!addForm.value.title) {
    ElMessage.error('请输入章节名称')
    return
  }
  
  const newChapter = {
    id: Date.now(),
    title: addForm.value.title,
    order: addForm.value.order,
    coursewareIds: []
  }
  
  // 插入到指定位置
  const updatedChapters = [...props.course.chapters, newChapter]
    .sort((a, b) => a.order - b.order)
    .map((chapter, index) => ({
      ...chapter,
      order: index + 1
    }))
  
  const updatedCourse = { ...props.course, chapters: updatedChapters }
  emit('update:course', updatedCourse)
  
  addDialogVisible.value = false
  ElMessage.success('章节添加成功')
}

// 确认编辑章节
function handleConfirmEdit() {
  if (!editForm.value.title) {
    ElMessage.error('请输入章节名称')
    return
  }
  
  const updatedChapters = props.course.chapters.map((chapter: any) => {
    if (chapter.id === editForm.value.id) {
      return { ...chapter, title: editForm.value.title }
    }
    return chapter
  })
  
  const updatedCourse = { ...props.course, chapters: updatedChapters }
  emit('update:course', updatedCourse)
  
  editDialogVisible.value = false
  ElMessage.success('章节编辑成功')
}

// 确认添加课件到章节
function handleConfirmAddCourseware() {
  if (selectedCoursewareIds.value.length === 0) return
  
  const updatedCoursewares = props.course.coursewares.map((courseware: any) => {
    if (selectedCoursewareIds.value.includes(courseware.id)) {
      return { ...courseware, chapterId: currentChapterId.value }
    }
    return courseware
  })
  
  const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
  emit('update:course', updatedCourse)
  
  addCoursewareDialogVisible.value = false
  ElMessage.success(`成功添加${selectedCoursewareIds.value.length}个课件到章节`)
}

// 确认排序章节
function handleConfirmSort() {
  const updatedChapters = sortedChapters.value.map((chapter: any) => ({
    ...chapter,
    order: chapter.order
  }))
  
  const updatedCourse = { ...props.course, chapters: updatedChapters }
  emit('update:course', updatedCourse)
  
  sortDialogVisible.value = false
  ElMessage.success('章节排序成功')
}
</script>

<style scoped lang="scss">
.chapter-manager {
  .chapter-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .chapter-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .chapter-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .chapter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .chapter-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .chapter-order {
    font-weight: 600;
    color: #1890ff;
    min-width: 24px;
  }

  .chapter-title {
    font-size: 16px;
    font-weight: 500;
    flex: 1;
  }

  .courseware-count {
    background: #f0f9ff;
    color: #1890ff;
  }

  .courseware-list {
    margin-top: 16px;
  }

  .courseware-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .courseware-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .courseware-title {
    flex: 1;
    font-size: 14px;
  }

  .courseware-meta {
    font-size: 12px;
    color: #909399;
  }

  .add-courseware-content {
    max-height: 400px;
    overflow-y: auto;
  }

  .courseware-checkbox {
    display: block;
    margin-bottom: 8px;
  }

  .courseware-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sort-item {
    margin-bottom: 12px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
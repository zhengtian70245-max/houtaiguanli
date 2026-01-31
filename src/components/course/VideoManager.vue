<template>
  <div class="video-manager">
    <!-- 操作栏 -->
    <div class="video-actions">
      <el-button type="primary" @click="handleUploadVideo">
        <el-icon><UploadFilled /></el-icon>
        上传课件
      </el-button>
      <el-button @click="handleSelectFromMaterial">
          <el-icon><FolderOpened /></el-icon>
          从素材库选择
        </el-button>
      <el-button @click="handleBatchDelete" :disabled="selectedVideoIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="课件名称">
        <el-input v-model="searchForm.keyword" placeholder="请输入课件名称" clearable />
      </el-form-item>
      <el-form-item label="课件类型">
        <el-select v-model="searchForm.type" placeholder="请选择课件类型" clearable>
          <el-option label="全部" :value="0" />
          <el-option label="视频" :value="1" />
          <el-option label="音频" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="全部" :value="-1" />
          <el-option label="就绪" :value="2" />
          <el-option label="上传中" :value="0" />
          <el-option label="转码中" :value="1" />
          <el-option label="失败" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 课件列表 -->
    <el-table
      v-loading="loading"
      :data="filteredVideos"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="title" label="课件标题" min-width="200">
        <template #default="{ row }">
          <div class="video-title">
            <el-icon :size="20">
              <VideoCameraFilled v-if="row.type === 1" />
              <Headset v-else />
            </el-icon>
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属章节" width="180" align="center">
        <template #default="{ row }">
          <span>{{ getChapterName(row.chapterId) || '未分配' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="100" align="center">
        <template #default="{ row }">
          {{ formatDuration(row.duration) }}
        </template>
      </el-table-column>
      <el-table-column label="大小" width="120" align="center">
        <template #default="{ row }">
          {{ formatFileSize(row.size) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" width="180" align="center" />
      <el-table-column label="操作" width="250" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleEditVideo(row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" @click="handlePreviewVideo(row)">
            <el-icon><VideoPlay /></el-icon>
            预览
          </el-button>
          <el-button size="small" @click="handleAssignChapter(row)">
            <el-icon><Link /></el-icon>
            分配章节
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteVideo(row)">
            <el-icon><Delete /></el-icon>
            删除
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
        :total="filteredVideos.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 上传视频对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传课件"
      width="500px"
    >
      <el-form :model="uploadForm" label-width="80px">
        <el-form-item label="课件名称">
          <el-input v-model="uploadForm.title" placeholder="请输入课件名称" />
        </el-form-item>
        <el-form-item label="课件类型">
          <el-select v-model="uploadForm.type" placeholder="请选择课件类型">
            <el-option label="视频" :value="1" />
            <el-option label="音频" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属章节">
          <el-select v-model="uploadForm.chapterId" placeholder="请选择章节">
            <el-option label="未分配" :value="0" />
            <el-option
              v-for="chapter in props.course.chapters"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课件文件">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择文件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                {{ uploadForm.type === 1 ? '请上传视频文件（MP4、MOV等）' : '请上传音频文件（MP3、WAV等）' }}
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmUpload">确定上传</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 从素材库选择对话框 -->
    <el-dialog
      v-model="materialDialogVisible"
      title="从素材库选择"
      width="800px"
    >
      <div class="material-selector">
        <el-form :inline="true" :model="materialSearchForm" class="search-form">
          <el-form-item label="素材名称">
            <el-input v-model="materialSearchForm.keyword" placeholder="请输入素材名称" clearable />
          </el-form-item>
          <el-form-item label="素材类型">
            <el-select v-model="materialSearchForm.type" placeholder="请选择素材类型" clearable>
              <el-option label="全部" :value="0" />
              <el-option label="视频" :value="1" />
              <el-option label="音频" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearchMaterial">搜索</el-button>
            <el-button @click="handleResetMaterialSearch">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="materialList"
          style="width: 100%"
          border
          stripe
          @selection-change="handleMaterialSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="name" label="素材名称" min-width="200" />
          <el-table-column label="素材类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.type === 1 ? 'info' : 'success'">
                {{ row.type === 1 ? '视频' : '音频' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="大小" width="120" align="center">
            <template #default="{ row }">
              {{ formatFileSize(row.size) }}
            </template>
          </el-table-column>
          <el-table-column label="时长" width="100" align="center">
            <template #default="{ row }">
              {{ formatDuration(row.duration) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">
                {{ row.status ? '可用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="materialDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmSelectMaterial" :disabled="selectedMaterialIds.length === 0">
            确定选择
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑视频对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑课件"
      width="500px"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="课件名称">
          <el-input v-model="editForm.title" placeholder="请输入课件名称" />
        </el-form-item>
        <el-form-item label="所属章节">
          <el-select v-model="editForm.chapterId" placeholder="请选择章节">
            <el-option label="未分配" :value="0" />
            <el-option
              v-for="chapter in props.course.chapters"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课件描述">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入课件描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmEdit">确定修改</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配章节对话框 -->
    <el-dialog
      v-model="assignDialogVisible"
      title="分配章节"
      width="400px"
    >
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="所属章节">
          <el-select v-model="assignForm.chapterId" placeholder="请选择章节">
            <el-option label="未分配" :value="0" />
            <el-option
              v-for="chapter in props.course.chapters"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmAssign">确定分配</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UploadFilled,
  FolderOpened,
  Delete,
  Refresh,
  VideoCameraFilled,
  Headset,
  Upload,
  Edit,
  VideoPlay,
  Link
} from '@element-plus/icons-vue'

const props = defineProps<{
  course: any
}>()

const emit = defineEmits<{
  'update:course': [course: any]
}>()

// 状态管理
const loading = ref(false)
const selectedVideoIds = ref<number[]>([])
const uploadDialogVisible = ref(false)
const materialDialogVisible = ref(false)
const editDialogVisible = ref(false)
const assignDialogVisible = ref(false)

// 搜索筛选
const searchForm = reactive({
  keyword: '',
  type: 0,
  status: -1
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10
})

// 上传表单
const uploadForm = reactive({
  title: '',
  type: 1,
  chapterId: 0,
  file: null
})

// 编辑表单
const editForm = reactive({
  id: 0,
  title: '',
  chapterId: 0,
  description: ''
})

// 分配章节表单
const assignForm = reactive({
  videoId: 0,
  chapterId: 0
})

// 素材库相关
const materialList = ref<any[]>([
  {
    id: 1,
    name: 'JavaScript基础',
    type: 1,
    size: 1024 * 1024 * 50,
    duration: 600,
    status: true,
    url: 'https://example.com/video1.mp4'
  },
  {
    id: 2,
    name: 'CSS高级技巧',
    type: 1,
    size: 1024 * 1024 * 80,
    duration: 900,
    status: true,
    url: 'https://example.com/video2.mp4'
  },
  {
    id: 3,
    name: 'Vue3入门',
    type: 2,
    size: 1024 * 1024 * 20,
    duration: 480,
    status: true,
    url: 'https://example.com/audio1.mp3'
  }
])

const materialSearchForm = reactive({
  keyword: '',
  type: 0
})

const selectedMaterialIds = ref<number[]>([])

// 过滤后的视频列表
const filteredVideos = computed(() => {
  let videos = [...(props.course.coursewares || [])]
  
  // 按关键词筛选
  if (searchForm.keyword) {
    videos = videos.filter(video => 
      video.title.includes(searchForm.keyword)
    )
  }
  
  // 按类型筛选
  if (searchForm.type) {
    videos = videos.filter(video => video.type === searchForm.type)
  }
  
  // 按状态筛选
  if (searchForm.status !== -1) {
    videos = videos.filter(video => video.status === searchForm.status)
  }
  
  return videos
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

// 获取章节名称
function getChapterName(chapterId: number): string {
  if (!chapterId) return ''
  const chapter = props.course.chapters?.find((c: any) => c.id === chapterId)
  return chapter?.title || ''
}

// 获取状态类型
function getStatusType(status: number): string {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'info'
    case 2: return 'success'
    case 3: return 'danger'
    default: return ''
  }
}

// 获取状态文本
function getStatusText(status: number): string {
  switch (status) {
    case 0: return '上传中'
    case 1: return '转码中'
    case 2: return '就绪'
    case 3: return '失败'
    default: return ''
  }
}

// 选择视频
function handleSelectionChange(selection: any[]) {
  selectedVideoIds.value = selection.map(item => item.id)
}

// 上传视频
function handleUploadVideo() {
  uploadForm.title = ''
  uploadForm.type = props.course.type || 1
  uploadForm.chapterId = 0
  uploadForm.file = null
  uploadDialogVisible.value = true
}

// 从素材库选择
function handleSelectFromMaterial() {
  selectedMaterialIds.value = []
  materialDialogVisible.value = true
}

// 批量删除
function handleBatchDelete() {
  ElMessageBox.confirm(
    `确定要删除选中的${selectedVideoIds.value.length}个课件吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    const updatedCoursewares = props.course.coursewares.filter(
      (video: any) => !selectedVideoIds.value.includes(video.id)
    )
    const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
    emit('update:course', updatedCourse)
    selectedVideoIds.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

// 刷新
function handleRefresh() {
  ElMessage.success('刷新成功')
}

// 编辑视频
function handleEditVideo(video: any) {
  editForm.id = video.id
  editForm.title = video.title
  editForm.chapterId = video.chapterId || 0
  editForm.description = video.description || ''
  editDialogVisible.value = true
}

// 预览视频
function handlePreviewVideo(video: any) {
  ElMessageBox.alert(
    `<div style="text-align: center;">
      <h3>${video.title}</h3>
      <p>类型: ${video.type === 1 ? '视频' : '音频'}</p>
      <p>大小: ${formatFileSize(video.size)}</p>
      <p>时长: ${formatDuration(video.duration)}</p>
      <p>URL: ${video.url}</p>
      ${video.description ? `<p>描述: ${video.description}</p>` : ''}
    </div>`,
    '课件预览',
    {
      dangerouslyUseHTMLString: true
    }
  )
}

// 分配章节
function handleAssignChapter(video: any) {
  assignForm.videoId = video.id
  assignForm.chapterId = video.chapterId || 0
  assignDialogVisible.value = true
}

// 删除视频
function handleDeleteVideo(video: any) {
  ElMessageBox.confirm(
    `确定要删除课件"${video.title}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    const updatedCoursewares = props.course.coursewares.filter(
      (v: any) => v.id !== video.id
    )
    const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
    emit('update:course', updatedCourse)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 文件变化
function handleFileChange(file: any) {
  uploadForm.file = file.raw
}

// 上传前验证
function beforeUpload(file: any) {
  const isVideo = uploadForm.type === 1 && file.type.startsWith('video/')
  const isAudio = uploadForm.type === 2 && file.type.startsWith('audio/')
  
  if (!isVideo && !isAudio) {
    ElMessage.error(uploadForm.type === 1 ? '请上传视频文件' : '请上传音频文件')
    return false
  }
  
  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.error('文件大小不能超过 500MB')
    return false
  }
  
  return true
}

// 确认上传
function handleConfirmUpload() {
  if (!uploadForm.title) {
    ElMessage.error('请输入课件名称')
    return
  }
  
  if (!uploadForm.file) {
    ElMessage.error('请选择文件')
    return
  }
  
  // 模拟上传
  loading.value = true
  setTimeout(() => {
    const newVideo = {
      id: Date.now(),
      title: uploadForm.title,
      type: uploadForm.type,
      url: URL.createObjectURL(uploadForm.file),
      duration: Math.floor(Math.random() * 3600) + 60,
      size: uploadForm.file.size,
      status: 2,
      chapterId: uploadForm.chapterId || 0,
      description: '',
      uploadTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    
    const updatedCoursewares = [...(props.course.coursewares || []), newVideo]
    const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
    emit('update:course', updatedCourse)
    
    uploadDialogVisible.value = false
    loading.value = false
    ElMessage.success('上传成功')
  }, 1500)
}

// 搜索素材
function handleSearchMaterial() {
  ElMessage.success('搜索成功')
}

// 重置素材搜索
function handleResetMaterialSearch() {
  materialSearchForm.keyword = ''
  materialSearchForm.type = 0
}

// 选择素材
function handleMaterialSelectionChange(selection: any[]) {
  selectedMaterialIds.value = selection.map(item => item.id)
}

// 确认选择素材
function handleConfirmSelectMaterial() {
  const selectedMaterials = materialList.value.filter(
    (material: any) => selectedMaterialIds.value.includes(material.id)
  )
  
  const newVideos = selectedMaterials.map((material: any) => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: material.name,
    type: material.type,
    url: material.url,
    duration: material.duration,
    size: material.size,
    status: 2,
    chapterId: 0,
    description: '',
    uploadTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }))
  
  const updatedCoursewares = [...(props.course.coursewares || []), ...newVideos]
  const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
  emit('update:course', updatedCourse)
  
  materialDialogVisible.value = false
  ElMessage.success(`成功添加${newVideos.length}个课件`)
}

// 确认编辑
function handleConfirmEdit() {
  if (!editForm.title) {
    ElMessage.error('请输入课件名称')
    return
  }
  
  const updatedCoursewares = props.course.coursewares.map((video: any) => {
    if (video.id === editForm.id) {
      return {
        ...video,
        title: editForm.title,
        chapterId: editForm.chapterId,
        description: editForm.description
      }
    }
    return video
  })
  
  const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
  emit('update:course', updatedCourse)
  
  editDialogVisible.value = false
  ElMessage.success('编辑成功')
}

// 确认分配章节
function handleConfirmAssign() {
  const updatedCoursewares = props.course.coursewares.map((video: any) => {
    if (video.id === assignForm.videoId) {
      return {
        ...video,
        chapterId: assignForm.chapterId
      }
    }
    return video
  })
  
  const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
  emit('update:course', updatedCourse)
  
  assignDialogVisible.value = false
  ElMessage.success('章节分配成功')
}

// 分页变化
function handleSizeChange(size: number) {
  pagination.size = size
}

function handleCurrentChange(page: number) {
  pagination.page = page
}
</script>

<style scoped lang="scss">
.video-manager {
  .video-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .video-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .material-selector {
    max-height: 400px;
    overflow-y: auto;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
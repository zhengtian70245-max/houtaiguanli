<template>
  <div class="video-manager">
    <!-- 操作栏 -->
    <div class="video-actions">
      <a-button type="primary" @click="handleUploadVideo">
        <template #icon>
          <icon-upload />
        </template>
        上传课件
      </a-button>
      <a-button @click="handleSelectFromMaterial">
        <template #icon>
          <icon-folder />
        </template>
        从素材库选择
      </a-button>
      <a-button @click="handleBatchDelete" :disabled="selectedVideoIds.length === 0">
        <template #icon>
          <icon-delete />
        </template>
        批量删除
      </a-button>
      <a-button @click="handleRefresh">
        <template #icon>
          <icon-refresh />
        </template>
        刷新
      </a-button>
    </div>

    <!-- 搜索筛选 -->
    <a-form :model="searchForm" class="search-form" layout="inline">
      <a-form-item label="课件名称">
        <a-input v-model="searchForm.keyword" placeholder="请输入课件名称" allow-clear />
      </a-form-item>
      <a-form-item label="课件类型">
        <a-select v-model="searchForm.type" placeholder="请选择课件类型" allow-clear>
          <a-option label="全部" :value="0" />
          <a-option label="视频" :value="1" />
          <a-option label="音频" :value="2" />
        </a-select>
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear>
          <a-option label="全部" :value="-1" />
          <a-option label="就绪" :value="2" />
          <a-option label="上传中" :value="0" />
          <a-option label="转码中" :value="1" />
          <a-option label="失败" :value="3" />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-form-item>
    </a-form>

    <!-- 课件列表 -->
    <a-table
      :loading="loading"
      :data="filteredVideos"
      bordered
      stripe
      @row-selection-change="handleSelectionChange"
    >
      <template #selection>
        <a-checkbox />
      </template>
      <a-table-column data-index="id" title="ID" width="80" align="center" />
      <a-table-column data-index="title" title="课件标题" min-width="200">
        <template #cell="{ record }">
          <div class="video-title">
            <a-icon :name="record.type === 1 ? 'video-camera' : 'headphones'" />
            <span>{{ record.title }}</span>
          </div>
        </template>
      </a-table-column>
      <a-table-column title="所属章节" width="180" align="center">
        <template #cell="{ record }">
          <span>{{ getChapterName(record.chapterId) || '未分配' }}</span>
        </template>
      </a-table-column>
      <a-table-column title="时长" width="100" align="center">
        <template #cell="{ record }">
          {{ formatDuration(record.duration) }}
        </template>
      </a-table-column>
      <a-table-column title="大小" width="120" align="center">
        <template #cell="{ record }">
          {{ formatFileSize(record.size) }}
        </template>
      </a-table-column>
      <a-table-column title="状态" width="120" align="center">
        <template #cell="{ record }">
          <a-tag :color="getStatusType(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
      </a-table-column>
      <a-table-column data-index="uploadTime" title="上传时间" width="180" align="center" />
      <a-table-column title="操作" width="250" align="center">
        <template #cell="{ record }">
          <a-button size="small" type="primary" @click="handleEditVideo(record)">
            <template #icon>
              <icon-edit />
            </template>
            编辑
          </a-button>
          <a-button size="small" @click="handlePreviewVideo(record)">
            <template #icon>
              <icon-play-circle />
            </template>
            预览
          </a-button>
          <a-button size="small" @click="handleAssignChapter(record)">
            <template #icon>
              <icon-link />
            </template>
            分配章节
          </a-button>
          <a-button size="small" type="danger" @click="handleDeleteVideo(record)">
            <template #icon>
              <icon-delete />
            </template>
            删除
          </a-button>
        </template>
      </a-table-column>
    </a-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="filteredVideos.length"
        @size-change="handleSizeChange"
        @change="handleCurrentChange"
      />
    </div>

    <!-- 上传视频对话框 -->
    <a-modal
      v-model:visible="uploadDialogVisible"
      title="上传课件"
      width="500px"
    >
      <a-form :model="uploadForm" label-width="80px">
        <a-form-item label="课件名称">
          <a-input v-model="uploadForm.title" placeholder="请输入课件名称" />
        </a-form-item>
        <a-form-item label="课件类型">
          <a-select v-model="uploadForm.type" placeholder="请选择课件类型">
            <a-option label="视频" :value="1" />
            <a-option label="音频" :value="2" />
          </a-select>
        </a-form-item>
        <a-form-item label="所属章节">
          <a-select v-model="uploadForm.chapterId" placeholder="请选择章节">
            <a-option label="未分配" :value="0" />
            <a-option
              v-for="chapter in props.course.chapters"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </a-select>
        </a-form-item>
        <a-form-item label="课件文件">
          <a-upload
            class="upload-demo"
            :action="'#'"
            :auto-upload="false"
            :show-file-list="true"
            @change="handleFileChange"
          >
            <a-button type="primary">
              <template #icon>
                <icon-upload />
              </template>
              选择文件
            </a-button>
            <template #tip>
              <div class="upload-tip">
                {{ uploadForm.type === 1 ? '请上传视频文件（MP4、MOV等）' : '请上传音频文件（MP3、WAV等）' }}
              </div>
            </template>
          </a-upload>
        </a-form-item>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="uploadDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="handleConfirmUpload">确定上传</a-button>
        </span>
      </template>
    </a-modal>

    <!-- 从素材库选择对话框 -->
    <a-modal
      v-model:visible="materialDialogVisible"
      title="从素材库选择"
      width="800px"
    >
      <div class="material-selector">
        <a-form :model="materialSearchForm" class="search-form" layout="inline">
          <a-form-item label="素材名称">
            <a-input v-model="materialSearchForm.keyword" placeholder="请输入素材名称" allow-clear />
          </a-form-item>
          <a-form-item label="素材类型">
            <a-select v-model="materialSearchForm.type" placeholder="请选择素材类型" allow-clear>
              <a-option label="全部" :value="0" />
              <a-option label="视频" :value="1" />
              <a-option label="音频" :value="2" />
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearchMaterial">搜索</a-button>
            <a-button @click="handleResetMaterialSearch">重置</a-button>
          </a-form-item>
        </a-form>

        <a-table
          :data="materialList"
          bordered
          stripe
          @row-selection-change="handleMaterialSelectionChange"
        >
          <template #selection>
            <a-checkbox />
          </template>
          <a-table-column data-index="id" title="ID" width="80" align="center" />
          <a-table-column data-index="name" title="素材名称" min-width="200" />
          <a-table-column title="素材类型" width="100" align="center">
            <template #cell="{ record }">
              <a-tag :color="record.type === 1 ? 'blue' : 'green'">
                {{ record.type === 1 ? '视频' : '音频' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="大小" width="120" align="center">
            <template #cell="{ record }">
              {{ formatFileSize(record.size) }}
            </template>
          </a-table-column>
          <a-table-column title="时长" width="100" align="center">
            <template #cell="{ record }">
              {{ formatDuration(record.duration) }}
            </template>
          </a-table-column>
          <a-table-column title="状态" width="100" align="center">
            <template #cell="{ record }">
              <a-tag :color="record.status ? 'green' : 'red'">
                {{ record.status ? '可用' : '禁用' }}
              </a-tag>
            </template>
          </a-table-column>
        </a-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="materialDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="handleConfirmSelectMaterial" :disabled="selectedMaterialIds.length === 0">
            确定选择
          </a-button>
        </span>
      </template>
    </a-modal>

    <!-- 编辑视频对话框 -->
    <a-modal
      v-model:visible="editDialogVisible"
      title="编辑课件"
      width="500px"
    >
      <a-form :model="editForm" label-width="80px">
        <a-form-item label="课件名称">
          <a-input v-model="editForm.title" placeholder="请输入课件名称" />
        </a-form-item>
        <a-form-item label="所属章节">
          <a-select v-model="editForm.chapterId" placeholder="请选择章节">
            <a-option label="未分配" :value="0" />
            <a-option
              v-for="chapter in props.course.chapters"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </a-select>
        </a-form-item>
        <a-form-item label="课件描述">
          <a-textarea
            v-model="editForm.description"
            :rows="4"
            placeholder="请输入课件描述"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="editDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="handleConfirmEdit">确定修改</a-button>
        </span>
      </template>
    </a-modal>

    <!-- 分配章节对话框 -->
    <a-modal
      v-model:visible="assignDialogVisible"
      title="分配章节"
      width="400px"
    >
      <a-form :model="assignForm" label-width="80px">
        <a-form-item label="所属章节">
          <a-select v-model="assignForm.chapterId" placeholder="请选择章节">
            <a-option label="未分配" :value="0" />
            <a-option
              v-for="chapter in props.course.chapters"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="assignDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="handleConfirmAssign">确定分配</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconUpload,
  IconFolder,
  IconDelete,
  IconRefresh,
  IconVideoCamera,
  IconHeadphones,
  IconEdit,
  IconPlayCircle,
  IconLink
} from '@arco-design/web-vue/es/icon'

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
    case 0: return 'yellow'
    case 1: return 'blue'
    case 2: return 'green'
    case 3: return 'red'
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
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的${selectedVideoIds.value.length}个课件吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      const updatedCoursewares = props.course.coursewares.filter(
        (video: any) => !selectedVideoIds.value.includes(video.id)
      )
      const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
      emit('update:course', updatedCourse)
      selectedVideoIds.value = []
      Message.success('批量删除成功')
    }
  })
}

// 刷新
function handleRefresh() {
  Message.success('刷新成功')
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
  Modal.info({
    title: '课件预览',
    content: `
      <div style="text-align: center;">
        <h3>${video.title}</h3>
        <p>类型: ${video.type === 1 ? '视频' : '音频'}</p>
        <p>大小: ${formatFileSize(video.size)}</p>
        <p>时长: ${formatDuration(video.duration)}</p>
        <p>URL: ${video.url}</p>
        ${video.description ? `<p>描述: ${video.description}</p>` : ''}
      </div>
    `,
    dangerouslyUseHTMLString: true
  })
}

// 分配章节
function handleAssignChapter(video: any) {
  assignForm.videoId = video.id
  assignForm.chapterId = video.chapterId || 0
  assignDialogVisible.value = true
}

// 删除视频
function handleDeleteVideo(video: any) {
  Modal.confirm({
    title: '删除确认',
    content: `确定要删除课件"${video.title}"吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      const updatedCoursewares = props.course.coursewares.filter(
        (v: any) => v.id !== video.id
      )
      const updatedCourse = { ...props.course, coursewares: updatedCoursewares }
      emit('update:course', updatedCourse)
      Message.success('删除成功')
    }
  })
}

// 文件变化
function handleFileChange(file: any) {
  uploadForm.file = file.file
}

// 确认上传
function handleConfirmUpload() {
  if (!uploadForm.title) {
    Message.error('请输入课件名称')
    return
  }
  
  if (!uploadForm.file) {
    Message.error('请选择文件')
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
    Message.success('上传成功')
  }, 1500)
}

// 搜索素材
function handleSearchMaterial() {
  Message.success('搜索成功')
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
  Message.success(`成功添加${newVideos.length}个课件`)
}

// 确认编辑
function handleConfirmEdit() {
  if (!editForm.title) {
    Message.error('请输入课件名称')
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
  Message.success('编辑成功')
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
  Message.success('章节分配成功')
}

// 分页变化
function handleSizeChange(size: number) {
  pagination.size = size
}

function handleCurrentChange(page: number) {
  pagination.page = page
}

// 搜索
function handleSearch() {
  Message.success('搜索成功')
}

// 重置
function handleReset() {
  searchForm.keyword = ''
  searchForm.type = 0
  searchForm.status = -1
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

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--arco-text-color-3);
  }
}
</style>
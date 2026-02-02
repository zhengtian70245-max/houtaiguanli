<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ $route.params.id ? '编辑素材' : '添加素材' }}</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" :label-width="'120px'" class="material-edit-form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="素材名称" required>
              <a-input v-model="form.name" placeholder="请输入素材名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="素材类型" required>
              <a-select v-model="form.type" placeholder="请选择素材类型">
                <a-option label="视频" :value="1" />
                <a-option label="音频" :value="2" />
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="素材文件" required>
              <a-upload
                class="material-uploader"
                :action="'#'"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :before-remove="onRemove"
                @file-list-change="onUploadChange"
              >
                <div v-if="form.url" class="material-preview">
                  <icon :icon="form.type === 1 ? iconVideo : iconAudio" />
                  <div class="material-info">
                    <div class="material-name">{{ form.name || '未命名素材' }}</div>
                    <div class="material-meta">
                      {{ form.type === 1 ? '视频文件' : '音频文件' }} · {{ formatFileSize(form.size) }}
                    </div>
                  </div>
                </div>
                <div v-else class="material-upload-area">
                  <a-icon :icon="iconPlus" />
                  <div class="upload-text">
                    <div>点击上传</div>
                    <div class="upload-hint">
                      {{ form.type === 1 ? '支持 MP4、MOV 等视频格式' : '支持 MP3、WAV 等音频格式' }}
                    </div>
                  </div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="素材时长（秒）">
              <a-input-number v-model="form.duration" :min="0" :precision="0" :step="1" placeholder="请输入时长" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="素材状态">
              <a-switch v-model="form.status" :active-text="form.status ? '可用' : '禁用'" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="素材描述">
              <a-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入素材描述" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
          <a-button @click="handleReset">重置</a-button>
          <a-button @click="handleCancel">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconVideo, IconAudio, IconPlus } from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const form = reactive({
  name: '',
  type: 1,
  url: '',
  size: 0,
  duration: 0,
  status: true,
  description: ''
})

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    const mockData = {
      id: id,
      name: '示例视频素材',
      type: 1,
      url: 'https://example.com/video.mp4',
      size: 1024 * 1024 * 100,
      duration: 180,
      status: true,
      description: '这是一个示例视频素材'
    }
    Object.assign(form, mockData)
  }
})

const beforeUpload = (file: File) => {
  if (file.size > 2 * 1024 * 1024 * 100) {
    Message.warning('文件大小不能超过200MB')
    return false
  }
  return true
}

const onRemove = (file: any) => {
  form.url = ''
  form.size = 0
}

const onUploadChange = (fileList: any[]) => {
  if (fileList.length > 0) {
    const file = fileList[fileList.length - 1]
    if (file.status === 'done') {
      form.url = file.url
      form.size = file.size
    }
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleSubmit = () => {
  if (!form.name) {
    Message.warning('请输入素材名称')
    return
  }
  if (!form.url) {
    Message.warning('请上传素材文件')
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    Message.success('提交成功')
    router.push('/course/material')
  }, 1500)
}

const handleReset = () => {
  const id = route.params.id as string
  if (id) {
    const mockData = {
      id: id,
      name: '',
      type: 1,
      url: '',
      size: 0,
      duration: 0,
      status: true,
      description: ''
    }
    Object.assign(form, mockData)
  } else {
    Object.assign(form, {
      name: '',
      type: 1,
      url: '',
      size: 0,
      duration: 0,
      status: true,
      description: ''
    })
  }
}

const handleCancel = () => {
  router.push('/course/material')
}
</script>

<style scoped lang="scss">
.page-container {
  .page-header {
    margin-bottom: 24px;
  }

  .page-content {
    .material-edit-form {
      :deep(.arco-form-item) {
        margin-bottom: 20px;
      }
    }
  }
}

.material-uploader {
  .material-preview {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;

    .material-icon {
      font-size: 48px;
      color: #165dff;
    }

    .material-info {
      .material-name {
        font-size: 16px;
        font-weight: 500;
      }

      .material-meta {
        color: #86909c;
        font-size: 14px;
      }
    }
  }

  .material-upload-area {
    padding: 40px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #165dff;
    }

    .upload-icon {
      font-size: 48px;
      color: #86909c;
      margin-bottom: 16px;
    }

    .upload-text {
      .upload-hint {
        color: #86909c;
        font-size: 14px;
        margin-top: 8px;
      }
    }
  }
}
</style>
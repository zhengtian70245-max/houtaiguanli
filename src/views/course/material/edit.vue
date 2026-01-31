<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ $route.params.id ? '编辑素材' : '添加素材' }}</h2>
    </div>
    <div class="page-content">
      <el-form :model="form" :label-width="'120px'" class="material-edit-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="素材名称" required>
              <el-input v-model="form.name" placeholder="请输入素材名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="素材类型" required>
              <el-select v-model="form.type" placeholder="请选择素材类型">
                <el-option label="视频" :value="1" />
                <el-option label="音频" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="素材文件" required>
              <el-upload
                class="material-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-remove="onRemove"
              >
                <div v-if="form.url" class="material-preview">
                  <el-icon class="material-icon"><VideoCameraFilled /></el-icon>
                  <div class="material-info">
                    <div class="material-name">{{ form.name || '未命名素材' }}</div>
                    <div class="material-meta">
                      {{ form.type === 1 ? '视频文件' : '音频文件' }} · {{ formatFileSize(form.size) }}
                    </div>
                  </div>
                </div>
                <div v-else class="material-upload-area">
                  <el-icon class="upload-icon"><Plus /></el-icon>
                  <div class="upload-text">
                    <div>点击上传</div>
                    <div class="upload-hint">
                      {{ form.type === 1 ? '支持 MP4、MOV 等视频格式' : '支持 MP3、WAV 等音频格式' }}
                    </div>
                  </div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="素材时长（秒）">
              <el-input-number v-model="form.duration" :min="0" :precision="0" :step="1" placeholder="请输入时长" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="素材状态">
              <el-switch v-model="form.status" :active-text="form.status ? '可用' : '禁用'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="素材描述">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入素材描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { VideoCameraFilled, Plus } from '@element-plus/icons-vue'

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

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 上传前验证
function beforeUpload(file: File): boolean {
  // 验证文件类型
  const isVideo = form.type === 1 && file.type.startsWith('video/')
  const isAudio = form.type === 2 && file.type.startsWith('audio/')
  
  if (!isVideo && !isAudio) {
    ElMessage.error(form.type === 1 ? '请上传视频文件' : '请上传音频文件')
    return false
  }
  
  // 验证文件大小（500MB限制）
  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.error('文件大小不能超过 500MB')
    return false
  }
  
  // 模拟上传成功
  form.url = URL.createObjectURL(file)
  form.size = file.size
  form.name = form.name || file.name
  
  // 提取时长（模拟）
  if (form.type === 1) {
    // 视频时长模拟
    form.duration = Math.floor(Math.random() * 3600) + 60
  } else {
    // 音频时长模拟
    form.duration = Math.floor(Math.random() * 1800) + 30
  }
  
  ElMessage.success('文件上传成功')
  return false
}

// 移除文件
function onRemove() {
  form.url = ''
  form.size = 0
  form.duration = 0
}

// 提交表单
async function handleSubmit() {
  if (!form.name) {
    ElMessage.error('请输入素材名称')
    return
  }
  
  if (!form.url) {
    ElMessage.error('请上传素材文件')
    return
  }
  
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const message = route.params.id ? '更新成功' : '添加成功'
    ElMessage.success(message)
    router.push('/course/material')
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
function handleReset() {
  form.name = ''
  form.type = 1
  form.url = ''
  form.size = 0
  form.duration = 0
  form.status = true
  form.description = ''
}

// 取消操作
function handleCancel() {
  router.push('/course/material')
}

// 初始化数据
onMounted(() => {
  const id = route.params.id
  if (id) {
    // 模拟加载素材数据
    form.name = '示例素材'
    form.type = 1
    form.url = 'https://example.com/video.mp4'
    form.size = 1024 * 1024 * 50
    form.duration = 600
    form.status = true
    form.description = '这是一个示例视频素材'
  }
})
</script>

<style scoped lang="scss">
.material-uploader {
  width: 100%;
}

.material-upload-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409eff;
    background: #f0f9ff;
  }
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
  color: #606266;
  
  .upload-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}

.material-preview {
  width: 100%;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
  display: flex;
  align-items: center;
}

.material-icon {
  font-size: 48px;
  color: #409eff;
  margin-right: 20px;
}

.material-info {
  flex: 1;
  
  .material-name {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 8px;
  }
  
  .material-meta {
    font-size: 14px;
    color: #606266;
  }
}

.material-edit-form {
  max-width: 800px;
}
</style>
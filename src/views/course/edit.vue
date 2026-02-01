<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ $route.params.id ? '编辑课程' : '添加课程' }}</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" layout="vertical" class="course-edit-form">
        <a-grid :cols="{ xs: 1, sm: 1, md: 2 }" :gutter="24">
          <a-grid-item>
            <a-form-item label="课程标题" :required="true">
              <a-input v-model="form.title" placeholder="请输入课程标题" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item label="课程分类" :required="true">
              <a-select v-model="form.category" placeholder="请选择课程分类">
                <a-option label="专业课" :value="1" />
                <a-option label="家长必修" :value="2" />
                <a-option label="精品专题" :value="3" />
                <a-option label="VIP专区" :value="4" />
              </a-select>
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item label="课程价格" :required="true">
              <a-input-number v-model="form.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格" style="width: 100%" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item label="课程时长（分钟）">
              <a-input-number v-model="form.duration" :min="0" :precision="0" :step="1" placeholder="请输入时长" style="width: 100%" />
            </a-form-item>
          </a-grid-item>
        </a-grid>
        
        <a-form-item label="课程简介" :required="true">
          <a-textarea v-model="form.intro" :rows="6" placeholder="请输入课程简介" />
        </a-form-item>
        
        <a-form-item label="课程封面">
          <a-upload
            class="upload-demo"
            :action="'#'"
            :auto-upload="false"
            :show-file-list="false"
            @change="handleFileChange"
          >
            <img v-if="form.cover" :src="form.cover" class="cover-preview" />
            <div v-else class="cover-uploader-icon">
              <a-icon name="plus-circle" />
              <span>上传封面</span>
            </div>
          </a-upload>
        </a-form-item>
        
        <a-form-item label="课程状态">
          <a-switch v-model="form.status" :checked-children="'上架'" :unchecked-children="'下架'" />
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
          <a-button style="margin-left: 12px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const form = reactive({
  title: '',
  category: 0,
  price: 0,
  duration: 0,
  intro: '',
  cover: '',
  status: true
})

function handleFileChange(file: any) {
  const selectedFile = file.file
  if (selectedFile) {
    const isImage = selectedFile.type.startsWith('image/')
    if (!isImage) {
      Message.error('请上传图片文件')
      return
    }
    const isLt2M = selectedFile.size / 1024 / 1024 < 2
    if (!isLt2M) {
      Message.error('图片大小不能超过 2MB')
      return
    }
    form.cover = URL.createObjectURL(selectedFile)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 800))
    const message = route.params.id ? '更新成功' : '添加成功'
    Message.success(message)
    // 跳回课程详情页
    router.push(`/course/detail/${route.params.id}`)
  } catch (error) {
    Message.error('操作失败')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.title = ''
  form.category = 0
  form.price = 0
  form.duration = 0
  form.intro = ''
  form.cover = ''
  form.status = true
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    // 模拟加载数据
    form.title = '高级JavaScript开发实战'
    form.category = 1
    form.price = 299
    form.duration = 1200
    form.intro = '本课程将带你深入了解JavaScript的高级特性和最佳实践，包括ES6+新特性、异步编程、设计模式等内容。通过大量的实战案例，帮助你快速提升JavaScript开发技能。'
    form.cover = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=JavaScript%20course%20cover%20with%20modern%20design%2C%20programming%20concepts%2C%20blue%20theme&image_size=square'
    form.status = true
  }
})
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.page-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.course-edit-form {
  max-width: 800px;
}

.cover-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.cover-uploader-icon {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px dashed #e4e7ed;
  
  &:hover {
    background: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
  }
  
  :deep(.arco-icon) {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 14px;
    color: #909399;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 12px;
  }
  
  .page-content {
    padding: 20px;
  }
  
  .cover-preview,
  .cover-uploader-icon {
    width: 150px;
    height: 150px;
  }
}
</style>
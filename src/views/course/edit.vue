<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ $route.params.id ? '编辑课程' : '添加课程' }}</h2>
    </div>
    <div class="page-content">
      <el-form :model="form" :label-width="'100px'" class="course-edit-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="课程标题" required>
              <el-input v-model="form.title" placeholder="请输入课程标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程分类" required>
              <el-select v-model="form.category" placeholder="请选择课程分类">
                <el-option label="专业课" :value="1" />
                <el-option label="家长必修" :value="2" />
                <el-option label="精品专题" :value="3" />
                <el-option label="VIP专区" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="课程价格" required>
              <el-input-number v-model="form.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程时长（分钟）">
              <el-input-number v-model="form.duration" :min="0" :precision="0" :step="1" placeholder="请输入时长" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="课程简介" required>
          <el-input v-model="form.intro" type="textarea" :rows="6" placeholder="请输入课程简介" />
        </el-form-item>
        <el-form-item label="课程封面">
          <el-upload
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-remove="onRemove"
          >
            <img v-if="form.cover" :src="form.cover" class="cover-preview" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程状态">
          <el-switch v-model="form.status" :active-text="form.status ? '上架' : '下架'" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()

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

function beforeUpload(file: any) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片文件')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  form.cover = URL.createObjectURL(file)
  return false
}

function onRemove() {
  form.cover = ''
}

async function handleSubmit() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const message = route.params.id ? '更新成功' : '添加成功'
    ElMessage.success(message)
  } catch (error) {
    ElMessage.error('操作失败')
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
    form.title = '课程标题示例'
    form.category = 1
    form.price = 198
    form.duration = 120
    form.intro = '这是一个优秀的课程，帮助您提升技能。'
  }
})
</script>

<style scoped lang="scss">
.cover-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.cover-uploader-icon {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  font-size: 24px;
  color: #909399;
}
</style>
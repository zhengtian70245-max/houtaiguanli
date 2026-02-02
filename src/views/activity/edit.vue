<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ $route.params.id ? '编辑活动' : '添加活动' }}</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
        <a-grid :cols="2" :colGap="24">
          <a-form-item label="活动标题" required>
            <a-input v-model="form.title" placeholder="请输入活动标题" />
          </a-form-item>
          <a-form-item label="活动类型" required>
            <a-select v-model="form.type" placeholder="请选择活动类型">
              <a-option label="读书会" :value="1" />
              <a-option label="研修班" :value="2" />
              <a-option label="训练营" :value="3" />
              <a-option label="其他活动" :value="4" />
            </a-select>
          </a-form-item>
          <a-form-item label="活动日期" required>
            <a-date-picker v-model="form.date" type="date" placeholder="请选择活动日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item label="活动地点">
            <a-input v-model="form.location" placeholder="请输入活动地点" />
          </a-form-item>
          <a-form-item label="活动价格（元）">
            <a-input-number v-model="form.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格" />
          </a-form-item>
          <a-form-item label="参与人数">
            <a-input-number v-model="form.maxParticipants" :min="1" :precision="0" :step="1" placeholder="请输入最大参与人数" />
          </a-form-item>
          <a-form-item label="开始时间">
            <a-time-picker v-model="form.startTime" placeholder="请选择开始时间" format="HH:mm:ss" value-format="HH:mm:ss" />
          </a-form-item>
          <a-form-item label="结束时间">
            <a-time-picker v-model="form.endTime" placeholder="请选择结束时间" format="HH:mm:ss" value-format="HH:mm:ss" />
          </a-form-item>
        </a-grid>
        <a-form-item label="活动简介">
          <a-textarea v-model="form.intro" :rows="6" placeholder="请输入活动简介" />
        </a-form-item>
        <a-form-item label="活动状态">
          <a-switch v-model="form.status" />
        </a-form-item>
        <a-form-item label="VIP免费参与">
          <a-switch v-model="form.vipFree" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const route = useRoute()
const loading = ref(false)

const form = reactive({
  title: '',
  type: 1,
  date: '',
  location: '',
  price: 0,
  maxParticipants: 100,
  startTime: '09:00:00',
  endTime: '17:00:00',
  intro: '',
  status: true,
  vipFree: false
})

async function handleSubmit() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const message = route.params.id ? '更新成功' : '添加成功'
    Message.success(message)
  } catch (error) {
    Message.error('操作失败')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.title = ''
  form.type = 1
  form.date = ''
  form.location = ''
  form.price = 0
  form.maxParticipants = 100
  form.startTime = '09:00:00'
  form.endTime = '17:00:00'
  form.intro = ''
  form.status = true
  form.vipFree = false
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    form.title = '读书会活动示例'
    form.type = 1
    form.date = new Date().toISOString().split('T')[0]
    form.location = '北京'
    form.price = 198
    form.maxParticipants = 100
    form.intro = '这是一个优秀的读书会活动，帮助您提升阅读能力。'
  }
})
</script>

<style scoped lang="scss">
.activity-edit-form {
  max-width: 800px;
}
</style>
<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ route.params.id ? '编辑活动' : '添加活动' }}</h2>
    </div>
    <div class="page-content">
      <a-tabs v-model:active-key="activeTab" class="activity-tabs">
        <!-- 基本信息 -->
        <a-tab-pane key="basic" title="基本信息">
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
              <a-form-item label="活动状态" required>
                <a-select v-model="form.status" placeholder="请选择活动状态">
                  <a-option label="草稿" :value="0" />
                  <a-option label="发布中" :value="1" />
                  <a-option label="已结束" :value="2" />
                </a-select>
              </a-form-item>
              <a-form-item label="活动标签">
                <a-input v-model="form.tags" placeholder="请输入活动标签，多个标签用逗号分隔" />
              </a-form-item>
              <a-form-item label="活动分类">
                <a-select v-model="form.categoryId" placeholder="请选择活动分类">
                  <a-option label="学术活动" :value="1" />
                  <a-option label="文化活动" :value="2" />
                  <a-option label="体育活动" :value="3" />
                  <a-option label="其他" :value="4" />
                </a-select>
              </a-form-item>
              <a-form-item label="活动负责人">
                <a-input v-model="form.contactPerson" placeholder="请输入活动负责人" />
              </a-form-item>
              <a-form-item label="联系电话">
                <a-input v-model="form.contactPhone" placeholder="请输入联系电话" />
              </a-form-item>
              <a-form-item label="活动海报">
                <a-upload
                  :action="'#'"
                  :auto-upload="false"
                  @change="handleFileChange"
                >
                  <a-button type="primary">
                    <template #icon>
                      <icon-upload />
                    </template>
                    上传海报
                  </a-button>
                </a-upload>
              </a-form-item>
            </a-grid>
          </a-form>
        </a-tab-pane>

        <!-- 活动时间 -->
        <a-tab-pane key="time" title="活动时间">
          <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
            <a-grid :cols="2" :colGap="24">
              <a-form-item label="开始时间" required>
                <a-date-picker
                  v-model="form.startDateTime"
                  type="datetime"
                  placeholder="请选择开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
              <a-form-item label="结束时间" required>
                <a-date-picker
                  v-model="form.endDateTime"
                  type="datetime"
                  placeholder="请选择结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
              <a-form-item label="活动时长（分钟）">
                <a-input-number v-model="form.duration" :min="0" :precision="0" :step="1" placeholder="请输入活动时长" />
              </a-form-item>
              <a-form-item label="活动频率">
                <a-select v-model="form.frequency" placeholder="请选择活动频率">
                  <a-option label="单次" :value="1" />
                  <a-option label="每周" :value="2" />
                  <a-option label="每月" :value="3" />
                </a-select>
              </a-form-item>
            </a-grid>
          </a-form>
        </a-tab-pane>

        <!-- 活动地点 -->
        <a-tab-pane key="location" title="活动地点">
          <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
            <a-grid :cols="2" :colGap="24">
              <a-form-item label="地点名称" required>
                <a-input v-model="form.locationName" placeholder="请输入地点名称" />
              </a-form-item>
              <a-form-item label="详细地址">
                <a-input v-model="form.locationAddress" placeholder="请输入详细地址" />
              </a-form-item>
              <a-form-item label="活动形式">
                <a-radio-group v-model="form.activityForm">
                  <a-radio :value="1">线上活动</a-radio>
                  <a-radio :value="2">线下活动</a-radio>
                  <a-radio :value="3">线上+线下</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="线上地址">
                <a-input v-model="form.onlineAddress" placeholder="请输入线上活动地址" />
              </a-form-item>
            </a-grid>
            <a-form-item label="地理位置">
              <div class="map-placeholder">
                <p>地图选择功能开发中</p>
                <a-button type="default">选择位置</a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 活动费用 -->
        <a-tab-pane key="price" title="活动费用">
          <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
            <a-grid :cols="2" :colGap="24">
              <a-form-item label="活动价格（元）">
                <a-input-number v-model="form.price" :min="0" :precision="2" :step="0.01" placeholder="请输入活动价格" />
              </a-form-item>
              <a-form-item label="会员价格（元）">
                <a-input-number v-model="form.memberPrice" :min="0" :precision="2" :step="0.01" placeholder="请输入会员价格" />
              </a-form-item>
              <a-form-item label="早鸟价格（元）">
                <a-input-number v-model="form.earlyBirdPrice" :min="0" :precision="2" :step="0.01" placeholder="请输入早鸟价格" />
              </a-form-item>
              <a-form-item label="早鸟截止日期">
                <a-date-picker v-model="form.earlyBirdDeadline" type="date" placeholder="请选择早鸟截止日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </a-form-item>
            </a-grid>
            <a-form-item label="价格说明">
              <a-textarea v-model="form.priceDescription" :rows="4" placeholder="请输入价格说明" />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 活动介绍 -->
        <a-tab-pane key="intro" title="活动介绍">
          <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
            <a-form-item label="活动亮点">
              <a-textarea v-model="form.highlights" :rows="4" placeholder="请输入活动亮点，多个亮点用换行分隔" />
            </a-form-item>
            <a-form-item label="适合人群">
              <a-textarea v-model="form.targetAudience" :rows="4" placeholder="请输入适合人群" />
            </a-form-item>
            <a-form-item label="活动简介">
              <a-textarea v-model="form.intro" :rows="6" placeholder="请输入活动简介" />
            </a-form-item>
            <a-form-item label="活动详情">
              <div class="rich-text-editor">
                <p>富文本编辑器开发中</p>
                <a-textarea v-model="form.detail" :rows="10" placeholder="请输入活动详细内容" />
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 活动须知 -->
        <a-tab-pane key="notice" title="活动须知">
          <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
            <a-form-item label="参与条件">
              <a-textarea v-model="form.participationConditions" :rows="4" placeholder="请输入参与条件" />
            </a-form-item>
            <a-form-item label="退款政策">
              <a-textarea v-model="form.refundPolicy" :rows="4" placeholder="请输入退款政策" />
            </a-form-item>
            <a-form-item label="其他说明">
              <a-textarea v-model="form.otherInstructions" :rows="4" placeholder="请输入其他说明" />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 报名设置 -->
        <a-tab-pane key="registration" title="报名设置">
          <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
            <a-grid :cols="2" :colGap="24">
              <a-form-item label="最大参与人数">
                <a-input-number v-model="form.maxParticipants" :min="1" :precision="0" :step="1" placeholder="请输入最大参与人数" />
              </a-form-item>
              <a-form-item label="报名开始时间">
                <a-date-picker
                  v-model="form.registrationStartTime"
                  type="datetime"
                  placeholder="请选择报名开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
              <a-form-item label="报名结束时间">
                <a-date-picker
                  v-model="form.registrationEndTime"
                  type="datetime"
                  placeholder="请选择报名结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
              <a-form-item label="VIP免费参与">
                <a-switch v-model="form.vipFree" />
              </a-form-item>
            </a-grid>
            <a-form-item label="报名须知">
              <a-textarea v-model="form.registrationNotice" :rows="4" placeholder="请输入报名须知" />
            </a-form-item>
            <a-form-item label="报名表单设置">
              <div class="form-settings">
                <p>报名表单设置功能开发中</p>
                <a-button type="default">设置表单</a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 活动图片 -->
        <a-tab-pane key="images" title="活动图片">
          <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="activity-edit-form">
            <a-form-item label="活动图片">
              <a-upload
                :action="'#'"
                :auto-upload="false"
                :multiple="true"
                @change="handleMultipleFileChange"
              >
                <a-button type="primary">
                  <template #icon>
                    <icon-upload />
                  </template>
                  上传图片
                </a-button>
              </a-upload>
              <div class="image-list">
                <div v-for="(image, index) in form.images" :key="index" class="image-item">
                  <div class="image-preview">
                    <img :src="image" alt="活动图片" />
                  </div>
                  <div class="image-actions">
                    <a-button size="small" @click="removeImage(index)">删除</a-button>
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <a-space>
          <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
          <a-button @click="handleReset">重置</a-button>
          <a-button @click="handlePreview">预览</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import {
  IconUpload
} from '@arco-design/web-vue/es/icon'

const route = useRoute()
const loading = ref(false)
const activeTab = ref('basic')

const form = reactive({
  // 基本信息
  title: '',
  type: 1,
  status: 0,
  tags: '',
  categoryId: '',
  contactPerson: '',
  contactPhone: '',
  poster: '',
  
  // 活动时间
  startDateTime: '',
  endDateTime: '',
  duration: 0,
  frequency: 1,
  
  // 活动地点
  locationName: '',
  locationAddress: '',
  activityForm: 2,
  onlineAddress: '',
  
  // 活动费用
  price: 0,
  memberPrice: 0,
  earlyBirdPrice: 0,
  earlyBirdDeadline: '',
  priceDescription: '',
  
  // 活动介绍
  highlights: '',
  targetAudience: '',
  intro: '',
  detail: '',
  
  // 活动须知
  participationConditions: '',
  refundPolicy: '',
  otherInstructions: '',
  
  // 报名设置
  maxParticipants: 100,
  registrationStartTime: '',
  registrationEndTime: '',
  registrationNotice: '',
  vipFree: false,
  
  // 活动图片
  images: []
})

// 文件上传处理
function handleFileChange(file: any) {
  form.poster = URL.createObjectURL(file.file)
  Message.success('海报上传成功')
}

function handleMultipleFileChange(info: any) {
  const files = info.fileList
  files.forEach((file: any) => {
    form.images.push(URL.createObjectURL(file.originFileObj))
  })
  Message.success('图片上传成功')
}

function removeImage(index: number) {
  form.images.splice(index, 1)
  Message.success('图片删除成功')
}

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
  // 重置表单数据
  Object.assign(form, {
    title: '',
    type: 1,
    status: 0,
    tags: '',
    categoryId: '',
    contactPerson: '',
    contactPhone: '',
    poster: '',
    startDateTime: '',
    endDateTime: '',
    duration: 0,
    frequency: 1,
    locationName: '',
    locationAddress: '',
    activityForm: 2,
    onlineAddress: '',
    price: 0,
    memberPrice: 0,
    earlyBirdPrice: 0,
    earlyBirdDeadline: '',
    priceDescription: '',
    highlights: '',
    targetAudience: '',
    intro: '',
    detail: '',
    participationConditions: '',
    refundPolicy: '',
    otherInstructions: '',
    maxParticipants: 100,
    registrationStartTime: '',
    registrationEndTime: '',
    registrationNotice: '',
    vipFree: false,
    images: []
  })
  Message.success('表单已重置')
}

function handlePreview() {
  Message.info('预览功能开发中')
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    // 加载活动数据
    loadActivityData()
  }
})

function loadActivityData() {
  // 模拟加载活动数据
  form.title = '读书会活动示例'
  form.type = 1
  form.status = 1
  form.tags = '阅读,学习,交流'
  form.categoryId = 2
  form.contactPerson = '张三'
  form.contactPhone = '13800138000'
  form.startDateTime = new Date().toISOString().slice(0, 19)
  form.endDateTime = new Date(Date.now() + 3600000).toISOString().slice(0, 19)
  form.duration = 120
  form.frequency = 1
  form.locationName = '北京图书馆'
  form.locationAddress = '北京市海淀区中关村南大街33号'
  form.activityForm = 2
  form.price = 198
  form.memberPrice = 168
  form.earlyBirdPrice = 148
  form.highlights = '1. 专业老师指导\n2. 互动交流\n3. 精美礼品'
  form.targetAudience = '18岁以上，对阅读感兴趣的人群'
  form.intro = '这是一个优秀的读书会活动，帮助您提升阅读能力。'
  form.detail = '活动详细内容开发中'
  form.participationConditions = '1. 提前报名\n2. 准时参加'
  form.refundPolicy = '活动开始前24小时可全额退款'
  form.maxParticipants = 100
  form.registrationStartTime = new Date(Date.now() - 86400000).toISOString().slice(0, 19)
  form.registrationEndTime = new Date(Date.now() + 86400000).toISOString().slice(0, 19)
  form.registrationNotice = '请准时参加活动'
  form.vipFree = false
  form.images = ['https://via.placeholder.com/150']
  Message.success('活动数据加载成功')
}
</script>

<style scoped lang="scss">
.activity-edit-form {
  max-width: 800px;
}

.activity-tabs {
  margin-bottom: 24px;
}

.submit-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.map-placeholder {
  height: 300px;
  border: 1px dashed #d9d9d9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: #f5f5f5;
}

.image-list {
  margin-top: 16px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.image-item {
  width: 150px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  padding: 8px;
  background-color: #f5f5f5;
  text-align: center;
}

.rich-text-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  background-color: #f5f5f5;
}

.form-settings {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  background-color: #f5f5f5;
}
</style>
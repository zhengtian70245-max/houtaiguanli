<template>
  <div class="page-container">
    <div class="page-header">
      <h2>VIP配置</h2>
    </div>
    <div class="page-content">
      <el-form :model="form" :label-width="'120px'" class="vip-config-form">
        <el-divider content-position="left">VIP套餐配置</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="套餐名称">
              <el-input v-model="form.packageName" placeholder="请输入套餐名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格（元）">
              <el-input-number v-model="form.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="时长（天）">
              <el-input-number v-model="form.duration" :min="0" :precision="0" :step="1" placeholder="请输入时长" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠送时长（天）">
              <el-input-number v-model="form.giftDuration" :min="0" :precision="0" :step="1" placeholder="请输入赠送时长" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="VIP权益列表">
          <el-checkbox-group v-model="form.benefits">
            <el-checkbox value="course">自动自发教育系统独家课程每年更新至少200节以上</el-checkbox>
            <el-checkbox value="vip_zone">免费1年在线学习"VIP专区"黄导独家线上音频及视频课程</el-checkbox>
            <el-checkbox value="offline_event">全年免费参加公司各种线下交流活动、沙龙、公益课程等</el-checkbox>
            <el-checkbox value="workshop">赠送12800元《家长研修班》9800元《周末亲子营》名额1个</el-checkbox>
            <el-checkbox value="points">签到、学习、分享、推荐购买等均可以获得积分</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-divider content-position="left">VIP等级规则配置</el-divider>
        <el-form-item label="等级名称">
          <el-input v-model="form.levelName" placeholder="请输入等级名称" />
        </el-form-item>
        <el-form-item label="等级描述">
          <el-input
            v-model="form.levelDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入等级描述"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">保存配置</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const form = reactive({
  packageName: 'VIP会员',
  price: 398,
  duration: 365,
  giftDuration: 90,
  benefits: ['course', 'vip_zone', 'offline_event', 'points'],
  levelName: 'VIP会员',
  levelDescription: '享受全部VIP权益，包括课程学习、活动优惠、积分等'
})

async function handleSave() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.packageName = 'VIP会员'
  form.price = 398
  form.duration = 365
  form.giftDuration = 90
  form.benefits = ['course', 'vip_zone', 'offline_event', 'points']
  form.levelName = 'VIP会员'
  form.levelDescription = '享受全部VIP权益，包括课程学习、活动优惠、积分等'
}
</script>

<style scoped lang="scss">
.vip-config-form {
  max-width: 800px;
}
</style>
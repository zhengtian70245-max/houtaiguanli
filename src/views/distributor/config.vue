<template>
  <div class="page-container">
    <div class="page-header">
      <h2>分销配置</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" :label-col="{ style: { width: '120px' } }" class="distributor-config-form">
        <a-divider content-position="left">分销基本信息</a-divider>
        <a-grid :cols="2" :colGap="24">
          <a-form-item label="公司名称">
            <a-input v-model="form.companyName" placeholder="请输入公司名称" />
          </a-form-item>
          <a-form-item label="企业账号">
            <a-input v-model="form.companyAccount" placeholder="请输入企业账号" />
          </a-form-item>
          <a-form-item label="联系人">
            <a-input v-model="form.contactName" placeholder="请输入联系人" />
          </a-form-item>
          <a-form-item label="联系电话">
            <a-input v-model="form.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
          <a-form-item label="直推奖励比例">
            <a-input-number v-model="form.directCommissionRate" :min="0" :max="100" :precision="2" :step="0.01" />
          </a-form-item>
          <a-form-item label="团队奖励比例">
            <a-input-number v-model="form.teamCommissionRate" :min="0" :max="100" :precision="2" :step="0.01" />
          </a-form-item>
          <a-form-item label="同级奖励比例">
            <a-input-number v-model="form.sameLevelCommissionRate" :min="0" :max="100" :precision="2" :step="0.01" />
          </a-form-item>
          <a-form-item label="级差奖励比例">
            <a-input-number v-model="form.levelCommissionRate" :min="0" :max="100" :precision="2" :step="0.01" />
          </a-form-item>
          <a-form-item label="结算周期">
            <a-select v-model="form.settlementCycle" placeholder="请选择结算周期">
              <a-option label="每日结算" :value="1" />
              <a-option label="每周结算" :value="7" />
              <a-option label="每月结算" :value="30" />
            </a-select>
          </a-form-item>
          <a-form-item label="结算时间">
            <a-time-picker v-model="form.settlementTime" placeholder="请选择结算时间" format="HH:mm:ss" value-format="HH:mm:ss" />
          </a-form-item>
        </a-grid>
        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="loading" @click="handleSave">保存配置</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)

const form = reactive({
  companyName: '',
  companyAccount: '',
  contactName: '',
  contactPhone: '',
  directCommissionRate: 10,
  teamCommissionRate: 5,
  sameLevelCommissionRate: 2,
  levelCommissionRate: 3,
  settlementCycle: 30,
  settlementTime: '00:00:00'
})

async function handleSave() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    Message.success('保存成功')
  } catch (error) {
    Message.error('保存失败')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.companyName = ''
  form.companyAccount = ''
  form.contactName = ''
  form.contactPhone = ''
  form.directCommissionRate = 10
  form.teamCommissionRate = 5
  form.sameLevelCommissionRate = 2
  form.levelCommissionRate = 3
  form.settlementCycle = 30
  form.settlementTime = '00:00:00'
}
</script>

<style scoped lang="scss">
.distributor-config-form {
  max-width: 800px;
}
</style>
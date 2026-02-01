<template>
  <div class="page-container">
    <div class="page-header">
      <h2>短信配置</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" :label-width="'120px'" class="sms-config-form">
        <a-divider orientation="left">阿里云短信配置</a-divider>
        <a-form-item label="AccessKeyId" required>
          <a-input v-model="form.accessKeyId" placeholder="请输入AccessKeyId" />
        </a-form-item>
        <a-form-item label="AccessKeySecret" required>
          <a-input v-model="form.accessKeySecret" placeholder="请输入AccessKeySecret" type="password" />
        </a-form-item>
        <a-form-item label="签名名称" required>
          <a-input v-model="form.signName" placeholder="请输入签名名称" />
        </a-form-item>
        <a-divider orientation="left">短信模板配置</a-divider>
        <a-form-item label="登录验证模板">
          <a-input v-model="form.loginTemplate" placeholder="请输入登录验证模板" />
        </a-form-item>
        <a-form-item label="注册验证模板">
          <a-input v-model="form.registerTemplate" placeholder="请输入注册验证模板" />
        </a-form-item>
        <a-form-item label="找回密码模板">
          <a-input v-model="form.resetPasswordTemplate" placeholder="请输入找回密码模板" />
        </a-form-item>
        <a-form-item label="活动通知模板">
          <a-input v-model="form.activityTemplate" placeholder="请输入活动通知模板" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="loading" @click="handleSave">保存配置</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import message from '@arco-design/web-vue/es/message'

const loading = ref(false)

const form = reactive({
  accessKeyId: '',
  accessKeySecret: '',
  signName: '',
  loginTemplate: '',
  registerTemplate: '',
  resetPasswordTemplate: '',
  activityTemplate: ''
})

async function handleSave() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    message.success('保存成功')
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.accessKeyId = ''
  form.accessKeySecret = ''
  form.signName = ''
  form.loginTemplate = ''
  form.registerTemplate = ''
  form.resetPasswordTemplate = ''
  form.activityTemplate = ''
}
</script>

<style scoped lang="scss">
.sms-config-form {
  max-width: 800px;
}
</style>
<template>
  <div class="page-container">
    <div class="page-header">
      <h2>支付配置</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" :label-width="'120px'" class="payment-config-form">
        <a-divider orientation="left">微信支付配置</a-divider>
        <a-form-item label="AppId" required>
          <a-input v-model="form.wechatAppId" placeholder="请输入AppId" />
        </a-form-item>
        <a-form-item label="商户号" required>
          <a-input v-model="form.wechatMchId" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="API密钥" required>
          <a-input v-model="form.wechatApiKey" placeholder="请输入API密钥" type="password" />
        </a-form-item>
        <a-divider orientation="left">支付宝配置</a-divider>
        <a-form-item label="应用ID" required>
          <a-input v-model="form.alipayAppId" placeholder="请输入应用ID" />
        </a-form-item>
        <a-form-item label="应用私钥" required>
          <a-textarea v-model="form.alipayPrivateKey" placeholder="请输入应用私钥" :rows="4" />
        </a-form-item>
        <a-form-item label="支付宝公钥" required>
          <a-textarea v-model="form.alipayPublicKey" placeholder="请输入支付宝公钥" :rows="4" />
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
  wechatAppId: '',
  wechatMchId: '',
  wechatApiKey: '',
  alipayAppId: '',
  alipayPrivateKey: '',
  alipayPublicKey: ''
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
  form.wechatAppId = ''
  form.wechatMchId = ''
  form.wechatApiKey = ''
  form.alipayAppId = ''
  form.alipayPrivateKey = ''
  form.alipayPublicKey = ''
}
</script>

<style scoped lang="scss">
.payment-config-form {
  max-width: 800px;
}
</style>
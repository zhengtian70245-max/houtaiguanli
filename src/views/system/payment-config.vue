<template>
  <div class="page-container">
    <div class="page-header">
      <h2>支付配置</h2>
    </div>
    <div class="page-content">
      <el-form :model="form" :label-width="'120px'" class="payment-config-form">
        <el-divider content-position="left">微信支付配置</el-divider>
        <el-form-item label="AppId" required>
          <el-input v-model="form.wechatAppId" placeholder="请输入AppId" />
        </el-form-item>
        <el-form-item label="商户号" required>
          <el-input v-model="form.wechatMchId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="API密钥" required>
          <el-input v-model="form.wechatApiKey" placeholder="请输入API密钥" type="password" />
        </el-form-item>
        <el-divider content-position="left">支付宝配置</el-divider>
        <el-form-item label="应用ID" required>
          <el-input v-model="form.alipayAppId" placeholder="请输入应用ID" />
        </el-form-item>
        <el-form-item label="应用私钥" required>
          <el-input v-model="form.alipayPrivateKey" placeholder="请输入应用私钥" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="支付宝公钥" required>
          <el-input v-model="form.alipayPublicKey" placeholder="请输入支付宝公钥" type="textarea" :rows="4" />
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
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
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
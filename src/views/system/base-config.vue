<template>
  <div class="page-container">
    <div class="page-header">
      <h2>基础配置</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" :label-width="'100px'" class="base-config-form">
        <a-divider orientation="left">平台信息</a-divider>
        <a-form-item label="平台名称">
          <a-input v-model="form.platformName" placeholder="请输入平台名称" />
        </a-form-item>
        <a-form-item label="Logo上传">
          <a-upload
            :action="'#'"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-remove="onRemove"
          >
            <img v-if="form.logo" :src="form.logo" class="logo-preview" />
            <div v-else class="avatar-uploader-icon">
              <a-icon name="plus" />
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="客服电话">
          <a-input v-model="form.hotline" placeholder="请输入客服电话" />
        </a-form-item>
        <a-form-item label="客服邮箱">
          <a-input v-model="form.email" placeholder="请输入客服邮箱" />
        </a-form-item>
        <a-form-item label="关于我们">
          <a-textarea
            v-model="form.aboutUs"
            :rows="6"
            placeholder="请输入关于我们的内容"
          />
        </a-form-item>
        <a-form-item label="版权信息">
          <a-input v-model="form.copyright" placeholder="请输入版权信息" />
        </a-form-item>

        <a-divider orientation="left">其他配置</a-divider>
        <a-form-item label="备案号">
          <a-input v-model="form.icp" placeholder="请输入备案号" />
        </a-form-item>
        <a-form-item label="客服QQ">
          <a-input v-model="form.qq" placeholder="请输入客服QQ" />
        </a-form-item>
        <a-form-item label="微信公众号">
          <a-input v-model="form.wechat" placeholder="请输入微信公众号" />
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
import { mockDataService } from '@/api/mock'

const loading = ref(false)

const form = reactive({
  platformName: 'zhengtian 家庭教育',
  logo: '',
  hotline: '400-123-4567',
  email: 'service@zhengtian.com',
  aboutUs: 'zhengtian 家庭教育致力于为家长提供专业的家庭教育知识和课程，帮助孩子健康成长...',
  copyright: '© 2024 zhengtian 家庭教育 版权所有',
  icp: '京ICP备12345678号',
  qq: '123456789',
  wechat: 'zhengtian_family'
})

function beforeUpload(file: any) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('请上传图片文件')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB')
    return false
  }
  form.logo = URL.createObjectURL(file)
  return false
}

function onRemove() {
  form.logo = ''
}

async function handleSave() {
  loading.value = true
  try {
    await mockDataService.saveSystemConfig(form)
    message.success('保存成功')
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.platformName = 'zhengtian 家庭教育'
  form.logo = ''
  form.hotline = '400-123-4567'
  form.email = 'service@zhengtian.com'
  form.aboutUs = 'zhengtian 家庭教育致力于为家长提供专业的家庭教育知识和课程，帮助孩子健康成长...'
  form.copyright = '© 2024 zhengtian 家庭教育 版权所有'
  form.icp = '京ICP备12345678号'
  form.qq = '123456789'
  form.wechat = 'zhengtian_family'
}
</script>

<style scoped lang="scss">
.base-config-form {
  .logo-preview {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
  }

  .avatar-uploader-icon {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    border-radius: 8px;
    cursor: pointer;
    font-size: 24px;
    color: #909399;
  }
}
</style>
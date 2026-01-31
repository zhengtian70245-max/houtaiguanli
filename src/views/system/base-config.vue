<template>
  <div class="page-container">
    <div class="page-header">
      <h2>基础配置</h2>
    </div>
    <div class="page-content">
      <el-form :model="form" :label-width="'100px'" class="base-config-form">
        <el-divider content-position="left">平台信息</el-divider>
        <el-form-item label="平台名称">
          <el-input v-model="form.platformName" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="Logo上传">
          <el-upload
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-remove="onRemove"
          >
            <img v-if="form.logo" :src="form.logo" class="logo-preview" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="客服电话">
          <el-input v-model="form.hotline" placeholder="请输入客服电话" />
        </el-form-item>
        <el-form-item label="客服邮箱">
          <el-input v-model="form.email" placeholder="请输入客服邮箱" />
        </el-form-item>
        <el-form-item label="关于我们">
          <el-input
            v-model="form.aboutUs"
            type="textarea"
            :rows="6"
            placeholder="请输入关于我们的内容"
          />
        </el-form-item>
        <el-form-item label="版权信息">
          <el-input v-model="form.copyright" placeholder="请输入版权信息" />
        </el-form-item>

        <el-divider content-position="left">其他配置</el-divider>
        <el-form-item label="备案号">
          <el-input v-model="form.icp" placeholder="请输入备案号" />
        </el-form-item>
        <el-form-item label="客服QQ">
          <el-input v-model="form.qq" placeholder="请输入客服QQ" />
        </el-form-item>
        <el-form-item label="微信公众号">
          <el-input v-model="form.wechat" placeholder="请输入微信公众号" />
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
    ElMessage.error('请上传图片文件')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
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
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
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
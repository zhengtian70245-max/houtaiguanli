<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>zhengtian 管理后台</h2>
        <p>欢迎登录，管理您的教育平台</p>
      </div>
      <a-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <a-form-item prop="username">
          <a-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="iconUser"
            @keyup.enter="handleLogin"
          />
        </a-form-item>
        <a-form-item prop="password">
          <a-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="iconLock"
            @keyup.enter="handleLogin"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="login-footer">
        <p>测试账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message, type FormInstance } from '@arco-design/web-vue'
import { IconUser, IconLock } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      login()
    } else {
      return false
    }
  })
}

async function login() {
  loading.value = true

  try {
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      const userInfo = {
        id: 1,
        username: 'admin',
        name: '超级管理员',
        avatar: '',
        role: 'super',
        permissions: ['*:*:*']
      }

      userStore.setUser(userInfo)
      userStore.setToken('mock-token-' + Date.now())

      await new Promise((resolve) => setTimeout(resolve, 500))
      Message.success('登录成功')
      router.push('/dashboard')
    } else {
      Message.error('用户名或密码错误')
    }
  } catch (error) {
    Message.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-box {
    width: 400px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .login-header {
      text-align: center;
      margin-bottom: 32px;

      h2 {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      p {
        color: #666;
        margin: 0;
      }
    }

    .login-form {
      :deep(.arco-form-item) {
        margin-bottom: 24px;
      }

      .login-btn {
        width: 100%;
        margin-top: 8px;
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;

      p {
        color: #999;
        margin: 0;
        font-size: 14px;
      }
    }
  }
}
</style>
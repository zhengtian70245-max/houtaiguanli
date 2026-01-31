<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>zhengtian 管理后台</h2>
        <p>欢迎登录，管理您的教育平台</p>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
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

      const token = 'mock-token-' + Date.now()

      userStore.setUserInfo(userInfo)
      userStore.setToken(token)

      ElMessage.success('登录成功')
      router.push('/dashboard')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .login-box {
    width: 400px;
    padding: 40px 32px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .login-header {
      text-align: center;
      margin-bottom: 32px;

      h2 {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: #999;
      }
    }

    .login-form {
      .login-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 24px;

      p {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
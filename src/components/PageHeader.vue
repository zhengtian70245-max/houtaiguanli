<template>
  <div class="page-header">
    <div class="header-info">
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageDesc }}</p>
    </div>
    <div class="header-actions">
      <div class="user-info">
        <el-avatar :size="40" :src="userInfo.avatar || ''" />
        <span class="username">{{ userInfo.name || userInfo.username }}</span>
      </div>
      <div class="action-buttons">
        <el-button @click="handleLogout">退出登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox, ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo || {})
const pageTitle = computed(() => route.meta.title || '管理后台')
const pageDesc = computed(() => {
  const descMap: Record<string, string> = {
    '/system': '系统配置管理',
    '/user': '用户信息管理',
    '/course': '课程内容管理',
    '/activity': '活动信息管理',
    '/order': '订单信息管理',
    '/vip': 'VIP会员管理',
    '/distributor': '分销渠道管理',
    '/statistics': '数据统计分析'
  }
  const path = route.path
  for (const key in descMap) {
    if (path.startsWith(key)) {
      return descMap[key]
    }
  }
  return '管理您的教育平台'
})

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    userStore.logout()
    router.push('/login')
    ElMessage.success('退出成功')
  })
  .catch(() => {
    // 用户取消操作
  })
}
</script>

<style scoped lang="scss">
.page-header {
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;

  .header-info {
    h1 {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    p {
      font-size: 12px;
      color: #999;
      margin: 4px 0 0 0;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .el-avatar {
        border: 1px solid #f0f0f0;
      }

      .username {
        font-size: 14px;
        color: #333;
      }
    }

    .action-buttons {
      .el-button {
        padding: 8px 16px;
        font-size: 14px;
      }
    }
  }
}
</style>
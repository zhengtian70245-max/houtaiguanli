<template>
  <div class="page-header">
    <div class="header-left">
      <a-icon class="collapse-icon" @click="toggleSidebar">
        <IconMenuUnfold />
      </a-icon>
      <span class="breadcrumb">
        {{ currentRoute.meta?.title }}
      </span>
    </div>
    <div class="header-right">
      <a-dropdown @select="handleCommand">
        <div class="user-info">
          <a-avatar :size="36">{{ userStore.userInfo?.name?.charAt(0) }}</a-avatar>
          <span class="user-name">{{ userStore.userInfo?.name }}</span>
          <a-icon class="dropdown-icon">
            <IconChevronDown />
          </a-icon>
        </div>
        <template #content>
          <a-dropdown-menu>
            <a-dropdown-item key="profile">个人中心</a-dropdown-item>
            <a-dropdown-item key="setting">设置</a-dropdown-item>
            <a-dropdown-item key="logout" :divided="true">退出登录</a-dropdown-item>
          </a-dropdown-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { IconMenuUnfold, IconChevronDown } from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const currentRoute = computed(() => route)

function toggleSidebar() {
  appStore.toggleSidebar()
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      break
    case 'setting':
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.page-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .header-left {
    display: flex;
    align-items: center;

    .collapse-icon {
      font-size: 20px;
      cursor: pointer;
      margin-right: 16px;
      color: #666;

      &:hover {
        color: #1890ff;
      }
    }

    .breadcrumb {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;

      :deep(.arco-avatar) {
        margin-right: 8px;
      }

      .user-name {
        margin-right: 4px;
        font-size: 14px;
        color: #333;
      }

      .dropdown-icon {
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
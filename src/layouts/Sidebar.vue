<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2 class="logo">zhengtian 管理后台</h2>
    </div>
    <div class="sidebar-menu">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-el-menu"
        router
        :collapse="sidebarCollapsed"
        :collapse-transition="false"
      >
        <template v-for="route in permissionRoutes" :key="route.path">
          <el-sub-menu v-if="route.children && route.children.length > 1" :index="route.path">
            <template #title>
              <el-icon><component :is="route.meta?.icon" /></el-icon>
              <span>{{ route.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="child.path"
            >
              {{ child.meta?.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="route.path">
            <el-icon><component :is="route.meta?.icon" /></el-icon>
            <span>{{ route.meta?.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const permissionRoutes = computed(() => {
  return router.getRoutes().filter((r) => !r.meta.hidden)
})
</script>

<style scoped lang="scss">
.sidebar {
  width: 220px;
  height: 100vh;
  background: #001529;
  position: relative;
  transition: width 0.3s;

  &:has(.sidebar-el-menu.is-collapsed) {
    width: 58px;

    .sidebar-header {
      .logo {
        font-size: 0;
      }
    }
  }

  .sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo {
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      margin: 0;
      transition: font-size 0.3s;
    }
  }

  .sidebar-menu {
    height: calc(100vh - 64px);
    overflow-y: auto;

    :deep(.el-menu) {
      border-right: none;
      background: transparent;

      .el-menu-item,
      .el-sub-menu__title {
        color: rgba(255, 255, 255, 0.65);
        height: 50px;
        line-height: 50px;
        margin: 0 12px;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        &.is-active {
          background: #1890ff;
          color: #fff;
        }
      }
    }
  }
}
</style>
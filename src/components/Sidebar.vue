<template>
  <div class="sidebar">
    <a-menu
      :open-keys="openKeys"
      :selected-keys="[selectedKey]"
      :inline-collapsed="isCollapse"
      mode="inline"
      @open-change="handleOpenChange"
    >
      <template v-for="item in menuItems" :key="item.path">
        <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.path">
          <template #icon>
            <component :is="getIconComponent(item.icon)" />
          </template>
          <template #title>{{ getMenuLabel(item) }}</template>
          <template v-for="child in item.children" :key="child.path">
              <a-menu-item @click="handleClick(child.path)">
                <template #icon>
                  <component :is="getIconComponent(child.icon)" />
                </template>
                {{ getMenuLabel(child) }}
              </a-menu-item>
            </template>
        </a-sub-menu>
        <a-menu-item v-else :key="item.path" @click="handleClick(item.path)">
          <template #icon>
            <component :is="getIconComponent(item.icon)" />
          </template>
          {{ getMenuLabel(item) }}
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import usePermission from '@/hooks/permission'
import { generateMenuFromRoutes, type MenuItem } from '@/stores/menu'
import { useUserStore } from '@/stores/user'
import { useLocale } from '@/locale/zh-CN'
import * as Icons from '@arco-design/web-vue/es/icon'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const permission = usePermission()
const { t } = useLocale()

const openKeys = ref<string[]>([])
const menuItems = ref<MenuItem[]>([])
const selectedKey = ref<string>('')

function findMenuItemByPath(items: MenuItem[], path: string): MenuItem | null {
  for (const item of items) {
    if (item.path === path) {
      return item
    }
    
    if (item.children) {
      const found = findMenuItemByPath(item.children, path)
      if (found) {
        return found
      }
    }
  }
  
  return null
}

function findParentMenuItems(items: MenuItem[], path: string): MenuItem[] {
  const parentItems: MenuItem[] = []
  
  function findParent(menuItems: MenuItem[], currentPath: string): boolean {
    for (const item of menuItems) {
      if (item.path === currentPath) {
        parentItems.push(item)
        return true
      }
      
      if (item.children) {
        const found = findParent(item.children, currentPath)
        if (found) {
          parentItems.unshift(item)
          return true
        }
      }
    }
    
    return false
  }
  
  findParent(items, path)
  return parentItems
}

function loadMenuItems() {
  // 避免在响应式上下文中直接修改menuItems
  const routes = router.options.routes
  const newMenuItems = generateMenuFromRoutes(routes)
  // 使用nextTick确保更新不会导致递归
  setTimeout(() => {
    menuItems.value = newMenuItems
  }, 0)
}

function updateMenuState() {
  if (menuItems.value.length === 0) {
    return
  }
  
  // 避免在响应式上下文中直接修改selectedKey和openKeys
  setTimeout(() => {
    // 更新选中的菜单项
    const selectedItem = findMenuItemByPath(menuItems.value, route.path)
    selectedKey.value = selectedItem?.path || ''
    
    // 更新展开的菜单项
    const parentItems = findParentMenuItems(menuItems.value, route.path)
    openKeys.value = parentItems
      .filter(item => item.children && item.children.length > 0)
      .map(item => item.path)
  }, 0)
}

function handleClick(path: string) {
  if (route.path === path) {
    return
  }
  
  router.push(path)
}

function handleOpenChange(keys: string[]) {
  openKeys.value = keys
}

function getMenuLabel(menuItem: MenuItem): string {
  if (menuItem.meta?.title) {
    return menuItem.meta.title
  }
  
  if (menuItem.meta?.locale) {
    return t(menuItem.meta.locale)
  }
  
  return menuItem.label
}

function getIconComponent(iconName: string | undefined) {
  if (!iconName) {
    return null
  }

  const iconKey = `Icon${iconName}`
  const IconComponent = Icons[iconKey] as any
  
  if (!IconComponent) {
    return null
  }

  return IconComponent
}

// 监听路由变化，更新菜单状态
watch(
  () => route.path,
  () => {
    updateMenuState()
  },
  { immediate: true }
)

// 监听菜单数据变化，更新菜单状态
// 移除深度监听，避免递归更新
// watch(
//   () => menuItems.value,
//   () => {
//     updateMenuState()
//   },
//   { deep: true }
// )

onMounted(() => {
  loadMenuItems()
  updateMenuState()
})
</script>

<style scoped lang="scss">
.sidebar {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  
  :deep(.arco-menu) {
    border-right: none;
  }
  
  :deep(.arco-menu-item) {
    margin: 4px 8px;
    border-radius: 4px;
  }
  
  :deep(.arco-menu-submenu-title) {
    margin: 4px 8px;
    border-radius: 4px;
  }
}
</style>
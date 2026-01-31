import { defineStore } from 'pinia'
import type { Ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed: Ref<boolean> = ref(false)
  const theme: Ref<string> = ref('light')
  const tagsView: Ref<any[]> = ref([])

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
  }

  function setTheme(theme: string) {
    theme.value = theme
  }

  function addTagsView(route: any) {
    const exist = tagsView.value.some((item) => item.path === route.path)
    if (!exist) {
      tagsView.value.push({
        name: route.name,
        path: route.path,
        meta: route.meta
      })
    }
  }

  function removeTagsView(path: string) {
    tagsView.value = tagsView.value.filter((item) => item.path !== path)
  }

  function clearTagsView() {
    tagsView.value = []
  }

  return {
    sidebarCollapsed,
    theme,
    tagsView,
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    addTagsView,
    removeTagsView,
    clearTagsView
  }
})
import { defineStore } from 'pinia'
import usePermission from '@/hooks/permission'
import { RouteRecordRaw } from 'vue-router'

export interface MenuItem {
  path: string
  name: string
  label: string
  icon?: string
  children?: MenuItem[]
  meta?: any
  roles?: string[]
}

// 深拷贝函数，避免修改原始路由配置
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any
  }
  
  const clonedObj = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  
  return clonedObj
}

export function generateMenuFromRoutes(routes: RouteRecordRaw[], parentPath = ''): MenuItem[] {
  const permission = usePermission()
  // 深拷贝路由配置，避免修改原始响应式对象
  const clonedRoutes = deepClone(routes)
  const accessibleRoutes = permission.filterAccessibleRoutes(clonedRoutes)
  
  const menuItems: MenuItem[] = []

  accessibleRoutes.forEach(route => {
    const routeMeta = (route as any).meta
    
    if (routeMeta?.hidden) {
      return
    }

    const menuItem: MenuItem = {
      path: route.path,
      name: route.name || '',
      label: routeMeta?.title || routeMeta?.locale || route.name || '',
      icon: routeMeta?.icon,
      meta: routeMeta,
      roles: routeMeta?.roles
    }

    if (route.children && route.children.length > 0) {
      const childMenuItems = generateMenuFromRoutes(route.children, route.path)
      
      if (childMenuItems.length > 0) {
        menuItem.children = childMenuItems
      }
    }

    if (!menuItem.children || menuItem.children.length > 0) {
      menuItems.push(menuItem)
    }
  })

  return menuItems.sort((a, b) => {
    return (a.meta?.order || 0) - (b.meta?.order || 0)
  })
}

export function findMenuItemByPath(menuItems: MenuItem[], path: string): MenuItem | null {
  for (const item of menuItems) {
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

export function getParentMenuItems(menuItems: MenuItem[], path: string): MenuItem[] {
  const parentItems: MenuItem[] = []
  
  function findParent(items: MenuItem[], currentPath: string): boolean {
    for (const item of items) {
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
  
  findParent(menuItems, path)
  return parentItems
}
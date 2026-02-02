import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default function usePermission() {
  const userStore = useUserStore()

  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw): boolean {
      const routeMeta = (route as any).meta
      
      if (!routeMeta?.requiresAuth && !routeMeta?.roles) {
        return true
      }
      
      if (routeMeta?.roles?.includes('*')) {
        return true
      }
      
      if (!userStore.role) {
        return false
      }
      
      if (userStore.role === 'super') {
        return true
      }
      
      if (routeMeta?.roles?.includes(userStore.role)) {
        return true
      }
      
      return false
    },
    
    filterAccessibleRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
      return routes.filter(route => {
        if (!this.accessRouter(route)) {
          return false
        }
        
        if (route.children) {
          route.children = this.filterAccessibleRoutes(route.children)
        }
        
        return true
      })
    },
    
    getMenuRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
      return routes.filter(route => {
        const meta = (route as any).meta
        
        if (meta?.hidden) {
          return false
        }
        
        if (!this.accessRouter(route)) {
          return false
        }
        
        if (route.children && route.children.length > 0) {
          route.children = this.getMenuRoutes(route.children)
        }
        
        return true
      })
    }
  }
}
import { defineStore } from 'pinia'
import { generateMenuFromRoutes, MenuItem } from './menu'
import usePermission from '@/hooks/permission'
import { RouteRecordRaw } from 'vue-router'

export interface UserState {
  id: number
  username: string
  name: string
  avatar: string
  role: string
  permissions: string[]
  token: string
  isLogin: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: 0,
    username: '',
    name: '',
    avatar: '',
    role: '',
    permissions: [],
    token: '',
    isLogin: false
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state }
    },

    isSuperAdmin(state: UserState): boolean {
      return state.role === 'super'
    },

    hasPermission(state: UserState, permission: string): boolean {
      return state.permissions.includes('*:*:*') || state.permissions.includes(permission)
    }
  },

  actions: {
    setToken(token: string) {
      this.token = token
      this.isLogin = true
      localStorage.setItem('token', token)
    },

    setUserInfo(userInfo: Partial<UserState>) {
      Object.assign(this, userInfo)
      this.isLogin = true
    },

    async login(username: string, password: string) {
      try {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        })

        const result = await response.json()

        if (result.code === 200 && result.data) {
          this.setToken(result.data.token)
          this.setUserInfo(result.data.userInfo)
          return result.data
        } else {
          throw new Error(result.msg || '登录失败')
        }
      } catch (error) {
        throw error
      }
    },

    async getInfo() {
      try {
        const response = await fetch('/api/user/info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        const result = await response.json()

        if (result.code === 200 && result.data) {
          this.setUserInfo(result.data)
          return result.data
        } else {
          throw new Error(result.msg || '获取用户信息失败')
        }
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.id = 0
      this.username = ''
      this.name = ''
      this.avatar = ''
      this.role = ''
      this.permissions = []
      this.token = ''
      this.isLogin = false
      localStorage.removeItem('token')
    }
  }
})
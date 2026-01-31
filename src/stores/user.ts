import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

export interface UserInfo {
  id: number
  username: string
  name: string
  avatar?: string
  role: string
  permissions: string[]
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo: Ref<UserInfo | null> = ref(null)
    const token: Ref<string> = ref('')

    function setUserInfo(info: UserInfo) {
      userInfo.value = info
    }

    function setToken(tokenStr: string) {
      token.value = tokenStr
      localStorage.setItem('token', tokenStr)
    }

    function getToken() {
      return token.value || localStorage.getItem('token') || ''
    }

    function logout() {
      userInfo.value = null
      token.value = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }

    function initUserInfo() {
      const userInfoStr = localStorage.getItem('userInfo')
      const tokenStr = localStorage.getItem('token')
      if (userInfoStr) {
        userInfo.value = JSON.parse(userInfoStr)
      }
      if (tokenStr) {
        token.value = tokenStr
      }
    }

    return {
      userInfo,
      token,
      setUserInfo,
      setToken,
      getToken,
      logout,
      initUserInfo
    }
  },
  {
    persist: true
  }
)
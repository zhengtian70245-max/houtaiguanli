import type { UserInfo } from '@/stores/user'

export interface MockDataService {
  login(username: string, password: string): Promise<{ token: string; userInfo: UserInfo }>
  getUsers(params: any): Promise<{ list: any[]; total: number }>
  getCourses(params: any): Promise<{ list: any[]; total: number }>
  getActivities(params: any): Promise<{ list: any[]; total: number }>
  getOrders(params: any): Promise<{ list: any[]; total: number }>
  getVips(params: any): Promise<{ list: any[]; total: number }>
  getDistributors(params: any): Promise<{ list: any[]; total: number }>
  getStatistics(): Promise<any>
  saveSystemConfig(config: any): Promise<boolean>
  saveVipConfig(config: any): Promise<boolean>
  saveDistributorConfig(config: any): Promise<boolean>
  saveSmsConfig(config: any): Promise<boolean>
  savePaymentConfig(config: any): Promise<boolean>
}

export const mockDataService: MockDataService = {
  async login(username: string, password: string): Promise<{ token: string; userInfo: UserInfo }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === '123456') {
          const token = 'mock-token-' + Date.now()
          const userInfo: UserInfo = {
            id: 1,
            username: 'admin',
            name: '超级管理员',
            avatar: '',
            role: 'super',
            permissions: ['*:*:*']
          }
          resolve({ token, userInfo })
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 1000)
    })
  },

  async getUsers(params: any): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from({ length: 10 }).map((_, index) => {
          const offset = params.page * params.size
          const id = index + offset
          return {
            id,
            avatar: '',
            nickname: `用户${id}`,
            phone: `138${Math.floor(Math.random() * 100000000)}`,
            level: Math.floor(Math.random() * 4),
            vipExpireDate: id % 3 === 0 ? '2024-12-31' : null,
            points: Math.floor(Math.random() * 10000),
            balance: Math.floor(Math.random() * 1000),
            status: id % 5 === 0 ? 0 : 1,
            createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            lastLoginTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        })
        resolve({ list, total: 100 })
      }, 500)
    })
  },

  async getCourses(params: any): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from({ length: 10 }).map((_, index) => {
          const offset = params.page * params.size
          const id = index + offset
          return {
            id,
            title: `课程标题 ${id}`,
            category: Math.floor(Math.random() * 4),
            price: Math.floor(Math.random() * 999) + 1,
            status: id % 4 === 0 ? 0 : 1,
            viewCount: Math.floor(Math.random() * 10000),
            purchaseCount: Math.floor(Math.random() * 1000),
            createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        })
        resolve({ list, total: 100 })
      }, 500)
    })
  },

  async getActivities(params: any): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from({ length: 10 }).map((_, index) => {
          const offset = params.page * params.size
          const id = index + offset
          return {
            id,
            title: `活动标题 ${id}`,
            type: Math.floor(Math.random() * 3),
            date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            location: `地点 ${id}`,
            price: Math.floor(Math.random() * 999),
            status: id % 5 === 0 ? 0 : 1,
            registrationCount: Math.floor(Math.random() * 1000),
            createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        })
        resolve({ list, total: 100 })
      }, 500)
    })
  },

  async getOrders(params: any): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from({ length: 10 }).map((_, index) => {
          const offset = params.page * params.size
          const id = index + offset
          return {
            id: `ORD${Date.now()}${id.toString().padStart(6, '0')}`,
            type: Math.floor(Math.random() * 3),
            amount: Math.floor(Math.random() * 999) + 1,
            status: Math.floor(Math.random() * 4),
            paymentType: Math.floor(Math.random() * 2),
            createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            paymentTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            username: `用户${id}`
          }
        })
        resolve({ list, total: 100 })
      }, 500)
    })
  },

  async getVips(params: any): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from({ length: 10 }).map((_, index) => {
          const offset = params.page * params.size
          const id = index + offset
          return {
            id,
            username: `用户${id}`,
            phone: `138${Math.floor(Math.random() * 100000000)}`,
            level: Math.floor(Math.random() * 2) + 3,
            startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            expireDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: id % 6 === 0 ? 0 : 1,
            createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        })
        resolve({ list, total: 100 })
      }, 500)
    })
  },

  async getDistributors(params: any): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from({ length: 10 }).map((_, index) => {
          const offset = params.page * params.size
          const id = index + offset
          return {
            id,
            username: `用户${id}`,
            phone: `138${Math.floor(Math.random() * 100000000)}`,
            level: Math.floor(Math.random() * 3) + 1,
            promotionCount: Math.floor(Math.random() * 1000),
            totalIncome: Math.floor(Math.random() * 100000),
            availableBalance: Math.floor(Math.random() * 10000),
            status: id % 7 === 0 ? 0 : 1,
            createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        })
        resolve({ list, total: 100 })
      }, 500)
    })
  },

  async getStatistics(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalUsers: 12580,
          totalCourses: 256,
          totalActivities: 48,
          totalOrders: 8956,
          totalIncome: 1258000,
          totalVips: 2580,
          totalDistributors: 368,
          todayNewUsers: 125,
          todayOrders: 89,
          todayIncome: 12580,
          userGrowth: 12.5,
          salesGrowth: 8.9
        })
      }, 500)
    })
  },

  async saveSystemConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  async saveVipConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  async saveDistributorConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  async saveSmsConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  async savePaymentConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  }
}
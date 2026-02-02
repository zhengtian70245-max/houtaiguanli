import Mock from 'mockjs'
import type { UserInfo } from '@/stores/user'

interface SuccessResponse<T = any> {
  code: number
  msg: string
  data: T
}

function successResponseWrap<T>(data: T, msg = '操作成功'): SuccessResponse<T> {
  return {
    code: 200,
    msg,
    data
  }
}

export const mockData = {
  login(username: string, password: string): Promise<{ token: string; userInfo: UserInfo }> {
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

  getUsers(params: any): Promise<{ list: any[]; total: number }> {
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

  getCourses(params: any): Promise<{ list: any[]; total: number }> {
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

  getActivities(params: any): Promise<{ list: any[]; total: number }> {
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

  getOrders(params: any): Promise<{ list: any[]; total: number }> {
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

  getVips(params: any): Promise<{ list: any[]; total: number }> {
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

  getDistributors(params: any): Promise<{ list: any[]; total: number }> {
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

  getStatistics(): Promise<any> {
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

  getCourseCategories(params: any): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from({ length: 5 }).map((_, index) => {
          const id = index + 1
          return {
            id,
            name: ['专业课', '家长必修', '精品专题', 'VIP专区', '其他'][index],
            description: ['专业课程分类', '家长必修课程分类', '精品专题课程分类', 'VIP专区课程分类', '其他课程分类'][index],
            sortOrder: index + 1,
            status: true,
            createTime: '2023-01-01',
            updateTime: '2023-01-01'
          }
        })
        resolve({ list, total: 5 })
      }, 500)
    })
  },

  saveSystemConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  saveVipConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  saveDistributorConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  saveSmsConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  },

  savePaymentConfig(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  }
}

export default mockData
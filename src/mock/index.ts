import Mock from 'mockjs'
import { successResponseWrap } from './setup-mock'
import { mockData } from './data'

Mock.mock(new RegExp('/api/user/login'), 'post', (options: any) => {
  const { username, password } = JSON.parse(options.body)
  try {
    const result = mockData.login(username, password)
    return result.then(data => successResponseWrap(data)).catch(error => ({
      code: 400,
      msg: error.message,
      data: null
    }))
  } catch (error) {
    return {
      code: 400,
      msg: error.message,
      data: null
    }
  }
})

Mock.mock(new RegExp('/api/user/info'), 'get', () => {
  return successResponseWrap({
    id: 1,
    username: 'admin',
    name: '超级管理员',
    avatar: '',
    role: 'super',
    permissions: ['*:*:*']
  })
})

Mock.mock(new RegExp('/api/users'), 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page') || '0')
  const size = parseInt(params.get('size') || '10')
  return mockData.getUsers({ page, size }).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/courses'), 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page') || '0')
  const size = parseInt(params.get('size') || '10')
  return mockData.getCourses({ page, size }).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/activities'), 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page') || '0')
  const size = parseInt(params.get('size') || '10')
  return mockData.getActivities({ page, size }).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/orders'), 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page') || '0')
  const size = parseInt(params.get('size') || '10')
  return mockData.getOrders({ page, size }).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/vips'), 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page') || '0')
  const size = parseInt(params.get('size') || '10')
  return mockData.getVips({ page, size }).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/distributors'), 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page') || '0')
  const size = parseInt(params.get('size') || '10')
  return mockData.getDistributors({ page, size }).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/course-categories'), 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page') || '0')
  const size = parseInt(params.get('size') || '10')
  return mockData.getCourseCategories({ page, size }).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/statistics'), 'get', () => {
  return mockData.getStatistics().then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/system-config'), 'post', (options: any) => {
  const config = JSON.parse(options.body)
  return mockData.saveSystemConfig(config).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/vip-config'), 'post', (options: any) => {
  const config = JSON.parse(options.body)
  return mockData.saveVipConfig(config).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/distributor-config'), 'post', (options: any) => {
  const config = JSON.parse(options.body)
  return mockData.saveDistributorConfig(config).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/sms-config'), 'post', (options: any) => {
  const config = JSON.parse(options.body)
  return mockData.saveSmsConfig(config).then(data => successResponseWrap(data))
})

Mock.mock(new RegExp('/api/payment-config'), 'post', (options: any) => {
  const config = JSON.parse(options.body)
  return mockData.savePaymentConfig(config).then(data => successResponseWrap(data))
})
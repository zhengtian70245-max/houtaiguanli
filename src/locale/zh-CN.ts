import { getCurrentInstance, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

interface LocaleConfig {
  [key: string]: string
}

const zhCN: LocaleConfig = {
  'menu.dashboard': '仪表盘',
  'menu.dashboard.workplace': '工作台',
  'menu.test': '测试页面',
  'menu.system': '系统管理',
  'menu.system.base-config': '基础配置',
  'menu.system.vip-config': 'VIP配置',
  'menu.system.distributor-config': '分销配置',
  'menu.system.sms-config': '短信配置',
  'menu.system.payment-config': '支付配置',
  'menu.user': '用户管理',
  'menu.user.list': '用户列表',
  'menu.user.tree': '用户关系',
  'menu.course': '课程管理',
  'menu.course.list': '课程列表',
  'menu.course.category': '课程分类',
  'menu.course.stats': '课程统计',
  'menu.course.material': '素材库',
  'menu.column': '专栏管理',
  'menu.column.list': '专栏列表',
  'menu.column.category': '专栏分类',
  'menu.activity': '活动管理',
  'menu.activity.list': '活动列表',
  'menu.activity.register': '报名管理',
  'menu.activity.stats': '活动统计',
  'menu.order': '订单管理',
  'menu.order.list': '订单列表',
  'menu.order.refund': '退款管理',
  'menu.order.stats': '订单统计',
  'menu.vip': 'VIP会员管理',
  'menu.vip.list': 'VIP列表',
  'menu.vip.config': 'VIP配置',
  'menu.vip.stats': 'VIP统计',
  'menu.distributor': '分销管理',
  'menu.distributor.list': '分销商列表',
  'menu.distributor.withdraw': '提现管理',
  'menu.distributor.config': '分销配置',
  'menu.distributor.stats': '分销统计',
  'menu.statistics': '数据统计',
  'menu.statistics.dashboard': '数据概览',
  'menu.statistics.user': '用户统计',
  'menu.statistics.sales': '销售统计',
  'menu.statistics.course': '课程统计',
  'menu.statistics.activity': '活动统计',
  'menu.statistics.vip': 'VIP统计',
  'menu.statistics.distributor': '分销统计'
}

export const useLocale = () => {
  const instance = getCurrentInstance()
  const userStore = useUserStore()

  const currentLocale = computed(() => {
    return zhCN
  })

  const locale = computed(() => {
    return currentLocale.value
  })

  const t = (key: string, defaultText?: string): string => {
    return locale.value[key] || defaultText || key
  }

  return {
    locale,
    t
  }
}

export default {
  zhCN
}
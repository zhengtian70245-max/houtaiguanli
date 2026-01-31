import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { title: '首页', icon: 'HomeFilled' },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/statistics/dashboard.vue'),
        meta: { title: '数据概览', icon: 'DataAnalysis' }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/system/base-config',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: '/system/base-config',
        name: 'BaseConfig',
        component: () => import('@/views/system/base-config.vue'),
        meta: { title: '基础配置', icon: 'Monitor' }
      },
      {
        path: '/system/vip-config',
        name: 'VipConfig',
        component: () => import('@/views/system/vip-config.vue'),
        meta: { title: 'VIP配置', icon: 'VipCard' }
      },
      {
        path: '/system/distributor-config',
        name: 'DistributorConfig',
        component: () => import('@/views/system/distributor-config.vue'),
        meta: { title: '分销配置', icon: 'Promotion' }
      },
      {
        path: '/system/sms-config',
        name: 'SmsConfig',
        component: () => import('@/views/system/sms-config.vue'),
        meta: { title: '短信配置', icon: 'ChatLineRound' }
      },
      {
        path: '/system/payment-config',
        name: 'PaymentConfig',
        component: () => import('@/views/system/payment-config.vue'),
        meta: { title: '支付配置', icon: 'Coin' }
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/user/list',
    meta: { title: '用户管理', icon: 'User' },
    children: [
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户列表', icon: 'UserFilled' }
      },
      {
        path: '/user/detail/:id',
        name: 'UserDetail',
        component: () => import('@/views/user/detail.vue'),
        meta: { title: '用户详情', hidden: true }
      },
      {
        path: '/user/tree/:id',
        name: 'UserTree',
        component: () => import('@/views/user/tree.vue'),
        meta: { title: '用户推广树', hidden: true }
      }
    ]
  },
  {
    path: '/course',
    name: 'Course',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/course/list',
    meta: { title: '课程管理', icon: 'Reading' },
    children: [
      {
        path: '/course/list',
        name: 'CourseList',
        component: () => import('@/views/course/list.vue'),
        meta: { title: '课程列表', icon: 'Document' }
      },
      {
        path: '/course/edit/:id?',
        name: 'CourseEdit',
        component: () => import('@/views/course/edit.vue'),
        meta: { title: '课程编辑', hidden: true }
      },
      {
        path: '/course/category',
        name: 'CourseCategory',
        component: () => import('@/views/course/category.vue'),
        meta: { title: '分类管理', icon: 'Folder' }
      },
      {
        path: '/course/stats',
        name: 'CourseStats',
        component: () => import('@/views/course/stats.vue'),
        meta: { title: '课程统计', icon: 'TrendCharts' }
      },
      {
        path: '/course/material',
        name: 'CourseMaterial',
        component: () => import('@/views/course/material/list.vue'),
        meta: { title: '素材库', icon: 'VideoCameraFilled' }
      },
      {
        path: '/course/material/edit/:id?',
        name: 'CourseMaterialEdit',
        component: () => import('@/views/course/material/edit.vue'),
        meta: { title: '素材编辑', hidden: true }
      },
      {
        path: '/course/detail/:id',
        name: 'CourseDetail',
        component: () => import('@/views/course/detail.vue'),
        meta: { title: '课程详情', hidden: true }
      }
    ]
  },
  {
    path: '/column',
    name: 'Column',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/column/list',
    meta: { title: '专栏管理', icon: 'CollectionTag' },
    children: [
      {
        path: '/column/list',
        name: 'ColumnList',
        component: () => import('@/views/column/list.vue'),
        meta: { title: '专栏列表', icon: 'List' }
      },
      {
        path: '/column/category',
        name: 'ColumnCategory',
        component: () => import('@/views/column/category.vue'),
        meta: { title: '专栏分类', icon: 'Tickets' }
      },
      {
        path: '/column/detail/:id',
        name: 'ColumnDetail',
        component: () => import('@/views/column/detail.vue'),
        meta: { title: '专栏详情', hidden: true }
      },
      {
        path: '/column/create',
        name: 'ColumnCreate',
        component: () => import('@/views/column/detail.vue'),
        meta: { title: '创建专栏', hidden: true }
      }
    ]
  },
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/activity/list',
    meta: { title: '活动管理', icon: 'Calendar' },
    children: [
      {
        path: '/activity/list',
        name: 'ActivityList',
        component: () => import('@/views/activity/list.vue'),
        meta: { title: '活动列表', icon: 'CalendarFilled' }
      },
      {
        path: '/activity/edit/:id?',
        name: 'ActivityEdit',
        component: () => import('@/views/activity/edit.vue'),
        meta: { title: '活动编辑', hidden: true }
      },
      {
        path: '/activity/register',
        name: 'ActivityRegister',
        component: () => import('@/views/activity/register.vue'),
        meta: { title: '报名管理', icon: 'Tickets' }
      },
      {
        path: '/activity/stats',
        name: 'ActivityStats',
        component: () => import('@/views/activity/stats.vue'),
        meta: { title: '活动统计', icon: 'TrendCharts' }
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'PriceTag' },
    children: [
      {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单列表', icon: 'List' }
      },
      {
        path: '/order/detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', hidden: true }
      },
      {
        path: '/order/refund',
        name: 'OrderRefund',
        component: () => import('@/views/order/refund.vue'),
        meta: { title: '退款管理', icon: 'Warning' }
      },
      {
        path: '/order/stats',
        name: 'OrderStats',
        component: () => import('@/views/order/stats.vue'),
        meta: { title: '订单统计', icon: 'TrendCharts' }
      }
    ]
  },
  {
    path: '/vip',
    name: 'Vip',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/vip/list',
    meta: { title: 'VIP会员管理', icon: 'VipCard' },
    children: [
      {
        path: '/vip/list',
        name: 'VipList',
        component: () => import('@/views/vip/list.vue'),
        meta: { title: 'VIP列表', icon: 'UserFilled' }
      },
      {
        path: '/vip/config',
        name: 'VipConfig',
        component: () => import('@/views/vip/config.vue'),
        meta: { title: 'VIP配置', icon: 'Setting' }
      },
      {
        path: '/vip/stats',
        name: 'VipStats',
        component: () => import('@/views/vip/stats.vue'),
        meta: { title: 'VIP统计', icon: 'TrendCharts' }
      }
    ]
  },
  {
    path: '/distributor',
    name: 'Distributor',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/distributor/list',
    meta: { title: '分销管理', icon: 'Share' },
    children: [
      {
        path: '/distributor/list',
        name: 'DistributorList',
        component: () => import('@/views/distributor/list.vue'),
        meta: { title: '分销商列表', icon: 'User' }
      },
      {
        path: '/distributor/config',
        name: 'DistributorConfig',
        component: () => import('@/views/distributor/config.vue'),
        meta: { title: '分销配置', icon: 'Setting' }
      },
      {
        path: '/distributor/withdraw',
        name: 'DistributorWithdraw',
        component: () => import('@/views/distributor/withdraw.vue'),
        meta: { title: '提现管理', icon: 'Wallet' }
      },
      {
        path: '/distributor/stats',
        name: 'DistributorStats',
        component: () => import('@/views/distributor/stats.vue'),
        meta: { title: '分销统计', icon: 'TrendCharts' }
      }
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/statistics/dashboard',
    meta: { title: '数据统计', icon: 'DataAnalysis' },
    children: [
      {
        path: '/statistics/dashboard',
        name: 'StatisticsDashboard',
        component: () => import('@/views/statistics/dashboard.vue'),
        meta: { title: '数据概览', icon: 'PieChart' }
      },
      {
        path: '/statistics/user',
        name: 'StatisticsUser',
        component: () => import('@/views/statistics/user.vue'),
        meta: { title: '用户统计', icon: 'User' }
      },
      {
        path: '/statistics/sales',
        name: 'StatisticsSales',
        component: () => import('@/views/statistics/sales.vue'),
        meta: { title: '销售统计', icon: 'TrendCharts' }
      },
      {
        path: '/statistics/course',
        name: 'StatisticsCourse',
        component: () => import('@/views/statistics/course.vue'),
        meta: { title: '课程统计', icon: 'Document' }
      },
      {
        path: '/statistics/activity',
        name: 'StatisticsActivity',
        component: () => import('@/views/statistics/activity.vue'),
        meta: { title: '活动统计', icon: 'CalendarFilled' }
      },
      {
        path: '/statistics/vip',
        name: 'StatisticsVip',
        component: () => import('@/views/statistics/vip.vue'),
        meta: { title: 'VIP统计', icon: 'VipCard' }
      },
      {
        path: '/statistics/distributor',
        name: 'StatisticsDistributor',
        component: () => import('@/views/statistics/distributor.vue'),
        meta: { title: '分销统计', icon: 'Share' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
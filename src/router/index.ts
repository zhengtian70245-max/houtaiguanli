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
    meta: { 
      title: '首页', 
      icon: 'HomeFilled',
      locale: 'menu.dashboard',
      roles: ['*']
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/statistics/dashboard.vue'),
        meta: { 
          title: '数据概览', 
          icon: 'DataAnalysis',
          locale: 'menu.dashboard.workplace',
          roles: ['*']
        }
      },
      {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/test/index.vue'),
        meta: { 
          title: '测试页面', 
          icon: 'File',
          locale: 'menu.test',
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/course',
    name: 'Course',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/course/list',
    meta: { 
      title: '课程管理', 
      icon: 'Reading',
      locale: 'menu.course',
      roles: ['*']
    },
    children: [
      {
        path: '/course/list',
        name: 'CourseList',
        component: () => import('@/views/course/list.vue'),
        meta: { 
          title: '课程列表', 
          icon: 'Document',
          locale: 'menu.course.list',
          roles: ['*']
        }
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
        meta: { 
          title: '课程分类', 
          icon: 'Folder',
          locale: 'menu.course.category',
          roles: ['*']
        }
      },
      {
        path: '/course/material',
        name: 'CourseMaterial',
        component: () => import('@/views/course/material/list.vue'),
        meta: { 
          title: '素材库', 
          icon: 'VideoCameraFilled',
          locale: 'menu.course.material',
          roles: ['*']
        }
      },
      {
        path: '/course/material/edit/:id?',
        name: 'CourseMaterialEdit',
        component: () => import('@/views/course/material/edit.vue'),
        meta: { 
          title: '素材编辑', 
          hidden: true,
          locale: 'menu.course.material-edit',
          roles: ['*']
        }
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
    meta: { 
      title: '专栏管理', 
      icon: 'CollectionTag',
      locale: 'menu.column',
      roles: ['*']
    },
    children: [
      {
        path: '/column/list',
        name: 'ColumnList',
        component: () => import('@/views/column/list.vue'),
        meta: { 
          title: '专栏列表', 
          icon: 'List',
          locale: 'menu.column.list',
          roles: ['*']
        }
      },
      {
        path: '/column/category',
        name: 'ColumnCategory',
        component: () => import('@/views/column/category.vue'),
        meta: { 
          title: '专栏分类', 
          icon: 'Tickets',
          locale: 'menu.column.category',
          roles: ['*']
        }
      },
      {
        path: '/column/detail/:id',
        name: 'ColumnDetail',
        component: () => import('@/views/common/detail.vue'),
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
    meta: { 
      title: '活动管理', 
      icon: 'Calendar',
      locale: 'menu.activity',
      roles: ['*']
    },
    children: [
      {
        path: '/activity/list',
        name: 'ActivityList',
        component: () => import('@/views/activity/list.vue'),
        meta: { 
          title: '活动列表', 
          icon: 'CalendarFilled',
          locale: 'menu.activity.list',
          roles: ['*']
        }
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
        meta: { 
          title: '报名管理', 
          icon: 'Tickets',
          locale: 'menu.activity.register',
          roles: ['*']
        }
      },
      {
        path: '/activity/stats',
        name: 'ActivityStats',
        component: () => import('@/views/activity/stats.vue'),
        meta: { 
          title: '活动统计', 
          icon: 'TrendCharts',
          locale: 'menu.activity.stats',
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/order/list',
    meta: { 
      title: '订单管理', 
      icon: 'PriceTag',
      locale: 'menu.order',
      roles: ['*']
    },
    children: [
      {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { 
          title: '订单列表', 
          icon: 'List',
          locale: 'menu.order.list',
          roles: ['*']
        }
      },
      {
        path: '/order/detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/common/detail.vue'),
        meta: { title: '订单详情', hidden: true }
      },
      {
        path: '/order/refund',
        name: 'OrderRefund',
        component: () => import('@/views/order/refund.vue'),
        meta: { 
          title: '退款管理', 
          icon: 'Warning',
          locale: 'menu.order.refund',
          roles: ['*']
        }
      },
      {
        path: '/order/stats',
        name: 'OrderStats',
        component: () => import('@/views/order/stats.vue'),
        meta: { 
          title: '订单统计', 
          icon: 'TrendCharts',
          locale: 'menu.order.stats',
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/vip',
    name: 'Vip',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/vip/list',
    meta: { 
      title: 'VIP会员管理', 
      icon: 'VipCard',
      locale: 'menu.vip',
      roles: ['*']
    },
    children: [
      {
        path: '/vip/list',
        name: 'VipList',
        component: () => import('@/views/vip/list.vue'),
        meta: { 
          title: 'VIP列表', 
          icon: 'UserFilled',
          locale: 'menu.vip.list',
          roles: ['*']
        }
      },
      {
        path: '/vip/config',
        name: 'VipConfig',
        component: () => import('@/views/vip/config.vue'),
        meta: { 
          title: 'VIP配置', 
          icon: 'Setting',
          locale: 'menu.vip.config',
          roles: ['super']
        }
      },
      {
        path: '/vip/stats',
        name: 'VipStats',
        component: () => import('@/views/vip/stats.vue'),
        meta: { 
          title: 'VIP统计', 
          icon: 'TrendCharts',
          locale: 'menu.vip.stats',
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/distributor',
    name: 'Distributor',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/distributor/list',
    meta: { 
      title: '服务商管理', 
      icon: 'Share',
      locale: 'menu.distributor',
      roles: ['*']
    },
    children: [
      {
        path: '/distributor/list',
        name: 'DistributorList',
        component: () => import('@/views/distributor/list.vue'),
        meta: { 
          title: '服务商列表', 
          icon: 'User',
          locale: 'menu.distributor.list',
          roles: ['*']
        }
      },
      {
        path: '/distributor/config',
        name: 'DistributorConfig',
        component: () => import('@/views/distributor/config.vue'),
        meta: { 
          title: '服务商配置', 
          icon: 'Setting',
          locale: 'menu.distributor.config',
          roles: ['super']
        }
      },
      {
        path: '/distributor/withdraw',
        name: 'DistributorWithdraw',
        component: () => import('@/views/distributor/withdraw.vue'),
        meta: { 
          title: '提现管理', 
          icon: 'Wallet',
          locale: 'menu.distributor.withdraw',
          roles: ['*']
        }
      },
      {
        path: '/distributor/stats',
        name: 'DistributorStats',
        component: () => import('@/views/distributor/stats.vue'),
        meta: { 
          title: '服务商统计', 
          icon: 'TrendCharts',
          locale: 'menu.distributor.stats',
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/user/list',
    meta: { 
      title: '用户管理', 
      icon: 'User',
      locale: 'menu.user',
      roles: ['*']
    },
    children: [
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { 
          title: '用户列表', 
          icon: 'UserFilled',
          locale: 'menu.user.list',
          roles: ['*']
        }
      },
      {
        path: '/user/detail/:id',
        name: 'UserDetail',
        component: () => import('@/views/common/detail.vue'),
        meta: { title: '用户详情', hidden: true }
      },
      {
        path: '/user/tree/:id',
        name: 'UserTree',
        component: () => import('@/views/user/tree.vue'),
        meta: { 
          title: '用户关系', 
          hidden: true,
          locale: 'menu.user.tree',
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/statistics/dashboard',
    meta: { 
      title: '财务管理', 
      icon: 'DataAnalysis',
      locale: 'menu.statistics',
      roles: ['*']
    },
    children: [
      {
        path: '/statistics/dashboard',
        name: 'StatisticsDashboard',
        component: () => import('@/views/statistics/dashboard.vue'),
        meta: { 
          title: '数据概览', 
          icon: 'PieChart',
          locale: 'menu.statistics.dashboard',
          roles: ['*']
        }
      },
      {
        path: '/statistics/user',
        name: 'StatisticsUser',
        component: () => import('@/views/statistics/user.vue'),
        meta: { 
          title: '用户统计', 
          icon: 'User',
          locale: 'menu.statistics.user',
          roles: ['*']
        }
      },
      {
        path: '/statistics/sales',
        name: 'StatisticsSales',
        component: () => import('@/views/statistics/sales.vue'),
        meta: { 
          title: '销售统计', 
          icon: 'TrendCharts',
          locale: 'menu.statistics.sales',
          roles: ['*']
        }
      },
      {
        path: '/statistics/course',
        name: 'StatisticsCourse',
        component: () => import('@/views/statistics/course.vue'),
        meta: { 
          title: '课程统计', 
          icon: 'Document',
          locale: 'menu.statistics.course',
          roles: ['*']
        }
      },
      {
        path: '/statistics/activity',
        name: 'StatisticsActivity',
        component: () => import('@/views/statistics/activity.vue'),
        meta: { 
          title: '活动统计', 
          icon: 'CalendarFilled',
          locale: 'menu.statistics.activity',
          roles: ['*']
        }
      },
      {
        path: '/statistics/vip',
        name: 'StatisticsVip',
        component: () => import('@/views/statistics/vip.vue'),
        meta: { 
          title: 'VIP统计', 
          icon: 'VipCard',
          locale: 'menu.statistics.vip',
          roles: ['*']
        }
      },
      {
        path: '/statistics/distributor',
        name: 'StatisticsDistributor',
        component: () => import('@/views/statistics/distributor.vue'),
        meta: { 
          title: '服务商统计', 
          icon: 'Share',
          locale: 'menu.statistics.distributor',
          roles: ['*']
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/system/base-config',
    meta: { 
      title: '系统管理', 
      icon: 'Setting',
      locale: 'menu.system',
      roles: ['*']
    },
    children: [
      {
        path: '/system/base-config',
        name: 'BaseConfig',
        component: () => import('@/views/system/base-config.vue'),
        meta: { 
          title: '基础配置', 
          icon: 'Monitor',
          locale: 'menu.system.base-config',
          roles: ['super']
        }
      },
      {
        path: '/system/vip-config',
        name: 'VipConfig',
        component: () => import('@/views/system/vip-config.vue'),
        meta: { 
          title: 'VIP配置', 
          icon: 'VipCard',
          locale: 'menu.system.vip-config',
          roles: ['super']
        }
      },
      {
        path: '/system/distributor-config',
        name: 'DistributorConfig',
        component: () => import('@/views/system/distributor-config.vue'),
        meta: { 
          title: '服务商配置', 
          icon: 'Promotion',
          locale: 'menu.system.distributor-config',
          roles: ['super']
        }
      },
      {
        path: '/system/sms-config',
        name: 'SmsConfig',
        component: () => import('@/views/system/sms-config.vue'),
        meta: { 
          title: '短信配置', 
          icon: 'ChatLineRound',
          locale: 'menu.system.sms-config',
          roles: ['super']
        }
      },
      {
        path: '/system/payment-config',
        name: 'PaymentConfig',
        component: () => import('@/views/system/payment-config.vue'),
        meta: { 
          title: '支付配置', 
          icon: 'Coin',
          locale: 'menu.system.payment-config',
          roles: ['super']
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
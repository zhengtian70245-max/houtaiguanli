<template>
  <div class="page-header">
    <div class="header-left">
      <div class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
            <router-link v-if="item.path" :to="item.path">{{ item.title }}</router-link>
            <span v-else>{{ item.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="page-info">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-desc">{{ pageDesc }}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="header-actions">
        <a-space :size="16">
          <a-tooltip content="消息通知">
            <a-badge :count="messageCount" :max-count="99">
              <a-button type="text" class="action-btn">
                <template #icon>
                  <icon-file />
                </template>
              </a-button>
            </a-badge>
          </a-tooltip>
          <a-tooltip content="帮助中心">
            <a-button type="text" class="action-btn">
              <template #icon>
                <icon-file />
              </template>
            </a-button>
          </a-tooltip>
          <a-dropdown @select="handleUserAction">
            <div class="user-info">
              <a-avatar :size="40" :style="{ backgroundColor: '#165dff' }">
                {{ userStore.userInfo?.name?.charAt(0) || userStore.userInfo?.username?.charAt(0) || 'U' }}
              </a-avatar>
              <div class="user-detail">
                <span class="user-name">{{ userStore.userInfo?.name || userStore.userInfo?.username }}</span>
                <span class="user-role">{{ userStore.userInfo?.role || '管理员' }}</span>
              </div>
              <icon-file class="dropdown-icon" />
            </div>
            <template #content>
              <a-doption value="profile">
                <template #icon>
                  <icon-file />
                </template>
                个人信息
              </a-doption>
              <a-doption value="settings">
                <template #icon>
                  <icon-file />
                </template>
                账号设置
              </a-doption>
              <a-doption value="logout">
                <template #icon>
                  <icon-file />
                </template>
                退出登录
              </a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconFile
} from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const messageCount = computed(() => 5)

const pageTitle = computed(() => route.meta.title || '管理后台')
const pageDesc = computed(() => {
  const descMap: Record<string, string> = {
    '/dashboard': '数据概览与统计',
    '/system': '系统配置管理',
    '/user': '用户信息管理',
    '/course': '课程内容管理',
    '/column': '专栏内容管理',
    '/activity': '活动信息管理',
    '/order': '订单信息管理',
    '/vip': 'VIP会员管理',
    '/distributor': '分销渠道管理',
    '/statistics': '数据统计分析'
  }
  const path = route.path
  for (const key in descMap) {
    if (path.startsWith(key)) {
      return descMap[key]
    }
  }
  return '管理您的教育平台'
})

const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = [{ title: '首页', path: '/dashboard' }]
  
  let currentPath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += '/' + pathSegments[i]
    const title = route.matched[i + 1]?.meta?.title || pathSegments[i]
    items.push({
      title: title as string,
      path: i === pathSegments.length - 1 ? '' : currentPath
    })
  }
  
  return items
})

function handleUserAction(value: string) {
  if (value === 'logout') {
    Modal.confirm({
      title: '提示',
      content: '确定要退出登录吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        userStore.logout()
        router.push('/login')
        Message.success('退出成功')
      }
    })
  } else if (value === 'profile') {
    router.push('/profile')
  } else if (value === 'settings') {
    router.push('/settings')
  }
}
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  padding: 0 24px;
  background: var(--arco-bg-color-1);
  border-bottom: 1px solid var(--arco-border-color-2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  overflow: hidden;

  .header-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    min-width: 0;

    .breadcrumb {
      :deep(.arco-breadcrumb) {
        font-size: 13px;
        color: var(--arco-text-color-3);

        .arco-breadcrumb-item-link {
          color: var(--arco-text-color-3);
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: var(--arco-primary-color-7);
          }
        }

        .arco-breadcrumb-item-separator {
          margin: 0 8px;
          color: var(--arco-text-color-4);
        }
      }
    }

    .page-info {
      display: flex;
      align-items: baseline;
      gap: 16px;
      flex-wrap: nowrap;
      overflow: hidden;

      .page-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--arco-text-color-1);
        margin: 0;
        line-height: 1.4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .page-desc {
        font-size: 13px;
        color: var(--arco-text-color-3);
        margin: 0;
        line-height: 1.4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .action-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--arco-text-color-2);
        transition: all 0.3s ease;

        &:hover {
          background: var(--arco-fill-color-1);
          color: var(--arco-primary-color-7);
        }

        .arco-icon {
          font-size: 20px;
        }
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        border-radius: var(--arco-radius-large);
        cursor: pointer;
        transition: all 0.3s ease;
        flex-shrink: 0;

        &:hover {
          background: var(--arco-fill-color-1);
        }

        .user-detail {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: right;
          flex-shrink: 0;

          .user-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--arco-text-color-1);
            line-height: 1.4;
            white-space: nowrap;
          }

          .user-role {
            font-size: 12px;
            color: var(--arco-text-color-3);
            line-height: 1.4;
            white-space: nowrap;
          }
        }

        .dropdown-icon {
          color: var(--arco-text-color-3);
          font-size: 14px;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
      }

      .user-info:hover .dropdown-icon {
        transform: rotate(180deg);
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .page-header {
    padding: 0 16px;
    height: 64px;

    .header-left {
      gap: 4px;

      .page-info {
        gap: 12px;

        .page-title {
          font-size: 18px;
        }

        .page-desc {
          font-size: 12px;
        }
      }
    }

    .header-right {
      gap: 12px;

      .header-actions {
        gap: 4px;

        .action-btn {
          width: 40px;
          height: 40px;

          .arco-icon {
            font-size: 18px;
          }
        }

        .user-info {
          padding: 6px 12px;
          gap: 8px;

          .user-detail {
            .user-name {
              font-size: 13px;
            }

            .user-role {
              font-size: 11px;
            }
          }
        }
      }
    }
  }
}
</style>

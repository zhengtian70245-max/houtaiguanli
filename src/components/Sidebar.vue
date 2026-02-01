<template>
  <a-menu
    :open-keys="openKeys"
    :inline-collapsed="props.isCollapse"
    mode="inline"
    @open-change="handleOpenChange"
  >
    <a-menu-item key="/dashboard" @click="navigateTo('/dashboard')">
      <template #icon>
        <icon-file />
      </template>
      <span>仪表盘</span>
    </a-menu-item>

    <a-sub-menu key="/course">
      <template #icon>
        <icon-file />
      </template>
      <template #title>课程管理</template>
      <a-menu-item key="/course/list" @click="navigateTo('/course/list')">
        <template #icon>
          <icon-file />
        </template>
        <span>课程列表</span>
      </a-menu-item>
      <a-menu-item key="/course/category" @click="navigateTo('/course/category')">
        <template #icon>
          <icon-file />
        </template>
        <span>课程分类</span>
      </a-menu-item>
      <a-menu-item key="/course/material" @click="navigateTo('/course/material')">
        <template #icon>
          <icon-file />
        </template>
        <span>素材库</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/column">
      <template #icon>
        <icon-file />
      </template>
      <template #title>专栏管理</template>
      <a-menu-item key="/column/list" @click="navigateTo('/column/list')">
        <template #icon>
          <icon-file />
        </template>
        <span>专栏列表</span>
      </a-menu-item>
      <a-menu-item key="/column/category" @click="navigateTo('/column/category')">
        <template #icon>
          <icon-file />
        </template>
        <span>专栏分类</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/activity">
      <template #icon>
        <icon-file />
      </template>
      <template #title>活动管理</template>
      <a-menu-item key="/activity/list" @click="navigateTo('/activity/list')">
        <template #icon>
          <icon-file />
        </template>
        <span>活动列表</span>
      </a-menu-item>
      <a-menu-item key="/activity/register" @click="navigateTo('/activity/register')">
        <template #icon>
          <icon-file />
        </template>
        <span>报名管理</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/order">
      <template #icon>
        <icon-file />
      </template>
      <template #title>订单管理</template>
      <a-menu-item key="/order/list" @click="navigateTo('/order/list')">
        <template #icon>
          <icon-file />
        </template>
        <span>订单列表</span>
      </a-menu-item>
      <a-menu-item key="/order/refund" @click="navigateTo('/order/refund')">
        <template #icon>
          <icon-file />
        </template>
        <span>退款管理</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/vip">
      <template #icon>
        <icon-file />
      </template>
      <template #title>VIP会员管理</template>
      <a-menu-item key="/vip/list" @click="navigateTo('/vip/list')">
        <template #icon>
          <icon-file />
        </template>
        <span>VIP列表</span>
      </a-menu-item>
      <a-menu-item key="/vip/config" @click="navigateTo('/vip/config')">
        <template #icon>
          <icon-file />
        </template>
        <span>VIP配置</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/distributor">
      <template #icon>
        <icon-file />
      </template>
      <template #title>分销管理</template>
      <a-menu-item key="/distributor/list" @click="navigateTo('/distributor/list')">
        <template #icon>
          <icon-file />
        </template>
        <span>分销商列表</span>
      </a-menu-item>
      <a-menu-item key="/distributor/withdraw" @click="navigateTo('/distributor/withdraw')">
        <template #icon>
          <icon-file />
        </template>
        <span>提现管理</span>
      </a-menu-item>
      <a-menu-item key="/distributor/config" @click="navigateTo('/distributor/config')">
        <template #icon>
          <icon-file />
        </template>
        <span>分销配置</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/statistics">
      <template #icon>
        <icon-file />
      </template>
      <template #title>数据统计</template>
      <a-menu-item key="/statistics/dashboard" @click="navigateTo('/statistics/dashboard')">
        <template #icon>
          <icon-file />
        </template>
        <span>数据概览</span>
      </a-menu-item>
      <a-menu-item key="/statistics/sales" @click="navigateTo('/statistics/sales')">
        <template #icon>
          <icon-file />
        </template>
        <span>销售统计</span>
      </a-menu-item>
      <a-menu-item key="/statistics/course" @click="navigateTo('/statistics/course')">
        <template #icon>
          <icon-file />
        </template>
        <span>课程统计</span>
      </a-menu-item>
      <a-menu-item key="/statistics/activity" @click="navigateTo('/statistics/activity')">
        <template #icon>
          <icon-file />
        </template>
        <span>活动统计</span>
      </a-menu-item>
      <a-menu-item key="/statistics/vip" @click="navigateTo('/statistics/vip')">
        <template #icon>
          <icon-file />
        </template>
        <span>VIP统计</span>
      </a-menu-item>
      <a-menu-item key="/statistics/distributor" @click="navigateTo('/statistics/distributor')">
        <template #icon>
          <icon-file />
        </template>
        <span>分销统计</span>
      </a-menu-item>
      <a-menu-item key="/statistics/user" @click="navigateTo('/statistics/user')">
        <template #icon>
          <icon-file />
        </template>
        <span>用户统计</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/system">
      <template #icon>
        <icon-file />
      </template>
      <template #title>系统配置</template>
      <a-menu-item key="/system/base-config" @click="navigateTo('/system/base-config')">
        <template #icon>
          <icon-file />
        </template>
        <span>基础配置</span>
      </a-menu-item>
      <a-menu-item key="/system/vip-config" @click="navigateTo('/system/vip-config')">
        <template #icon>
          <icon-file />
        </template>
        <span>VIP配置</span>
      </a-menu-item>
      <a-menu-item key="/system/distributor-config" @click="navigateTo('/system/distributor-config')">
        <template #icon>
          <icon-file />
        </template>
        <span>分销配置</span>
      </a-menu-item>
      <a-menu-item key="/system/sms-config" @click="navigateTo('/system/sms-config')">
        <template #icon>
          <icon-file />
        </template>
        <span>短信配置</span>
      </a-menu-item>
      <a-menu-item key="/system/payment-config" @click="navigateTo('/system/payment-config')">
        <template #icon>
          <icon-file />
        </template>
        <span>支付配置</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/user">
      <template #icon>
        <icon-file />
      </template>
      <template #title>用户管理</template>
      <a-menu-item key="/user/list" @click="navigateTo('/user/list')">
        <template #icon>
          <icon-file />
        </template>
        <span>用户列表</span>
      </a-menu-item>
      <a-menu-item key="/user/tree" @click="navigateTo('/user/tree')">
        <template #icon>
          <icon-file />
        </template>
        <span>用户关系</span>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IconFile
} from '@arco-design/web-vue/es/icon'

const props = defineProps<{
  isCollapse?: boolean
}>()

const router = useRouter()
const route = useRoute()
const openKeys = ref<string[]>([])

const currentPath = computed(() => route.path)

function navigateTo(path: string) {
  console.log('Navigating to:', path)
  router.push(path)
}

function handleSelect(info: any) {
  console.log('Menu select event:', info)
  // 尝试不同的方式获取key值
  const key = info.key || info
  console.log('Navigating to:', key)
  router.push(key)
}

function handleOpenChange(keys: string[]) {
  openKeys.value = keys
}


</script>

<style scoped lang="scss">
:deep(.arco-menu) {
  background: transparent;
  border: none;

  .arco-menu-item,
  .arco-menu-inline-header {
    margin-bottom: 4px;
    border-radius: var(--arco-radius-medium);
    transition: all 0.3s ease;
    color: var(--arco-text-color-2);

    &:hover {
      background: var(--arco-fill-color-1);
      color: var(--arco-primary-color-7);
    }

    .arco-icon {
      color: var(--arco-text-color-3);
      transition: all 0.3s ease;
    }

    &:hover .arco-icon {
      color: var(--arco-primary-color-7);
    }
  }

  .arco-menu-item-selected {
    background: linear-gradient(135deg, var(--arco-primary-color-1) 0%, var(--arco-primary-color-2) 100%);
    color: var(--arco-primary-color-7);
    font-weight: 500;

    .arco-icon {
      color: var(--arco-primary-color-7);
    }

    &::before {
      background: var(--arco-primary-color-7);
    }
  }

  .arco-menu-inline-content {
    padding-left: 16px;
  }

  .arco-menu-item {
    padding: 10px 16px;

    .arco-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }

  .arco-menu-inline-header {
    padding: 12px 16px;

    .arco-icon {
      margin-right: 8px;
      font-size: 16px;
    }

    .arco-menu-icon-suffix {
      transition: transform 0.3s ease;
    }
  }

  .arco-menu-inline-header.arco-menu-opened {
    .arco-menu-icon-suffix {
      transform: rotate(90deg);
    }
  }

  &.arco-menu-collapsed {
    .arco-menu-item,
    .arco-menu-inline-header {
      padding: 12px;
      justify-content: center;

      .arco-icon {
        margin-right: 0;
      }

      .arco-menu-title {
        display: none;
      }
    }
  }
}
</style>

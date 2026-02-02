<template>
  <a-layout class="main-layout">
    <a-layout-sider
      class="layout-sider"
      :width="240"
      :collapsed="isCollapse"
      :collapsible="false"
      :hide-trigger="true"
    >
      <div class="logo-container">
        <div class="logo">
          <div class="logo-icon">
            <IconFile />
          </div>
        </div>
        <div class="logo-text" v-if="!isCollapse">
          <span class="title">知识管理</span>
          <span class="subtitle">后台系统</span>
        </div>
      </div>
      <Sidebar :is-collapse="isCollapse" />
      <div class="collapse-trigger" @click="toggleCollapse">
        <IconFile v-if="!isCollapse" />
        <IconFile v-else />
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <PageHeader />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import PageHeader from '@/components/PageHeader.vue'
import { IconFile } from '@arco-design/web-vue/es/icon'

const isCollapse = ref(false)

function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped lang="scss">
.main-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;

  .layout-sider {
    background: var(--arco-bg-color-1);
    border-right: 1px solid var(--arco-border-color-2);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    z-index: 10;
    display: flex;
    flex-direction: column;

    :deep(.arco-layout-sider-children) {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .logo-container {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--arco-border-color-2);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: all 0.3s ease;
      flex-shrink: 0;

      .logo {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;

        .logo-icon {
          color: #ffffff;
          font-size: 24px;
        }
      }

      .logo-text {
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
        }
      }
    }

    :deep(.arco-menu) {
      flex: 1;
      overflow-y: auto;
      border: none;
      padding: 12px 8px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--arco-border-color-3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    .collapse-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      border-top: 1px solid var(--arco-border-color-2);
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--arco-text-color-2);

      &:hover {
        background: var(--arco-fill-color-1);
        color: var(--arco-primary-color-7);
      }

      .arco-icon {
        font-size: 18px;
      }
    }
  }

  .layout-header {
    background: var(--arco-bg-color-1);
    border-bottom: 1px solid var(--arco-border-color-2);
    padding: 0;
    height: 72px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 5;
  }

  // 响应式调整
  @media (max-width: 768px) {
    .layout-header {
      height: 64px;
    }
  }

  .layout-content {
    background: var(--arco-bg-color-2);
    overflow: hidden;

    .content-wrapper {
      height: 100%;
      overflow-y: auto;
      padding: 20px;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--arco-border-color-3);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-track {
        background: var(--arco-fill-color-1);
      }
    }
  }
}
</style>

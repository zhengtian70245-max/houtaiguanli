<template>
  <div class="main-layout">
    <Sidebar />
    <div class="main-content">
      <PageHeader />
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" />
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import Sidebar from '@/components/Sidebar.vue'
import PageHeader from '@/components/PageHeader.vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.initUserInfo()
})
</script>

<style scoped lang="scss">
.main-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f7fa;

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
  }
}
</style>
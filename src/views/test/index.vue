<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>这是一个测试页面，用于诊断路由和渲染问题</p>
    <p>当前时间: {{ currentTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentTime = ref(new Date().toLocaleString())

onMounted(() => {
  console.log('测试页面挂载成功')
})
</script>

<style scoped>
.test-page {
  padding: 24px;
}

h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
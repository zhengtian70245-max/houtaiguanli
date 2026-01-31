<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

:root {
  --theme-color: #409eff;
  --theme-hover-color: #66b1ff;
  --theme-active-color: #337ecc;
  --border-color: #dcdfe6;
  --text-color: #303133;
  --text-secondary-color: #606266;
  --background-color: #f5f7fa;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
}
</style>
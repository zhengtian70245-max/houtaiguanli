<template>
  <div class="page-container">
    <div class="page-header">
      <h2>素材库</h2>
      <el-button type="primary" @click="handleAdd">添加素材</el-button>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="素材名称">
          <el-input v-model="queryForm.name" placeholder="请输入素材名称" clearable />
        </el-form-item>
        <el-form-item label="素材类型">
          <el-select v-model="queryForm.type" placeholder="请选择素材类型" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="视频" :value="1" />
            <el-option label="音频" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="可用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="素材名称" min-width="200" />
        <el-table-column prop="type" label="素材类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1" type="info">视频</el-tag>
            <el-tag v-else-if="row.type === 2" type="success">音频</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="120" align="right">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="120" align="center">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '可用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="上传时间" width="160" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handlePreview(row)">预览</el-button>
            <el-button v-if="row.status" type="info" size="small" @click="handleDisable(row)">禁用</el-button>
            <el-button v-else type="success" size="small" @click="handleEnable(row)">启用</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockDataService } from '@/api/mock'

const router = useRouter()
const loading = ref(false)

const queryForm = reactive({
  name: '',
  type: 0,
  status: -1
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化时长
function formatDuration(seconds: number): string {
  if (!seconds) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

async function fetchData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page - 1,
      size: pagination.size,
      ...queryForm
    }
    // 模拟数据
    const result = {
      list: [
        {
          id: 1,
          name: '课程介绍视频',
          type: 1,
          size: 1024 * 1024 * 50, // 50MB
          duration: 600, // 10分钟
          url: 'https://example.com/video1.mp4',
          status: 1,
          createTime: '2026-01-01 10:00:00'
        },
        {
          id: 2,
          name: '音频讲解1',
          type: 2,
          size: 1024 * 1024 * 10, // 10MB
          duration: 300, // 5分钟
          url: 'https://example.com/audio1.mp3',
          status: 1,
          createTime: '2026-01-02 14:30:00'
        }
      ],
      total: 2
    }
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  queryForm.name = ''
  queryForm.type = 0
  queryForm.status = -1
  pagination.page = 1
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  fetchData()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  fetchData()
}

function handleAdd() {
  router.push('/course/material/edit')
}

function handleEdit(row: any) {
  router.push(`/course/material/edit/${row.id}`)
}

function handlePreview(row: any) {
  // 预览素材
  ElMessageBox.alert(
    `<div style="text-align: center;">
      <h3>${row.name}</h3>
      <p>类型: ${row.type === 1 ? '视频' : '音频'}</p>
      <p>大小: ${formatFileSize(row.size)}</p>
      <p>时长: ${formatDuration(row.duration)}</p>
      <p>URL: ${row.url}</p>
    </div>`,
    '素材预览',
    {
      dangerouslyUseHTMLString: true
    }
  )
}

function handleDisable(row: any) {
  ElMessage.confirm('确定要禁用该素材吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 0
    ElMessage.success('禁用成功')
  }).catch(() => {})
}

function handleEnable(row: any) {
  ElMessage.confirm('确定要启用该素材吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 1
    ElMessage.success('启用成功')
  }).catch(() => {})
}

function handleDelete(row: any) {
  ElMessage.confirm('确定要删除该素材吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
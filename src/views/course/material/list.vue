<template>
  <div class="page-container">
    <a-card class="search-card" :bordered="false">
      <a-form :model="queryForm" layout="inline">
        <a-form-item label="素材名称">
          <a-input v-model="queryForm.name" placeholder="请输入素材名称" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="素材类型">
          <a-select v-model="queryForm.type" placeholder="请选择素材类型" allow-clear style="width: 150px">
            <a-option label="全部" :value="0" />
            <a-option label="视频" :value="1" />
            <a-option label="音频" :value="2" />
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
            <a-option label="全部" :value="-1" />
            <a-option label="可用" :value="1" />
            <a-option label="禁用" :value="0" />
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card" :bordered="false">
      <template #title>
        <div class="card-title">
          <span>素材库</span>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            添加素材
          </a-button>
        </div>
      </template>

      <a-table :data="tableData" :loading="loading" :columns="columns" :pagination="false" bordered>
        <template #column:type="{ record }">
          <a-tag v-if="record.type === 1" color="blue">视频</a-tag>
          <a-tag v-else-if="record.type === 2" color="green">音频</a-tag>
        </template>
        <template #column:size="{ record }">
          {{ formatFileSize(record.size) }}
        </template>
        <template #column:duration="{ record }">
          {{ formatDuration(record.duration) }}
        </template>
        <template #column:status="{ record }">
          <a-tag :color="record.status ? 'green' : 'red'">
            {{ record.status ? '可用' : '禁用' }}
          </a-tag>
        </template>
        <template #column:action="{ record }">
          <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
          <a-button type="default" size="small" @click="handlePreview(record)">预览</a-button>
          <a-button v-if="record.status" type="default" size="small" @click="handleDisable(record)">禁用</a-button>
          <a-button v-else type="success" size="small" @click="handleEnable(record)">启用</a-button>
          <a-button type="danger" size="small" @click="handleDelete(record)">删除</a-button>
        </template>
      </a-table>

      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="pagination.page"
          v-model:page-size="pagination.size"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-total
          :total="pagination.total"
          @change="handleCurrentChange"
          @page-size-change="handleSizeChange"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import message from '@arco-design/web-vue/es/message'
import Modal from '@arco-design/web-vue/es/modal'
import {
  IconPlus,
  IconEdit,
  IconEye,
  IconVideoCamera,
  IconAudio,
  IconDelete,
  IconSearch,
  IconRefresh
} from '@arco-design/web-vue/es/icon'

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

const columns = computed(() => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    align: 'center'
  },
  {
    title: '素材名称',
    dataIndex: 'name',
    minWidth: 200
  },
  {
    title: '素材类型',
    dataIndex: 'type',
    width: 100,
    align: 'center'
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    width: 120,
    align: 'right'
  },
  {
    title: '时长',
    dataIndex: 'duration',
    width: 120,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    align: 'center'
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    width: 160
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    align: 'center',
    fixed: 'right'
  }
])

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
        },
        {
          id: 3,
          name: '课程讲解视频2',
          type: 1,
          size: 1024 * 1024 * 80, // 80MB
          duration: 900, // 15分钟
          url: 'https://example.com/video2.mp4',
          status: 1,
          createTime: '2026-01-03 09:00:00'
        },
        {
          id: 4,
          name: '音频讲解2',
          type: 2,
          size: 1024 * 1024 * 15, // 15MB
          duration: 450, // 7.5分钟
          url: 'https://example.com/audio2.mp3',
          status: 0,
          createTime: '2026-01-04 16:00:00'
        }
      ],
      total: 4
    }
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    message.error('获取数据失败')
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
  let mediaPlayer = ''
  if (row.type === 1) {
    // 视频预览
    mediaPlayer = '<div class="media-player"><video controls width="600" height="400"><source src="' + row.url + '" type="video/mp4">您的浏览器不支持视频播放。</video></div>'
  } else if (row.type === 2) {
    // 音频预览
    mediaPlayer = '<div class="media-player"><audio controls style="width: 100%;"><source src="' + row.url + '" type="audio/mp3">您的浏览器不支持音频播放。</audio></div>'
  }

  Modal.info({
    title: '素材预览',
    width: 700,
    content: '<div><h3 style="text-align: center; margin-bottom: 20px;">' + row.name + '</h3>' + mediaPlayer + '<div class="material-info"><div class="info-item"><span class="info-label">类型:</span><span class="info-value">' + (row.type === 1 ? '视频' : '音频') + '</span></div><div class="info-item"><span class="info-label">大小:</span><span class="info-value">' + formatFileSize(row.size) + '</span></div><div class="info-item"><span class="info-label">时长:</span><span class="info-value">' + formatDuration(row.duration) + '</span></div><div class="info-item"><span class="info-label">状态:</span><span class="info-value">' + (row.status ? '可用' : '禁用') + '</span></div><div class="info-item"><span class="info-label">上传时间:</span><span class="info-value">' + row.createTime + '</span></div><div class="info-item"><span class="info-label">URL:</span><span class="info-value"><a href="' + row.url + '" target="_blank">' + row.url + '</a></span></div></div></div>',
    showCancel: false
  })
}

function handleDisable(row: any) {
  Modal.confirm({
    title: '操作确认',
    content: '确定要禁用该素材吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      row.status = 0
      message.success('禁用成功')
    }
  })
}

function handleEnable(row: any) {
  Modal.confirm({
    title: '操作确认',
    content: '确定要启用该素材吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      row.status = 1
      message.success('启用成功')
    }
  })
}

function handleDelete(row: any) {
  Modal.confirm({
    title: '操作确认',
    content: '确定要删除该素材吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('删除成功')
      fetchData()
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-container {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .media-player {
    margin-top: 20px;
    text-align: center;

    video,
    audio {
      max-width: 100%;
      border-radius: 4px;
    }
  }

  .material-info {
    margin-top: 20px;
    padding: 16px;
    background-color: #f7f9fc;
    border-radius: 4px;
    text-align: left;

    .info-item {
      margin-bottom: 8px;
      display: flex;
      align-items: center;

      .info-label {
        width: 80px;
        font-weight: 500;
        color: #666;
      }

      .info-value {
        color: #333;
      }
    }
  }
}
</style>
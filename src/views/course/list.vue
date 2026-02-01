<template>
  <div class="course-list-page">
    <a-card class="search-card" :bordered="false">
      <a-form :model="queryForm" layout="inline">
        <a-form-item label="课程标题">
          <a-input v-model="queryForm.title" placeholder="请输入课程标题" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="课程分类">
          <a-select v-model="queryForm.category" placeholder="请选择课程分类" allow-clear style="width: 150px">
            <a-option :value="0">全部</a-option>
            <a-option :value="1">专业课</a-option>
            <a-option :value="2">家长必修</a-option>
            <a-option :value="3">精品专题</a-option>
            <a-option :value="4">VIP专区</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
            <a-option :value="-1">全部</a-option>
            <a-option :value="1">上架</a-option>
            <a-option :value="0">下架</a-option>
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
          <span>课程列表</span>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            添加课程
          </a-button>
        </div>
      </template>
      <template #extra>
        <a-space>
          <a-button @click="handleBatchDelete" :disabled="selectedRows.length === 0">
            <template #icon>
              <icon-delete />
            </template>
            批量删除
          </a-button>
          <a-button @click="handleExport">
            <template #icon>
              <icon-download />
            </template>
            导出数据
          </a-button>
        </a-space>
      </template>

      <a-table
        :data="tableData"
        :loading="loading"
        :pagination="false"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true
        }"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <template #columns>
          <a-table-column title="ID" data-index="id" :width="80" align="center" />
          <a-table-column title="课程标题" data-index="title" :width="200">
            <template #cell="{ record }">
              <a-button type="text" @click="handleViewDetail(record)">{{ record.title }}</a-button>
            </template>
          </a-table-column>
          <a-table-column title="课程分类" data-index="category" :width="120" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.category === 1" color="blue">专业课</a-tag>
              <a-tag v-else-if="record.category === 2" color="green">家长必修</a-tag>
              <a-tag v-else-if="record.category === 3" color="orange">精品专题</a-tag>
              <a-tag v-else-if="record.category === 4" color="purple">VIP专区</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="价格" data-index="price" :width="100" align="right">
            <template #cell="{ record }">
              <span class="price-text">¥{{ record.price.toFixed(2) }}</span>
            </template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" :width="100" align="center">
            <template #cell="{ record }">
              <a-tag :color="record.status ? 'green' : 'red'">
                {{ record.status ? '上架' : '下架' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="浏览量" data-index="viewCount" :width="100" align="right" />
          <a-table-column title="购买量" data-index="purchaseCount" :width="100" align="right" />
          <a-table-column title="创建时间" data-index="createTime" :width="160" />
          <a-table-column title="操作" :width="280" align="center" fixed="right">
            <template #cell="{ record }">
              <a-space :size="4">
                <a-button type="text" size="small" @click="handleEdit(record)">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </a-button>
                <a-button type="text" size="small" @click="handleViewDetail(record)">
                  <template #icon>
                    <icon-eye />
                  </template>
                  详情
                </a-button>
                <a-button
                  v-if="record.status"
                  type="text"
                  size="small"
                  @click="handleTakeDown(record)"
                >
                  <template #icon>
                    <icon-stop />
                  </template>
                  下架
                </a-button>
                <a-button
                  v-else
                  type="text"
                  size="small"
                  @click="handlePutUp(record)"
                >
                  <template #icon>
                    <icon-play-circle />
                  </template>
                  上架
                </a-button>
                <a-popconfirm content="确定要删除该课程吗？" @ok="handleDelete(record)">
                  <a-button type="text" size="small" status="danger">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>

      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :show-total="true"
          :show-jumper="true"
          :show-page-size="true"
          :page-size-options="[10, 20, 50, 100]"
          @change="handlePageChange"
          @page-size-change="handleSizeChange"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconDelete,
  IconDownload,
  IconEdit,
  IconEye,
  IconStop,
  IconPlayCircle
} from '@arco-design/web-vue/es/icon'
import { mockDataService } from '@/api/mock'

const router = useRouter()
const loading = ref(false)
const selectedRows = ref<any[]>([])

const queryForm = reactive({
  title: '',
  category: 0,
  status: -1
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

async function fetchData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page - 1,
      size: pagination.size,
      ...queryForm
    }
    const result = await mockDataService.getCourses(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    Message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  queryForm.title = ''
  queryForm.category = 0
  queryForm.status = -1
  pagination.page = 1
  fetchData()
}

function handlePageChange(page: number) {
  pagination.page = page
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  fetchData()
}

function handleAdd() {
  router.push('/course/edit')
}

function handleEdit(row: any) {
  router.push(`/course/detail/1?tab=chapters`)
}

function handleViewDetail(row: any) {
  console.log('View detail clicked:', row)
  console.log('Navigating to:', `/course/detail/1`)
  router.push(`/course/detail/1`)
  console.log('Navigation executed')
}

function handleTakeDown(row: any) {
  Modal.confirm({
    title: '提示',
    content: '确定要下架该课程吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      row.status = 0
      Message.success('下架成功')
    }
  })
}

function handlePutUp(row: any) {
  Modal.confirm({
    title: '提示',
    content: '确定要上架该课程吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      row.status = 1
      Message.success('上架成功')
    }
  })
}

function handleDelete(row: any) {
  Message.success('删除成功')
  fetchData()
}

function handleSelectionChange(keys: any[], rows: any[]) {
  selectedRows.value = rows
}

function handleBatchDelete() {
  Modal.confirm({
    title: '提示',
    content: `确定要删除选中的 ${selectedRows.value.length} 个课程吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      Message.success('批量删除成功')
      selectedRows.value = []
      fetchData()
    }
  })
}

function handleExport() {
  Message.info('导出功能开发中')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.course-list-page {
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

    .price-text {
      color: var(--arco-danger-color-6);
      font-weight: 600;
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

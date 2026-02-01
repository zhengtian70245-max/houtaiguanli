<template>
  <div class="page-container">
    <div class="page-header">
      <h2>活动列表</h2>
      <a-button type="primary" @click="handleAdd">添加活动</a-button>
    </div>
    <div class="page-content">
      <a-card class="search-card" :bordered="false">
        <a-form :model="queryForm" layout="inline">
          <a-form-item label="活动标题">
            <a-input v-model="queryForm.title" placeholder="请输入活动标题" allow-clear />
          </a-form-item>
          <a-form-item label="活动类型">
            <a-select v-model="queryForm.type" placeholder="请选择活动类型" allow-clear>
              <a-option label="全部" :value="0" />
              <a-option label="读书会" :value="1" />
              <a-option label="研修班" :value="2" />
              <a-option label="训练营" :value="3" />
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-model="queryForm.status" placeholder="请选择状态" allow-clear>
              <a-option label="全部" :value="-1" />
              <a-option label="进行中" :value="1" />
              <a-option label="已结束" :value="0" />
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">搜索</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>

      <a-card class="table-card" :bordered="false">
        <a-table
          :data="tableData"
          :loading="loading"
          :pagination="false"
          row-key="id"
        >
          <template #columns>
            <a-table-column title="ID" data-index="id" :width="80" align="center" />
            <a-table-column title="活动标题" data-index="title" :min-width="200" />
            <a-table-column title="活动类型" :width="120" align="center">
              <template #cell="{ record }">
                <a-tag>
                  {{ record.type === 1 ? '读书会' : record.type === 2 ? '研修班' : '训练营' }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="活动日期" data-index="date" :width="130" />
            <a-table-column title="地点" data-index="location" :width="120" />
            <a-table-column title="价格" :width="100" align="right">
              <template #cell="{ record }">
                ¥{{ record.price.toFixed(2) }}
              </template>
            </a-table-column>
            <a-table-column title="状态" :width="100" align="center">
              <template #cell="{ record }">
                <a-tag :color="record.status ? 'green' : 'red'">
                  {{ record.status ? '进行中' : '已结束' }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="报名人数" data-index="registrationCount" :width="120" align="center" />
            <a-table-column title="操作" :width="200" align="center">
              <template #cell="{ record }">
                <a-space>
                  <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
                  <a-button type="success" size="small" @click="viewRegistration(record)">查看报名</a-button>
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
            @change="handleCurrentChange"
            @page-size-change="handleSizeChange"
          />
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const loading = ref(false)

const queryForm = reactive({
  title: '',
  type: 0,
  status: -1
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

function fetchData() {
  const list = Array.from({ length: 10 }).map((_, index) => {
    const offset = pagination.page * pagination.size
    const id = index + offset
    return {
      id,
      title: `活动标题 ${id}`,
      type: Math.floor(Math.random() * 3) + 1,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: `地点 ${id}`,
      price: Math.floor(Math.random() * 999),
      status: id % 4 === 0 ? 0 : 1,
      registrationCount: Math.floor(Math.random() * 1000)
    }
  })
  tableData.value = list
  pagination.total = 100
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  queryForm.title = ''
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
  router.push('/activity/edit')
}

function handleEdit(row: any) {
  router.push(`/activity/edit/${row.id}`)
}

function viewRegistration(row: any) {
  router.push('/activity/register')
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

.search-card {
  margin-bottom: 20px;
}

.table-card {
  :deep(.arco-table-th) {
    font-weight: 600;
  }
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
<template>
  <div class="page-container">
    <div class="page-header">
      <h2>活动报名管理</h2>
    </div>
    <div class="page-content">
      <a-form :model="queryForm" layout="inline" class="search-form">
        <a-form-item label="活动标题">
          <a-input v-model="queryForm.title" placeholder="请输入活动标题" allow-clear />
        </a-form-item>
        <a-form-item label="用户昵称">
          <a-input v-model="queryForm.nickname" placeholder="请输入用户昵称" allow-clear />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model="queryForm.phone" placeholder="请输入手机号" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryForm.status" placeholder="请选择状态" allow-clear>
            <a-option label="全部" :value="-1" />
            <a-option label="已报名" :value="1" />
            <a-option label="已取消" :value="0" />
            <a-option label="已参与" :value="2" />
          </a-select>
        </a-form-item>
        <a-form-item label="报名时间">
          <a-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            :placeholder="['开始日期', '结束日期']"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <a-table :data="tableData" :bordered="true" :stripe="true">
        <template #columns>
          <a-table-column title="ID" data-index="id" :width="80" align="center" />
          <a-table-column title="活动标题" data-index="activityTitle" :min-width="200" />
          <a-table-column title="活动日期" data-index="activityDate" :width="130" align="center" />
          <a-table-column title="用户昵称" data-index="nickname" :width="120" />
          <a-table-column title="手机号" data-index="phone" :width="130" align="center" />
          <a-table-column title="状态" :width="120" align="center">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="报名时间" data-index="registrationDate" :width="160" align="center" />
          <a-table-column title="支付金额" :width="100" align="right">
            <template #cell="{ record }">
              ¥{{ record.price.toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="150" align="center">
            <template #cell="{ record }">
              <a-button type="primary" size="small" @click="viewDetail(record)">查看详情</a-button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)

const queryForm = reactive({
  title: '',
  nickname: '',
  phone: '',
  status: -1,
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

function getStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    0: 'red',
    1: 'green',
    2: 'orange'
  }
  return colorMap[status] || 'blue'
}

function getStatusText(status: number): string {
  const textMap: Record<number, string> = {
    0: '已取消',
    1: '已报名',
    2: '已参与'
  }
  return textMap[status] || '未知'
}

function fetchData() {
  const list = Array.from({ length: 10 }).map((_, index) => {
    const offset = pagination.page * pagination.size
    const id = index + offset
    return {
      id,
      activityTitle: `读书会${id}`,
      activityDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nickname: `用户${id}`,
      phone: `138${Math.floor(Math.random() * 100000000)}`,
      status: Math.floor(Math.random() * 3),
      registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: Math.floor(Math.random() * 1980) + 198
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
  queryForm.nickname = ''
  queryForm.phone = ''
  queryForm.status = -1
  queryForm.dateRange = []
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

function viewDetail(row: any) {
  console.log('查看详情:', row)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.search-form {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
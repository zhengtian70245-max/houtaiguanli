<template>
  <div class="page-container">
    <div class="page-header">
      <h2>分销商列表</h2>
    </div>
    <div class="page-content">
      <a-form :model="queryForm" class="search-form">
        <a-form-item label="用户昵称">
          <a-input v-model="queryForm.nickname" placeholder="请输入用户昵称" allow-clear />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model="queryForm.phone" placeholder="请输入手机号" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="queryForm.status" placeholder="请选择状态" allow-clear>
            <a-option label="全部" :value="-1" />
            <a-option label="正常" :value="1" />
            <a-option label="已禁用" :value="0" />
          </a-select>
        </a-form-item>
        <a-form-item label="注册时间">
          <a-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            placeholder="开始日期"
            placeholder-end="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :data="tableData"
        :loading="loading"
        :pagination="false"
        border
        stripe
      >
        <template #columns>
          <a-table-column title="ID" data-index="id" :width="80" align="center" />
          <a-table-column title="用户昵称" data-index="nickname" :width="120" />
          <a-table-column title="手机号" data-index="phone" :width="130" align="center" />
          <a-table-column title="加入时间" data-index="joinDate" :width="150" align="center" />
          <a-table-column title="状态" :width="100" align="center">
            <template #cell="{ record }">
              <a-switch :checked="record.status === 1" @change="toggleStatus(record)" />
            </template>
          </a-table-column>
          <a-table-column title="直接下级" data-index="directCount" :width="120" align="center" />
          <a-table-column title="间接下级" data-index="indirectCount" :width="120" align="center" />
          <a-table-column title="总下级" data-index="totalCount" :width="120" align="center" />
          <a-table-column title="累计收入" :width="150" align="right">
            <template #cell="{ record }">
              ¥{{ record.totalIncome.toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column title="待结算收入" :width="150" align="right">
            <template #cell="{ record }">
              ¥{{ record.pendingIncome.toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column title="已结算收入" :width="150" align="right">
            <template #cell="{ record }">
              ¥{{ record.settledIncome.toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="200" align="center">
            <template #cell="{ record }">
              <a-button type="primary" size="small" @click="viewDetail(record)">查看详情</a-button>
              <a-button type="success" size="small" @click="viewTree(record)">查看推广树</a-button>
            </template>
          </a-table-column>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import message from '@arco-design/web-vue/es/message'

const loading = ref(false)

const queryForm = reactive({
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

function toggleStatus(record: any) {
  record.status = record.status === 1 ? 0 : 1
  const messageText = record.status === 1 ? '启用成功' : '禁用成功'
  message.success(messageText)
}

function viewDetail(record: any) {
  console.log('查看详情:', record)
}

function viewTree(record: any) {
  console.log('查看推广树:', record)
}

function fetchData() {
  const list = Array.from({ length: 10 }).map((_, index) => {
    const offset = (pagination.page - 1) * pagination.size
    const id = index + offset
    return {
      id,
      nickname: `分销用户${id}`,
      phone: `138${Math.floor(Math.random() * 100000000)}`,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: id % 15 === 0 ? 0 : 1,
      directCount: Math.floor(Math.random() * 100) + 1,
      indirectCount: Math.floor(Math.random() * 500) + 1,
      totalCount: Math.floor(Math.random() * 600) + 1,
      totalIncome: Math.floor(Math.random() * 10000) + 100,
      pendingIncome: Math.floor(Math.random() * 1000) + 10,
      settledIncome: Math.floor(Math.random() * 9000) + 90
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
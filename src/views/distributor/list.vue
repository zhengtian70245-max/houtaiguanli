<template>
  <div class="page-container">
    <div class="page-header">
      <h2>分销商列表</h2>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="用户昵称">
          <el-input v-model="queryForm.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="已禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="nickname" label="用户昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" align="center" />
        <el-table-column prop="joinDate" label="加入时间" width="150" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.status" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="directCount" label="直接下级" width="120" align="center" />
        <el-table-column prop="indirectCount" label="间接下级" width="120" align="center" />
        <el-table-column prop="totalCount" label="总下级" width="120" align="center" />
        <el-table-column prop="totalIncome" label="累计收入" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.totalIncome.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="pendingIncome" label="待结算收入" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.pendingIncome.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="settledIncome" label="已结算收入" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.settledIncome.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetail(row)">查看详情</el-button>
            <el-button type="success" size="small" @click="viewTree(row)">查看推广树</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model="pagination.page"
          :page-size="pagination.size"
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
import { ElMessage } from 'element-plus'

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

function toggleStatus(row: any) {
  row.status = row.status ? 0 : 1
  const message = row.status ? '启用成功' : '禁用成功'
  ElMessage.success(message)
}

function viewDetail(row: any) {
  console.log('查看详情:', row)
}

function viewTree(row: any) {
  console.log('查看推广树:', row)
}

function fetchData() {
  const list = Array.from({ length: 10 }).map((_, index) => {
    const offset = pagination.page * pagination.size
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
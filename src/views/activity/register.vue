<template>
  <div class="page-container">
    <div class="page-header">
      <h2>活动报名管理</h2>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="活动标题">
          <el-input v-model="queryForm.title" placeholder="请输入活动标题" clearable />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="queryForm.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="已报名" :value="1" />
            <el-option label="已取消" :value="0" />
            <el-option label="已参与" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="报名时间">
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
        <el-table-column prop="activityTitle" label="活动标题" min-width="200" />
        <el-table-column prop="activityDate" label="活动日期" width="130" align="center" />
        <el-table-column prop="nickname" label="用户昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" align="center" />
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registrationDate" label="报名时间" width="160" align="center" />
        <el-table-column prop="price" label="支付金额" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetail(row)">查看详情</el-button>
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

function getStatusType(status: number): string {
  const typeMap: Record<number, string> = {
    0: 'danger',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status] || 'info'
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
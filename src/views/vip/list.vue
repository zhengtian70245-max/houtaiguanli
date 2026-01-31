<template>
  <div class="page-container">
    <div class="page-header">
      <h2>VIP列表</h2>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="用户昵称">
          <el-input v-model="queryForm.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="queryForm.level" placeholder="请选择等级" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="VIP会员" :value="3" />
            <el-option label="分销商" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="已过期" :value="0" />
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
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :size="40">
              {{ row.nickname?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="level" label="等级" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">
              {{ getLevelText(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开通时间" width="160" />
        <el-table-column prop="expireDate" label="到期时间" width="160" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.status" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetail(row)">查看详情</el-button>
            <el-button type="success" size="small" @click="handleRenew(row)">续费</el-button>
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
  level: 0,
  status: -1,
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

function getLevelType(level: number): string {
  const typeMap: Record<number, string> = {
    1: 'info',
    2: 'primary',
    3: 'warning',
    4: 'danger'
  }
  return typeMap[level] || 'info'
}

function getLevelText(level: number): string {
  const textMap: Record<number, string> = {
    1: '普通用户',
    2: '付费用户',
    3: 'VIP会员',
    4: '分销商'
  }
  return textMap[level] || '未知'
}

function fetchData() {
  const list = Array.from({ length: 10 }).map((_, index) => {
    const offset = pagination.page * pagination.size
    const id = index + offset
    return {
      id,
      nickname: `VIP用户${id}`,
      phone: `138${Math.floor(Math.random() * 100000000)}`,
      level: Math.floor(Math.random() * 2) + 3,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expireDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: id % 5 === 0 ? 0 : 1
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
  queryForm.level = 0
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

function toggleStatus(row: any) {
  row.status = row.status ? 0 : 1
  const message = row.status ? '启用成功' : '禁用成功'
  ElMessage.success(message)
}

function viewDetail(row: any) {
  console.log('查看详情:', row)
}

function handleRenew(row: any) {
  console.log('续费:', row)
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
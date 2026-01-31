<template>
  <div class="page-container">
    <div class="page-header">
      <h2>退款管理</h2>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="queryForm.orderId" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="queryForm.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select v-model="queryForm.refundStatus" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="退款中" :value="0" />
            <el-option label="退款成功" :value="1" />
            <el-option label="退款失败" :value="2" />
            <el-option label="退款关闭" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="退款时间">
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
        <el-table-column prop="orderId" label="订单号" width="180" align="center" />
        <el-table-column prop="nickname" label="用户昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" align="center" />
        <el-table-column prop="refundStatus" label="退款状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getRefundStatusType(row.refundStatus)">
              {{ getRefundStatusText(row.refundStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="refundAmount" label="退款金额" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.refundAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="refundReason" label="退款原因" min-width="200" />
        <el-table-column prop="refundTime" label="退款时间" width="160" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetail(row)">查看详情</el-button>
            <el-button v-if="row.refundStatus === 0" type="success" size="small" @click="handleRefund(row.id)">退款处理</el-button>
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
  orderId: '',
  nickname: '',
  phone: '',
  refundStatus: -1,
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

function getRefundStatusType(status: number): string {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'danger',
    3: 'info'
  }
  return typeMap[status] || 'info'
}

function getRefundStatusText(status: number): string {
  const textMap: Record<number, string> = {
    0: '退款中',
    1: '退款成功',
    2: '退款失败',
    3: '退款关闭'
  }
  return textMap[status] || '未知'
}

function fetchData() {
  const list = Array.from({ length: 10 }).map((_, index) => {
    const offset = pagination.page * pagination.size
    const id = index + offset
    return {
      id,
      orderId: `2023${id}`.padStart(10, '0'),
      nickname: `用户${id}`,
      phone: `138${Math.floor(Math.random() * 100000000)}`,
      refundStatus: index % 5 === 0 ? 0 : 1,
      refundAmount: Math.floor(Math.random() * 500) + 100,
      refundReason: '申请退款',
      refundTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  })
  tableData.value = list
  pagination.total = 100
}

function handleRefund(id: number) {
  ElMessage.success('退款处理成功')
}

function viewDetail(row: any) {
  console.log('查看详情:', row)
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  queryForm.orderId = ''
  queryForm.nickname = ''
  queryForm.phone = ''
  queryForm.refundStatus = -1
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
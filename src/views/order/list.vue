<template>
  <div class="page-container">
    <div class="page-header">
      <h2>订单列表</h2>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="queryForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="queryForm.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="queryForm.type" placeholder="请选择订单类型" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="课程订单" :value="1" />
            <el-option label="活动订单" :value="2" />
            <el-option label="VIP订单" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="queryForm.status" placeholder="请选择订单状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="已退款" :value="2" />
            <el-option label="已取消" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="queryForm.paymentType" placeholder="请选择支付方式" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="微信支付" :value="1" />
            <el-option label="支付宝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-table-column prop="id" label="订单号" min-width="180" />
        <el-table-column prop="username" label="用户" width="120" />
        <el-table-column prop="type" label="订单类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1">课程订单</el-tag>
            <el-tag v-else-if="row.type === 2">活动订单</el-tag>
            <el-tag v-else-if="row.type === 3">VIP订单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentType" label="支付方式" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.paymentType === 1">微信支付</el-tag>
            <el-tag v-else-if="row.paymentType === 2">支付宝</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="paymentTime" label="支付时间" width="160" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetail(row)">查看详情</el-button>
            <el-button v-if="row.status === 0" type="danger" size="small" @click="cancelOrder(row)">取消订单</el-button>
            <el-button v-if="row.status === 1" type="warning" size="small" @click="refundOrder(row)">退款</el-button>
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockDataService } from '@/api/mock'

const router = useRouter()
const loading = ref(false)

const queryForm = reactive({
  orderNo: '',
  nickname: '',
  type: 0,
  status: -1,
  paymentType: 0,
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
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'danger'
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: number): string {
  const textMap: Record<number, string> = {
    0: '待支付',
    1: '已支付',
    2: '已退款',
    3: '已取消'
  }
  return textMap[status] || '未知'
}

async function fetchData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page - 1,
      size: pagination.size,
      ...queryForm
    }
    const result = await mockDataService.getOrders(params)
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
  queryForm.orderNo = ''
  queryForm.nickname = ''
  queryForm.type = 0
  queryForm.status = -1
  queryForm.paymentType = 0
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
  router.push(`/order/detail/${row.id}`)
}

function cancelOrder(row: any) {
  ElMessage.confirm('确定要取消该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 3
    ElMessage.success('取消订单成功')
  }).catch(() => {})
}

function refundOrder(row: any) {
  ElMessage.confirm('确定要退款吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 2
    ElMessage.success('退款成功')
  }).catch(() => {})
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
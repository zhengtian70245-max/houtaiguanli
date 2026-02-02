<template>
  <div class="page-container">
    <div class="page-header">
      <h2>退款管理</h2>
    </div>
    <div class="page-content">
      <a-form :model="queryForm" layout="inline" class="search-form">
        <a-form-item label="订单号">
          <a-input v-model="queryForm.orderId" placeholder="请输入订单号" allow-clear />
        </a-form-item>
        <a-form-item label="用户昵称">
          <a-input v-model="queryForm.nickname" placeholder="请输入用户昵称" allow-clear />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model="queryForm.phone" placeholder="请输入手机号" allow-clear />
        </a-form-item>
        <a-form-item label="退款状态">
          <a-select v-model="queryForm.refundStatus" placeholder="请选择状态" allow-clear>
            <a-option label="全部" :value="-1" />
            <a-option label="退款中" :value="0" />
            <a-option label="退款成功" :value="1" />
            <a-option label="退款失败" :value="2" />
            <a-option label="退款关闭" :value="3" />
          </a-select>
        </a-form-item>
        <a-form-item label="退款时间">
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
          <a-table-column title="订单号" data-index="orderId" :width="180" align="center" />
          <a-table-column title="用户昵称" data-index="nickname" :width="120" />
          <a-table-column title="手机号" data-index="phone" :width="130" align="center" />
          <a-table-column title="退款状态" :width="120" align="center">
            <template #cell="{ record }">
              <a-tag :color="getRefundStatusColor(record.refundStatus)">
                {{ getRefundStatusText(record.refundStatus) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="退款金额" :width="150" align="right">
            <template #cell="{ record }">
              ¥{{ record.refundAmount.toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column title="退款原因" data-index="refundReason" :min-width="200" />
          <a-table-column title="退款时间" data-index="refundTime" :width="160" align="center" />
          <a-table-column title="操作" :width="200" align="center">
            <template #cell="{ record }">
              <a-space>
                <a-button type="primary" size="small" @click="viewDetail(record)">查看详情</a-button>
                <a-button v-if="record.refundStatus === 0" type="success" size="small" @click="handleRefund(record.id)">退款处理</a-button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

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

function getRefundStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    0: 'orange',
    1: 'green',
    2: 'red',
    3: 'blue'
  }
  return colorMap[status] || 'blue'
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
  Message.success('退款处理成功')
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
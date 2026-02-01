<template>
  <div class="page-container">
    <div class="page-header">
      <h2>订单列表</h2>
    </div>
    <div class="page-content">
      <a-card class="search-card" :bordered="false">
        <a-form :model="queryForm" layout="inline">
          <a-form-item label="订单号">
            <a-input v-model="queryForm.orderNo" placeholder="请输入订单号" allow-clear />
          </a-form-item>
          <a-form-item label="用户昵称">
            <a-input v-model="queryForm.nickname" placeholder="请输入用户昵称" allow-clear />
          </a-form-item>
          <a-form-item label="订单类型">
            <a-select v-model="queryForm.type" placeholder="请选择订单类型" allow-clear>
              <a-option label="全部" :value="0" />
              <a-option label="课程订单" :value="1" />
              <a-option label="活动订单" :value="2" />
              <a-option label="VIP订单" :value="3" />
            </a-select>
          </a-form-item>
          <a-form-item label="订单状态">
            <a-select v-model="queryForm.status" placeholder="请选择订单状态" allow-clear>
              <a-option label="全部" :value="-1" />
              <a-option label="待支付" :value="0" />
              <a-option label="已支付" :value="1" />
              <a-option label="已退款" :value="2" />
              <a-option label="已取消" :value="3" />
            </a-select>
          </a-form-item>
          <a-form-item label="支付方式">
            <a-select v-model="queryForm.paymentType" placeholder="请选择支付方式" allow-clear>
              <a-option label="全部" :value="0" />
              <a-option label="微信支付" :value="1" />
              <a-option label="支付宝" :value="2" />
            </a-select>
          </a-form-item>
          <a-form-item label="创建时间">
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
      </a-card>

      <a-card class="table-card" :bordered="false">
        <a-table
          :data="tableData"
          :loading="loading"
          :pagination="false"
          row-key="id"
        >
          <template #columns>
            <a-table-column title="订单号" data-index="id" :min-width="180" />
            <a-table-column title="用户" data-index="username" :width="120" />
            <a-table-column title="订单类型" :width="120" align="center">
              <template #cell="{ record }">
                <a-tag>
                  {{ record.type === 1 ? '课程订单' : record.type === 2 ? '活动订单' : 'VIP订单' }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="金额" :width="120" align="right">
              <template #cell="{ record }">
                ¥{{ record.amount.toFixed(2) }}
              </template>
            </a-table-column>
            <a-table-column title="订单状态" :width="120" align="center">
              <template #cell="{ record }">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusText(record.status) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="支付方式" :width="120" align="center">
              <template #cell="{ record }">
                <a-tag>
                  {{ record.paymentType === 1 ? '微信支付' : '支付宝' }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="创建时间" data-index="createTime" :width="160" />
            <a-table-column title="支付时间" data-index="paymentTime" :width="160" />
            <a-table-column title="操作" :width="200" align="center">
              <template #cell="{ record }">
                <a-space>
                  <a-button type="primary" size="small" @click="viewDetail(record)">查看详情</a-button>
                  <a-button v-if="record.status === 0" type="danger" size="small" @click="cancelOrder(record)">取消订单</a-button>
                  <a-button v-if="record.status === 1" type="warning" size="small" @click="refundOrder(record)">退款</a-button>
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
import { Message, Modal } from '@arco-design/web-vue'
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

function getStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    0: 'orange',
    1: 'green',
    2: 'blue',
    3: 'red'
  }
  return colorMap[status] || 'blue'
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
  Modal.confirm({
    title: '提示',
    content: '确定要取消该订单吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      row.status = 3
      Message.success('取消订单成功')
    }
  })
}

function refundOrder(row: any) {
  Modal.confirm({
    title: '提示',
    content: '确定要退款吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      row.status = 2
      Message.success('退款成功')
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-header {
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
<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户列表</h2>
    </div>
    <div class="page-content">
      <a-card class="search-card" :bordered="false">
        <a-form :model="queryForm" layout="inline">
          <a-form-item label="手机号">
            <a-input v-model="queryForm.phone" placeholder="请输入手机号" allow-clear />
          </a-form-item>
          <a-form-item label="会员等级">
            <a-select v-model="queryForm.level" placeholder="请选择会员等级" allow-clear>
              <a-option label="全部" :value="0" />
              <a-option label="普通用户" :value="1" />
              <a-option label="付费用户" :value="2" />
              <a-option label="VIP会员" :value="3" />
              <a-option label="分销商" :value="4" />
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-model="queryForm.status" placeholder="请选择状态" allow-clear>
              <a-option label="全部" :value="-1" />
              <a-option label="启用" :value="1" />
              <a-option label="禁用" :value="0" />
            </a-select>
          </a-form-item>
          <a-form-item label="注册时间">
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
            <a-table-column title="ID" data-index="id" :width="80" align="center" />
            <a-table-column title="头像" :width="80" align="center">
              <template #cell="{ record }">
                <a-avatar :size="40" :style="{ backgroundColor: '#165dff' }">
                  {{ record.nickname?.charAt(0) }}
                </a-avatar>
              </template>
            </a-table-column>
            <a-table-column title="昵称" data-index="nickname" :width="120" />
            <a-table-column title="手机号" data-index="phone" :width="130" />
            <a-table-column title="会员等级" :width="120" align="center">
              <template #cell="{ record }">
                <a-tag :color="getLevelColor(record.level)">
                  {{ getLevelText(record.level) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="VIP到期时间" data-index="vipExpireDate" :width="160" />
            <a-table-column title="积分" data-index="points" :width="100" align="right" />
            <a-table-column title="账户余额" :width="120" align="right">
              <template #cell="{ record }">
                ¥{{ record.balance.toFixed(2) }}
              </template>
            </a-table-column>
            <a-table-column title="状态" :width="100" align="center">
              <template #cell="{ record }">
                <a-switch v-model="record.status" @change="toggleStatus(record)" />
              </template>
            </a-table-column>
            <a-table-column title="注册时间" data-index="createTime" :width="160" />
            <a-table-column title="操作" :width="250" align="center">
              <template #cell="{ record }">
                <a-space>
                  <a-button type="primary" size="small" @click="viewDetail(record)">查看详情</a-button>
                  <a-button type="success" size="small" @click="viewTree(record)">推广树</a-button>
                  <a-button type="danger" size="small" @click="deleteUser(record)">删除</a-button>
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

function getLevelColor(level: number): string {
  const colorMap: Record<number, string> = {
    1: 'blue',
    2: 'primary',
    3: 'orange',
    4: 'red'
  }
  return colorMap[level] || 'blue'
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

async function fetchData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page - 1,
      size: pagination.size,
      ...queryForm
    }
    const result = await mockDataService.getUsers(params)
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
  Message.success(message)
}

function viewDetail(row: any) {
  router.push(`/user/detail/${row.id}`)
}

function viewTree(row: any) {
  router.push(`/user/tree/${row.id}`)
}

function deleteUser(row: any) {
  Modal.confirm({
    title: '提示',
    content: '确定要删除该用户吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      Message.success('删除成功')
      fetchData()
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
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
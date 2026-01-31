<template>
  <div class="page-container">
    <div class="page-header">
      <h2>活动列表</h2>
      <el-button type="primary" @click="handleAdd">添加活动</el-button>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="活动标题">
          <el-input v-model="queryForm.title" placeholder="请输入活动标题" clearable />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="queryForm.type" placeholder="请选择活动类型" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="读书会" :value="1" />
            <el-option label="研修班" :value="2" />
            <el-option label="训练营" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="title" label="活动标题" min-width="200" />
        <el-table-column prop="type" label="活动类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1">读书会</el-tag>
            <el-tag v-else-if="row.type === 2">研修班</el-tag>
            <el-tag v-else-if="row.type === 3">训练营</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="活动日期" width="130" />
        <el-table-column prop="location" label="地点" width="120" />
        <el-table-column prop="price" label="价格" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '进行中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registrationCount" label="报名人数" width="120" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" size="small" @click="viewRegistration(row)">查看报名</el-button>
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

const router = useRouter()
const loading = ref(false)

const queryForm = reactive({
  title: '',
  type: 0,
  status: -1
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

function fetchData() {
  const list = Array.from({ length: 10 }).map((_, index) => {
    const offset = pagination.page * pagination.size
    const id = index + offset
    return {
      id,
      title: `活动标题 ${id}`,
      type: Math.floor(Math.random() * 3) + 1,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: `地点 ${id}`,
      price: Math.floor(Math.random() * 999),
      status: id % 4 === 0 ? 0 : 1,
      registrationCount: Math.floor(Math.random() * 1000)
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
  queryForm.type = 0
  queryForm.status = -1
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

function handleAdd() {
  router.push('/activity/edit')
}

function handleEdit(row: any) {
  router.push(`/activity/edit/${row.id}`)
}

function viewRegistration(row: any) {
  router.push('/activity/register')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
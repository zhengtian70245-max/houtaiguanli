<template>
  <div class="page-container">
    <div class="page-header">
      <h2>课程列表</h2>
      <el-button type="primary" @click="handleAdd">添加课程</el-button>
    </div>
    <div class="page-content">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="课程标题">
          <el-input v-model="queryForm.title" placeholder="请输入课程标题" clearable />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="queryForm.category" placeholder="请选择课程分类" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="专业课" :value="1" />
            <el-option label="家长必修" :value="2" />
            <el-option label="精品专题" :value="3" />
            <el-option label="VIP专区" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="title" label="课程标题" min-width="200" />
        <el-table-column prop="category" label="课程分类" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.category === 1">专业课</el-tag>
            <el-tag v-else-if="row.category === 2">家长必修</el-tag>
            <el-tag v-else-if="row.category === 3">精品专题</el-tag>
            <el-tag v-else-if="row.category === 4">VIP专区</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览量" width="100" align="right" />
        <el-table-column prop="purchaseCount" label="购买量" width="100" align="right" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.status" type="warning" size="small" @click="handleTakeDown(row)">下架</el-button>
            <el-button v-else type="success" size="small" @click="handlePutUp(row)">上架</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
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
  title: '',
  category: 0,
  status: -1
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const tableData = ref<any[]>([])

async function fetchData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page - 1,
      size: pagination.size,
      ...queryForm
    }
    const result = await mockDataService.getCourses(params)
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
  queryForm.title = ''
  queryForm.category = 0
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
  router.push('/course/edit')
}

function handleEdit(row: any) {
  router.push(`/course/edit/${row.id}`)
}

function handleTakeDown(row: any) {
  ElMessage.confirm('确定要下架该课程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 0
    ElMessage.success('下架成功')
  }).catch(() => {})
}

function handlePutUp(row: any) {
  ElMessage.confirm('确定要上架该课程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 1
    ElMessage.success('上架成功')
  }).catch(() => {})
}

function handleDelete(row: any) {
  ElMessage.confirm('确定要删除该课程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
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
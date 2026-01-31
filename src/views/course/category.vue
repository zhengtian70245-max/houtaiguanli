<template>
  <div class="page-container">
    <div class="page-header">
      <h2>课程分类管理</h2>
      <div class="page-actions">
        <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="分类名称" width="200" />
        <el-table-column prop="description" label="分类描述" min-width="200" />
        <el-table-column prop="sortOrder" label="排序" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="150" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editCategory(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteCategory(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="visible" :title="dialogTitle" width="600px">
      <el-form :model="form" :label-width="'100px'">
        <el-form-item label="分类名称" required>
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入分类描述"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :precision="0" :step="1" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-text="form.status ? '启用' : '禁用'" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const visible = ref(false)
const dialogTitle = ref('添加分类')

const form = reactive({
  name: '',
  description: '',
  sortOrder: 0,
  status: true,
  updateTime: ''
})

const tableData = ref([
  { id: 1, name: '专业课', description: '专业课程分类', sortOrder: 1, status: true, createTime: '2023-01-01', updateTime: '2023-01-01' },
  { id: 2, name: '家长必修', description: '家长必修课程分类', sortOrder: 2, status: true, createTime: '2023-01-01', updateTime: '2023-01-01' },
  { id: 3, name: '精品专题', description: '精品专题课程分类', sortOrder: 3, status: true, createTime: '2023-01-01', updateTime: '2023-01-01' },
  { id: 4, name: 'VIP专区', description: 'VIP专区课程分类', sortOrder: 4, status: true, createTime: '2023-01-01', updateTime: '2023-01-01' },
  { id: 5, name: '其他', description: '其他课程分类', sortOrder: 5, status: true, createTime: '2023-01-01', updateTime: '2023-01-01' }
])

function showAddDialog() {
  dialogTitle.value = '添加分类'
  form.name = ''
  form.description = ''
  form.sortOrder = 0
  form.status = true
  form.updateTime = ''
  visible.value = true
}

function editCategory(row: any) {
  dialogTitle.value = '编辑分类'
  form.name = row.name
  form.description = row.description
  form.sortOrder = row.sortOrder
  form.status = row.status
  form.updateTime = new Date().toISOString().split('T')[0]
  visible.value = true
}

function deleteCategory(id: number) {
  ElMessage.success('删除成功')
}

function handleSubmit() {
  loading.value = true
  try {
    setTimeout(() => {
      ElMessage.success('保存成功')
      visible.value = false
      loading.value = false
    }, 500)
  } catch (error) {
    ElMessage.error('保存失败')
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.page-actions {
  display: flex;
  gap: 10px;
}
</style>
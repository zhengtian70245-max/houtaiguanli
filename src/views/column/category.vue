<template>
  <div class="column-category">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>专栏分类管理</h1>
      <el-button type="primary" @click="handleAddCategory">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <!-- 分类列表 -->
    <div class="category-list">
      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="分类ID" width="100" align="center" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="parentId" label="父分类" width="120" align="center">
          <template #default="{ row }">
            {{ row.parentId === 0 ? '顶级分类' : getParentName(row.parentId) }}
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="100" align="center">
          <template #default="{ row }">
            <div class="sort-control">
              <el-button
                size="small"
                :disabled="row.order === 1"
                @click="handleMoveUp(row)"
              >
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <span>{{ row.order }}</span>
              <el-button
                size="small"
                :disabled="row.order === categories.length"
                @click="handleMoveDown(row)"
              >
                <el-icon><ArrowDown /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditCategory(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteCategory(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
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

    <!-- 新增/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="categoryForm" label-width="100px" class="category-form">
        <el-form-item label="分类名称" prop="name" required>
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父分类">
          <el-select v-model="categoryForm.parentId" placeholder="请选择父分类">
            <el-option label="顶级分类" :value="0" />
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.id === categoryForm.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="categoryForm.order"
            :min="1"
            :max="categories.length + 1"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 分类表单
const categoryForm = reactive({
  id: 0,
  name: '',
  parentId: 0,
  order: 1,
  description: ''
})

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '默认分组',
    parentId: 0,
    order: 1,
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00'
  },
  {
    id: 2,
    name: '热门专栏',
    parentId: 0,
    order: 2,
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00'
  },
  {
    id: 3,
    name: '推荐专栏',
    parentId: 0,
    order: 3,
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00'
  },
  {
    id: 4,
    name: '精品专栏',
    parentId: 0,
    order: 4,
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00'
  }
])

// 初始化
onMounted(() => {
  pagination.total = categories.value.length
})

// 获取父分类名称
const getParentName = (parentId: number) => {
  const parent = categories.value.find(item => item.id === parentId)
  return parent ? parent.name : '未知'
}

// 新增分类
const handleAddCategory = () => {
  dialogTitle.value = '新增分类'
  Object.assign(categoryForm, {
    id: 0,
    name: '',
    parentId: 0,
    order: categories.value.length + 1,
    description: ''
  })
  dialogVisible.value = true
}

// 编辑分类
const handleEditCategory = (row: any) => {
  dialogTitle.value = '编辑分类'
  Object.assign(categoryForm, { ...row })
  dialogVisible.value = true
}

// 删除分类
const handleDeleteCategory = (row: any) => {
  ElMessage.confirm(`确定要删除分类 "${row.name}" 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    categories.value = categories.value.filter(item => item.id !== row.id)
    // 重新排序
    categories.value.forEach((item, index) => {
      item.order = index + 1
    })
    pagination.total = categories.value.length
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!categoryForm.name) {
    ElMessage.warning('请输入分类名称')
    return
  }

  if (categoryForm.id === 0) {
    // 新增
    const newCategory = {
      id: Math.max(...categories.value.map(item => item.id)) + 1,
      name: categoryForm.name,
      parentId: categoryForm.parentId,
      order: categoryForm.order,
      description: categoryForm.description,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    categories.value.push(newCategory)
    // 重新排序
    categories.value.sort((a, b) => a.order - b.order)
    categories.value.forEach((item, index) => {
      item.order = index + 1
    })
    ElMessage.success('新增分类成功')
  } else {
    // 编辑
    const index = categories.value.findIndex(item => item.id === categoryForm.id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        name: categoryForm.name,
        parentId: categoryForm.parentId,
        order: categoryForm.order,
        description: categoryForm.description,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      // 重新排序
      categories.value.sort((a, b) => a.order - b.order)
      categories.value.forEach((item, index) => {
        item.order = index + 1
      })
      ElMessage.success('编辑分类成功')
    }
  }

  pagination.total = categories.value.length
  dialogVisible.value = false
}

// 上移
const handleMoveUp = (row: any) => {
  const index = categories.value.findIndex(item => item.id === row.id)
  if (index > 0) {
    const temp = categories.value[index]
    categories.value[index] = categories.value[index - 1]
    categories.value[index - 1] = temp
    // 重新排序
    categories.value.forEach((item, i) => {
      item.order = i + 1
    })
    ElMessage.success('排序成功')
  }
}

// 下移
const handleMoveDown = (row: any) => {
  const index = categories.value.findIndex(item => item.id === row.id)
  if (index < categories.value.length - 1) {
    const temp = categories.value[index]
    categories.value[index] = categories.value[index + 1]
    categories.value[index + 1] = temp
    // 重新排序
    categories.value.forEach((item, i) => {
      item.order = i + 1
    })
    ElMessage.success('排序成功')
  }
}

// 选择变化
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.size = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}
</script>

<style scoped lang="scss">
.column-category {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }

  .category-list {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;

    .sort-control {
      display: flex;
      align-items: center;
      gap: 8px;

      span {
        min-width: 30px;
        text-align: center;
      }
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .category-form {
    .el-form-item {
      margin-bottom: 20px;
    }
  }
}
</style>
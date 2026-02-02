<template>
  <div class="column-category">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>专栏分类管理</h1>
      <div class="page-actions">
        <a-button type="primary" @click="handleAddCategory">
          <template #icon>
            <icon-plus />
          </template>
          新增分类
        </a-button>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="category-list">
      <!-- 手动渲染的完整表格 -->
      <table class="manual-table">
        <thead>
          <tr>
            <th>分类ID</th>
            <th>分类名称</th>
            <th>父分类</th>
            <th>排序</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.parentId === 0 ? '顶级分类' : getParentName(item.parentId) }}</td>
            <td>
              <div class="sort-control">
                <a-button
                  size="small"
                  :disabled="item.order === 1"
                  @click="handleMoveUp(item)"
                >
                  <template #icon>
                    <icon-up />
                  </template>
                </a-button>
                <span>{{ item.order }}</span>
                <a-button
                  size="small"
                  :disabled="item.order === categories.length"
                  @click="handleMoveDown(item)"
                >
                  <template #icon>
                    <icon-down />
                  </template>
                </a-button>
              </div>
            </td>
            <td>{{ item.createTime }}</td>
            <td>{{ item.updateTime }}</td>
            <td>
              <div class="action-buttons">
                <a-button size="small" @click="handleEditCategory(item)">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </a-button>
                <a-button size="small" type="danger" @click="handleDeleteCategory(item)">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="pagination">
        <a-pagination
          v-model:page="pagination.page"
          v-model:page-size="pagination.size"
          :page-size-options="[10, 20, 50, 100]"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :total="pagination.total"
          @page-change="handleCurrentChange"
          @page-size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 新增/编辑分类对话框 -->
    <a-modal
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <a-form :model="categoryForm" label-width="100px" class="category-form">
        <a-form-item label="分类名称" :required="true">
          <a-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="父分类">
          <a-select v-model="categoryForm.parentId" placeholder="请选择父分类">
            <a-option label="顶级分类" :value="0" />
            <a-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.id === categoryForm.id"
            />
          </a-select>
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number
            v-model="categoryForm.order"
            :min="1"
            :max="categories.length + 1"
            :step="1"
          />
        </a-form-item>
        <a-form-item label="分类描述">
          <a-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="dialogVisible = false">取消</a-button>
        <a-button type="primary" @click="handleSubmit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconPlus,
  IconUp,
  IconDown,
  IconEdit,
  IconDelete
} from '@arco-design/web-vue/es/icon'

const loading = ref(false)
const selectedRecords = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const categoryForm = reactive({
  id: 0,
  name: '',
  parentId: 0,
  order: 1,
  description: ''
})

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

onMounted(() => {
  pagination.total = categories.value.length
})

const getParentName = (parentId: number) => {
  const parent = categories.value.find(item => item.id === parentId)
  return parent ? parent.name : '未知'
}

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

const handleEditCategory = (record: any) => {
  dialogTitle.value = '编辑分类'
  Object.assign(categoryForm, { ...record })
  dialogVisible.value = true
}

const handleDeleteCategory = (record: any) => {
  Message.warning('删除功能开发中')
}

const handleSubmit = () => {
  if (!categoryForm.name) {
    Message.warning('请输入分类名称')
    return
  }

  if (categoryForm.id === 0) {
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
    categories.value.sort((a, b) => a.order - b.order)
    categories.value.forEach((item, index) => {
      item.order = index + 1
    })
    Message.success('新增分类成功')
  } else {
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
      categories.value.sort((a, b) => a.order - b.order)
      categories.value.forEach((item, index) => {
        item.order = index + 1
      })
      Message.success('编辑分类成功')
    }
  }

  pagination.total = categories.value.length
  dialogVisible.value = false
}

const handleMoveUp = (record: any) => {
  const index = categories.value.findIndex(item => item.id === record.id)
  if (index > 0) {
    const temp = categories.value[index]
    categories.value[index] = categories.value[index - 1]
    categories.value[index - 1] = temp
    categories.value.forEach((item, i) => {
      item.order = i + 1
    })
    Message.success('排序成功')
  }
}

const handleMoveDown = (record: any) => {
  const index = categories.value.findIndex(item => item.id === record.id)
  if (index < categories.value.length - 1) {
    const temp = categories.value[index]
    categories.value[index] = categories.value[index + 1]
    categories.value[index + 1] = temp
    categories.value.forEach((item, i) => {
      item.order = i + 1
    })
    Message.success('排序成功')
  }
}

const handleSelectionChange = (selected: any[]) => {
  selectedRecords.value = selected
}

const handleSizeChange = (size: number) => {
  pagination.size = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-actions {
  display: flex;
  gap: 10px;

  .a-button {
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
}

.category-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;

  .manual-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    overflow: hidden;
    background-color: #fff;

    th {
      background-color: #fafbfc;
      color: #333;
      font-weight: 500;
      text-align: left;
      padding: 12px 16px;
      border-bottom: 1px solid #eaeef2;
      font-size: 14px;
    }

    th:first-child,
    td:first-child {
      padding-left: 20px;
    }

    th:last-child,
    td:last-child {
      padding-right: 20px;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f2f5;
      font-size: 14px;
      color: #333;
    }

    tr:hover {
      background-color: #f7f9fc;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  .sort-control {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      min-width: 30px;
      text-align: center;
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;

    .a-button {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      &.arco-btn-primary {
        background-color: #1890ff;
        border-color: #1890ff;

        &:hover {
          background-color: #40a9ff;
          border-color: #40a9ff;
        }
      }

      &.arco-btn-danger {
        background-color: #ff4d4f;
        border-color: #ff4d4f;

        &:hover {
          background-color: #ff7875;
          border-color: #ff7875;
        }
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
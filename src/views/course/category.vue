<template>
  <div class="page-container">
    <div class="page-header">
      <h2>课程分类管理</h2>
      <div class="page-actions">
        <a-button type="primary" @click="showAddDialog">添加分类</a-button>
        <a-button @click="loadData">加载数据</a-button>
      </div>
    </div>
    <div class="page-content">
      <!-- 显示数据长度 -->
      <div class="data-info">
        <p>数据长度: {{ tableData.length }}</p>
      </div>
      
      <!-- 手动渲染的完整表格 -->
      <table class="manual-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>分类名称</th>
            <th>分类描述</th>
            <th>排序</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.sortOrder }}</td>
            <td>
              <span :class="item.status ? 'status-enabled' : 'status-disabled'">
                {{ item.status ? '启用' : '禁用' }}
              </span>
            </td>
            <td>{{ item.createTime }}</td>
            <td>{{ item.updateTime }}</td>
            <td>
              <div class="action-buttons">
                <a-button type="primary" size="small" @click="editCategory(item)">编辑</a-button>
                <a-button type="danger" size="small" @click="deleteCategory(item.id)">删除</a-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <a-modal v-model:visible="visible" :title="dialogTitle" width="600px">
      <a-form :model="form" :label-width="'100px'">
        <a-form-item label="分类名称" required>
          <a-input v-model="form.name" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="分类描述">
          <a-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入分类描述"
          />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model="form.sortOrder" :min="0" :precision="0" :step="1" placeholder="请输入排序" />
        </a-form-item>
        <a-form-item label="状态">
          <a-switch v-model="form.status" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

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

const tableData = ref<any[]>([])

onMounted(() => {
  // 直接硬编码数据测试
  tableData.value = [
    {
      id: 1,
      name: '专业课',
      description: '专业课程分类',
      sortOrder: 1,
      status: true,
      createTime: '2023-01-01',
      updateTime: '2023-01-01'
    },
    {
      id: 2,
      name: '家长必修',
      description: '家长必修课程分类',
      sortOrder: 2,
      status: true,
      createTime: '2023-01-01',
      updateTime: '2023-01-01'
    },
    {
      id: 3,
      name: '精品专题',
      description: '精品专题课程分类',
      sortOrder: 3,
      status: true,
      createTime: '2023-01-01',
      updateTime: '2023-01-01'
    }
  ]
})

function showAddDialog() {
  dialogTitle.value = '添加分类'
  form.name = ''
  form.description = ''
  form.sortOrder = 0
  form.status = true
  form.updateTime = ''
  visible.value = true
}

function editCategory(record: any) {
  if (!record) {
    console.error('editCategory: record is undefined')
    return
  }
  dialogTitle.value = '编辑分类'
  form.name = record.name
  form.description = record.description
  form.sortOrder = record.sortOrder
  form.status = record.status
  form.updateTime = new Date().toISOString().split('T')[0]
  visible.value = true
}

function deleteCategory(id: number) {
  Message.success('删除成功')
}

function handleSubmit() {
  loading.value = true
  try {
    setTimeout(() => {
      Message.success('保存成功')
      visible.value = false
      loading.value = false
    }, 500)
  } catch (error) {
    Message.error('保存失败')
    loading.value = false
  }
}

function loadData() {
  tableData.value = [
    {
      id: 1,
      name: '专业课',
      description: '专业课程分类',
      sortOrder: 1,
      status: true,
      createTime: '2023-01-01',
      updateTime: '2023-01-01'
    },
    {
      id: 2,
      name: '家长必修',
      description: '家长必修课程分类',
      sortOrder: 2,
      status: true,
      createTime: '2023-01-01',
      updateTime: '2023-01-01'
    },
    {
      id: 3,
      name: '精品专题',
      description: '精品专题课程分类',
      sortOrder: 3,
      status: true,
      createTime: '2023-01-01',
      updateTime: '2023-01-01'
    }
  ]
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

.data-info {
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.manual-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
}

.manual-table th {
  background-color: #fafbfc;
  color: #333;
  font-weight: 500;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeef2;
  font-size: 14px;
}

.manual-table th:first-child,
.manual-table td:first-child {
  padding-left: 20px;
}

.manual-table th:last-child,
.manual-table td:last-child {
  padding-right: 20px;
}

.manual-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  font-size: 14px;
  color: #333;
}

.manual-table tr:hover {
  background-color: #f7f9fc;
}

.manual-table tr:last-child td {
  border-bottom: none;
}

.status-enabled {
  color: #52c41a;
  font-weight: 500;
}

.status-disabled {
  color: #ff4d4f;
  font-weight: 500;
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
</style>
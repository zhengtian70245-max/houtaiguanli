<template>
  <div class="comment-manager">
    <!-- 操作栏 -->
    <div class="comment-actions">
      <a-button @click="handleBatchDelete" :disabled="selectedCommentIds.length === 0">
        <template #icon>
          <icon-delete />
        </template>
        批量删除
      </a-button>
      <a-button @click="handleBatchApprove" :disabled="selectedCommentIds.length === 0">
        <template #icon>
          <icon-check />
        </template>
        批量审核通过
      </a-button>
      <a-button @click="handleRefresh">
        <template #icon>
          <icon-refresh />
        </template>
        刷新
      </a-button>
    </div>

    <!-- 搜索筛选 -->
    <a-form :inline="true" :model="searchForm" class="search-form">
      <a-form-item label="评论内容">
        <a-input v-model="searchForm.content" placeholder="请输入评论内容" allow-clear />
      </a-form-item>
      <a-form-item label="评论用户">
        <a-input v-model="searchForm.userName" placeholder="请输入评论用户" allow-clear />
      </a-form-item>
      <a-form-item label="评论状态">
        <a-select v-model="searchForm.status" placeholder="请选择评论状态" allow-clear>
          <a-option label="全部" :value="-1" />
          <a-option label="已审核" :value="1" />
          <a-option label="待审核" :value="0" />
        </a-select>
      </a-form-item>
      <a-form-item label="评分">
        <a-select v-model="searchForm.rating" placeholder="请选择评分" allow-clear>
          <a-option label="全部" :value="0" />
          <a-option label="5星" :value="5" />
          <a-option label="4星" :value="4" />
          <a-option label="3星" :value="3" />
          <a-option label="2星" :value="2" />
          <a-option label="1星" :value="1" />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-form-item>
    </a-form>

    <!-- 评论列表 -->
    <a-table
      :loading="loading"
      :data="filteredComments"
      style="width: 100%"
      border
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <a-table-column type="selection" width="55" />
      <a-table-column label="评论用户" min-width="150">
        <template #cell="{ record }">
          <div class="comment-user">
            <div class="user-avatar" v-if="record.avatar">
              <img :src="record.avatar" alt="用户头像" />
            </div>
            <div class="user-avatar placeholder" v-else>
              <a-icon name="user" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ record.userName }}</div>
              <div class="user-id">ID: {{ record.userId }}</div>
            </div>
          </div>
        </template>
      </a-table-column>
      <a-table-column label="评论内容" min-width="300">
        <template #cell="{ record }">
          <div class="comment-content">
            <div class="content-text">{{ record.content }}</div>
            <div class="content-meta">
              <div class="rating">
                <a-rate v-model="record.rating" :disabled="true" :size="14" />
              </div>
              <div class="create-time">{{ record.createTime }}</div>
            </div>
          </div>
        </template>
      </a-table-column>
      <a-table-column label="回复内容" min-width="200">
        <template #cell="{ record }">
          <div class="reply-content" v-if="record.reply">
            {{ record.reply }}
          </div>
          <div class="reply-content empty" v-else>
            暂无回复
          </div>
        </template>
      </a-table-column>
      <a-table-column label="状态" width="100" align="center">
        <template #cell="{ record }">
          <a-tag :type="record.status ? 'success' : 'warning'">
            {{ record.status ? '已审核' : '待审核' }}
          </a-tag>
        </template>
      </a-table-column>
      <a-table-column label="操作" width="200" align="center">
        <template #cell="{ record }">
          <a-button size="small" @click="handleReply(record)">
            <template #icon>
              <icon-message />
            </template>
            回复
          </a-button>
          <a-button size="small" :type="record.status ? 'info' : 'success'" @click="handleToggleStatus(record)">
            <template #icon>
              <a-icon :name="record.status ? 'close' : 'check'" />
            </template>
            {{ record.status ? '取消审核' : '审核通过' }}
          </a-button>
          <a-button size="small" type="danger" @click="handleDelete(record)">
            <template #icon>
              <icon-delete />
            </template>
            删除
          </a-button>
        </template>
      </a-table-column>
    </a-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="pagination.page"
        v-model:page-size="pagination.size"
        :page-size-options="[10, 20, 50, 100]"
        :total="filteredComments.length"
        show-total
        show-jumper
        show-size-changer
        @page-size-change="handleSizeChange"
        @page-change="handleCurrentChange"
      />
    </div>

    <!-- 回复评论对话框 -->
    <a-modal
      v-model:visible="replyDialogVisible"
      title="回复评论"
      width="500px"
    >
      <a-form :model="replyForm" label-width="80px">
        <a-form-item label="评论用户">
          <a-input v-model="replyForm.userName" :disabled="true" />
        </a-form-item>
        <a-form-item label="评论内容">
          <a-input
            v-model="replyForm.content"
            type="textarea"
            :rows="3"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item label="回复内容">
          <a-input
            v-model="replyForm.reply"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="replyDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="handleConfirmReply">确定回复</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconDelete,
  IconCheck,
  IconRefresh,
  IconMessage,
  IconClose,
  IconUser
} from '@arco-design/web-vue/es/icon'

const props = defineProps<{
  course: any
}>()

// 状态管理
const loading = ref(false)
const selectedCommentIds = ref<number[]>([])
const replyDialogVisible = ref(false)

// 搜索筛选
const searchForm = reactive({
  content: '',
  userName: '',
  status: -1,
  rating: 0
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10
})

// 回复表单
const replyForm = reactive({
  id: 0,
  userName: '',
  content: '',
  reply: ''
})

// 模拟评论数据
const mockComments = ref([
  {
    id: 1,
    userId: 101,
    userName: '张三',
    avatar: 'https://via.placeholder.com/40x40',
    content: '课程内容很丰富，老师讲解很详细，非常喜欢！',
    rating: 5,
    reply: '感谢您的好评，我们会继续努力！',
    status: true,
    createTime: '2026-01-30 14:30:00'
  },
  {
    id: 2,
    userId: 102,
    userName: '李四',
    avatar: 'https://via.placeholder.com/40x40',
    content: '课程还可以，希望能有更多实战案例。',
    rating: 4,
    reply: '您好，我们会在后续更新中添加更多实战案例，感谢您的建议！',
    status: true,
    createTime: '2026-01-30 16:45:00'
  },
  {
    id: 3,
    userId: 103,
    userName: '王五',
    avatar: 'https://via.placeholder.com/40x40',
    content: '课程质量不错，性价比很高。',
    rating: 5,
    reply: '',
    status: false,
    createTime: '2026-01-31 09:20:00'
  },
  {
    id: 4,
    userId: 104,
    userName: '赵六',
    avatar: 'https://via.placeholder.com/40x40',
    content: '老师讲课很生动，容易理解。',
    rating: 4,
    reply: '',
    status: false,
    createTime: '2026-01-31 11:15:00'
  }
])

// 过滤后的评论列表
const filteredComments = computed(() => {
  let comments = [...mockComments.value]
  
  // 按评论内容筛选
  if (searchForm.content) {
    comments = comments.filter(comment => 
      comment.content.includes(searchForm.content)
    )
  }
  
  // 按用户名称筛选
  if (searchForm.userName) {
    comments = comments.filter(comment => 
      comment.userName.includes(searchForm.userName)
    )
  }
  
  // 按状态筛选
  if (searchForm.status !== -1) {
    comments = comments.filter(comment => comment.status === (searchForm.status === 1))
  }
  
  // 按评分筛选
  if (searchForm.rating > 0) {
    comments = comments.filter(comment => comment.rating === searchForm.rating)
  }
  
  return comments
})

// 选择评论
function handleSelect(selection: any[], record: any, selected: boolean) {
  if (selected) {
    selectedCommentIds.value.push(record.id)
  } else {
    selectedCommentIds.value = selectedCommentIds.value.filter(id => id !== record.id)
  }
}

function handleSelectAll(selection: any[], selected: boolean) {
  if (selected) {
    selectedCommentIds.value = selection.map(item => item.id)
  } else {
    selectedCommentIds.value = []
  }
}

// 批量删除
function handleBatchDelete() {
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的${selectedCommentIds.value.length}条评论吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      mockComments.value = mockComments.value.filter(
        (comment: any) => !selectedCommentIds.value.includes(comment.id)
      )
      selectedCommentIds.value = []
      Message.success('批量删除成功')
    }
  })
}

// 批量审核通过
function handleBatchApprove() {
  mockComments.value = mockComments.value.map((comment: any) => {
    if (selectedCommentIds.value.includes(comment.id)) {
      return { ...comment, status: true }
    }
    return comment
  })
  selectedCommentIds.value = []
  Message.success('批量审核通过成功')
}

// 刷新
function handleRefresh() {
  Message.success('刷新成功')
}

// 搜索
function handleSearch() {
  pagination.page = 1
  Message.success('搜索成功')
}

// 重置
function handleReset() {
  searchForm.content = ''
  searchForm.userName = ''
  searchForm.status = -1
  searchForm.rating = 0
  pagination.page = 1
  Message.success('重置成功')
}

// 回复评论
function handleReply(comment: any) {
  replyForm.id = comment.id
  replyForm.userName = comment.userName
  replyForm.content = comment.content
  replyForm.reply = comment.reply || ''
  replyDialogVisible.value = true
}

// 切换评论状态
function handleToggleStatus(comment: any) {
  comment.status = !comment.status
  Message.success(comment.status ? '审核通过成功' : '取消审核成功')
}

// 删除评论
function handleDelete(comment: any) {
  Modal.confirm({
    title: '删除评论',
    content: '确定要删除这条评论吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      mockComments.value = mockComments.value.filter(
        (c: any) => c.id !== comment.id
      )
      Message.success('删除成功')
    }
  })
}

// 确认回复
function handleConfirmReply() {
  if (!replyForm.reply) {
    Message.error('请输入回复内容')
    return
  }
  
  mockComments.value = mockComments.value.map((comment: any) => {
    if (comment.id === replyForm.id) {
      return { ...comment, reply: replyForm.reply, status: true }
    }
    return comment
  })
  
  replyDialogVisible.value = false
  Message.success('回复成功')
}

// 分页变化
function handleSizeChange(size: number) {
  pagination.size = size
}

function handleCurrentChange(page: number) {
  pagination.page = page
}
</script>

<style scoped lang="scss">
.comment-manager {
  .comment-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .comment-user {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-avatar.placeholder {
      background: #e4e7ed;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;

      .arco-icon {
        font-size: 24px;
      }
    }

    .user-info {
      .user-name {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .user-id {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .comment-content {
    .content-text {
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .content-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #909399;

      .rating {
        .arco-rate {
          --arco-rate-icon-size: 14px;
        }
      }
    }
  }

  .reply-content {
    line-height: 1.5;

    &.empty {
      color: #909399;
      font-style: italic;
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
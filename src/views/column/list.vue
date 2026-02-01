<template>
  <div class="column-list-page">
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item label="专栏名称">
          <a-input v-model="searchForm.name" placeholder="请输入专栏名称" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="专栏分组">
          <a-select v-model="searchForm.category" placeholder="请选择专栏分组" allow-clear style="width: 150px">
            <a-option value="">请选择分组</a-option>
            <a-option :value="1">默认分组</a-option>
            <a-option :value="2">热门专栏</a-option>
            <a-option :value="3">推荐专栏</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上架状态">
          <a-select v-model="searchForm.status" placeholder="请选择上架状态" allow-clear style="width: 120px">
            <a-option value="">请选择状态</a-option>
            <a-option :value="1">已上架</a-option>
            <a-option :value="2">已下架</a-option>
            <a-option :value="3">草稿</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="购买方式">
          <a-select v-model="searchForm.purchaseType" placeholder="请选择购买方式" allow-clear style="width: 120px">
            <a-option value="">请选择购买方式</a-option>
            <a-option :value="1">单独购买</a-option>
            <a-option :value="2">订阅</a-option>
            <a-option :value="3">加盟</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card" :bordered="false">
      <template #title>
        <div class="card-title">
          <span>专栏列表</span>
          <a-button type="primary" @click="handleAddColumn">
            <template #icon>
              <icon-plus />
            </template>
            新增专栏
          </a-button>
        </div>
      </template>
      <template #extra>
        <a-space>
          <a-button @click="handleShareFunction">
            <template #icon>
              <icon-share-alt />
            </template>
            分享功能
          </a-button>
          <a-button @click="handleSortByOrder">
            <template #icon>
              <icon-sort />
            </template>
            序号排序
          </a-button>
          <a-dropdown>
            <a-button>
              更多操作
              <template #icon>
                <icon-down />
              </template>
            </a-button>
            <template #content>
              <a-doption @click="handleBatchPublish">批量上架</a-doption>
              <a-doption @click="handleBatchUnpublish">批量下架</a-doption>
              <a-doption @click="handleBatchDelete">批量删除</a-doption>
              <a-doption @click="handleUpdateCreationCount">更新创作量</a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </template>

      <a-table
        :data="columnsData"
        :loading="loading"
        :pagination="false"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true
        }"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <template #columns>
          <a-table-column title="专栏封面" :width="100" align="center">
            <template #cell="{ record }">
              <div class="column-cover">
                <img :src="record.cover" alt="专栏封面" v-if="record.cover" />
                <div class="cover-placeholder" v-else>
                  <icon-image />
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="专栏名称" :width="200">
            <template #cell="{ record }">
              <div class="column-info">
                <div class="column-name">{{ record.name }}</div>
                <div class="column-price">
                  <span class="price current">{{ record.price }}</span>
                  <span class="price original" v-if="record.originalPrice">{{ record.originalPrice }}</span>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="分组" data-index="categoryName" :width="120" align="center" />
          <a-table-column title="状态" data-index="status" :width="100" align="center">
            <template #cell="{ record }">
              <a-tag :color="record.status === 1 ? 'green' : record.status === 2 ? 'red' : 'orange'">
                {{ record.status === 1 ? '已上架' : record.status === 2 ? '已下架' : '草稿' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="课程数" data-index="courseCount" :width="80" align="center" />
          <a-table-column title="创建时间" data-index="createTime" :width="180" align="center" />
          <a-table-column title="序号" data-index="order" :width="80" align="center" />
          <a-table-column title="创建账号" data-index="createAccount" :width="150" align="center" />
          <a-table-column title="操作" :width="200" align="center" fixed="right">
            <template #cell="{ record }">
              <a-space :size="4">
                <a-button type="text" size="small" @click="handleViewDetail(record)">
                  <template #icon>
                    <icon-eye />
                  </template>
                  详情
                </a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </a-button>
                <a-button type="text" size="small" @click="handleShare(record)">
                  <template #icon>
                    <icon-share-alt />
                  </template>
                  分享
                </a-button>
                <a-dropdown>
                  <a-button type="text" size="small">
                    更多
                    <template #icon>
                      <icon-down />
                    </template>
                  </a-button>
                  <template #content>
                    <a-doption v-if="record.status !== 1" @click="handlePublish(record)">上架</a-doption>
                    <a-doption v-if="record.status === 1" @click="handleUnpublish(record)">下架</a-doption>
                    <a-doption @click="handleDelete(record)">删除</a-doption>
                  </template>
                </a-dropdown>
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
          @change="handlePageChange"
          @page-size-change="handleSizeChange"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconShareAlt,
  IconSort,
  IconDown,
  IconImage,
  IconEye,
  IconEdit
} from '@arco-design/web-vue/es/icon'

const router = useRouter()
const loading = ref(false)
const selectedRows = ref<any[]>([])

const searchForm = reactive({
  name: '',
  category: '',
  status: '',
  purchaseType: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const columnsData = ref([
  {
    id: 1,
    name: '自动化思考模型等你学习掌握',
    cover: 'https://via.placeholder.com/80x80',
    price: '¥99.00',
    originalPrice: '¥199.00',
    categoryName: '默认分组',
    status: 2,
    courseCount: 6,
    createTime: '2023-09-28 15:37:26',
    order: 1,
    createAccount: '182482498877'
  },
  {
    id: 2,
    name: '短视频学习攻略',
    cover: 'https://via.placeholder.com/80x80',
    price: '¥0.00',
    originalPrice: '¥0.00',
    categoryName: '热门专栏',
    status: 1,
    courseCount: 5,
    createTime: '2025-12-05 10:00:33',
    order: 2,
    createAccount: '176399974475'
  },
  {
    id: 3,
    name: '家庭教育系列课程',
    cover: 'https://via.placeholder.com/80x80',
    price: '¥399.00',
    originalPrice: '¥599.00',
    categoryName: '推荐专栏',
    status: 1,
    courseCount: 8,
    createTime: '2025-03-12 16:55:55',
    order: 3,
    createAccount: '176399974475'
  },
  {
    id: 4,
    name: '商业思维大课堂',
    cover: 'https://via.placeholder.com/80x80',
    price: '¥599.00',
    originalPrice: '¥899.00',
    categoryName: '默认分组',
    status: 1,
    courseCount: 10,
    createTime: '2024-05-14 14:48:48',
    order: 4,
    createAccount: '182482498877'
  },
  {
    id: 5,
    name: '个人成长系列',
    cover: 'https://via.placeholder.com/80x80',
    price: '¥199.00',
    originalPrice: '¥299.00',
    categoryName: '热门专栏',
    status: 1,
    courseCount: 7,
    createTime: '2024-05-14 14:36:38',
    order: 5,
    createAccount: '182482498877'
  }
])

onMounted(() => {
  pagination.total = columnsData.value.length
})

function handleSearch() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    Message.success('搜索成功')
  }, 500)
}

function handleReset() {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = ''
  })
}

function handleAddColumn() {
  router.push('/column/create')
}

function handleShareFunction() {
  Message.info('分享功能开发中')
}

function handleSortByOrder() {
  Message.info('序号排序功能开发中')
}

function handleBatchPublish() {
  if (selectedRows.value.length === 0) {
    Message.warning('请选择要上架的专栏')
    return
  }
  Message.success(`已上架 ${selectedRows.value.length} 个专栏`)
}

function handleBatchUnpublish() {
  if (selectedRows.value.length === 0) {
    Message.warning('请选择要下架的专栏')
    return
  }
  Message.success(`已下架 ${selectedRows.value.length} 个专栏`)
}

function handleBatchDelete() {
  if (selectedRows.value.length === 0) {
    Message.warning('请选择要删除的专栏')
    return
  }
  Message.success(`已删除 ${selectedRows.value.length} 个专栏`)
}

function handleUpdateCreationCount() {
  Message.info('更新创作量功能开发中')
}

function handleViewDetail(row: any) {
  router.push(`/column/detail/${row.id}`)
}

function handleEdit(row: any) {
  router.push(`/column/detail/${row.id}`)
}

function handleShare(row: any) {
  Message.info('分享功能开发中')
}

function handlePublish(row: any) {
  Message.success(`已上架专栏：${row.name}`)
}

function handleUnpublish(row: any) {
  Message.success(`已下架专栏：${row.name}`)
}

function handleDelete(row: any) {
  Message.success(`已删除专栏：${row.name}`)
}

function handleSelectionChange(keys: any[], rows: any[]) {
  selectedRows.value = rows
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
}
</script>

<style scoped lang="scss">
.column-list-page {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .column-cover {
      width: 80px;
      height: 80px;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--arco-radius-medium);
      }

      .cover-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--arco-fill-color-1);
        border-radius: var(--arco-radius-medium);

        .arco-icon {
          font-size: 24px;
          color: var(--arco-text-color-3);
        }
      }
    }

    .column-info {
      .column-name {
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--arco-text-color-1);
      }

      .column-price {
        .price {
          margin-right: 8px;

          &.current {
            color: var(--arco-danger-color-6);
            font-weight: 500;
          }

          &.original {
            color: var(--arco-text-color-3);
            text-decoration: line-through;
          }
        }
      }
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

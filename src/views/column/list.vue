<template>
  <div class="column-list">
    <!-- 搜索筛选区 -->
    <div class="search-filter">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="专栏名称">
          <el-input v-model="searchForm.name" placeholder="请输入专栏名称" clearable />
        </el-form-item>
        <el-form-item label="专栏分组">
          <el-select v-model="searchForm.category" placeholder="请选择专栏分组" clearable>
            <el-option label="请选择分组" :value="''" />
            <el-option label="默认分组" :value="1" />
            <el-option label="热门专栏" :value="2" />
            <el-option label="推荐专栏" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-select v-model="searchForm.status" placeholder="请选择上架状态" clearable>
            <el-option label="请选择状态" :value="''" />
            <el-option label="已上架" :value="1" />
            <el-option label="已下架" :value="2" />
            <el-option label="草稿" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="购买方式">
          <el-select v-model="searchForm.purchaseType" placeholder="请选择购买方式" clearable>
            <el-option label="请选择购买方式" :value="''" />
            <el-option label="单独购买" :value="1" />
            <el-option label="订阅" :value="2" />
            <el-option label="加盟" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="素材状态">
          <el-select v-model="searchForm.materialStatus" placeholder="请选择素材状态" clearable>
            <el-option label="请选择素材状态" :value="''" />
            <el-option label="已审核" :value="1" />
            <el-option label="未审核" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号搜索">
          <el-input v-model="searchForm.account" placeholder="输入账号" clearable />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="价格区间">
          <el-input-number v-model="searchForm.priceMin" placeholder="最低" clearable />
          <span style="margin: 0 8px;">-</span>
          <el-input-number v-model="searchForm.priceMax" placeholder="最高" clearable />
        </el-form-item>
        <el-form-item label="VIP折扣">
          <el-input-number v-model="searchForm.vipDiscountMin" placeholder="最低" clearable />
          <span style="margin: 0 8px;">-</span>
          <el-input-number v-model="searchForm.vipDiscountMax" placeholder="最高" clearable />
        </el-form-item>
        <el-form-item label="SVIP折扣">
          <el-input-number v-model="searchForm.svipDiscountMin" placeholder="最低" clearable />
          <span style="margin: 0 8px;">-</span>
          <el-input-number v-model="searchForm.svipDiscountMax" placeholder="最高" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleMoreOptions">更多筛选</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleAddColumn">
        <el-icon><Plus /></el-icon>
        新增专栏
      </el-button>
      <el-button @click="handleShareFunction">
        <el-icon><Share /></el-icon>
        分享功能
      </el-button>
      <el-button @click="handleSortByOrder">
        <el-icon><Top /></el-icon>
        序号排序
      </el-button>
      <el-dropdown>
        <el-button>
          更多操作 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleBatchPublish">批量上架</el-dropdown-item>
            <el-dropdown-item @click="handleBatchUnpublish">批量下架</el-dropdown-item>
            <el-dropdown-item @click="handleBatchDelete">批量删除</el-dropdown-item>
            <el-dropdown-item @click="handleUpdateCreationCount">更新创作量</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 数据列表区 -->
    <div class="data-list">
      <el-table
        v-loading="loading"
        :data="columnsData"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="专栏封面" width="100" align="center">
          <template #default="{ row }">
            <div class="column-cover">
              <img :src="row.cover" alt="专栏封面" v-if="row.cover" />
              <div class="cover-placeholder" v-else>
                <el-icon><PictureFilled /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="专栏名称" min-width="200">
          <template #default="{ row }">
            <div class="column-info">
              <div class="column-name">{{ row.name }}</div>
              <div class="column-price">
                <span class="price current">{{ row.price }}</span>
                <span class="price original" v-if="row.originalPrice">{{ row.originalPrice }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分组" width="120" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'">
              {{ row.status === 1 ? '已上架' : row.status === 2 ? '已下架' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="courseCount" label="课程数" width="80" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column prop="order" label="序号" width="80" align="center" />
        <el-table-column prop="createAccount" label="创建账号" width="150" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewDetail(row)">
              <el-icon><View /></el-icon>
              详情
            </el-button>
            <el-button size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" @click="handleShare(row)">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
            <el-dropdown>
              <el-button size="small">
                更多 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handlePublish(row)" v-if="row.status !== 1">上架</el-dropdown-item>
                  <el-dropdown-item @click="handleUnpublish(row)" v-if="row.status === 1">下架</el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(row)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const selectedRows = ref([])

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  status: '',
  purchaseType: '',
  materialStatus: '',
  account: '',
  createTime: [],
  priceMin: '',
  priceMax: '',
  vipDiscountMin: '',
  vipDiscountMax: '',
  svipDiscountMin: '',
  svipDiscountMax: ''
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 专栏数据
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

// 初始化
onMounted(() => {
  pagination.total = columnsData.value.length
})

// 搜索
const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索成功')
  }, 500)
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = ''
  })
}

// 更多筛选
const handleMoreOptions = () => {
  ElMessage.info('更多筛选功能开发中')
}

// 新增专栏
const handleAddColumn = () => {
  router.push('/column/create')
}

// 分享功能
const handleShareFunction = () => {
  ElMessage.info('分享功能开发中')
}

// 序号排序
const handleSortByOrder = () => {
  ElMessage.info('序号排序功能开发中')
}

// 批量上架
const handleBatchPublish = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要上架的专栏')
    return
  }
  ElMessage.success(`已上架 ${selectedRows.value.length} 个专栏`)
}

// 批量下架
const handleBatchUnpublish = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要下架的专栏')
    return
  }
  ElMessage.success(`已下架 ${selectedRows.value.length} 个专栏`)
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的专栏')
    return
  }
  ElMessage.success(`已删除 ${selectedRows.value.length} 个专栏`)
}

// 更新创作量
const handleUpdateCreationCount = () => {
  ElMessage.info('更新创作量功能开发中')
}

// 查看详情
const handleViewDetail = (row: any) => {
  router.push(`/column/detail/${row.id}`)
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/column/detail/${row.id}`)
}

// 分享
const handleShare = (row: any) => {
  ElMessage.info('分享功能开发中')
}

// 上架
const handlePublish = (row: any) => {
  ElMessage.success(`已上架专栏：${row.name}`)
}

// 下架
const handleUnpublish = (row: any) => {
  ElMessage.success(`已下架专栏：${row.name}`)
}

// 删除
const handleDelete = (row: any) => {
  ElMessage.success(`已删除专栏：${row.name}`)
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
.column-list {
  .search-filter {
    margin-bottom: 20px;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
  }

  .action-buttons {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .data-list {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;

    .column-cover {
      width: 80px;
      height: 80px;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }

      .cover-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        border-radius: 4px;
        
        .el-icon {
          font-size: 24px;
          color: #999;
        }
      }
    }

    .column-info {
      .column-name {
        font-weight: 500;
        margin-bottom: 8px;
      }

      .column-price {
        .price {
          margin-right: 8px;
          
          &.current {
            color: #ff4d4f;
            font-weight: 500;
          }

          &.original {
            color: #999;
            text-decoration: line-through;
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
}
</style>
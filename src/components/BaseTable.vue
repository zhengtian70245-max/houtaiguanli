<template>
  <div class="base-table">
    <el-table :data="tableData" :height="height" :border="border" :stripe="stripe">
      <template v-for="col in columns" :key="col.prop">
        <el-table-column v-if="!col.slot" :prop="col.prop" :label="col.label" :width="col.width" :min-width="col.minWidth" :align="col.align">
          <template #default="{ row }">
            <template v-if="col.type === 'status'">
              <el-tag :type="getStatusType(row[col.prop!])">{{ getStatusText(row[col.prop!]) }}</el-tag>
            </template>
            <template v-else-if="col.type === 'level'">
              <el-tag :type="getLevelType(row[col.prop!])">{{ getLevelText(row[col.prop!]) }}</el-tag>
            </template>
            <template v-else-if="col.type === 'date'">
              {{ formatDate(row[col.prop!]) }}
            </template>
            <template v-else-if="col.type === 'money'">
              {{ formatMoney(row[col.prop!]) }}
            </template>
            <template v-else>
              {{ row[col.prop!] }}
            </template>
          </template>
        </el-table-column>
        <el-table-column v-else :label="col.label" :width="col.width" :min-width="col.minWidth" :align="col.align">
          <template #default="{ row }">
            <slot :name="col.slot" :row="row" />
          </template>
        </el-table-column>
      </template>
      <el-table-column v-if="actions" label="操作" align="center" :width="actionsWidth">
        <template #default="{ row }">
          <template v-for="action in actions" :key="action.type">
            <el-button :type="action.type" :size="action.size" :icon="action.icon" :disabled="action.disabled && action.disabled(row)" @click="handleAction(action, row)">
              {{ action.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper" v-if="showPagination">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  tableData: {
    type: Array as () => any[],
    default: () => []
  },
  columns: {
    type: Array as () => Column[],
    default: () => []
  },
  actions: {
    type: Array as () => Action[],
    default: () => []
  },
  height: {
    type: Number,
    default: null
  },
  border: {
    type: Boolean,
    default: false
  },
  stripe: {
    type: Boolean,
    default: false
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Object as () => Pagination,
    default: () => ({ page: 1, size: 10, total: 0 })
  },
  actionsWidth: {
    type: Number,
    default: 200
  }
})

const emit = defineEmits(['size-change', 'current-change', 'action'])

const pagination = computed(() => props.pagination)

function getStatusType(status: number): string {
  const typeMap: Record<number, string> = {
    0: 'danger',
    1: 'success'
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: number): string {
  const textMap: Record<number, string> = {
    0: '禁用',
    1: '启用'
  }
  return textMap[status] || '未知'
}

function getLevelType(level: number): string {
  const typeMap: Record<number, string> = {
    1: 'info',
    2: 'primary',
    3: 'warning',
    4: 'danger'
  }
  return typeMap[level] || 'info'
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

function formatDate(date: string | Date): string {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

function formatMoney(money: number): string {
  return `¥${money.toFixed(2)}`
}

function handleSizeChange(size: number) {
  emit('size-change', size)
}

function handleCurrentChange(page: number) {
  emit('current-change', page)
}

function handleAction(action: Action, row: any) {
  emit('action', action, row)
}
</script>

<style scoped lang="scss">
.base-table {
  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
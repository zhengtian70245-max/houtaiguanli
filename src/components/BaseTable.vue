<template>
  <div class="base-table">
    <a-table :data="tableData" :height="height" :border="border" :stripe="stripe">
      <template v-for="col in columns" :key="col.properties">
        <a-table-column v-if="!col.slot" :prop="col.properties" :label="col.label" :width="col.width" :min-width="col.minWidth" :align="col.align">
          <template #default="{ record }">
            <template v-if="col.type === 'status'">
              <a-tag :color="getStatusColor(record[col.properties])">{{ getStatusText(record[col.properties]) }}</a-tag>
            </template>
            <template v-else-if="col.type === 'level'">
              <a-tag :color="getLevelColor(record[col.properties])">{{ getLevelText(record[col.properties]) }}</a-tag>
            </template>
            <template v-else-if="col.type === 'date'">
              {{ formatDate(record[col.properties]) }}
            </template>
            <template v-else-if="col.type === 'money'">
              {{ formatMoney(record[col.properties]) }}
            </template>
            <template v-else>
              {{ record[col.properties] }}
            </template>
          </template>
        </a-table-column>
        <a-table-column v-else :label="col.label" :width="col.width" :min-width="col.minWidth" :align="col.align">
          <template #default="{ record }">
            <slot :name="col.slot" :record="record" />
          </template>
        </a-table-column>
      </template>
      <a-table-column v-if="actions" label="操作" align="center" :width="actionsWidth">
        <template #default="{ record }">
          <template v-for="action in actions" :key="action.type">
            <a-button :type="action.type" :size="action.size" :icon="action.icon" :disabled="action.disabled && action.disabled(record)" @click="handleAction(action, record)">
              {{ action.label }}
            </a-button>
          </template>
        </template>
      </a-table-column>
    </a-table>
    <div class="pagination-wrapper" v-if="showPagination">
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

function getStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    0: 'red',
    1: 'green'
  }
  return colorMap[status] || 'blue'
}

function getStatusText(status: number): string {
  const textMap: Record<number, string> = {
    0: '禁用',
    1: '启用'
  }
  return textMap[status] || '未知'
}

function getLevelColor(level: number): string {
  const colorMap: Record<number, string> = {
    1: 'blue',
    2: 'purple',
    3: 'orange',
    4: 'red'
  }
  return colorMap[level] || 'blue'
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

function handleAction(action: Action, record: any) {
  emit('action', action, record)
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
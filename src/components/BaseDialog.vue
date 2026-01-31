<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :top="top"
    :modal="modal"
    :append-to-body="appendToBody"
    :destroy-on-close="destroyOnClose"
    @close="handleClose"
    @open="handleOpen"
  >
    <slot />
    <template v-if="showButtons" #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="confirmLoading" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: [String, Number],
    default: '500px'
  },
  top: {
    type: String,
    default: '50vh'
  },
  modal: {
    type: Boolean,
    default: true
  },
  appendToBody: {
    type: Boolean,
    default: false
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  showButtons: {
    type: Boolean,
    default: true
  },
  confirmLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'close', 'open'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val)
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}

function handleClose() {
  emit('close')
}

function handleOpen() {
  emit('open')
}
</script>

<style scoped lang="scss">
.base-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;

    .el-dialog__header {
      padding: 18px 20px;
      border-bottom: 1px solid #e8e8e8;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      padding: 12px 20px 20px;
      border-top: 1px solid #e8e8e8;
      text-align: right;
    }
  }
}
</style>
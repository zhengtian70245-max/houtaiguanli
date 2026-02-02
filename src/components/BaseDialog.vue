<template>
  <a-modal
    v-model:visible="dialogVisible"
    :title="title"
    :width="width"
    :top="top"
    :mask="modal"
    :mask-closable="false"
    @cancel="handleCancel"
    @ok="handleConfirm"
  >
    <slot />
  </a-modal>
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
</script>

<style scoped lang="scss">
.base-dialog {
  :deep(.arco-modal) {
    border-radius: 8px;

    .arco-modal-header {
      padding: 18px 20px;
      border-bottom: 1px solid #e8e8e8;

      .arco-modal-title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .arco-modal-body {
      padding: 20px;
    }

    .arco-modal-footer {
      padding: 12px 20px 20px;
      border-top: 1px solid #e8e8e8;
      text-align: right;
    }
  }
}
</style>
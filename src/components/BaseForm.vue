<template>
  <a-form :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" :inline="inline" class="base-form">
    <template v-for="field in fields" :key="field.properties">
      <a-form-item :label="field.label" :name="[field.properties]" :rules="getFieldRules(field.properties)">
        <template v-if="field.type === 'input'">
          <a-input
            v-model="form[field.properties]"
            :placeholder="field.placeholder"
            :type="field.inputType"
            :disabled="field.disabled"
            :prefix="field.prefixIcon"
            @keyup.enter="handleEnter"
          />
        </template>
        <template v-else-if="field.type === 'select'">
          <a-select
            v-model="form[field.properties]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @change="handleChange(field, form[field.properties])"
          >
            <a-option
              v-for="option in field.options!"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </a-select>
        </template>
        <template v-else-if="field.type === 'date'">
          <a-date-picker
            v-model="form[field.properties]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </template>
        <template v-else-if="field.type === 'daterange'">
          <a-range-picker
            v-model="form[field.properties]"
            :start-placeholder="field.startPlaceholder"
            :end-placeholder="field.endPlaceholder"
            :disabled="field.disabled"
            value-format="YYYY-MM-DD"
          />
        </template>
        <template v-else-if="field.type === 'number'">
          <a-input-number
            v-model="form[field.properties]"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            :precision="field.precision"
            :disabled="field.disabled"
          />
        </template>
        <template v-else-if="field.type === 'textarea'">
          <a-input
            v-model="form[field.properties]"
            type="textarea"
            :rows="field.rows || 4"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
          />
        </template>
        <template v-else-if="field.type === 'radio'">
          <a-radio-group v-model="form[field.properties]">
            <a-radio
              v-for="option in field.options!"
              :key="option.value"
              :value="option.value"
              :disabled="field.disabled"
            >
              {{ option.label }}
            </a-radio>
          </a-radio-group>
        </template>
        <template v-else-if="field.type === 'checkbox'">
          <a-checkbox-group v-model="form[field.properties]">
            <a-checkbox
              v-for="option in field.options!"
              :key="option.value"
              :value="option.value"
              :disabled="field.disabled"
            >
              {{ option.label }}
            </a-checkbox>
          </a-checkbox-group>
        </template>
        <template v-else-if="field.type === 'switch'">
          <a-switch v-model="form[field.properties]" :active-text="field.activeText" :inactive-text="field.inactiveText" />
        </template>
        <template v-else-if="field.type === 'upload'">
          <a-upload
            :file-list="field.fileList"
            :action="field.action"
            :headers="field.headers"
            :data="field.data"
            :name="field.name"
            :with-credentials="field.withCredentials"
            :show-file-list="field.showFileList"
            :multiple="field.multiple"
            :auto-upload="field.autoUpload"
            :accept="field.accept"
            :limit="field.limit"
            :before-upload="field.beforeUpload"
            :before-remove="field.beforeRemove"
            :on-success="field.onSuccess"
            :on-error="field.onError"
            :on-change="field.onChange"
            @file-list-change="handleUploadChange"
          >
            <a-button :type="field.type">
              <icon :icon="field.icon" />
              {{ field.text || '上传文件' }}
            </a-button>
            <template #tip v-if="field.tip">
              <div class="upload-tip">{{ field.tip }}</div>
            </template>
          </a-upload>
        </template>
      </a-form-item>
    </template>
    <template v-if="showButtons">
      <a-form-item>
        <a-button type="primary" @click="handleSubmit">提交</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-form-item>
    </template>
  </a-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  form: {
    type: Object as () => Record<string, any>,
    default: () => ({})
  },
  fields: {
    type: Array as () => Field[],
    default: () => []
  },
  rules: {
    type: Object as () => Record<string, any>,
    default: () => ({})
  },
  labelCol: {
    type: Object,
    default: () => ({ span: 5 })
  },
  wrapperCol: {
    type: Object,
    default: () => ({ span: 19 })
  },
  inline: {
    type: Boolean,
    default: false
  },
  showButtons: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['submit', 'reset', 'change', 'enter', 'upload'])

const form = computed(() => props.form)

function getFieldRules(properties: string) {
  return props.rules[properties] || []
}

function handleSubmit() {
  emit('submit')
}

function handleReset() {
  emit('reset')
}

function handleChange(field: Field, value: any) {
  emit('change', field, value)
}

function handleEnter() {
  emit('enter')
}

function handleUploadChange(fileList: any[]) {
  emit('upload', fileList)
}
</script>

<style scoped lang="scss">
.base-form {
  :deep(.arco-form-item) {
    margin-bottom: 20px;
  }
}

.upload-tip {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}
</style>
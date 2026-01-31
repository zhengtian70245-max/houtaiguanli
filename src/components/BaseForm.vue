<template>
  <el-form :model="form" :rules="rules" :label-width="labelWidth" :inline="inline" class="base-form">
    <template v-for="field in fields" :key="field.prop">
      <el-form-item :label="field.label" :prop="field.prop">
        <template v-if="field.type === 'input'">
          <el-input
            v-model="form[field.prop!]"
            :placeholder="field.placeholder"
            :type="field.inputType"
            :disabled="field.disabled"
            :show-password="field.showPassword"
            :prefix-icon="field.prefixIcon"
            @keyup.enter="handleEnter"
          />
        </template>
        <template v-else-if="field.type === 'select'">
          <el-select
            v-model="form[field.prop!]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @change="handleChange(field, form[field.prop!])"
          >
            <el-option
              v-for="option in field.options!"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </template>
        <template v-else-if="field.type === 'date'">
          <el-date-picker
            v-model="form[field.prop!]"
            type="datetime"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </template>
        <template v-else-if="field.type === 'daterange'">
          <el-date-picker
            v-model="form[field.prop!]"
            type="daterange"
            :start-placeholder="field.startPlaceholder"
            :end-placeholder="field.endPlaceholder"
            :disabled="field.disabled"
            value-format="YYYY-MM-DD"
          />
        </template>
        <template v-else-if="field.type === 'number'">
          <el-input-number
            v-model="form[field.prop!]"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            :precision="field.precision"
            :disabled="field.disabled"
          />
        </template>
        <template v-else-if="field.type === 'textarea'">
          <el-input
            v-model="form[field.prop!]"
            type="textarea"
            :rows="field.rows || 4"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
          />
        </template>
        <template v-else-if="field.type === 'radio'">
          <el-radio-group v-model="form[field.prop!]">
            <el-radio
              v-for="option in field.options!"
              :key="option.value"
              :value="option.value"
              :disabled="field.disabled"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </template>
        <template v-else-if="field.type === 'checkbox'">
          <el-checkbox-group v-model="form[field.prop!]">
            <el-checkbox
              v-for="option in field.options!"
              :key="option.value"
              :value="option.value"
              :disabled="field.disabled"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-else-if="field.type === 'switch'">
          <el-switch v-model="form[field.prop!]" :active-text="field.activeText" :inactive-text="field.inactiveText" />
        </template>
        <template v-else-if="field.type === 'upload'">
          <el-upload
            v-model:file-list="field.fileList"
            :action="field.action"
            :headers="field.headers"
            :data="field.data"
            :name="field.name"
            :with-credentials="field.withCredentials"
            :show-file-list="field.showFileList"
            :drag="field.drag"
            :auto-upload="field.autoUpload"
            :accept="field.accept"
            :limit="field.limit"
            :on-preview="field.onPreview"
            :on-remove="field.onRemove"
            :before-upload="field.beforeUpload"
            :before-remove="field.beforeRemove"
            :on-success="field.onSuccess"
            :on-error="field.onError"
            :on-progress="field.onProgress"
            :on-change="field.onChange"
            :file-list="field.fileList"
          >
            <el-icon v-if="field.icon"><Plus /></el-icon>
            <template #tip v-if="field.tip">
              <div class="el-upload__tip">{{ field.tip }}</div>
            </template>
          </el-upload>
        </template>
      </el-form-item>
    </template>
    <template v-if="showButtons">
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </template>
  </el-form>
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
  labelWidth: {
    type: [String, Number],
    default: '100px'
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

const emit = defineEmits(['submit', 'reset', 'change', 'enter'])

const form = computed(() => props.form)

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
</script>

<style scoped lang="scss">
.base-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}
</style>
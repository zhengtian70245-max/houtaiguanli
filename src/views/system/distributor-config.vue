<template>
  <div class="page-container">
    <div class="page-header">
      <h2>分销配置</h2>
    </div>
    <div class="page-content">
      <a-form :model="form" :label-width="'140px'" class="distributor-config-form">
        <a-divider orientation="left">分销层级设置</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="分销层级">
              <a-select v-model="form.level" placeholder="请选择层级">
                <a-option label="1级分销" :value="1" />
                <a-option label="2级分销" :value="2" />
                <a-option label="3级分销" :value="3" />
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">各级佣金比例配置</a-divider>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="一级佣金比例（%）">
              <a-input-number v-model="form.commissionLevel1" :min="0" :max="100" :precision="2" :step="0.01" placeholder="请输入比例" />
            </a-form-item>
          </a-col>
          <a-col :span="8" v-if="form.level >= 2">
            <a-form-item label="二级佣金比例（%）">
              <a-input-number v-model="form.commissionLevel2" :min="0" :max="100" :precision="2" :step="0.01" placeholder="请输入比例" />
            </a-form-item>
          </a-col>
          <a-col :span="8" v-if="form.level >= 3">
            <a-form-item label="三级佣金比例（%）">
              <a-input-number v-model="form.commissionLevel3" :min="0" :max="100" :precision="2" :step="0.01" placeholder="请输入比例" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">结算周期配置</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="结算周期">
              <a-select v-model="form.settlementCycle" placeholder="请选择结算周期">
                <a-option label="T+1" value="t+1" />
                <a-option label="周结" value="weekly" />
                <a-option label="月结" value="monthly" />
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">提现门槛设置</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="提现门槛（元）">
              <a-input-number v-model="form.withdrawThreshold" :min="0" :precision="2" :step="0.01" placeholder="请输入提现门槛" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">分销套餐配置</a-divider>
        <div class="package-list">
          <div class="package-item" v-for="(package, index) in form.packages" :key="index">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item :label="`套餐${index + 1}名称`" :prop="`packages[${index}].name`">
                  <a-input v-model="package.name" placeholder="请输入套餐名称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="`套餐${index + 1}价格`" :prop="`packages[${index}].price`">
                  <a-input-number v-model="package.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="`套餐${index + 1}时长`" :prop="`packages[${index}].duration`">
                  <a-input-number v-model="package.duration" :min="0" :precision="0" :step="1" placeholder="请输入时长（月）" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>

        <a-form-item>
          <a-button type="primary" :loading="loading" @click="handleSave">保存配置</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import message from '@arco-design/web-vue/es/message'

const loading = ref(false)

const form = reactive({
  level: 3,
  commissionLevel1: 10,
  commissionLevel2: 5,
  commissionLevel3: 3,
  settlementCycle: 'weekly',
  withdrawThreshold: 100,
  packages: [
    { name: '终身学员', price: 998, duration: 999 },
    { name: '架构学套餐', price: 39800, duration: 36 },
    { name: '全家福套餐', price: 200000, duration: 24 },
    { name: '自动自发家族', price: 200000, duration: 999 }
  ]
})

async function handleSave() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    message.success('保存成功')
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.level = 3
  form.commissionLevel1 = 10
  form.commissionLevel2 = 5
  form.commissionLevel3 = 3
  form.settlementCycle = 'weekly'
  form.withdrawThreshold = 100
}
</script>

<style scoped lang="scss">
.package-list {
  .package-item {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e8e8;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
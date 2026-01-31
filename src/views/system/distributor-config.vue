<template>
  <div class="page-container">
    <div class="page-header">
      <h2>分销配置</h2>
    </div>
    <div class="page-content">
      <el-form :model="form" :label-width="'140px'" class="distributor-config-form">
        <el-divider content-position="left">分销层级设置</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="分销层级">
              <el-select v-model="form.level" placeholder="请选择层级">
                <el-option label="1级分销" :value="1" />
                <el-option label="2级分销" :value="2" />
                <el-option label="3级分销" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">各级佣金比例配置</el-divider>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="一级佣金比例（%）">
              <el-input-number v-model="form.commissionLevel1" :min="0" :max="100" :precision="2" :step="0.01" placeholder="请输入比例" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.level >= 2">
            <el-form-item label="二级佣金比例（%）">
              <el-input-number v-model="form.commissionLevel2" :min="0" :max="100" :precision="2" :step="0.01" placeholder="请输入比例" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.level >= 3">
            <el-form-item label="三级佣金比例（%）">
              <el-input-number v-model="form.commissionLevel3" :min="0" :max="100" :precision="2" :step="0.01" placeholder="请输入比例" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">结算周期配置</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="结算周期">
              <el-select v-model="form.settlementCycle" placeholder="请选择结算周期">
                <el-option label="T+1" value="t+1" />
                <el-option label="周结" value="weekly" />
                <el-option label="月结" value="monthly" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">提现门槛设置</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="提现门槛（元）">
              <el-input-number v-model="form.withdrawThreshold" :min="0" :precision="2" :step="0.01" placeholder="请输入提现门槛" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">分销套餐配置</el-divider>
        <div class="package-list">
          <div class="package-item" v-for="(package, index) in form.packages" :key="index">
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item :label="`套餐${index + 1}名称`" :prop="`packages[${index}].name`">
                  <el-input v-model="package.name" placeholder="请输入套餐名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`套餐${index + 1}价格`" :prop="`packages[${index}].price`">
                  <el-input-number v-model="package.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`套餐${index + 1}时长`" :prop="`packages[${index}].duration`">
                  <el-input-number v-model="package.duration" :min="0" :precision="0" :step="1" placeholder="请输入时长（月）" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">保存配置</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

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
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
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
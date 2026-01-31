<template>
  <div class="course-settings">
    <!-- 设置选项卡 -->
    <el-tabs v-model="activeSettingTab" class="settings-tabs">
      <el-tab-pane label="基础设置" name="basic">
        <el-form :model="settingsForm.basic" label-width="120px" class="settings-form">
          <el-form-item label="课程简介">
            <el-input
              v-model="settingsForm.basic.intro"
              type="textarea"
              :rows="4"
              placeholder="请输入课程简介"
            />
          </el-form-item>
          <el-form-item label="课程详情">
            <el-input
              v-model="settingsForm.basic.detail"
              type="textarea"
              :rows="8"
              placeholder="请输入课程详情"
            />
          </el-form-item>
          <el-form-item label="课程标签">
            <el-tag
              v-for="(tag, index) in settingsForm.basic.tags"
              :key="index"
              closable
              @close="handleRemoveTag(index)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-model="newTag"
              class="tag-input"
              placeholder="输入标签后按回车"
              @keyup.enter="handleAddTag"
            />
          </el-form-item>
          <el-form-item label="SEO标题">
            <el-input v-model="settingsForm.basic.seoTitle" placeholder="请输入SEO标题" />
          </el-form-item>
          <el-form-item label="SEO关键词">
            <el-input v-model="settingsForm.basic.seoKeywords" placeholder="请输入SEO关键词，多个用逗号分隔" />
          </el-form-item>
          <el-form-item label="SEO描述">
            <el-input
              v-model="settingsForm.basic.seoDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入SEO描述"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="价格设置" name="price">
        <el-form :model="settingsForm.price" label-width="120px" class="settings-form">
          <el-form-item label="课程价格">
            <el-input-number
              v-model="settingsForm.price.price"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入价格"
            />
          </el-form-item>
          <el-form-item label="原价">
            <el-input-number
              v-model="settingsForm.price.originalPrice"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入原价"
            />
          </el-form-item>
          <el-form-item label="会员价格">
            <el-input-number
              v-model="settingsForm.price.vipPrice"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入会员价格"
            />
          </el-form-item>
          <el-form-item label="所需会员等级">
            <el-select v-model="settingsForm.price.vipLevelRequired" placeholder="请选择所需会员等级">
              <el-option label="无限制" :value="0" />
              <el-option label="付费学员" :value="1" />
              <el-option label="终身学员" :value="2" />
              <el-option label="架构学套餐学员" :value="3" />
              <el-option label="全家福套餐学员" :value="4" />
              <el-option label="自动自发家族成员" :value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否参与会员免费">
            <el-switch v-model="settingsForm.price.includeInVip" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="销售设置" name="sales">
        <el-form :model="settingsForm.sales" label-width="120px" class="settings-form">
          <el-form-item label="是否开启分销">
            <el-switch v-model="settingsForm.sales.enableDistribution" />
          </el-form-item>
          <el-form-item label="分销佣金比例" v-if="settingsForm.sales.enableDistribution">
            <el-input-number
              v-model="settingsForm.sales.distributionRate"
              :min="0"
              :max="100"
              :precision="2"
              :step="0.1"
              placeholder="请输入佣金比例"
            >
              <template #append>%</template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="是否开启优惠券">
            <el-switch v-model="settingsForm.sales.enableCoupon" />
          </el-form-item>
          <el-form-item label="是否开启积分抵扣">
            <el-switch v-model="settingsForm.sales.enablePoints" />
          </el-form-item>
          <el-form-item label="积分抵扣比例" v-if="settingsForm.sales.enablePoints">
            <el-input-number
              v-model="settingsForm.sales.pointsRate"
              :min="0"
              :max="100"
              :precision="2"
              :step="0.1"
              placeholder="请输入积分抵扣比例"
            >
              <template #append>%</template>
            </el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="关联设置" name="related">
        <el-form :model="settingsForm.related" label-width="120px" class="settings-form">
          <el-form-item label="关联商品">
            <el-select
              v-model="settingsForm.related.relatedProducts"
              multiple
              placeholder="请选择关联商品"
              class="product-select"
            >
              <el-option label="商品1" :value="1" />
              <el-option label="商品2" :value="2" />
              <el-option label="商品3" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="关联课程">
            <el-select
              v-model="settingsForm.related.relatedCourses"
              multiple
              placeholder="请选择关联课程"
              class="course-select"
            >
              <el-option label="课程1" :value="1" />
              <el-option label="课程2" :value="2" />
              <el-option label="课程3" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="关联电子书">
            <el-select
              v-model="settingsForm.related.relatedBooks"
              multiple
              placeholder="请选择关联电子书"
              class="book-select"
            >
              <el-option label="电子书1" :value="1" />
              <el-option label="电子书2" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="关联圈子">
            <el-select
              v-model="settingsForm.related.relatedCircles"
              multiple
              placeholder="请选择关联圈子"
              class="circle-select"
            >
              <el-option label="圈子1" :value="1" />
              <el-option label="圈子2" :value="2" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="高级设置" name="advanced">
        <el-form :model="settingsForm.advanced" label-width="120px" class="settings-form">
          <el-form-item label="允许评论">
            <el-switch v-model="settingsForm.advanced.allowComment" />
          </el-form-item>
          <el-form-item label="评论审核">
            <el-switch v-model="settingsForm.advanced.commentAudit" />
          </el-form-item>
          <el-form-item label="允许下载">
            <el-switch v-model="settingsForm.advanced.allowDownload" />
          </el-form-item>
          <el-form-item label="学习有效期">
            <el-select v-model="settingsForm.advanced.validityPeriod" placeholder="请选择学习有效期">
              <el-option label="永久有效" :value="0" />
              <el-option label="30天" :value="30" />
              <el-option label="90天" :value="90" />
              <el-option label="180天" :value="180" />
              <el-option label="365天" :value="365" />
            </el-select>
          </el-form-item>
          <el-form-item label="最大学习人数">
            <el-input-number
              v-model="settingsForm.advanced.maxStudents"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="0表示无限制"
            />
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="settingsForm.advanced.sort"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="请输入排序值"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 操作按钮 -->
    <div class="settings-actions">
      <el-button type="primary" @click="handleSaveSettings">
        <el-icon><Check /></el-icon>
        保存设置
      </el-button>
      <el-button @click="handleResetSettings">
        <el-icon><Refresh /></el-icon>
        重置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Check,
  Refresh
} from '@element-plus/icons-vue'

const props = defineProps<{
  course: any
}>()

const emit = defineEmits<{
  'update:course': [course: any]
}>()

// 激活的设置选项卡
const activeSettingTab = ref('basic')

// 标签输入
const newTag = ref('')

// 设置表单
const settingsForm = reactive({
  basic: {
    intro: '',
    detail: '',
    tags: [] as string[],
    seoTitle: '',
    seoKeywords: '',
    seoDescription: ''
  },
  price: {
    price: 0,
    originalPrice: 0,
    vipPrice: 0,
    vipLevelRequired: 0,
    includeInVip: false
  },
  sales: {
    enableDistribution: false,
    distributionRate: 0,
    enableCoupon: false,
    enablePoints: false,
    pointsRate: 0
  },
  related: {
    relatedProducts: [] as number[],
    relatedCourses: [] as number[],
    relatedBooks: [] as number[],
    relatedCircles: [] as number[]
  },
  advanced: {
    allowComment: true,
    commentAudit: true,
    allowDownload: false,
    validityPeriod: 0,
    maxStudents: 0,
    sort: 0
  }
})

// 初始化设置数据
function initSettingsData() {
  if (props.course.settings) {
    // 基础设置
    settingsForm.basic.intro = props.course.intro || ''
    settingsForm.basic.detail = props.course.detail || ''
    settingsForm.basic.tags = props.course.settings.relatedSettings?.keywords || []
    settingsForm.basic.seoTitle = props.course.settings.seoTitle || ''
    settingsForm.basic.seoKeywords = props.course.settings.seoKeywords || ''
    settingsForm.basic.seoDescription = props.course.settings.seoDescription || ''
    
    // 价格设置
    settingsForm.price.price = props.course.price || 0
    settingsForm.price.originalPrice = props.course.originalPrice || 0
    settingsForm.price.vipPrice = props.course.vipPrice || 0
    settingsForm.price.vipLevelRequired = props.course.vipLevelRequired || 0
    settingsForm.price.includeInVip = props.course.settings.includeInVip || false
    
    // 销售设置
    settingsForm.sales.enableDistribution = props.course.settings.enableDistribution || false
    settingsForm.sales.distributionRate = props.course.settings.distributionRate || 0
    settingsForm.sales.enableCoupon = props.course.settings.enableCoupon || false
    settingsForm.sales.enablePoints = props.course.settings.enablePoints || false
    settingsForm.sales.pointsRate = props.course.settings.pointsRate || 0
    
    // 关联设置
    settingsForm.related.relatedProducts = props.course.settings.relatedSettings?.relatedProducts || []
    settingsForm.related.relatedCourses = props.course.settings.relatedSettings?.relatedCourses || []
    settingsForm.related.relatedBooks = props.course.settings.relatedSettings?.relatedBooks || []
    settingsForm.related.relatedCircles = props.course.settings.relatedSettings?.relatedCircles || []
    
    // 高级设置
    settingsForm.advanced.allowComment = props.course.settings.allowComment !== false
    settingsForm.advanced.commentAudit = props.course.settings.commentAudit !== false
    settingsForm.advanced.allowDownload = props.course.settings.allowDownload || false
    settingsForm.advanced.validityPeriod = props.course.settings.validityPeriod || 0
    settingsForm.advanced.maxStudents = props.course.settings.maxStudents || 0
    settingsForm.advanced.sort = props.course.settings.sort || 0
  }
}

// 添加标签
function handleAddTag() {
  if (newTag.value && !settingsForm.basic.tags.includes(newTag.value)) {
    settingsForm.basic.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 移除标签
function handleRemoveTag(index: number) {
  settingsForm.basic.tags.splice(index, 1)
}

// 保存设置
function handleSaveSettings() {
  // 构建更新后的课程数据
  const updatedCourse = {
    ...props.course,
    intro: settingsForm.basic.intro,
    detail: settingsForm.basic.detail,
    price: settingsForm.price.price,
    originalPrice: settingsForm.price.originalPrice,
    vipPrice: settingsForm.price.vipPrice,
    vipLevelRequired: settingsForm.price.vipLevelRequired,
    settings: {
      ...props.course.settings,
      includeInVip: settingsForm.price.includeInVip,
      enableDistribution: settingsForm.sales.enableDistribution,
      distributionRate: settingsForm.sales.distributionRate,
      enableCoupon: settingsForm.sales.enableCoupon,
      enablePoints: settingsForm.sales.enablePoints,
      pointsRate: settingsForm.sales.pointsRate,
      seoTitle: settingsForm.basic.seoTitle,
      seoKeywords: settingsForm.basic.seoKeywords,
      seoDescription: settingsForm.basic.seoDescription,
      allowComment: settingsForm.advanced.allowComment,
      commentAudit: settingsForm.advanced.commentAudit,
      allowDownload: settingsForm.advanced.allowDownload,
      validityPeriod: settingsForm.advanced.validityPeriod,
      maxStudents: settingsForm.advanced.maxStudents,
      sort: settingsForm.advanced.sort,
      relatedSettings: {
        keywords: settingsForm.basic.tags,
        relatedProducts: settingsForm.related.relatedProducts,
        relatedCourses: settingsForm.related.relatedCourses,
        relatedBooks: settingsForm.related.relatedBooks,
        relatedCircles: settingsForm.related.relatedCircles
      }
    }
  }
  
  emit('update:course', updatedCourse)
  ElMessage.success('设置保存成功')
}

// 重置设置
function handleResetSettings() {
  initSettingsData()
  ElMessage.success('设置已重置')
}

// 监听课程数据变化
watch(() => props.course, () => {
  initSettingsData()
}, { deep: true, immediate: true })
</script>

<style scoped lang="scss">
.course-settings {
  .settings-tabs {
    margin-bottom: 24px;

    .el-tabs__header {
      margin-bottom: 24px;
    }
  }

  .settings-form {
    max-width: 800px;
    margin-bottom: 32px;

    .el-form-item {
      margin-bottom: 20px;
    }

    .tag-input {
      width: 300px;
      margin-top: 8px;
    }

    .product-select,
    .course-select,
    .book-select,
    .circle-select {
      width: 100%;
    }
  }

  .settings-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }
}
</style>
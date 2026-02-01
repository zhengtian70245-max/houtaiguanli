<template>
  <div class="course-settings">
    <!-- 设置选项卡 -->
    <a-tabs v-model:activeKey="activeSettingTab" class="settings-tabs">
      <a-tab-pane key="basic" title="基础设置">
        <a-form :model="settingsForm.basic" label-width="120px" class="settings-form">
          <a-form-item label="课程简介">
            <a-input
              v-model="settingsForm.basic.intro"
              type="textarea"
              :rows="4"
              placeholder="请输入课程简介"
            />
          </a-form-item>
          <a-form-item label="课程详情">
            <a-input
              v-model="settingsForm.basic.detail"
              type="textarea"
              :rows="8"
              placeholder="请输入课程详情"
            />
          </a-form-item>
          <a-form-item label="课程标签">
            <a-tag
              v-for="(tag, index) in settingsForm.basic.tags"
              :key="index"
              :closable="true"
              @close="handleRemoveTag(index)"
            >
              {{ tag }}
            </a-tag>
            <a-input
              v-model="newTag"
              class="tag-input"
              placeholder="输入标签后按回车"
              @keyup.enter="handleAddTag"
            />
          </a-form-item>
          <a-form-item label="SEO标题">
            <a-input v-model="settingsForm.basic.seoTitle" placeholder="请输入SEO标题" />
          </a-form-item>
          <a-form-item label="SEO关键词">
            <a-input v-model="settingsForm.basic.seoKeywords" placeholder="请输入SEO关键词，多个用逗号分隔" />
          </a-form-item>
          <a-form-item label="SEO描述">
            <a-input
              v-model="settingsForm.basic.seoDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入SEO描述"
            />
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="price" title="价格设置">
        <a-form :model="settingsForm.price" label-width="120px" class="settings-form">
          <a-form-item label="课程价格">
            <a-input-number
              v-model="settingsForm.price.price"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入价格"
            />
          </a-form-item>
          <a-form-item label="原价">
            <a-input-number
              v-model="settingsForm.price.originalPrice"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入原价"
            />
          </a-form-item>
          <a-form-item label="会员价格">
            <a-input-number
              v-model="settingsForm.price.vipPrice"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入会员价格"
            />
          </a-form-item>
          <a-form-item label="所需会员等级">
            <a-select v-model="settingsForm.price.vipLevelRequired" placeholder="请选择所需会员等级">
              <a-option label="无限制" :value="0" />
              <a-option label="付费学员" :value="1" />
              <a-option label="终身学员" :value="2" />
              <a-option label="架构学套餐学员" :value="3" />
              <a-option label="全家福套餐学员" :value="4" />
              <a-option label="自动自发家族成员" :value="5" />
            </a-select>
          </a-form-item>
          <a-form-item label="是否参与会员免费">
            <a-switch v-model="settingsForm.price.includeInVip" />
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="sales" title="销售设置">
        <a-form :model="settingsForm.sales" label-width="120px" class="settings-form">
          <a-form-item label="是否开启分销">
            <a-switch v-model="settingsForm.sales.enableDistribution" />
          </a-form-item>
          <a-form-item label="分销佣金比例" v-if="settingsForm.sales.enableDistribution">
            <a-input-number
              v-model="settingsForm.sales.distributionRate"
              :min="0"
              :max="100"
              :precision="2"
              :step="0.1"
              placeholder="请输入佣金比例"
            >
              <template #suffix>%</template>
            </a-input-number>
          </a-form-item>
          <a-form-item label="是否开启优惠券">
            <a-switch v-model="settingsForm.sales.enableCoupon" />
          </a-form-item>
          <a-form-item label="是否开启积分抵扣">
            <a-switch v-model="settingsForm.sales.enablePoints" />
          </a-form-item>
          <a-form-item label="积分抵扣比例" v-if="settingsForm.sales.enablePoints">
            <a-input-number
              v-model="settingsForm.sales.pointsRate"
              :min="0"
              :max="100"
              :precision="2"
              :step="0.1"
              placeholder="请输入积分抵扣比例"
            >
              <template #suffix>%</template>
            </a-input-number>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="related" title="关联设置">
        <a-form :model="settingsForm.related" label-width="120px" class="settings-form">
          <a-form-item label="关联商品">
            <a-select
              v-model="settingsForm.related.relatedProducts"
              :multiple="true"
              placeholder="请选择关联商品"
              class="product-select"
            >
              <a-option label="商品1" :value="1" />
              <a-option label="商品2" :value="2" />
              <a-option label="商品3" :value="3" />
            </a-select>
          </a-form-item>
          <a-form-item label="关联课程">
            <a-select
              v-model="settingsForm.related.relatedCourses"
              :multiple="true"
              placeholder="请选择关联课程"
              class="course-select"
            >
              <a-option label="课程1" :value="1" />
              <a-option label="课程2" :value="2" />
              <a-option label="课程3" :value="3" />
            </a-select>
          </a-form-item>
          <a-form-item label="关联电子书">
            <a-select
              v-model="settingsForm.related.relatedBooks"
              :multiple="true"
              placeholder="请选择关联电子书"
              class="book-select"
            >
              <a-option label="电子书1" :value="1" />
              <a-option label="电子书2" :value="2" />
            </a-select>
          </a-form-item>
          <a-form-item label="关联圈子">
            <a-select
              v-model="settingsForm.related.relatedCircles"
              :multiple="true"
              placeholder="请选择关联圈子"
              class="circle-select"
            >
              <a-option label="圈子1" :value="1" />
              <a-option label="圈子2" :value="2" />
            </a-select>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="advanced" title="高级设置">
        <a-form :model="settingsForm.advanced" label-width="120px" class="settings-form">
          <a-form-item label="允许评论">
            <a-switch v-model="settingsForm.advanced.allowComment" />
          </a-form-item>
          <a-form-item label="评论审核">
            <a-switch v-model="settingsForm.advanced.commentAudit" />
          </a-form-item>
          <a-form-item label="允许下载">
            <a-switch v-model="settingsForm.advanced.allowDownload" />
          </a-form-item>
          <a-form-item label="学习有效期">
            <a-select v-model="settingsForm.advanced.validityPeriod" placeholder="请选择学习有效期">
              <a-option label="永久有效" :value="0" />
              <a-option label="30天" :value="30" />
              <a-option label="90天" :value="90" />
              <a-option label="180天" :value="180" />
              <a-option label="365天" :value="365" />
            </a-select>
          </a-form-item>
          <a-form-item label="最大学习人数">
            <a-input-number
              v-model="settingsForm.advanced.maxStudents"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="0表示无限制"
            />
          </a-form-item>
          <a-form-item label="课程排序">
            <a-input-number
              v-model="settingsForm.advanced.sort"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="请输入排序值"
            />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <!-- 操作按钮 -->
    <div class="settings-actions">
      <a-button type="primary" @click="handleSaveSettings">
        <template #icon>
          <icon-check />
        </template>
        保存设置
      </a-button>
      <a-button @click="handleResetSettings">
        <template #icon>
          <icon-refresh />
        </template>
        重置
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconCheck,
  IconRefresh
} from '@arco-design/web-vue/es/icon'

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
    settingsForm.basic.tags = [...(props.course.settings.relatedSettings?.keywords || [])]
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
    settingsForm.related.relatedProducts = [...(props.course.settings.relatedSettings?.relatedProducts || [])]
    settingsForm.related.relatedCourses = [...(props.course.settings.relatedSettings?.relatedCourses || [])]
    settingsForm.related.relatedBooks = [...(props.course.settings.relatedSettings?.relatedBooks || [])]
    settingsForm.related.relatedCircles = [...(props.course.settings.relatedSettings?.relatedCircles || [])]
    
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
  Message.success('设置保存成功')
}

// 重置设置
function handleResetSettings() {
  initSettingsData()
  Message.success('设置已重置')
}
</script>

<style scoped lang="scss">
.course-settings {
  .settings-tabs {
    margin-bottom: 24px;

    .arco-tabs-header {
      margin-bottom: 24px;
    }
  }

  .settings-form {
    max-width: 800px;
    margin-bottom: 32px;

    .arco-form-item {
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
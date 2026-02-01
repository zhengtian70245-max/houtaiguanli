<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户详情</h2>
    </div>
    <div class="page-content">
      <a-row :gutter="[24, 24]">
        <a-col :span="8">
          <a-card>
            <template #title>
              <div class="card-header">
                <span>基本信息</span>
              </div>
            </template>
            <div class="user-avatar">
              <a-avatar :size="100" :style="{ backgroundColor: '#165dff' }">
                {{ userInfo?.nickname?.charAt(0) }}
              </a-avatar>
            </div>
            <div class="user-info">
              <p><strong>昵称：</strong>{{ userInfo?.nickname }}</p>
              <p><strong>手机号：</strong>{{ userInfo?.phone }}</p>
              <p><strong>会员等级：</strong>
                <a-tag :color="getLevelColor(userInfo?.level)">{{ getLevelText(userInfo?.level) }}</a-tag>
              </p>
              <p><strong>VIP到期时间：</strong>{{ userInfo?.vipExpireDate || '未开通' }}</p>
              <p><strong>推荐人：</strong>{{ userInfo?.recommender || '无' }}</p>
              <p><strong>积分：</strong>{{ userInfo?.points }}</p>
              <p><strong>账户余额：</strong>¥{{ userInfo?.balance.toFixed(2) }}</p>
              <p><strong>注册时间：</strong>{{ userInfo?.createTime }}</p>
              <p><strong>最后登录时间：</strong>{{ userInfo?.lastLoginTime }}</p>
            </div>
          </a-card>
        </a-col>
        <a-col :span="16">
          <a-card>
            <template #title>
              <div class="card-header">
                <span>数据统计</span>
              </div>
            </template>
            <a-row :gutter="[16, 16]">
              <a-col :span="6" v-for="stat in stats" :key="stat.key">
                <div class="stat-item">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </a-col>
            </a-row>
          </a-card>

          <a-card style="margin-top: 24px;">
            <template #title>
              <div class="card-header">
                <span>VIP信息</span>
                <a-button type="primary" size="small">续费</a-button>
              </div>
            </template>
            <a-table
              :data="vipRecords"
              :pagination="false"
              row-key="startDate"
            >
              <template #columns>
                <a-table-column title="等级" data-index="level" :width="120" align="center" />
                <a-table-column title="时长" data-index="duration" :width="120" align="center" />
                <a-table-column title="价格" data-index="price" :width="120" align="right" />
                <a-table-column title="开始时间" data-index="startDate" :width="160" />
                <a-table-column title="到期时间" data-index="expireDate" :width="160" />
              </template>
            </a-table>
          </a-card>

          <a-card style="margin-top: 24px;">
            <template #title>
              <div class="card-header">
                <span>学习记录</span>
                <a-button type="primary" size="small">查看全部</a-button>
              </div>
            </template>
            <a-table
              :data="learningRecords"
              :pagination="false"
              row-key="courseName"
            >
              <template #columns>
                <a-table-column title="课程名称" data-index="courseName" :width="200" />
                <a-table-column title="进度" :width="180" align="center">
                  <template #cell="{ record }">
                    <div class="progress-container">
                      <a-progress :percent="record.progress" :stroke-width="10" :show-text="false" />
                      <span class="progress-text">{{ record.progress }}%</span>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column title="观看时长" data-index="watchTime" :width="120" align="center" />
                <a-table-column title="状态" :width="120" align="center">
                  <template #cell="{ record }">
                    <a-tag :color="record.status ? 'green' : 'blue'">{{ record.status ? '已完成' : '学习中' }}</a-tag>
                  </template>
                </a-table-column>
                <a-table-column title="完成时间" data-index="completeTime" :width="160" />
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const userInfo = ref({
  nickname: '张三',
  phone: '13800138000',
  level: 3,
  vipExpireDate: '2024-12-31',
  recommender: '李四',
  points: 1256,
  balance: 896.5,
  createTime: '2023-01-15 10:30:00',
  lastLoginTime: '2024-01-31 15:45:00'
})

const stats = ref([
  { key: 'orders', label: '订单数量', value: '15' },
  { key: 'totalAmount', label: '总消费金额', value: '¥2,896' },
  { key: 'courses', label: '学习课程数', value: '8' },
  { key: 'completedCourses', label: '完成课程数', value: '6' },
  { key: 'activities', label: '活动报名数', value: '3' },
  { key: 'signInTimes', label: '签到次数', value: '45' },
  { key: 'promotionCount', label: '推广人数', value: '25' },
  { key: 'promotionIncome', label: '推广收益', value: '¥1,256' }
])

const vipRecords = ref([
  { level: 'VIP会员', duration: '1年', price: '¥398', startDate: '2023-01-15', expireDate: '2024-01-15' },
  { level: 'VIP会员', duration: '1年', price: '¥398', startDate: '2024-01-15', expireDate: '2024-12-31' }
])

const learningRecords = ref([
  { courseName: '家庭教育基础', progress: 85, watchTime: '2小时30分', status: 0, completeTime: '' },
  { courseName: '儿童心理学', progress: 100, watchTime: '5小时20分', status: 1, completeTime: '2024-01-20 14:30:00' },
  { courseName: '亲子沟通技巧', progress: 92, watchTime: '4小时15分', status: 0, completeTime: '' },
  { courseName: '家长情绪管理', progress: 100, watchTime: '3小时50分', status: 1, completeTime: '2024-01-15 16:45:00' },
  { courseName: '学习方法指导', progress: 75, watchTime: '3小时00分', status: 0, completeTime: '' }
])

function getLevelColor(level: number): string {
  const colorMap: Record<number, string> = {
    1: 'blue',
    2: 'primary',
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

onMounted(() => {
  const userId = route.params.id
  console.log('用户ID:', userId)
})
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.user-info {
  padding: 10px 0;

  p {
    margin-bottom: 12px;
    line-height: 1.6;

    strong {
      color: var(--arco-text-color-2);
      margin-right: 8px;
    }
  }
}

.stat-item {
  padding: 20px;
  background: var(--arco-bg-color-2);
  border-radius: 8px;
  text-align: center;

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--arco-text-color-1);
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--arco-text-color-3);
  }
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;

  .progress-text {
    font-size: 14px;
    color: var(--arco-text-color-1);
    min-width: 40px;
  }
}
</style>
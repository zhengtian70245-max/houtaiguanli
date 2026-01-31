<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户详情</h2>
    </div>
    <div class="page-content">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
              </div>
            </template>
            <div class="user-avatar">
              <el-avatar :size="100">
                {{ userInfo?.nickname?.charAt(0) }}
              </el-avatar>
            </div>
            <div class="user-info">
              <p><strong>昵称：</strong>{{ userInfo?.nickname }}</p>
              <p><strong>手机号：</strong>{{ userInfo?.phone }}</p>
              <p><strong>会员等级：</strong>
                <el-tag :type="getLevelType(userInfo?.level)">{{ getLevelText(userInfo?.level) }}</el-tag>
              </p>
              <p><strong>VIP到期时间：</strong>{{ userInfo?.vipExpireDate || '未开通' }}</p>
              <p><strong>推荐人：</strong>{{ userInfo?.recommender || '无' }}</p>
              <p><strong>积分：</strong>{{ userInfo?.points }}</p>
              <p><strong>账户余额：</strong>¥{{ userInfo?.balance.toFixed(2) }}</p>
              <p><strong>注册时间：</strong>{{ userInfo?.createTime }}</p>
              <p><strong>最后登录时间：</strong>{{ userInfo?.lastLoginTime }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>数据统计</span>
              </div>
            </template>
            <el-row :gutter="16">
              <el-col :span="6" v-for="stat in stats" :key="stat.key">
                <div class="stat-item">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <el-card style="margin-top: 24px;">
            <template #header>
              <div class="card-header">
                <span>VIP信息</span>
                <el-button type="primary" size="small">续费</el-button>
              </div>
            </template>
            <el-table :data="vipRecords" style="width: 100%">
              <el-table-column prop="level" label="等级" width="120" align="center" />
              <el-table-column prop="duration" label="时长" width="120" align="center" />
              <el-table-column prop="price" label="价格" width="120" align="right" />
              <el-table-column prop="startDate" label="开始时间" width="160" />
              <el-table-column prop="expireDate" label="到期时间" width="160" />
            </el-table>
          </el-card>

          <el-card style="margin-top: 24px;">
            <template #header>
              <div class="card-header">
                <span>学习记录</span>
                <el-button type="primary" size="small">查看全部</el-button>
              </div>
            </template>
            <el-table :data="learningRecords" style="width: 100%">
              <el-table-column prop="courseName" label="课程名称" width="200" />
              <el-table-column prop="progress" label="进度" width="120" align="center">
                <template #default="{ row }">
                  <el-progress :percentage="row.progress" :stroke-width="10" :show-text="false" />
                  <span style="margin-left: 8px;">{{ row.progress }}%</span>
                </template>
              </el-table-column>
              <el-table-column prop="watchTime" label="观看时长" width="120" align="center" />
              <el-table-column prop="status" label="状态" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status ? 'success' : 'info'">
                    {{ row.status ? '已完成' : '学习中' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="completeTime" label="完成时间" width="160" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
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

function getLevelType(level: number): string {
  const typeMap: Record<number, string> = {
    1: 'info',
    2: 'primary',
    3: 'warning',
    4: 'danger'
  }
  return typeMap[level] || 'info'
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
      color: #606266;
      margin-right: 8px;
    }
  }
}

.stat-item {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #909399;
  }
}
</style>
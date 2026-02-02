<template>
  <div class="page-container">
    <div class="page-header">
      <h2>订单详情</h2>
      <div class="page-actions">
        <a-button @click="$router.go(-1)">返回</a-button>
      </div>
    </div>
    <div class="page-content">
      <a-card class="order-card" :body-style="{ padding: '20px' }">
        <div class="order-header">
          <div class="order-info">
            <div class="order-id">订单号：{{ orderInfo.id }}</div>
            <div class="order-status" :class="orderInfo.status === 1 ? 'success' : 'danger'">
              <a-tag :color="orderInfo.status === 1 ? 'green' : 'red'">
                {{ orderInfo.status === 1 ? '已支付' : '未支付' }}
              </a-tag>
            </div>
          </div>
          <div class="order-price">
            ¥{{ orderInfo.price.toFixed(2) }}
          </div>
        </div>

        <div class="order-content">
          <div class="order-section">
            <div class="section-title">订单信息</div>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">用户昵称：</span>
                <span class="info-value">{{ orderInfo.nickname }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">手机号：</span>
                <span class="info-value">{{ orderInfo.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">创建时间：</span>
                <span class="info-value">{{ orderInfo.createTime }}</span>
              </div>
              <div class="info-item" v-if="orderInfo.payTime">
                <span class="info-label">支付时间：</span>
                <span class="info-value">{{ orderInfo.payTime }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">支付方式：</span>
                <span class="info-value">{{ orderInfo.payMethod === 1 ? '微信支付' : '支付宝' }}</span>
              </div>
              <div class="info-item" v-if="orderInfo.payId">
                <span class="info-label">支付单号：</span>
                <span class="info-value">{{ orderInfo.payId }}</span>
              </div>
            </div>
          </div>

          <div class="order-section">
            <div class="section-title">订单商品</div>
            <a-table :data="orderInfo.items" :bordered="true" :stripe="true">
              <template #columns>
                <a-table-column title="商品名称" data-index="name" :min-width="200" />
                <a-table-column title="单价" :width="100" align="right">
                  <template #cell="{ record }">
                    ¥{{ record.price.toFixed(2) }}
                  </template>
                </a-table-column>
                <a-table-column title="数量" :width="80" align="center" data-index="quantity" />
                <a-table-column title="小计" :width="100" align="right">
                  <template #cell="{ record }">
                    ¥{{ record.subtotal.toFixed(2) }}
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>

          <div class="order-section">
            <div class="section-title">分销信息</div>
            <div class="distributor-info">
              <a-table :data="orderInfo.distributor" :bordered="true" :stripe="true">
                <template #columns>
                  <a-table-column title="分销层级" :width="100" align="center" data-index="level" />
                  <a-table-column title="分销用户" :width="120" align="center" data-index="nickname" />
                  <a-table-column title="手机号" :width="130" align="center" data-index="phone" />
                  <a-table-column title="佣金" :width="120" align="right">
                    <template #cell="{ record }">
                      ¥{{ record.commission.toFixed(2) }}
                    </template>
                  </a-table-column>
                  <a-table-column title="佣金比例" :width="120" align="center">
                    <template #cell="{ record }">
                      {{ record.rate }}%
                    </template>
                  </a-table-column>
                </template>
              </a-table>
            </div>
          </div>

          <div class="order-footer">
            <div class="footer-info">
              <div class="total-info">
                商品总价：¥{{ orderInfo.price.toFixed(2) }}
              </div>
              <div class="total-price">
                实付金额：¥{{ orderInfo.price.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const route = useRoute()
const orderInfo = reactive({
  id: '20240101123456',
  price: 198,
  status: 1,
  nickname: '张三',
  phone: '13800138000',
  createTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  payTime: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString().split('T')[0],
  payMethod: Math.floor(Math.random() * 2) + 1,
  payId: 'pay' + Math.floor(Math.random() * 10000000000),
  items: [
    {
      id: 1,
      name: '课程名称1',
      price: 198,
      quantity: 1,
      subtotal: 198
    },
    {
      id: 2,
      name: '课程名称2',
      price: 398,
      quantity: 1,
      subtotal: 398
    }
  ],
  distributor: [
    {
      level: 1,
      nickname: '分销用户1',
      phone: '13800000001',
      commission: 10,
      rate: 10
    },
    {
      level: 2,
      nickname: '分销用户2',
      phone: '13800000002',
      commission: 5,
      rate: 5
    }
  ]
})

onMounted(() => {
  const orderId = route.params.id
  if (orderId) {
    orderInfo.id = `20240101${orderId}`
  }
})
</script>

<style scoped lang="scss">
.order-card {
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;

    .order-info {
      display: flex;
      align-items: center;

      .order-id {
        font-size: 18px;
        font-weight: bold;
        margin-right: 20px;
      }

      .order-status {
        .el-tag {
          font-size: 14px;
        }
      }
    }

    .order-price {
      font-size: 24px;
      font-weight: bold;
      color: #f56c6c;
    }
  }

  .order-content {
    padding: 20px 0;

    .order-section {
      margin-bottom: 20px;

      .section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #333;
        border-left: 4px solid #409eff;
        padding-left: 10px;
      }

      .info-list {
        padding: 20px;
        background: #f5f5f5;
        border-radius: 8px;

        .info-item {
          display: flex;
          margin-bottom: 12px;

          .info-label {
            width: 120px;
            color: #666;
          }

          .info-value {
            color: #333;
          }
        }
      }
    }
  }

  .order-footer {
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;

    .footer-info {
      display: flex;
      justify-content: flex-end;

      .total-info {
        margin-right: 30px;
        color: #666;
      }

      .total-price {
        font-size: 18px;
        font-weight: bold;
        color: #f56c6c;
      }
    }
  }
}

.page-actions {
  display: flex;
  gap: 10px;
}
</style>
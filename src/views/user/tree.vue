<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户推广树</h2>
      <el-button type="primary" size="small">导出推广树</el-button>
    </div>
    <div class="page-content">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>推广人信息</span>
              </div>
            </template>
            <div class="promoter-info">
              <el-avatar :size="80">
                {{ promoterInfo?.nickname?.charAt(0) }}
              </el-avatar>
              <div class="promoter-name">{{ promoterInfo?.nickname }}</div>
              <div class="promoter-level">
                <el-tag :type="getLevelType(promoterInfo?.level)">{{ getLevelText(promoterInfo?.level) }}</el-tag>
              </div>
              <div class="promoter-stats">
                <div class="stat-item">
                  <el-icon>
                    <UserFilled />
                  </el-icon>
                  <span>{{ promoterInfo?.promotionCount }}</span>
                </div>
                <div class="stat-item">
                  <el-icon>
                    <Coin />
                  </el-icon>
                  <span>¥{{ promoterInfo?.totalIncome.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </el-card>

          <el-card style="margin-top: 24px;">
            <template #header>
              <div class="card-header">
                <span>统计信息</span>
              </div>
            </template>
            <div class="stats-container">
              <div class="stats-item" v-for="stat in stats" :key="stat.key">
                <div class="stats-title">{{ stat.title }}</div>
                <div class="stats-value">{{ stat.value }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>推广树视图</span>
                <div class="expand-all">
                  <el-button type="text" size="small" @click="expandAll">展开全部</el-button>
                  <el-button type="text" size="small" @click="collapseAll">收起全部</el-button>
                </div>
              </div>
            </template>
            <div class="tree-container">
              <div class="tree-level" v-for="(level, index) in treeData" :key="index">
                <div class="level-title">第 {{ index + 1 }} 级</div>
                <div class="nodes-container">
                  <div class="tree-node" v-for="node in level.nodes" :key="node.id">
                    <div class="node-content" @click="viewNodeDetail(node)">
                      <el-avatar :size="48">
                        {{ node.nickname?.charAt(0) }}
                      </el-avatar>
                      <div class="node-info">
                        <div class="node-name">{{ node.nickname }}</div>
                        <div class="node-level">
                          <el-tag :size="small" :type="getLevelType(node.level)">{{ getLevelText(node.level) }}</el-tag>
                        </div>
                      </div>
                      <div class="node-stats">
                        <el-tag size="small" type="warning">¥{{ node.income.toFixed(2) }}</el-tag>
                      </div>
                      <div class="node-actions">
                        <el-button type="text" size="small" @click.stop="viewUserDetail(node)">详情</el-button>
                      </div>
                    </div>
                    <div v-if="node.children && node.children.length > 0" class="node-children">
                      <div class="tree-level" style="margin-left: 40px; margin-top: 20px;">
                        <div class="nodes-container">
                          <div class="tree-node" v-for="child in node.children" :key="child.id">
                            <div class="node-content" @click="viewNodeDetail(child)">
                              <el-avatar :size="36">
                                {{ child.nickname?.charAt(0) }}
                              </el-avatar>
                              <div class="node-info">
                                <div class="node-name" style="font-size: 12px;">{{ child.nickname }}</div>
                                <div class="node-level">
                                  <el-tag size="small" :type="getLevelType(child.level)">{{ getLevelText(child.level) }}</el-tag>
                                </div>
                              </div>
                              <div class="node-stats">
                                <el-tag size="small" type="warning">¥{{ child.income.toFixed(2) }}</el-tag>
                              </div>
                              <div class="node-actions">
                                <el-button type="text" size="small" @click.stop="viewUserDetail(child)">详情</el-button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card style="margin-top: 24px;">
        <template #header>
          <div class="card-header">
            <span>图例说明</span>
          </div>
        </template>
        <div class="legend-container">
          <div class="legend-item" v-for="item in legend" :key="item.key">
            <el-tag :type="item.type">{{ item.label }}</el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const promoterInfo = ref({
  nickname: '张三',
  level: 3,
  promotionCount: 25,
  totalIncome: 1256.8
})

const stats = ref([
  { key: 'level1', title: '一级推广人数', value: '15' },
  { key: 'level2', title: '二级推广人数', value: '8' },
  { key: 'level3', title: '三级推广人数', value: '2' },
  { key: 'totalPromotion', title: '总推广人数', value: '25' },
  { key: 'directIncome', title: '直接推广收益', value: '¥896.5' },
  { key: 'teamIncome', title: '团队奖励收益', value: '¥360.3' },
  { key: 'totalIncome', title: '总收益', value: '¥1,256.8' }
])

const treeData = ref([
  {
    level: 1,
    nodes: [
      {
        id: 2,
        nickname: '李四',
        level: 2,
        income: 256.8,
        children: [
          { id: 11, nickname: '王五', level: 1, income: 120.5 },
          { id: 12, nickname: '赵六', level: 1, income: 89.6 }
        ]
      },
      {
        id: 3,
        nickname: '钱七',
        level: 3,
        income: 312.5,
        children: [
          { id: 13, nickname: '孙八', level: 1, income: 98.7 },
          { id: 14, nickname: '周九', level: 2, income: 125.8 }
        ]
      }
    ]
  },
  {
    level: 2,
    nodes: [
      {
        id: 4,
        nickname: '吴十',
        level: 1,
        income: 189.6,
        children: [
          { id: 15, nickname: '郑十一', level: 1, income: 78.4 }
        ]
      },
      {
        id: 5,
        nickname: '冯十二',
        level: 2,
        income: 256.8,
        children: [
          { id: 16, nickname: '陈十三', level: 1, income: 65.2 }
        ]
      }
    ]
  }
])

const legend = ref([
  { key: 'level1', label: '普通用户', type: 'info' },
  { key: 'level2', label: '付费用户', type: 'primary' },
  { key: 'level3', label: 'VIP会员', type: 'warning' },
  { key: 'level4', label: '分销商', type: 'danger' }
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

function expandAll() {
  console.log('展开全部')
}

function collapseAll() {
  console.log('收起全部')
}

function viewNodeDetail(node: any) {
  console.log('查看节点详情:', node)
}

function viewUserDetail(node: any) {
  console.log('查看用户详情:', node)
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

  .expand-all {
    .el-button {
      margin-left: 8px;
    }
  }
}

.promoter-info {
  text-align: center;

  .promoter-name {
    font-size: 18px;
    font-weight: bold;
    margin: 8px 0;
  }

  .promoter-level {
    margin: 8px 0;
  }

  .promoter-stats {
    display: flex;
    justify-content: center;
    margin-top: 16px;

    .stat-item {
      display: flex;
      align-items: center;
      margin: 0 16px;

      .el-icon {
        margin-right: 4px;
        color: #409eff;
      }

      span {
        font-weight: bold;
        color: #333;
      }
    }
  }
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .stats-item {
    text-align: center;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 8px;

    .stats-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }

    .stats-value {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
  }
}

.tree-container {
  padding: 20px;

  .tree-level {
    margin-bottom: 40px;

    .level-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
      color: #333;
    }

    .nodes-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
  }

  .tree-node {
    .node-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: #f5f7fa;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #e6f7ff;
      }

      .node-info {
        margin-left: 12px;
        flex: 1;

        .node-name {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .node-level {
          .el-tag {
            margin: 0;
          }
        }
      }

      .node-stats {
        margin: 0 12px;
      }

      .node-actions {
        margin-left: 12px;
      }
    }

    .node-children {
      margin-top: 16px;
      border-left: 2px solid #e8e8e8;
      padding-left: 16px;

      .tree-node {
        margin-bottom: 12px;
      }
    }
  }
}

.legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .legend-item {
    display: flex;
    align-items: center;
    margin: 8px 0;
  }
}
</style>
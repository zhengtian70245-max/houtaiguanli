<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>zhengtian 管理后台</h2>
    </div>
    <div class="sidebar-content">
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-sub-menu index="/course">
          <template #title>
            <el-icon>
              <Reading />
            </el-icon>
            <span>课程管理</span>
          </template>
          <el-menu-item index="/course/list">
            <el-icon><Document /></el-icon>
            <span>课程列表</span>
          </el-menu-item>
          <el-menu-item index="/course/category">
            <el-icon><Folder /></el-icon>
            <span>课程分类</span>
          </el-menu-item>
          <el-menu-item index="/course/material">
            <el-icon><VideoCameraFilled /></el-icon>
            <span>素材库</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/column">
          <template #title>
            <el-icon>
              <CollectionTag />
            </el-icon>
            <span>专栏管理</span>
          </template>
          <el-menu-item index="/column/list">
            <el-icon><List /></el-icon>
            <span>专栏列表</span>
          </el-menu-item>
          <el-menu-item index="/column/category">
            <el-icon><Tickets /></el-icon>
            <span>专栏分类</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/activity">
          <template #title>
            <el-icon>
              <Calendar />
            </el-icon>
            <span>活动管理</span>
          </template>
          <el-menu-item index="/activity/list">活动列表</el-menu-item>
          <el-menu-item index="/activity/register">报名管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/order">
          <template #title>
            <el-icon>
              <PriceTag />
            </el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/order/list">订单列表</el-menu-item>
          <el-menu-item index="/order/refund">退款管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/vip">
          <template #title>
            <el-icon>
              <Present />
            </el-icon>
            <span>VIP会员管理</span>
          </template>
          <el-menu-item index="/vip/list">VIP列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/distributor">
          <template #title>
            <el-icon>
              <Share />
            </el-icon>
            <span>分销管理</span>
          </template>
          <el-menu-item index="/distributor/list">分销商列表</el-menu-item>
          <el-menu-item index="/distributor/withdraw">提现管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/statistics">
          <template #title>
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <span>财务统计</span>
          </template>
          <el-menu-item index="/statistics/sales">销售统计</el-menu-item>
          <el-menu-item index="/statistics/course">课程收入统计</el-menu-item>
          <el-menu-item index="/statistics/activity">活动收入统计</el-menu-item>
          <el-menu-item index="/statistics/vip">VIP收入统计</el-menu-item>
          <el-menu-item index="/statistics/distributor">分销佣金统计</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/statistics">
          <template #title>
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <span>运营统计</span>
          </template>
          <el-menu-item index="/statistics/user">用户统计</el-menu-item>
          <el-menu-item index="/statistics/distributor">分销商统计</el-menu-item>
          <el-menu-item index="/statistics/course">课程学习统计</el-menu-item>
          <el-menu-item index="/statistics/activity">活动参与统计</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/system">
          <template #title>
            <el-icon>
              <Setting />
            </el-icon>
            <span>系统配置</span>
          </template>
          <el-menu-item index="/system/base-config">基础配置</el-menu-item>
          <el-menu-item index="/system/vip-config">VIP配置</el-menu-item>
          <el-menu-item index="/system/distributor-config">分销配置</el-menu-item>
          <el-menu-item index="/system/sms-config">短信配置</el-menu-item>
          <el-menu-item index="/system/payment-config">支付配置</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/user">
          <template #title>
            <el-icon>
              <User />
            </el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/user/list">用户列表</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="sidebar-footer">
      <el-button
        :icon="isCollapse ? 'Expand' : 'Fold'"
        circle
        @click="toggleCollapse"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Setting,
  User,
  Reading,
  Calendar,
  PriceTag,
  Present,
  Share,
  DataAnalysis,
  VideoCameraFilled,
  Document,
  Folder
} from '@element-plus/icons-vue'

const router = useRouter()
const isCollapse = ref(false)

function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 220px;
  height: 100vh;
  background: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  &.collapse {
    width: 60px;
  }

  .sidebar-header {
    padding: 20px;
    text-align: center;

    h2 {
      font-size: 18px;
      color: #fff;
      margin: 0;
    }
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;

    .el-menu {
      background: #001529;

      .el-sub-menu {
        .el-icon {
          color: #fff;
        }
      }

      .el-menu-item {
        .el-icon {
          color: #fff;
        }

        &.is-active {
          background: #1890ff;
          color: #ffd04b;
        }
      }
    }
  }

  .sidebar-footer {
    padding: 10px;
    text-align: center;

    .el-button {
      background: #1890ff;
      border: none;

      &:hover {
        background: #40a9ff;
      }
    }
  }
}
</style>
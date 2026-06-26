<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app.store'
import HomeComponent from '@/components/home/HomeComponent.vue'
import FoodCategory from '@/components/food/FoodCategory.vue'
import PageOrderList from '@/components/order/PageOrderList.vue'
import MineComponent from '@/components/mine/MineComponent.vue'

const appStore = useAppStore()
const currentTab = ref(0)
const isFoodCategoryOnShow = ref(false)

const tabs = [
  { name: '首页', icon: 'home' },
  { name: '点餐', icon: 'food' },
  { name: '订单', icon: 'order' },
  { name: '我的', icon: 'mine' }
]

watch(currentTab, (newVal, oldVal) => {
  appStore.setSelectedIndex(newVal)
  if (oldVal !== 1) {
    // 离开点餐tab
    isFoodCategoryOnShow.value = false
  }
})

function onTabChange(index: number) {
  currentTab.value = index
  if (index === 1) {
    // 切换到点餐tab时触发
    setTimeout(() => {
      isFoodCategoryOnShow.value = true
    }, 50)
  }
}

onMounted(() => {
  currentTab.value = appStore.selectedIndex || 1
  if (currentTab.value === 1) {
    isFoodCategoryOnShow.value = true
  }
})
</script>

<template>
  <view class="main-container">
    <!-- 页面内容区 -->
    <view class="page-content">
      <HomeComponent v-if="currentTab === 0" />
      <FoodCategory v-if="currentTab === 1" :is-food-category-on-show="isFoodCategoryOnShow" />
      <PageOrderList v-if="currentTab === 2" />
      <MineComponent v-if="currentTab === 3" />
    </view>

    <!-- 底部导航栏 -->
    <view class="tab-bar">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="onTabChange(index)"
      >
        <image
          :src="index === 0 ? '/static/ic_home_new.svg' : index === 1 ? '/static/ic_food_new.svg' : index === 2 ? '/static/ic_order_new.svg' : '/static/ic_mine_new.svg'"
          class="tab-icon-img"
        />
        <text class="tab-name">{{ tab.name }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow: hidden;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

.tab-icon-img {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}

.tab-name {
  font-size: 11px;
  color: #999;
}

.tab-item.active .tab-name {
  color: #FF6B35;
  font-weight: bold;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { useShopStore } from '@/stores/shop.store'
import { FoodService } from '@/services/FoodService'
import { ToastUtil } from '@/utils/ToastUtil'
import { getImageUrl } from '@/constants/api'
import type { FoodItem, FoodCategory as FoodCategoryType } from '@/models/food.types'
import type { Shop } from '@/models/shop.types'
import FoodRecommendCard from '@/components/food/FoodRecommendCard.vue'
import BuyNumControl from '@/components/food/BuyNumControl.vue'
import FoodSpecDrawer from '@/components/food/FoodSpecDrawer.vue'

const cartStore = useCartStore()
const shopStore = useShopStore()

const props = defineProps<{
  isFoodCategoryOnShow: boolean
}>()

const currentIndex = ref(0)
const categories = ref<FoodCategoryType[]>([])
const categoryFoods = ref<{ category: string; list: FoodItem[] }[]>([])
const loading = ref(false)
const showSpecDrawer = ref(false)
const selectedFood = ref<FoodItem | null>(null)

const foodIds = computed(() => Object.keys(cartStore.buyFoods))
const currentShop = computed(() => shopStore.currentShop)

onMounted(() => {
  loadData()
})

// 监听店铺变化，重新加载数据
watch(() => shopStore.currentShop, () => {
  if (shopStore.currentShop) {
    loadData()
  }
}, { deep: true })

/** 加载分类和食品数据 */
async function loadData() {
  loading.value = true
  try {
    // 获取当前店铺
    if (shopStore.shops.length === 0) {
      await shopStore.fetchShops()
    }
    
    // 如果没有选择店铺，默认选择第一个
    if (!shopStore.currentShop && shopStore.shops.length > 0) {
      shopStore.setCurrentShop(shopStore.shops[0])
    }

    if (shopStore.currentShop) {
      cartStore.setChooseShop(shopStore.currentShop.id)
      const foodsByCategory = await FoodService.getFoodsByCategory(shopStore.currentShop.id)
      categoryFoods.value = foodsByCategory.map(item => ({
        category: item.categoryName,
        list: item.foods
      }))

      categories.value = await FoodService.getCategories(shopStore.currentShop.id)
    }
  } catch (e) {
    console.error('加载食品数据失败:', e)
    ToastUtil.showError('加载失败')
  } finally {
    loading.value = false
  }
}

/** 跳转到店铺列表 */
function goToShopList() {
  uni.navigateTo({ url: '/pages/shop/shop-list' })
}

/** 点击食品项 - 显示规格选择 */
function onFoodClick(food: FoodItem) {
  if (food.specs && food.specs.length > 1) {
    selectedFood.value = food
    showSpecDrawer.value = true
  } else {
    addToCart(food)
  }
}

/** 添加到购物车 */
function addToCart(food: FoodItem, spec?: any) {
  const item = {
    ...food,
    buyNum: 1,
    specId: spec?.id || (food.specs?.[0]?.id || ''),
    specName: spec?.name || (food.specs?.[0]?.name || ''),
    selectedSpecs: spec ? { [spec.id]: spec.name } : {}
  }
  cartStore.addToCart(item)
  ToastUtil.showSuccess(`已添加 ${food.name}`)
}

/** 规格选择确认 */
function onSpecConfirm(spec: any) {
  showSpecDrawer.value = false
  if (selectedFood.value) {
    addToCart(selectedFood.value, spec)
  }
}

/** 规格选择取消 */
function onSpecCancel() {
  showSpecDrawer.value = false
  selectedFood.value = null
}
</script>

<template>
  <view class="food-category-container">
    <!-- 顶部店铺信息 -->
    <view class="shop-header" v-if="currentShop" @click="goToShopList">
      <image :src="getImageUrl(currentShop.logo)" class="shop-logo" mode="aspectFill" />
      <view class="shop-info">
        <view class="shop-name-row">
          <text class="shop-name">{{ currentShop.name }}</text>
          <image src="/static/ic_public_arrow_right.svg" class="arrow-icon" />
        </view>
        <text class="shop-desc">评分 {{ currentShop.rating }} | 月售 {{ currentShop.monthlySales }}</text>
      </view>
    </view>

    <view class="category-main">
      <!-- 左侧分类栏 -->
      <scroll-view scroll-y class="category-sidebar" :style="{ height: 'calc(100vh - 160px)' }">
        <view
          v-for="(cat, idx) in categories"
          :key="cat.id"
          class="sidebar-item"
          :class="{ active: currentIndex === idx }"
          @click="currentIndex = idx"
        >
          <text class="sidebar-text">{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧菜品列表 -->
      <scroll-view
        scroll-y
        class="food-list"
        :style="{ height: 'calc(100vh - 160px)' }"
        @scrolltolower="loadData"
      >
        <view v-if="loading" class="loading-box">
          <text>加载中...</text>
        </view>

        <view v-for="(group, catIdx) in categoryFoods" :key="catIdx">
          <text class="category-title">{{ group.category }}</text>
          <view
            v-for="food in group.list"
            :key="food.id"
            class="food-item"
            @click="onFoodClick(food)"
          >
            <image :src="getImageUrl(food.image)" class="food-image" mode="aspectFill" />
            <view class="food-info">
              <text class="food-name">{{ food.name }}</text>
              <text class="food-desc">{{ food.description }}</text>
              <view class="food-bottom">
                <view class="food-price-box">
                  <text class="food-price">¥{{ food.price }}</text>
                  <text class="food-original" v-if="food.originalPrice > food.price">¥{{ food.originalPrice }}</text>
                </view>
                <BuyNumControl
                  :food-id="food.id"
                  :buy-num="cartStore.getBuyNum(food.id)"
                  @increase="addToCart(food)"
                  @decrease="cartStore.decreaseQuantity(food.id)"
                />
              </view>
              <text class="food-sales">月售 {{ food.monthlySales }}</text>
            </view>
          </view>
        </view>

        <view v-if="!loading && categoryFoods.length === 0" class="empty-box">
          <text>暂无菜品</text>
        </view>
      </scroll-view>
    </view>

    <!-- 购物车固定栏 -->
    <view class="cart-footer" v-if="cartStore.totalItems > 0" @click="uni.navigateTo({ url: '/pages/order/order-preview' })">
      <view class="cart-badge">{{ cartStore.totalItems }}</view>
      <text class="cart-total">¥{{ cartStore.totalPrice }}</text>
      <text class="cart-btn">去结算</text>
    </view>

    <!-- 规格选择抽屉 -->
    <FoodSpecDrawer
      v-if="showSpecDrawer && selectedFood"
      :food="selectedFood"
      :visible="showSpecDrawer"
      @confirm="onSpecConfirm"
      @cancel="onSpecCancel"
    />
  </view>
</template>

<style lang="scss" scoped>
.food-category-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
}

.shop-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  .shop-logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    margin-right: 12px;
  }

  .shop-info {
    display: flex;
    flex-direction: column;
    flex: 1;

    .shop-name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .shop-name {
        font-size: 16px;
        font-weight: bold;
      }

      .arrow-icon {
        width: 16px;
        height: 16px;
      }
    }

    .shop-desc {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
    }
  }
}

.category-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.category-sidebar {
  width: 80px;
  background-color: #ffffff;
  flex-shrink: 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 8px;

  .sidebar-text {
    font-size: 13px;
    color: #666;
  }
}

.sidebar-item.active {
  background-color: #f5f5f5;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    background-color: #FF6B35;
    border-radius: 2px;
  }

  .sidebar-text {
    color: #FF6B35;
    font-weight: bold;
  }
}

.food-list {
  flex: 1;
  padding: 0 12px;
}

.category-title {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  padding: 12px 0 8px;
}

.food-item {
  display: flex;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 10px;

  .food-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .food-info {
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .food-name {
    font-size: 15px;
    font-weight: bold;
    color: #333;
  }

  .food-desc {
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .food-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .food-price-box {
    display: flex;
    align-items: baseline;
  }

  .food-price {
    font-size: 18px;
    color: #FF6B35;
    font-weight: bold;
  }

  .food-original {
    font-size: 12px;
    color: #ccc;
    text-decoration: line-through;
    margin-left: 6px;
  }

  .food-sales {
    font-size: 11px;
    color: #bbb;
  }
}

.loading-box, .empty-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

.cart-footer {
  display: flex;
  align-items: center;
  height: 50px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  padding: 0 16px;
  color: #ffffff;

  .cart-badge {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: #ffffff;
    color: #FF6B35;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }

  .cart-total {
    font-size: 18px;
    font-weight: bold;
    flex: 1;
  }

  .cart-btn {
    font-size: 15px;
    font-weight: bold;
    padding: 6px 16px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
  }
}
</style>

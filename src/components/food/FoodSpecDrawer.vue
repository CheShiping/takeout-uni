<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FoodItem, FoodSpec } from '@/models/food.types'
import { ToastUtil } from '@/utils/ToastUtil'

const props = defineProps<{
  food: FoodItem
  visible: boolean
}>()

const emit = defineEmits<{
  confirm: [spec: FoodSpec]
  cancel: []
}>()

const selectedSpec = ref<FoodSpec | null>(null)
const buyNum = ref(1)

const totalPrice = computed(() => {
  if (selectedSpec.value) {
    return (selectedSpec.value.price * buyNum.value).toFixed(2)
  }
  return '0.00'
})

function selectSpec(spec: FoodSpec) {
  selectedSpec.value = spec
}

function increaseNum() {
  buyNum.value++
}

function decreaseNum() {
  if (buyNum.value > 1) {
    buyNum.value--
  }
}

function onConfirm() {
  if (!selectedSpec.value && props.food.specs.length > 0) {
    selectedSpec.value = props.food.specs[0]
  }
  if (!selectedSpec.value) {
    ToastUtil.showMessage('请选择规格')
    return
  }
  emit('confirm', {
    ...selectedSpec.value,
    buyNum: buyNum.value
  } as any)
}
</script>

<template>
  <view class="spec-drawer-backdrop" v-if="visible" @click="emit('cancel')">
    <view class="spec-drawer" @click.stop>
      <view class="drawer-header">
        <text class="drawer-title">选择规格</text>
        <text class="drawer-close" @click="emit('cancel')">✕</text>
      </view>

      <view class="food-basic">
        <text class="food-basic-name">{{ food.name }}</text>
        <text class="food-basic-desc">{{ food.description }}</text>
      </view>

      <!-- 规格列表 -->
      <view class="spec-section" v-if="food.specs && food.specs.length > 1">
        <text class="section-label">规格</text>
        <view class="spec-grid">
          <view
            v-for="spec in food.specs"
            :key="spec.id"
            class="spec-item"
            :class="{ active: selectedSpec?.id === spec.id }"
            @click="selectSpec(spec)"
          >
            <text class="spec-name">{{ spec.name }}</text>
            <text class="spec-price">¥{{ spec.price }}</text>
          </view>
        </view>
      </view>

      <!-- 数量选择 -->
      <view class="quantity-section">
        <text class="section-label">数量</text>
        <view class="quantity-control">
          <view class="qty-btn" :class="{ disabled: buyNum <= 1 }" @click="decreaseNum">
            <text>−</text>
          </view>
          <text class="qty-value">{{ buyNum }}</text>
          <view class="qty-btn" @click="increaseNum">
            <text>+</text>
          </view>
        </view>
      </view>

      <!-- 确认按钮 -->
      <view class="drawer-footer">
        <text class="total-price">¥{{ totalPrice }}</text>
        <view class="confirm-btn" @click="onConfirm">
          <text>加入购物车</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.spec-drawer-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.spec-drawer {
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 20px 16px;
  padding-bottom: calc(20px + constant(safe-area-inset-bottom));
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .drawer-title {
    font-size: 18px;
    font-weight: bold;
  }

  .drawer-close {
    font-size: 20px;
    color: #999;
    padding: 4px;
  }
}

.food-basic {
  margin-bottom: 16px;

  .food-basic-name {
    font-size: 16px;
    font-weight: bold;
    display: block;
  }

  .food-basic-desc {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
    display: block;
  }
}

.section-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  display: block;
}

.spec-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 18px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 2px solid transparent;

  .spec-name {
    font-size: 13px;
    color: #333;
  }

  .spec-price {
    font-size: 15px;
    color: #FF6B35;
    font-weight: bold;
    margin-top: 4px;
  }
}

.spec-item.active {
  border-color: #FF6B35;
  background-color: #FFF5F0;
}

.quantity-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;

  &.disabled {
    opacity: 0.4;
  }
}

.qty-value {
  font-size: 16px;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .total-price {
    font-size: 22px;
    color: #FF6B35;
    font-weight: bold;
  }

  .confirm-btn {
    background: linear-gradient(135deg, #FF6B35, #FF8F5E);
    padding: 12px 30px;
    border-radius: 24px;

    text {
      color: #ffffff;
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>

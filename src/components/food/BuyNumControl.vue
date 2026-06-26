<script setup lang="ts">
defineProps<{
  foodId: string
  buyNum: number
}>()

const emit = defineEmits<{
  increase: []
  decrease: []
}>()
</script>

<template>
  <view class="buy-num-control">
    <view class="control-btn minus" v-if="buyNum > 0" @click.stop="emit('decrease')">
      <text>−</text>
    </view>
    <text class="control-num" v-if="buyNum > 0">{{ buyNum }}</text>
    <view class="control-btn plus" @click.stop="emit('increase')">
      <text>+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.buy-num-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  width: 26px;
  height: 26px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;

  &.plus {
    background-color: #FF6B35;
    color: #ffffff;
  }

  &.minus {
    background-color: #ffffff;
    border: 1px solid #FF6B35;
    color: #FF6B35;
  }
}

.control-num {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  min-width: 20px;
  text-align: center;
}
</style>

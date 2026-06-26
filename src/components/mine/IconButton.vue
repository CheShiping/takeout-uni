<script setup lang="ts">
defineProps<{
  icon: string
  name: string
  badge?: number
}>()
</script>

<template>
  <view class="icon-button">
    <view class="icon-wrapper">
      <text class="icon">{{ icon }}</text>
      <view v-if="badge && badge > 0" class="badge">
        <text>{{ badge > 99 ? '99+' : badge }}</text>
      </view>
    </view>
    <text class="icon-name">{{ name }}</text>
  </view>
</template>

<style lang="scss" scoped>
.icon-button {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  background-color: #f5f5f5;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 22px;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  background-color: #FF3B30;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;

  text {
    font-size: 10px;
    color: #ffffff;
    font-weight: bold;
  }
}

.icon-name {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
}
</style>

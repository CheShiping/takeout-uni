<script setup lang="ts">
defineProps<{
  visible: boolean
}>()
</script>

<template>
  <view class="loading-overlay" v-if="visible">
    <view class="loading-spinner">
      <image src="/static/ic_public_arrow_right.svg" class="spinner-img" />
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner-img {
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

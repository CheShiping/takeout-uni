<script setup lang="ts">
defineProps<{
  title: string
  items: Array<{ icon: string; name: string; path?: string }>
}>()

const emit = defineEmits<{
  'item-click': [item: { icon: string; name: string; path?: string }]
}>()
</script>

<template>
  <view class="grid-section">
    <text class="section-title">{{ title }}</text>
    <view class="grid-row">
      <view
        v-for="(item, idx) in items"
        :key="idx"
        class="grid-item"
        @click="emit('item-click', item)"
      >
        <image :src="item.icon" class="item-icon-img" />
        <text class="item-name">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.grid-section {
  background-color: #ffffff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  display: block;
}

.grid-row {
  display: flex;
  flex-wrap: wrap;
}

.grid-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;

  .item-icon-img {
    width: 28px;
    height: 28px;
  }

  .item-name {
    font-size: 12px;
    color: #666;
    margin-top: 6px;
  }
}
</style>

<script setup lang="ts">
import { getImageUrl } from '@/constants/api'
import { DateUtil } from '@/utils/DateUtil'
import type { Review } from '@/models/review.types'

defineProps<{
  review: Review
}>()

const emit = defineEmits<{
  like: [reviewId: string]
}>()

function renderStars(rating: number): string {
  let stars = ''
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆'
  }
  return stars
}
</script>

<template>
  <view class="review-card">
    <view class="review-header">
      <view class="reviewer-info">
        <text class="reviewer-name">
          {{ review.isAnonymous ? '匿名用户' : review.userName }}
        </text>
        <text class="review-rating">{{ renderStars(review.rating) }}</text>
      </view>
      <text class="review-time">{{ DateUtil.formatRelativeTime(review.createTime) }}</text>
    </view>

    <text class="review-content">{{ review.content }}</text>

    <!-- 图片 -->
    <view v-if="review.images && review.images.length > 0" class="review-images">
      <image
        v-for="(img, idx) in review.images.slice(0, 9)"
        :key="idx"
        :src="getImageUrl(img)"
        class="review-img"
        mode="aspectFill"
      />
    </view>

    <!-- 标签 -->
    <view v-if="review.tags && review.tags.length > 0" class="review-tags">
      <text v-for="tag in review.tags" :key="tag" class="tag-item">{{ tag }}</text>
    </view>

    <!-- 商家回复 -->
    <view v-if="review.reply" class="review-reply">
      <text class="reply-label">商家回复：</text>
      <text class="reply-content">{{ review.reply }}</text>
    </view>

    <!-- 底部操作 -->
    <view class="review-footer">
      <view
        class="like-btn"
        :class="{ liked: review.isLiked }"
        @click="emit('like', review.id)"
      >
        <image :src="review.isLiked ? '/static/ic_public_choose_selected.svg' : '/static/ic_public_choose.svg'" class="icon-inline" />
        <text class="like-count">{{ review.likeCount || 0 }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.review-card {
  background-color: #ffffff;
  margin: 10px 16px;
  border-radius: 12px;
  padding: 14px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-right: 8px;
}

.review-rating {
  font-size: 13px;
  color: #FF9500;
}

.review-time {
  font-size: 12px;
  color: #bbb;
}

.review-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.review-img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag-item {
  font-size: 11px;
  color: #FF6B35;
  background-color: #FFF5F0;
  padding: 3px 10px;
  border-radius: 12px;
}

.review-reply {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;

  .reply-label {
    font-size: 12px;
    color: #999;
  }

  .reply-content {
    font-size: 13px;
    color: #666;
  }
}

.review-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.icon-inline {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  background-color: #f5f5f5;

  text {
    font-size: 13px;
  }

  &.liked {
    background-color: #FFF0F0;
  }
}

.like-count {
  font-size: 12px;
  color: #999;
}
</style>

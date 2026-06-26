<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AddressService } from '@/services/AddressService'
import { useUserStore } from '@/stores/user.store'
import { ToastUtil } from '@/utils/ToastUtil'
import type { UserAddress } from '@/models/address.types'

const userStore = useUserStore()

const addresses = ref<UserAddress[]>([])
const loading = ref(false)

onMounted(async () => {
  if (!userStore.isLogin) {
    uni.navigateTo({ url: '/pages/mine/login' })
    return
  }
  await fetchAddresses()
})

async function fetchAddresses() {
  loading.value = true
  try {
    addresses.value = await AddressService.getAddresses()
  } catch (e) {
    console.error('获取地址失败:', e)
  } finally {
    loading.value = false
  }
}

async function onDelete(addr: UserAddress) {
  const confirmed = await ToastUtil.showConfirm('提示', `确定删除地址"${addr.detail}"吗？`)
  if (confirmed) {
    try {
      await AddressService.deleteAddress(addr.id)
      ToastUtil.showSuccess('删除成功')
      await fetchAddresses()
    } catch (e) {
      ToastUtil.showError('删除失败')
    }
  }
}

function onEdit(addr: UserAddress) {
  uni.navigateTo({ url: `/pages/address/add-address?addressId=${addr.id}` })
}

function onAdd() {
  uni.navigateTo({ url: '/pages/address/add-address' })
}

function onSelect(addr: UserAddress) {
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - 2] as any
  if (prevPage?.$page?.fullPath?.includes('order-preview')) {
    const eventChannel = prevPage?.getOpenerEventChannel?.()
    if (eventChannel) {
      eventChannel.emit('selectAddress', {
        id: addr.id,
        consignee: addr.consignee,
        phone: addr.phone,
        fullAddress: `${addr.province}${addr.city}${addr.district}${addr.detail}`
      })
    }
    uni.navigateBack()
  } else {
    // 非选择模式，点击无效果
  }
}
</script>

<template>
  <scroll-view scroll-y class="address-list-page" :style="{ height: '100vh' }">
    <view v-if="addresses.length === 0 && !loading" class="empty-state">
      <image src="/static/ic_public_map.svg" class="empty-icon-img" />
      <text class="empty-text">暂无收货地址</text>
      <view class="add-btn" @click="onAdd">
        <text>新增地址</text>
      </view>
    </view>

    <view v-for="addr in addresses" :key="addr.id" class="address-card" @click="onSelect(addr)">
      <view class="address-header">
        <text class="addr-name">{{ addr.consignee }}</text>
        <text class="addr-phone">{{ addr.phone }}</text>
        <text v-if="addr.isDefault === 1" class="default-tag">默认</text>
      </view>
      <text class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</text>
      <view class="address-actions">
        <text class="action-btn" @click.stop="onEdit(addr)">编辑</text>
        <text class="action-btn delete" @click.stop="onDelete(addr)">删除</text>
      </view>
    </view>
  </scroll-view>

  <!-- 底部新增按钮 -->
  <view class="bottom-add">
    <view class="add-address-btn" @click="onAdd">
      <text>+ 新增收货地址</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.address-list-page {
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;

  .empty-icon-img {
    width: 48px;
    height: 48px;
  }

  .empty-text {
    font-size: 14px;
    color: #999;
    margin: 12px 0;
  }
}

.add-btn {
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  padding: 10px 24px;
  border-radius: 22px;

  text {
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
  }
}

.address-card {
  background-color: #ffffff;
  margin: 10px 16px;
  border-radius: 12px;
  padding: 16px;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.addr-name {
  font-size: 16px;
  font-weight: bold;
}

.addr-phone {
  font-size: 14px;
  color: #666;
}

.default-tag {
  font-size: 11px;
  color: #FF6B35;
  background-color: #FFF5F0;
  padding: 2px 8px;
  border-radius: 10px;
}

.addr-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;

  .action-btn {
    font-size: 13px;
    color: #FF6B35;
  }

  .action-btn.delete {
    color: #999;
  }
}

.bottom-add {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background-color: #ffffff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.add-address-btn {
  height: 44px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    color: #ffffff;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>

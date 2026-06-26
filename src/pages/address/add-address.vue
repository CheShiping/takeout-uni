<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { AddressService } from '@/services/AddressService'
import { ToastUtil } from '@/utils/ToastUtil'
import type { UserAddress } from '@/models/address.types'

const addressId = ref('')
const consignee = ref('')
const phone = ref('')
const province = ref('')
const city = ref('')
const district = ref('')
const detail = ref('')
const isDefault = ref(0)
const loading = ref(false)
const isEdit = ref(false)
let editIdFromRoute = ''

onLoad((options: any) => {
  editIdFromRoute = options?.addressId || ''
})

onMounted(async () => {
  if (!editIdFromRoute) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const options = currentPage?.$page?.options || currentPage?.options || {}
    editIdFromRoute = options.addressId || ''
  }

  if (editIdFromRoute) {
    isEdit.value = true
    addressId.value = editIdFromRoute
    loading.value = true
    try {
      const addresses = await AddressService.getAddresses()
      const addr = addresses.find(a => a.id === editIdFromRoute)
      if (addr) {
        consignee.value = addr.consignee
        phone.value = addr.phone
        province.value = addr.province
        city.value = addr.city
        district.value = addr.district
        detail.value = addr.detail
        isDefault.value = addr.isDefault
      }
    } catch (e) {
      console.error('加载地址失败:', e)
    } finally {
      loading.value = false
    }
  }
})

async function onSave() {
  if (!consignee.value.trim()) {
    ToastUtil.showMessage('请输入收货人')
    return
  }
  if (!phone.value.trim()) {
    ToastUtil.showMessage('请输入手机号')
    return
  }
  if (!detail.value.trim()) {
    ToastUtil.showMessage('请输入详细地址')
    return
  }

  loading.value = true
  try {
    if (isEdit.value) {
      await AddressService.updateAddress({
        id: addressId.value,
        userId: '',
        consignee: consignee.value,
        phone: phone.value,
        province: province.value || '广东省',
        city: city.value || '广州市',
        district: district.value || '天河区',
        detail: detail.value,
        longitude: 0,
        latitude: 0,
        isDefault: isDefault.value,
        createTime: ''
      })
      ToastUtil.showSuccess('更新成功')
    } else {
      await AddressService.addAddress({
        consignee: consignee.value,
        phone: phone.value,
        province: province.value || '广东省',
        city: city.value || '广州市',
        district: district.value || '天河区',
        detail: detail.value,
        longitude: 0,
        latitude: 0,
        isDefault: isDefault.value
      })
      ToastUtil.showSuccess('添加成功')
    }
    uni.navigateBack()
  } catch (e) {
    ToastUtil.showError('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <scroll-view scroll-y class="add-address-page" :style="{ height: '100vh' }">
    <view class="form-section">
      <view class="form-group">
        <text class="form-label">收货人</text>
        <input v-model="consignee" class="form-input" placeholder="请输入收货人姓名" />
      </view>
      <view class="form-group">
        <text class="form-label">手机号</text>
        <input v-model="phone" class="form-input" type="number" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="form-group">
        <text class="form-label">省/市/区</text>
        <input v-model="province" class="form-input" placeholder="省份" style="flex:1" />
        <input v-model="city" class="form-input" placeholder="城市" style="flex:1" />
        <input v-model="district" class="form-input" placeholder="区县" style="flex:1" />
      </view>
      <view class="form-group">
        <text class="form-label">详细地址</text>
        <textarea v-model="detail" class="form-textarea" placeholder="请输入详细地址，如街道、门牌号等" />
      </view>

      <view class="default-row">
        <text class="default-label">设为默认地址</text>
        <switch :checked="isDefault === 1" @change="(e: any) => isDefault = e.detail.value ? 1 : 0" color="#FF6B35" />
      </view>
    </view>

    <view class="save-btn-wrapper">
      <view class="save-btn" :class="{ disabled: loading }" @click="onSave">
        <text>{{ loading ? '保存中...' : '保存' }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.add-address-page {
  background-color: #f5f5f5;
}

.form-section {
  background-color: #ffffff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.form-group {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.form-label {
  font-size: 15px;
  color: #333;
  width: 80px;
}

.form-input {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.form-textarea {
  flex: 1;
  height: 80px;
  font-size: 14px;
  color: #333;
}

.default-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;

  .default-label {
    font-size: 15px;
    color: #333;
  }
}

.save-btn-wrapper {
  padding: 30px 16px;
}

.save-btn {
  height: 50px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    opacity: 0.6;
  }

  text {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>

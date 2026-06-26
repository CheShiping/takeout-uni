/**
 * 路由配置
 */
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/pages/index/index'
  },
  {
    path: '/pages/index/index',
    name: 'Index',
    component: () => import('@/pages/index/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/pages/main/main',
    name: 'Main',
    component: () => import('@/pages/main/main.vue'),
    meta: { title: '外卖点餐' }
  },
  {
    path: '/pages/food/food-detail',
    name: 'FoodDetail',
    component: () => import('@/pages/food/food-detail.vue'),
    meta: { title: '菜品详情' }
  },
  {
    path: '/pages/food/search',
    name: 'Search',
    component: () => import('@/pages/food/search.vue'),
    meta: { title: '搜索菜品' }
  },
  {
    path: '/pages/order/order-preview',
    name: 'OrderPreview',
    component: () => import('@/pages/order/order-preview.vue'),
    meta: { title: '订单结算', requireAuth: true }
  },
  {
    path: '/pages/order/order-list',
    name: 'OrderList',
    component: () => import('@/pages/order/order-list.vue'),
    meta: { title: '我的订单' }
  },
  {
    path: '/pages/order/order-detail',
    name: 'OrderDetail',
    component: () => import('@/pages/order/order-detail.vue'),
    meta: { title: '订单详情', requireAuth: true }
  },
  {
    path: '/pages/order/payment',
    name: 'Payment',
    component: () => import('@/pages/order/payment.vue'),
    meta: { title: '支付', requireAuth: true }
  },
  {
    path: '/pages/mine/login',
    name: 'Login',
    component: () => import('@/pages/mine/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/pages/mine/register',
    name: 'Register',
    component: () => import('@/pages/mine/register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/pages/mine/profile',
    name: 'Profile',
    component: () => import('@/pages/mine/profile.vue'),
    meta: { title: '个人资料' }
  },
  {
    path: '/pages/address/address-list',
    name: 'AddressList',
    component: () => import('@/pages/address/address-list.vue'),
    meta: { title: '收货地址' }
  },
  {
    path: '/pages/address/add-address',
    name: 'AddAddress',
    component: () => import('@/pages/address/add-address.vue'),
    meta: { title: '新增地址', requireAuth: true }
  },
  {
    path: '/pages/shop/shop-list',
    name: 'ShopList',
    component: () => import('@/pages/shop/shop-list.vue'),
    meta: { title: '附近店铺' }
  },
  {
    path: '/pages/review/review-submit',
    name: 'ReviewSubmit',
    component: () => import('@/pages/review/review-submit.vue'),
    meta: { title: '评价提交', requireAuth: true }
  }
]

export default routes

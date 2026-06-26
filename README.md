# takeout-uni

外卖点餐系统 - 基于 uni-app 的跨平台移动端应用

## 技术栈

- **框架**: Vue 3 + TypeScript
- **跨平台**: uni-app 3.x (H5 / 微信小程序 / App)
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **HTTP 客户端**: Axios
- **UI 组件**: uview-pro
- **构建工具**: Vite
- **样式**: SCSS

## 快速开始

### 环境要求

- Node.js >= 16
- npm / yarn / pnpm

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin
```

### 构建命令

```bash
# H5 生产构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin
```

## 项目结构

```
src/
├── api/              # HTTP 请求封装
├── components/       # 可复用组件
│   ├── common/       # 通用组件
│   ├── food/         # 食品相关组件
│   ├── home/         # 首页组件
│   ├── mine/         # 个人中心组件
│   ├── order/        # 订单组件
│   └── review/       # 评价组件
├── constants/        # 常量定义
├── hooks/            # Vue 组合式函数
├── models/           # TypeScript 类型定义
├── pages/            # 页面视图
├── router/           # 路由配置
├── services/         # 业务服务层
├── stores/           # Pinia 状态管理
├── types/            # 全局类型声明
└── utils/            # 工具函数
```

## 功能模块

- **首页**: 店铺推荐、食品分类、搜索
- **食品**: 食品详情、规格选择、加购
- **购物车**: 商品管理、数量调整
- **订单**: 下单、支付、订单列表、订单详情
- **地址**: 收货地址管理
- **个人中心**: 登录注册、个人信息、订单查看
- **评价**: 订单评价提交

## 配置说明

### API 配置

API 基础地址在 `src/constants/api.ts` 中配置，默认使用 Vite 代理：

```
/api → http://192.168.10.155:8123
```

### 平台适配

项目使用 uni-app 条件编译进行平台适配：

```typescript
// #ifdef MP-WEIXIN
// 微信小程序专用代码
// #endif

// #ifdef H5
// H5 专用代码
// #endif

// #ifdef APP-PLUS
// App 专用代码
// #endif
```

## 开发规范

- 使用 TypeScript 编写所有新代码
- 遵循《代码整洁之道》原则
- 优先使用 async/await 而非回调
- 编写完善的错误处理
- 组件使用 `<style lang="scss" scoped>` 样式隔离
- 品牌主色: `#FF6B35` (橙色)

## 相关文档

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)

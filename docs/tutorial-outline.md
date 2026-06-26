# 外卖点餐系统 — uni-app 实战教程

> 基于 Vue 3 + TypeScript + uni-app 3.x 的跨平台外卖点餐系统开发全流程

---

## 教程总览

本教程以 takeout-uni 项目为蓝本，从零到一讲解如何使用 uni-app 开发一个完整的外卖点餐系统，覆盖 H5、微信小程序双端。适合有 Vue 基础、想学习 uni-app 跨平台开发的同学。

---

## 目录计划

### 第一章：项目概述与环境搭建

- 1.1 项目介绍：功能预览与技术选型
- 1.2 开发环境准备：Node.js / HBuilderX / 微信开发者工具
- 1.3 使用 Vite 创建 uni-app Vue3 + TypeScript 项目
- 1.4 项目目录结构详解
- 1.5 首次运行：H5 与微信小程序预览

### 第二章：项目架构设计

- 2.1 整体架构分层：pages → services → api → models
- 2.2 路由系统：pages.json 双层路由与页面跳转
- 2.3 全局配置：manifest.json 与 pages.json 详解
- 2.4 路径别名与 Vite 配置
- 2.5 TypeScript 配置与类型声明

### 第三章：网络请求封装

- 3.1 Axios 封装：请求/响应拦截器设计
- 3.2 Token 自动注入与 Sa-Token 认证
- 3.3 统一错误处理与 Toast 提示
- 3.4 API 常量管理与路径配置
- 3.5 文件上传：uni.uploadFile 封装
- 3.6 Vite 代理配置解决跨域

### 第四章：状态管理（Pinia）

- 4.1 Pinia 安装与初始化
- 4.2 pinia-plugin-persistedstate 与 uni-app 存储适配
- 4.3 用户状态管理（user.store.ts）
- 4.4 购物车状态管理（cart.store.ts）
- 4.5 订单状态管理（order.store.ts）
- 4.6 店铺状态管理（shop.store.ts）
- 4.7 全局应用状态（app.store.ts）

### 第五章：类型系统设计

- 5.1 为什么要用 TypeScript：类型安全的价值
- 5.2 按领域划分类型文件（models/*.types.ts）
- 5.3 食品类型：FoodItem、FoodSpec、FoodImage
- 5.4 购物车类型：CartFoodItem 扩展设计
- 5.5 订单类型：OrderStatus 枚举与状态流转
- 5.6 API 响应类型与泛型封装
- 5.7 全局类型声明（global.types.ts）

### 第六章：首页开发

- 6.1 TabBar 容器页面（main.vue）设计
- 6.2 自定义导航栏（navigationStyle: custom）
- 6.3 首页组件拆分：HomeComponent
- 6.4 食品分类组件（FoodCategory）
- 6.5 推荐菜品卡片（FoodRecommendCard）
- 6.6 下拉刷新与加载更多

### 第七章：店铺模块

- 7.1 店铺列表页面开发
- 7.2 店铺卡片组件设计
- 7.3 店铺详情与菜单联动
- 7.4 地理位置服务：useLocation 组合式函数
- 7.5 附近店铺搜索与排序

### 第八章：食品详情与规格选择

- 8.1 食品详情页面布局
- 8.2 图片轮播与预览
- 8.3 规格选择抽屉（FoodSpecDrawer）
- 8.4 购买数量控制（BuyNumControl）
- 8.5 加入购物车逻辑
- 8.6 搜索功能实现（SearchService）

### 第九章：购物车模块

- 9.1 购物车数据模型设计
- 9.2 useCart 组合式函数封装
- 9.3 购物车商品管理（增删改查）
- 9.4 规格联动与价格计算
- 9.5 购物车与后端同步（CartService 特殊传参）
- 9.6 购物车状态不持久化的处理策略

### 第十章：订单流程

- 10.1 订单确认页面（order-preview）
- 10.2 地址选择与展示
- 10.3 订单提交与后端交互
- 10.4 支付页面（payment）
- 10.5 订单列表（order-list）与状态筛选
- 10.6 订单详情（order-detail）
- 10.7 OrderStatus 状态流转与 UI 映射

### 第十一章：地址管理

- 11.1 地址列表页面
- 11.2 新增/编辑地址表单
- 11.3 地址选择器与默认地址
- 11.4 AddressService 接口对接
- 11.5 地图选点（MapUtil）

### 第十二章：用户认证

- 12.1 登录页面与表单验证
- 12.2 注册流程
- 12.3 useAuth 组合式函数设计
- 12.4 Token 管理与持久化
- 12.5 全局路由守卫：页面级鉴权
- 12.6 个人资料编辑（profile）

### 第十三章：评价系统

- 13.1 评价提交页面
- 13.2 星级评分组件
- 13.3 文字评价与图片上传
- 13.4 评价卡片组件（ReviewCard）
- 13.5 ReviewService 接口对接

### 第十四章：通用组件与工具

- 14.1 加载进度条（LoadingProgress）
- 14.2 Toast 工具封装（ToastUtil）
- 14.3 日志工具（Logger）
- 14.4 日期工具（DateUtil）
- 14.5 数学计算工具（MathUtil）
- 14.6 敏感词过滤（SensitiveFilter）
- 14.7 存储工具（StorageUtil / UniStorage）

### 第十五章：跨平台适配

- 15.1 条件编译：#ifdef 的使用
- 15.2 H5 平台特殊处理
- 15.3 微信小程序平台适配
- 15.4 App 平台权限管理（PermissionsUtil）
- 15.5 平台差异 API 封装策略

### 第十六章：样式与主题

- 16.1 uni.scss 全局变量定义
- 16.2 品牌色系设计（#FF6B35 主色）
- 16.3 Scoped SCSS 组件样式隔离
- 16.4 响应式布局：rpx 单位使用
- 16.5 暗色模式适配思路

### 第十七章：构建与发布

- 17.1 H5 生产环境构建
- 17.2 微信小程序代码上传与审核
- 17.3 App 打包与发布（云打包 / 离线打包）
- 17.4 环境变量管理：开发/测试/生产
- 17.5 性能优化建议

---

## 教程特色

- **实战驱动**：每一章对应项目中真实的功能模块
- **代码优先**：所有示例均来自实际项目代码
- **TypeScript 全程**：从类型定义到业务代码全链路 TS
- **跨平台视角**：重点讲解 H5 与微信小程序的差异处理
- **渐进式学习**：从基础架构 → 核心功能 → 高级特性 → 发布上线

## 适合人群

- 有 Vue 3 基础，想学习 uni-app 跨平台开发
- 想了解如何用 TypeScript 构建 uni-app 项目
- 需要参考外卖/电商类 App 开发模式

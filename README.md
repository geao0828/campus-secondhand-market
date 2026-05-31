# 校园二手交易平台

一个面向高校学生的二手物品交易平台，让闲置物品流转起来。

## 技术栈

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&style=flat-square)
![Vue Router](https://img.shields.io/badge/Vue%20Router-4-4FC08D?logo=vue&style=flat-square)
![Pinia](https://img.shields.io/badge/Pinia-2-FFD859?logo=pinia&style=flat-square)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2-409EFF?logo=element-plus&style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?logo=axios&style=flat-square)

## 项目简介

### 功能概述

- **商品展示与检索**：支持分类浏览（数码、书籍、服饰、生活用品）、关键词搜索、价格/时间排序
- **首页轮播图**：展示热门推荐、最新发布等促销活动
- **商品详情页**：图文详情、成色说明、用户评价、支持收藏和加入购物车
- **发布功能**：上传商品图片、填写描述、设置价格和分类，支持编辑和下架
- **订单管理**：查看订单状态（待付款/待发货/已完成）、确认收货、评价商品
- **个人中心**：管理个人信息、查看我的发布、我的订单、我的收藏

## 运行指南

### 环境要求

- Node.js >= 16
- pnpm >= 8（推荐）或 npm/yarn

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

项目运行后访问 http://localhost:5173/

### 构建生产版本

```bash
pnpm build
```

## 功能截图

### 首页
![首页](./screenshots/home.png)

### 商品列表
![商品列表](./screenshots/products.png)

### 商品详情
![商品详情](./screenshots/detail.png)

### 发布商品
![发布商品](./screenshots/publish.png)

### 订单管理
![订单管理](./screenshots/orders.png)

### 个人中心
![个人中心](./screenshots/profile.png)

## 项目结构

```
src/
├── api/              # API 接口封装（预留对接后端）
├── components/       # 可复用组件
│   ├── AppLayout.vue       # 页面布局组件
│   ├── ProductCard.vue      # 商品卡片组件
│   ├── ProductForm.vue      # 商品表单组件
│   └── SideAd.vue           # 侧边广告组件
├── data/
│   └── mock.js      # 模拟数据
├── router/
│   └── index.js     # 路由配置
├── stores/           # Pinia 状态管理
│   ├── product.js   # 商品相关状态
│   ├── user.js      # 用户相关状态
│   └── order.js     # 订单相关状态
├── utils/
│   ├── request.js   # Axios 封装
│   └── upload.js     # 图片上传工具
├── views/            # 页面视图
│   ├── HomeView.vue        # 首页
│   ├── ProductListView.vue # 商品列表
│   ├── ProductDetailView.vue # 商品详情
│   ├── PublishView.vue     # 发布商品
│   ├── OrderView.vue       # 订单管理
│   └── ProfileView.vue     # 个人中心
├── App.vue           # 根组件
└── main.js          # 入口文件
```

## 对接后端

如需对接真实后端接口，请：

1. 取消 `src/api/index.js` 中的接口注释
2. 修改 `src/utils/request.js` 中的 `baseURL` 为后端地址
3. 根据后端接口调整 API 调用参数

## License

MIT

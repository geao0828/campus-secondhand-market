# 校园二手交易平台 — 接口文档

> 本文档与前端 `src/api/index.js`、`src/utils/request.js` 保持一致，供前后端联调使用。

## 1. 通用说明

### 1.1 基础地址

| 环境 | Base URL |
|------|----------|
| 开发（默认） | `/api` |
| 可配置 | 环境变量 `VITE_API_BASE_URL` |

示例：`.env` 中设置 `VITE_API_BASE_URL=http://localhost:8080/api`

### 1.2 请求头

| Header | 说明 |
|--------|------|
| `Content-Type` | `application/json` |
| `Authorization` | 登录后携带 `Bearer {token}`（除登录、注册、公开商品列表等接口外建议必填） |

### 1.3 统一响应格式

前端拦截器约定：业务成功时 `code === 200`（或未返回 `code` 时直接视为成功）。

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | number | 业务状态码，200 表示成功 |
| message | string | 提示信息 |
| data | any | 业务数据 |

### 1.4 分页参数（列表类接口建议）

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，从 1 开始，默认 1 |
| pageSize | number | 否 | 每页条数，默认 10 |

分页响应建议：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 1.5 HTTP 状态码

| 状态码 | 说明 | 前端处理 |
|--------|------|----------|
| 401 | 未授权 | 清除 token，提示登录 |
| 403 | 无权限 | 提示拒绝访问 |
| 404 | 资源不存在 | 提示资源不存在 |
| 500 | 服务器错误 | 提示服务器错误 |

### 1.6 枚举约定

**商品分类 `category`**

| 值 | 说明 |
|----|------|
| digital | 数码 |
| books | 书籍 |
| clothing | 服饰 |
| daily | 生活用品 |

**商品成色 `condition`**

`全新` | `99新` | `98新` | `95新` | `良好` | `一般`

**商品状态 `status`**

| 值 | 说明 |
|----|------|
| active | 在售 |
| inactive | 已下架 |
| sold | 已售出 |

**订单状态 `status`**

| 值 | 说明 | statusText（展示） |
|----|------|-------------------|
| pending | 待付款 | 待付款 |
| shipped | 待发货（已付款） | 待发货 |
| completed | 已完成 | 已完成 |
| cancelled | 已取消 | 已取消 |

**排序 `sortBy`（商品列表）**

| 值 | 说明 |
|----|------|
| default | 综合排序 |
| price_asc | 价格升序 |
| price_desc | 价格降序 |
| time_desc | 发布时间降序 |

---

## 2. 用户模块

### 2.1 用户登录

- **URL**：`POST /user/login`
- **认证**：否
- **前端方法**：`userAPI.login(data)`

**请求体**

```json
{
  "username": "20210001",
  "password": "123456"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名/学号 |
| password | string | 是 | 密码 |

**响应 data 示例**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "张三",
    "avatar": "https://example.com/avatar.png",
    "phone": "13800138000",
    "email": "zhang@school.edu",
    "address": "XX大学XX宿舍楼"
  }
}
```

---

### 2.2 用户注册

- **URL**：`POST /user/register`
- **认证**：否
- **前端方法**：`userAPI.register(data)`

**请求体**

```json
{
  "username": "20210002",
  "password": "123456",
  "name": "李四",
  "phone": "13800138001"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名/学号 |
| password | string | 是 | 密码 |
| name | string | 是 | 昵称 |
| phone | string | 否 | 手机号 |

**响应**：同登录，返回 `token` 与 `user`。

---

### 2.3 获取当前用户信息

- **URL**：`GET /user/info`
- **认证**：是
- **前端方法**：`userAPI.getUserInfo()`

**响应 data 示例**

```json
{
  "id": 1,
  "name": "张三",
  "avatar": "",
  "phone": "13800138000",
  "email": "zhang@school.edu",
  "address": "XX大学XX宿舍楼"
}
```

---

### 2.4 更新用户信息

- **URL**：`PUT /user/info`
- **认证**：是
- **前端方法**：`userAPI.updateUserInfo(data)`

**请求体**

```json
{
  "name": "张三",
  "phone": "13800138000",
  "email": "zhang@school.edu",
  "address": "新地址",
  "avatar": "https://example.com/new-avatar.png"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 用户名 |
| phone | string | 否 | 手机号 |
| email | string | 否 | 邮箱 |
| address | string | 否 | 默认收货地址 |
| avatar | string | 否 | 头像 URL |

---

### 2.5 我的发布列表

- **URL**：`GET /user/products`
- **认证**：是
- **前端方法**：`userAPI.getMyProducts()`

**响应 data**：`Product[]`（见 [商品对象](#31-商品对象-product)）

---

### 2.6 我的订单列表

- **URL**：`GET /user/orders`
- **认证**：是
- **前端方法**：`userAPI.getMyOrders()`

**Query 参数（可选）**

| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | 订单状态：pending / shipped / completed |

**响应 data**：`Order[]`（见 [订单对象](#41-订单对象-order)）

---

### 2.7 我的收藏列表

- **URL**：`GET /user/favorites`
- **认证**：是
- **前端方法**：`userAPI.getMyFavorites()`

**响应 data**：`Product[]`

---

### 2.8 添加收藏

- **URL**：`POST /user/favorites/{productId}`
- **认证**：是
- **前端方法**：`userAPI.addFavorite(productId)`

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| productId | number | 商品 ID |

**响应 data**：`null` 或收藏记录对象

---

### 2.9 取消收藏

- **URL**：`DELETE /user/favorites/{productId}`
- **认证**：是
- **前端方法**：`userAPI.removeFavorite(productId)`

---

## 3. 商品模块

### 3.1 商品对象 (Product)

```json
{
  "id": 1,
  "name": "iPhone 14 Pro Max 256G",
  "price": 5999,
  "originalPrice": 7999,
  "category": "digital",
  "image": "https://example.com/cover.jpg",
  "images": ["https://example.com/1.jpg", "https://example.com/2.jpg"],
  "description": "99新，无划痕",
  "condition": "99新",
  "publishTime": "2024-01-15 10:30:00",
  "isHot": true,
  "isNew": false,
  "stock": 1,
  "status": "active",
  "seller": {
    "id": 1,
    "name": "张三",
    "avatar": "",
    "rating": 4.8,
    "soldCount": 15
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 商品 ID |
| name | string | 商品名称 |
| price | number | 售价（元） |
| originalPrice | number | 原价（元） |
| category | string | 分类 ID |
| image | string | 封面图 URL |
| images | string[] | 详情图 URL 列表 |
| description | string | 描述 |
| condition | string | 成色 |
| publishTime | string | 发布时间 |
| isHot | boolean | 是否热门 |
| isNew | boolean | 是否最新 |
| stock | number | 库存 |
| status | string | 商品状态 |
| seller | Seller | 卖家信息 |

**卖家对象 (Seller)**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 卖家用户 ID |
| name | string | 昵称 |
| avatar | string | 头像 |
| rating | number | 评分（如 4.8） |
| soldCount | number | 已售数量 |

---

### 3.2 商品列表

- **URL**：`GET /products`
- **认证**：否
- **前端方法**：`productAPI.getProducts(params)`

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 关键词（名称、描述） |
| category | string | 否 | 分类 ID |
| sortBy | string | 否 | 排序，见枚举 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

**响应 data**：分页列表，`list` 为 `Product[]`

---

### 3.3 商品详情

- **URL**：`GET /products/{id}`
- **认证**：否
- **前端方法**：`productAPI.getProductDetail(id)`

**路径参数**：`id` — 商品 ID

**响应 data**：`Product`

---

### 3.4 热门商品

- **URL**：`GET /products/hot`
- **认证**：否
- **前端方法**：`productAPI.getHotProducts()`

**Query**：可选 `page`、`pageSize`

**响应 data**：`Product[]` 或分页结构

---

### 3.5 最新发布商品

- **URL**：`GET /products/new`
- **认证**：否
- **前端方法**：`productAPI.getNewProducts()`

**响应 data**：`Product[]` 或分页结构

---

### 3.6 按分类查询商品

- **URL**：`GET /products/category/{categoryId}`
- **认证**：否
- **前端方法**：`productAPI.getProductsByCategory(categoryId, params)`

**路径参数**：`categoryId` — 如 `digital`、`books`

**Query**：同 [3.2 商品列表](#32-商品列表)

---

### 3.7 搜索商品

- **URL**：`GET /products/search`
- **认证**：否
- **前端方法**：`productAPI.searchProducts(keyword, params)`

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| category | string | 否 | 分类筛选 |
| sortBy | string | 否 | 排序 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

---

### 3.8 发布商品

- **URL**：`POST /products`
- **认证**：是
- **前端方法**：`productAPI.publishProduct(data)`

**请求体**

```json
{
  "name": "高等数学教材",
  "category": "books",
  "condition": "良好",
  "price": 25,
  "originalPrice": 49,
  "stock": 1,
  "description": "少量笔记",
  "images": ["https://example.com/1.jpg"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 商品名称 |
| category | string | 是 | 分类 |
| condition | string | 是 | 成色 |
| price | number | 是 | 售价 |
| originalPrice | number | 否 | 原价 |
| stock | number | 是 | 库存 |
| description | string | 是 | 描述 |
| images | string[] | 否 | 图片 URL 列表（先调用 [8.1 图片上传](#81-图片上传) 获取） |

**响应 data**：创建后的 `Product`

---

### 3.9 更新商品

- **URL**：`PUT /products/{id}`
- **认证**：是（仅卖家本人）
- **前端方法**：`productAPI.updateProduct(id, data)`

**请求体**：字段同 [3.8 发布商品](#38-发布商品)，均为可选（部分更新）。

---

### 3.10 下架/删除商品

- **URL**：`DELETE /products/{id}`
- **认证**：是（仅卖家本人）
- **前端方法**：`productAPI.deleteProduct(id)`

**说明**：逻辑删除或 `status` 置为 `inactive`，与前端「下架」一致。

---

## 4. 分类模块

### 4.1 分类列表

- **URL**：`GET /categories`
- **认证**：否
- **前端方法**：`categoryAPI.getCategories()`

**响应 data 示例**

```json
[
  { "id": "digital", "name": "数码", "icon": "Monitor" },
  { "id": "books", "name": "书籍", "icon": "Reading" },
  { "id": "clothing", "name": "服饰", "icon": "Shop" },
  { "id": "daily", "name": "生活用品", "icon": "ShoppingBag" }
]
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 分类标识 |
| name | string | 分类名称 |
| icon | string | 图标名（Element Plus Icons） |

---

## 5. 订单模块

### 5.1 订单对象 (Order)

```json
{
  "id": "ORD20240126001",
  "productId": 1,
  "productName": "iPhone 14 Pro Max 256G",
  "productImage": "https://example.com/cover.jpg",
  "price": 5999,
  "quantity": 1,
  "status": "pending",
  "statusText": "待付款",
  "seller": "张三",
  "sellerId": 1,
  "createTime": "2024-01-26 10:30:00",
  "address": "XX大学XX宿舍楼",
  "reviewed": false
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 订单号 |
| productId | number | 商品 ID |
| productName | string | 商品名称 |
| productImage | string | 商品封面 |
| price | number | 单价 |
| quantity | number | 数量 |
| status | string | 订单状态 |
| statusText | string | 状态文案（前端展示） |
| seller | string | 卖家昵称 |
| sellerId | number | 卖家 ID（可选） |
| createTime | string | 下单时间 |
| address | string | 收货地址 |
| reviewed | boolean | 是否已评价 |

---

### 5.2 订单列表

- **URL**：`GET /orders`
- **认证**：是
- **前端方法**：`orderAPI.getOrders(params)`

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | pending / shipped / completed / all |
| page | number | 页码 |
| pageSize | number | 每页条数 |

---

### 5.3 订单详情

- **URL**：`GET /orders/{id}`
- **认证**：是
- **前端方法**：`orderAPI.getOrderDetail(id)`

**响应 data**：`Order`

---

### 5.4 创建订单

- **URL**：`POST /orders`
- **认证**：是
- **前端方法**：`orderAPI.createOrder(data)`

**请求体**

```json
{
  "productId": 1,
  "quantity": 1,
  "address": "XX大学XX宿舍楼"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| productId | number | 是 | 商品 ID |
| quantity | number | 是 | 购买数量 |
| address | string | 是 | 收货地址 |

**响应 data**：`Order`（状态为 `pending`）

**业务规则建议**

- 校验库存、商品是否在售
- 下单后扣减库存（或付款后扣减，按业务定）
- 购物车批量下单可扩展为 `productIds` 数组或多次调用

---

### 5.5 支付订单

- **URL**：`POST /orders/{id}/pay`
- **认证**：是（买家）
- **前端方法**：`orderAPI.payOrder(id)`

**说明**：校园场景可为模拟支付；成功后 `status` 变为 `shipped`。

**响应 data**：更新后的 `Order`

---

### 5.6 确认收货

- **URL**：`POST /orders/{id}/confirm`
- **认证**：是（买家）
- **前端方法**：`orderAPI.confirmReceive(id)`

**说明**：成功后 `status` 变为 `completed`。

---

### 5.7 取消订单

- **URL**：`POST /orders/{id}/cancel`
- **认证**：是（买家，仅 `pending` 可取消）
- **前端方法**：`orderAPI.cancelOrder(id)`

---

## 6. 购物车模块

### 6.1 购物车项 (CartItem)

```json
{
  "productId": 1,
  "quantity": 2,
  "product": {}
}
```

`product` 为完整 `Product` 对象，便于前端展示。

---

### 6.2 获取购物车

- **URL**：`GET /cart`
- **认证**：是
- **前端方法**：`cartAPI.getCart()`

**响应 data**：`CartItem[]`

---

### 6.3 加入购物车

- **URL**：`POST /cart`
- **认证**：是
- **前端方法**：`cartAPI.addToCart(productId, quantity)`

**请求体**

```json
{
  "productId": 1,
  "quantity": 1
}
```

---

### 6.4 更新购物车数量

- **URL**：`PUT /cart/{productId}`
- **认证**：是
- **前端方法**：`cartAPI.updateCartItem(productId, quantity)`

**请求体**

```json
{
  "quantity": 3
}
```

---

### 6.5 移除购物车商品

- **URL**：`DELETE /cart/{productId}`
- **认证**：是
- **前端方法**：`cartAPI.removeFromCart(productId)`

---

### 6.6 清空购物车

- **URL**：`DELETE /cart`
- **认证**：是
- **前端方法**：`cartAPI.clearCart()`

---

## 7. 评价模块

### 7.1 评价对象 (Review)

```json
{
  "id": 1,
  "productId": 1,
  "userId": 10,
  "userName": "买家A",
  "avatar": "",
  "rating": 5,
  "content": "成色很好，卖家靠谱",
  "time": "2024-01-20 14:30:00"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 评价 ID |
| productId | number | 商品 ID |
| userId | number | 评价用户 ID |
| userName | string | 用户昵称 |
| avatar | string | 头像 |
| rating | number | 评分 1–5 |
| content | string | 评价内容 |
| time | string | 评价时间 |

---

### 7.2 获取商品评价列表

- **URL**：`GET /products/{productId}/reviews`
- **认证**：否
- **前端方法**：`reviewAPI.getProductReviews(productId)`

**Query**：可选 `page`、`pageSize`

**响应 data**：`Review[]` 或分页结构

---

### 7.3 提交商品评价

- **URL**：`POST /products/{productId}/reviews`
- **认证**：是
- **前端方法**：`reviewAPI.createReview(productId, data)`

**请求体**

```json
{
  "rating": 5,
  "content": "非常满意"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| rating | number | 是 | 1–5 星 |
| content | string | 是 | 评价正文 |

**业务规则建议**

- 仅已完成订单的买家可评价
- 同一订单/商品仅可评价一次

---

## 8. 文件上传模块

### 8.1 图片上传

- **URL**：`POST /upload/image`
- **认证**：是（建议；开发环境未强制校验 token）
- **Content-Type**：`multipart/form-data`
- **前端方法**：`uploadAPI.uploadImage(file, type)`
- **工具函数**：`uploadImageFile(file, type)`（`src/utils/upload.js`）

**请求体（FormData）**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 图片文件 |
| type | string | 否 | `product` 商品图（默认）/ `avatar` 头像 |

**限制**

| 项 | 值 |
|----|-----|
| 最大体积 | 5MB |
| 允许格式 | jpg、png、webp、gif |
| 商品图数量 | 前端限制最多 5 张（业务层控制） |

**响应 data 示例**

```json
{
  "url": "/uploads/product/1717056123456-abc12def.jpg",
  "type": "product"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| url | string | 图片访问路径（相对站点根路径，可直接用于 `<img src>` 与商品 `images` 字段） |
| type | string | 实际上传类型：`product` / `avatar` |

**存储路径约定**

| type | 服务端目录 | URL 前缀 |
|------|------------|----------|
| product | `public/uploads/product/` | `/uploads/product/` |
| avatar | `public/uploads/avatar/` | `/uploads/avatar/` |

**错误示例**

```json
{
  "code": 400,
  "message": "仅支持 jpg、png、webp、gif 格式",
  "data": null
}
```

**前端调用示例**

```javascript
import { uploadAPI } from '@/api'

const formData = new FormData()
formData.append('file', file)
formData.append('type', 'product')

const res = await uploadAPI.uploadImage(file, 'product')
const imageUrl = res.data.url // 写入商品 images / image 字段
```

**开发环境实现说明**

- 项目通过 Vite 插件 `plugins/vite-upload-api.js` 在 `pnpm dev` / `pnpm preview` 时提供该接口
- 文件保存在 `public/uploads/` 下，静态资源可直接访问
- 生产部署需由真实后端（Java / Node 等）实现相同契约，或将该插件逻辑迁移至服务端

---

### 8.2 扩展接口（建议）

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/banners` | 首页轮播图配置 |
| POST | `/chat/{sellerId}` | 私聊卖家（IM 会话创建） |
| GET | `/chat/messages` | 聊天记录 |

---

## 9. 接口一览表

| 模块 | 方法 | 路径 | 认证 |
|------|------|------|------|
| 用户 | POST | /user/login | 否 |
| 用户 | POST | /user/register | 否 |
| 用户 | GET | /user/info | 是 |
| 用户 | PUT | /user/info | 是 |
| 用户 | GET | /user/products | 是 |
| 用户 | GET | /user/orders | 是 |
| 用户 | GET | /user/favorites | 是 |
| 用户 | POST | /user/favorites/{productId} | 是 |
| 用户 | DELETE | /user/favorites/{productId} | 是 |
| 分类 | GET | /categories | 否 |
| 商品 | GET | /products | 否 |
| 商品 | GET | /products/{id} | 否 |
| 商品 | GET | /products/hot | 否 |
| 商品 | GET | /products/new | 否 |
| 商品 | GET | /products/category/{categoryId} | 否 |
| 商品 | GET | /products/search | 否 |
| 商品 | POST | /products | 是 |
| 商品 | PUT | /products/{id} | 是 |
| 商品 | DELETE | /products/{id} | 是 |
| 评价 | GET | /products/{productId}/reviews | 否 |
| 评价 | POST | /products/{productId}/reviews | 是 |
| 订单 | GET | /orders | 是 |
| 订单 | GET | /orders/{id} | 是 |
| 订单 | POST | /orders | 是 |
| 订单 | POST | /orders/{id}/pay | 是 |
| 订单 | POST | /orders/{id}/confirm | 是 |
| 订单 | POST | /orders/{id}/cancel | 是 |
| 购物车 | GET | /cart | 是 |
| 购物车 | POST | /cart | 是 |
| 购物车 | PUT | /cart/{productId} | 是 |
| 购物车 | DELETE | /cart/{productId} | 是 |
| 购物车 | DELETE | /cart | 是 |
| 上传 | POST | /upload/image | 是 |

---

## 10. 前端对接说明

1. 配置 `.env`：`VITE_API_BASE_URL=你的后端地址`
2. 在 `src/stores/*.js` 中将 mock 逻辑替换为 `src/api/index.js` 对应方法
3. 登录成功后将 `data.token` 写入 `localStorage.setItem('token', token)`（当前 `userStore.login` 已处理）
4. 确保后端响应符合 [1.3 统一响应格式](#13-统一响应格式)，否则需调整 `src/utils/request.js` 拦截器

**前端 API 文件位置**：`src/api/index.js`

**图片上传**

- 发布商品：`ProductForm` 选择图片后自动调用 `POST /upload/image`，将返回的 `url` 写入 `images`
- 个人中心：头像上传 `type=avatar`，保存个人信息时一并提交 `avatar` 字段
- 上传工具：`src/utils/upload.js`；开发态由 `plugins/vite-upload-api.js` 提供接口

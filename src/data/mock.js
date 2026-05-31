const sellers = [
  { id: 1, name: '张三', avatar: '', rating: 4.8, soldCount: 15 },
  { id: 2, name: '李四', avatar: '', rating: 4.5, soldCount: 8 },
  { id: 3, name: '王五', avatar: '', rating: 4.9, soldCount: 23 },
  { id: 4, name: '赵六', avatar: '', rating: 4.7, soldCount: 12 },
  { id: 5, name: '钱七', avatar: '', rating: 4.6, soldCount: 6 },
  { id: 6, name: '孙八', avatar: '', rating: 4.4, soldCount: 3 },
  { id: 7, name: '周九', avatar: '', rating: 4.3, soldCount: 19 },
  { id: 8, name: '吴十', avatar: '', rating: 4.9, soldCount: 31 }
]

function p(id, opts) {
  const img = `https://picsum.photos/400/300?random=${id}`
  return {
    id,
    image: img,
    images: [img],
    status: 'active',
    stock: 1,
    seller: sellers[(id - 1) % sellers.length],
    ...opts
  }
}

export const mockProducts = [
  p(1, { name: 'iPhone 14 Pro Max 256G', price: 5999, originalPrice: 7999, category: 'digital', description: '99新，无划痕，配件齐全，电池健康度98%', condition: '99新', publishTime: '2024-01-15 10:30', isHot: true, isNew: false }),
  p(2, { name: '高等数学（第七版）', price: 25, originalPrice: 49, category: 'books', description: '课本，少量笔记，无缺页', condition: '良好', publishTime: '2024-01-18 14:20', isHot: false, isNew: true }),
  p(3, { name: 'Nike 运动外套 M码', price: 180, originalPrice: 599, category: 'clothing', description: '穿过两次，太小了，几乎全新', condition: '95新', publishTime: '2024-01-20 09:15', isHot: true, isNew: false }),
  p(4, { name: '小米台灯', price: 89, originalPrice: 169, category: 'daily', description: '功能完好，轻微使用痕迹', condition: '良好', publishTime: '2024-01-21 16:45', isHot: false, isNew: true, stock: 2 }),
  p(5, { name: 'MacBook Air M1', price: 4500, originalPrice: 7999, category: 'digital', description: '学生自用，包装配件齐全', condition: '98新', publishTime: '2024-01-22 11:00', isHot: true, isNew: false }),
  p(6, { name: '大学物理教材', price: 30, originalPrice: 65, category: 'books', description: '全新未使用', condition: '全新', publishTime: '2024-01-23 08:30', isHot: false, isNew: true }),
  p(7, { name: 'Sony WH-1000XM4 耳机', price: 1200, originalPrice: 2299, category: 'digital', description: '降噪效果极佳，配件齐全', condition: '95新', publishTime: '2024-01-24 15:20', isHot: true, isNew: false }),
  p(8, { name: '优衣库羽绒服 L码', price: 250, originalPrice: 599, category: 'clothing', description: '穿过一次，非常暖和', condition: '99新', publishTime: '2024-01-25 10:10', isHot: false, isNew: true }),
  p(9, { name: 'iPad Air 5 64G', price: 2800, originalPrice: 4399, category: 'digital', description: '贴膜送壳，无磕碰', condition: '98新', publishTime: '2024-01-26 09:00', isHot: true, isNew: true }),
  p(10, { name: '线性代数习题册', price: 15, originalPrice: 35, category: 'books', description: '写过几页，答案完整', condition: '良好', publishTime: '2024-01-26 11:20', isHot: false, isNew: true }),
  p(11, { name: '阿迪达斯运动鞋 42码', price: 220, originalPrice: 699, category: 'clothing', description: '鞋底磨损轻微', condition: '良好', publishTime: '2024-01-27 08:15', isHot: true, isNew: false }),
  p(12, { name: '电热水壶 1.7L', price: 45, originalPrice: 99, category: 'daily', description: '宿舍自用，已清洗干净', condition: '良好', publishTime: '2024-01-27 14:30', isHot: false, isNew: true }),
  p(13, { name: '华为 MatePad 11', price: 1500, originalPrice: 2499, category: 'digital', description: '手写笔一起出', condition: '95新', publishTime: '2024-01-28 10:00', isHot: true, isNew: false }),
  p(14, { name: 'C++ Primer Plus', price: 55, originalPrice: 128, category: 'books', description: '正版书，无划线', condition: '99新', publishTime: '2024-01-28 16:45', isHot: false, isNew: true }),
  p(15, { name: '牛仔夹克 L码', price: 90, originalPrice: 299, category: 'clothing', description: '复古款，版型好看', condition: '良好', publishTime: '2024-01-29 09:30', isHot: false, isNew: true }),
  p(16, { name: '床上四件套', price: 60, originalPrice: 199, category: 'daily', description: '1.5m床，洗过两次', condition: '99新', publishTime: '2024-01-29 18:00', isHot: false, isNew: true }),
  p(17, { name: '罗技 G304 鼠标', price: 120, originalPrice: 199, category: 'digital', description: '无线，送电池', condition: '98新', publishTime: '2024-01-30 11:10', isHot: true, isNew: false }),
  p(18, { name: '英语四级真题集', price: 20, originalPrice: 45, category: 'books', description: '2023版，附听力', condition: '全新', publishTime: '2024-01-30 15:20', isHot: false, isNew: true }),
  p(19, { name: '双肩背包', price: 75, originalPrice: 259, category: 'clothing', description: '容量大，适合上课', condition: '良好', publishTime: '2024-01-31 08:40', isHot: false, isNew: true }),
  p(20, { name: '小冰箱 单门', price: 280, originalPrice: 599, category: 'daily', description: '制冷正常，毕业甩卖', condition: '良好', publishTime: '2024-01-31 13:00', isHot: true, isNew: false }),
  p(21, { name: 'Kindle Paperwhite', price: 450, originalPrice: 998, category: 'digital', description: '屏幕无坏点，送保护套', condition: '95新', publishTime: '2024-02-01 10:15', isHot: false, isNew: true }),
  p(22, { name: '概率论与数理统计', price: 28, originalPrice: 58, category: 'books', description: '老师推荐版', condition: '良好', publishTime: '2024-02-01 14:50', isHot: false, isNew: true }),
  p(23, { name: '针织开衫 M码', price: 65, originalPrice: 199, category: 'clothing', description: '春秋可穿，柔软不起球', condition: '99新', publishTime: '2024-02-02 09:20', isHot: false, isNew: true }),
  p(24, { name: '瑜伽垫', price: 35, originalPrice: 89, category: 'daily', description: '加厚款，无异味', condition: '全新', publishTime: '2024-02-02 16:30', isHot: false, isNew: true }),
  p(25, { name: 'AirPods Pro 二代', price: 980, originalPrice: 1899, category: 'digital', description: '续航正常，盒有划痕', condition: '95新', publishTime: '2024-02-03 11:00', isHot: true, isNew: true }),
  p(26, { name: '数据结构教材', price: 32, originalPrice: 69, category: 'books', description: '清华版，笔记少', condition: '良好', publishTime: '2024-02-03 15:40', isHot: false, isNew: true }),
  p(27, { name: '运动短裤 XL', price: 40, originalPrice: 129, category: 'clothing', description: '速干面料', condition: '全新', publishTime: '2024-02-04 08:50', isHot: false, isNew: true }),
  p(28, { name: '收纳箱 3个装', price: 25, originalPrice: 59, category: 'daily', description: '毕业清仓', condition: '良好', publishTime: '2024-02-04 12:10', isHot: false, isNew: true }),
  p(29, { name: '显示器 24寸 1080P', price: 380, originalPrice: 899, category: 'digital', description: '无坏点，送HDMI线', condition: '98新', publishTime: '2024-02-05 10:30', isHot: true, isNew: true }),
  p(30, { name: '马克思主义基本原理', price: 18, originalPrice: 42, category: 'books', description: '考试已过，便宜出', condition: '良好', publishTime: '2024-02-05 14:20', isHot: false, isNew: true }),
  p(31, { name: '帆布鞋 41码', price: 55, originalPrice: 199, category: 'clothing', description: '白色，洗得很干净', condition: '良好', publishTime: '2024-02-06 09:00', isHot: false, isNew: true }),
  p(32, { name: '吹风机', price: 50, originalPrice: 129, category: 'daily', description: '大功率，风力足', condition: '95新', publishTime: '2024-02-06 17:45', isHot: false, isNew: true }),
  p(33, { name: '机械键盘 红轴', price: 180, originalPrice: 399, category: 'digital', description: 'RGB背光，键帽齐全', condition: '98新', publishTime: '2024-02-07 11:20', isHot: true, isNew: true }),
  p(34, { name: '计算机网络教材', price: 35, originalPrice: 79, category: 'books', description: '谢希仁版第七版', condition: '良好', publishTime: '2024-02-07 15:00', isHot: false, isNew: true }),
  p(35, { name: '卫衣连帽 L码', price: 85, originalPrice: 259, category: 'clothing', description: '纯棉，秋冬款', condition: '99新', publishTime: '2024-02-08 10:10', isHot: false, isNew: true }),
  p(36, { name: '晾衣架 落地式', price: 40, originalPrice: 99, category: 'daily', description: '可折叠，宿舍适用', condition: '良好', publishTime: '2024-02-08 16:30', isHot: false, isNew: true })
]

export const mockReviews = [
  { id: 1, productId: 1, userId: 10, userName: '买家A', avatar: '', rating: 5, content: '手机成色很好，卖家很靠谱！', time: '2024-01-20 14:30' },
  { id: 2, productId: 1, userId: 11, userName: '买家B', avatar: '', rating: 4, content: '整体不错，物流有点慢', time: '2024-01-22 09:15' },
  { id: 3, productId: 2, userId: 12, userName: '买家C', avatar: '', rating: 5, content: '书很新，性价比高', time: '2024-01-25 16:45' },
  { id: 4, productId: 5, userId: 13, userName: '小陈', avatar: '', rating: 5, content: 'Mac 很新，当面交易放心', time: '2024-01-28 11:00' },
  { id: 5, productId: 7, userId: 14, userName: '耳机控', avatar: '', rating: 5, content: '降噪给力，续航够用', time: '2024-02-01 09:30' },
  { id: 6, productId: 9, userId: 15, userName: '平板用户', avatar: '', rating: 4, content: '屏幕无划痕，送壳很实用', time: '2024-02-03 14:20' },
  { id: 7, productId: 13, userId: 16, userName: '考研党', avatar: '', rating: 5, content: '手写笔灵敏，做笔记方便', time: '2024-02-05 10:15' },
  { id: 8, productId: 20, userId: 17, userName: '宿舍长', avatar: '', rating: 4, content: '冰箱制冷快，噪音不大', time: '2024-02-06 18:00' }
]

export const mockOrders = [
  { id: 'ORD001', productId: 1, productName: 'iPhone 14 Pro Max 256G', productImage: 'https://picsum.photos/400/300?random=1', price: 5999, quantity: 1, status: 'pending', statusText: '待付款', seller: '张三', createTime: '2024-02-08 10:30', address: '北京市海淀区清华大学', reviewed: false },
  { id: 'ORD002', productId: 2, productName: '高等数学（第七版）', productImage: 'https://picsum.photos/400/300?random=2', price: 25, quantity: 1, status: 'shipped', statusText: '待发货', seller: '李四', createTime: '2024-02-07 14:20', address: '北京市海淀区北京大学', reviewed: false },
  { id: 'ORD003', productId: 3, productName: 'Nike 运动外套 M码', productImage: 'https://picsum.photos/400/300?random=3', price: 180, quantity: 1, status: 'completed', statusText: '已完成', seller: '王五', createTime: '2024-02-01 09:15', address: '北京市朝阳区', reviewed: false },
  { id: 'ORD004', productId: 9, productName: 'iPad Air 5 64G', productImage: 'https://picsum.photos/400/300?random=9', price: 2800, quantity: 1, status: 'pending', statusText: '待付款', seller: '张三', createTime: '2024-02-08 11:00', address: '上海市杨浦区复旦大学', reviewed: false },
  { id: 'ORD005', productId: 12, productName: '电热水壶 1.7L', productImage: 'https://picsum.photos/400/300?random=12', price: 45, quantity: 2, status: 'shipped', statusText: '待发货', seller: '赵六', createTime: '2024-02-06 16:30', address: '广州市天河区中山大学', reviewed: false },
  { id: 'ORD006', productId: 17, productName: '罗技 G304 鼠标', productImage: 'https://picsum.photos/400/300?random=17', price: 120, quantity: 1, status: 'completed', statusText: '已完成', seller: '周九', createTime: '2024-01-28 10:00', address: '武汉市洪山区华中科技大学', reviewed: true },
  { id: 'ORD007', productId: 25, productName: 'AirPods Pro 二代', productImage: 'https://picsum.photos/400/300?random=25', price: 980, quantity: 1, status: 'completed', statusText: '已完成', seller: '吴十', createTime: '2024-02-04 09:20', address: '南京市鼓楼区南京大学', reviewed: false },
  { id: 'ORD008', productId: 29, productName: '显示器 24寸 1080P', productImage: 'https://picsum.photos/400/300?random=29', price: 380, quantity: 1, status: 'shipped', statusText: '待发货', seller: '钱七', createTime: '2024-02-07 15:45', address: '成都市武侯区四川大学', reviewed: false }
]

export const mockMyProducts = [
  { id: 101, name: '我的闲置键盘', price: 150, category: 'digital', condition: '良好', description: '机械键盘，青轴', image: 'https://picsum.photos/400/300?random=50', status: 'active', publishTime: '2024-01-20', views: 156, stock: 1 },
  { id: 102, name: '二手自行车', price: 300, category: 'daily', condition: '一般', description: '骑行正常，送锁', image: 'https://picsum.photos/400/300?random=51', status: 'sold', publishTime: '2024-01-15', views: 328, stock: 0 },
  { id: 103, name: '考研英语词汇书', price: 22, category: 'books', condition: '良好', description: '红宝书，有笔记', image: 'https://picsum.photos/400/300?random=52', status: 'active', publishTime: '2024-02-05', views: 89, stock: 1 },
  { id: 104, name: '电竞椅', price: 420, category: 'daily', condition: '95新', description: '腰部支撑好，毕业出', image: 'https://picsum.photos/400/300?random=53', status: 'active', publishTime: '2024-02-06', views: 245, stock: 1 },
  { id: 105, name: '相机三脚架', price: 80, category: 'digital', condition: '99新', description: '只用过两次', image: 'https://picsum.photos/400/300?random=54', status: 'active', publishTime: '2024-02-07', views: 67, stock: 1 }
]

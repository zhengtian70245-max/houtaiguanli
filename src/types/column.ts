// 专栏类型定义

// 专栏状态
export enum ColumnStatus {
  DRAFT = 0,      // 草稿
  PUBLISHED = 1,   // 已上架
  UNPUBLISHED = 2  // 已下架
}

// 专栏类型
export enum ColumnType {
  PRODUCTION = 1,  // 生产资料
  SALES = 2        // 销售资料
}

// 商品详情类型
export enum DetailType {
  INDEPENDENT = 1, // 独立详情页
  DEFAULT = 2      // 课程默认设置
}

// 购买方式
export enum PurchaseType {
  SINGLE = 1,      // 单独购买
  SUBSCRIPTION = 2, // 订阅
  FRANCHISE = 3    // 加盟
}

// 专栏权益
export enum RightsType {
  LIFETIME = 1,    // 长期有效
  THIRTY_DAYS = 2  // 购买后30天
}

// 上架选项
export enum PublishOption {
  IMMEDIATE = 1,   // 立即上架
  SCHEDULED = 2,   // 定时上架
  UNPUBLISHED = 3  // 暂不上架
}

// 专栏分类接口
export interface ColumnCategory {
  id: number
  name: string
  parentId: number
  order: number
  description?: string
  createTime: string
  updateTime: string
}

// 专栏销售信息接口
export interface ColumnSales {
  originalPrice: number
  price: number
  purchaseType: string
  enableDistribution: boolean
  recommend: boolean
  rights: string
}

// 专栏发布信息接口
export interface ColumnPublish {
  publishOption: string
  publishTime: Date
  downloadSettings: string[]
  accessTime: string
}

// 关联课程接口
export interface RelatedCourse {
  id: number
  title: string
  cover: string
  price: string
  status: number
}

// 专栏接口
export interface Column {
  id: number
  name: string
  cover: string
  categoryId: number
  categoryName?: string
  columnType: string
  contentTypes: string[]
  detailType: string
  updateNotice: boolean
  intro: string
  detail: string
  sales: ColumnSales
  publish: ColumnPublish
  relatedCourses: RelatedCourse[]
  courseCount?: number
  status: number
  order: number
  createAccount?: string
  createTime: string
  updateTime: string
}

// 专栏搜索表单接口
export interface ColumnSearchForm {
  name: string
  category: string
  status: string
  purchaseType: string
  materialStatus: string
  account: string
  createTime: any[]
  priceMin: string
  priceMax: string
  vipDiscountMin: string
  vipDiscountMax: string
  svipDiscountMin: string
  svipDiscountMax: string
}

// 专栏列表项接口
export interface ColumnListItem {
  id: number
  name: string
  cover: string
  price: string
  originalPrice: string
  categoryName: string
  status: number
  courseCount: number
  createTime: string
  order: number
  createAccount: string
}

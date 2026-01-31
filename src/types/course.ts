// 课程相关数据结构定义

// 课程类型枚举
export enum CourseType {
  VIDEO = 1,  // 视频课程
  AUDIO = 2,  // 音频课程
  MIXED = 3   // 混合课程
}

// 课程状态枚举
export enum CourseStatus {
  DRAFT = 0,    // 草稿
  PUBLISHED = 1, // 已发布
  OFFLINE = 2    // 已下架
}

// 课件类型枚举
export enum CoursewareType {
  VIDEO = 1,  // 视频
  AUDIO = 2   // 音频
}

// 课件状态枚举
export enum CoursewareStatus {
  UPLOADING = 0,    // 上传中
  TRANSCODING = 1,  // 转码中
  READY = 2,        // 就绪
  FAILED = 3        // 失败
}

// 会员等级
export interface VipLevel {
  id: number;
  name: string;
  level: number;
  price: number;
  duration: number; // 有效期（天）
  isActive: boolean;
}

// 专栏
export interface Column {
  id: number;
  title: string;
  cover: string;
  intro: string;
  price: number;
  courseIds: number[];
  status: boolean;
  createTime: string;
  updateTime: string;
}

// 章节
export interface Chapter {
  id: number;
  title: string;
  order: number;
  coursewareIds: number[];
  createTime: string;
  updateTime: string;
}

// 课件
export interface Courseware {
  id: number;
  title: string;
  type: CoursewareType;
  url: string;
  duration: number; // 时长（秒）
  size: number;     // 文件大小（字节）
  status: CoursewareStatus;
  chapterId: number;
  description: string;
  materialId: number; // 关联素材库ID
  uploadTime: string;
  updateTime: string;
}

// 课程设置
export interface CourseSettings {
  // 基础设置
  infoCollection: boolean;    // 是否开启信息采集
  entryGuide: boolean;         // 是否开启入学引导
  
  // 邀请设置
  inviteSettings: {
    inviteCodeCount: number;   // 邀请码数量
    inviteCount: number;       // 邀请人数
  };
  
  // 创作主体设置
  mainProduct: string;         // 关联商品
  
  // 关联设置
  relatedSettings: {
    keywords: string[];        // 关键词
    sellingPoints: string[];   // 卖点标签
    categories: string[];      // 分类标签
    tags: string[];            // 视频标签
    relatedBooks: string[];    // 关联电子书
    relatedCircles: string[];  // 关联圈子
  };
  
  // 其他设置
  interactiveSettings: any;    // 互动设置
  trafficSettings: any;        // 流量设置
  deliverySettings: any;       // 投放设置
}

// 课程统计数据
export interface CourseStats {
  // 学习数据
  learningData: {
    userCount: number;          // 学习人数
    viewCount: number;          // 浏览量
    payCount: number;           // 支付人数
    payAmount: number;          // 支付金额
    conversionRate: number;     // 转化率
    orderCount: number;         // 订单量
    chartData: Array<{
      date: string;
      value: number;
    }>;
  };
  
  // 流量数据
  trafficData: {
    chartData: Array<{
      date: string;
      value: number;
    }>;
  };
  
  // 分销数据
  distributionData: {
    payAmount: number;          // 支付金额
    orderCount: number;         // 订单量
    commission: number;         // 推广佣金
    conversionRate: number;     // 转化率
    actualIncome: number;       // 实际收入
    chartData: Array<{
      date: string;
      value: number;
    }>;
  };
}

// 学员学习进度
export interface LearningProgress {
  id: number;
  userId: number;
  courseId: number;
  completedCoursewareIds: number[];
  currentCoursewareId: number;
  totalProgress: number;        // 总进度（百分比）
  totalLearningTime: number;    // 总学习时长（分钟）
  lastLearningTime: string;      // 最后学习时间
  isCompleted: boolean;
}

// 学员
export interface Student {
  id: number;
  userId: number;
  userName: string;
  avatar: string;
  studentType: string;           // 学员类型
  level: string;                 // 等级
  referrer: string;              // 推荐人
  status: string;                // 状态
  learningProgress: number;      // 学习进度
  learningTime: number;          // 学习时长（分钟）
  phone: string;
  joinTime: string;
}

// 课程
export interface Course {
  id: number;
  title: string;
  subtitle: string;
  type: CourseType;
  categoryId: number;
  categoryName: string;
  cover: string;
  intro: string;
  detail: string;
  price: number;
  originalPrice: number;
  vipPrice: number;
  vipLevelRequired: number;     // 所需会员等级
  totalDuration: number;        // 总时长（分钟）
  totalCoursewares: number;     // 总课件数
  totalChapters: number;        // 总章节数
  status: CourseStatus;
  columnId: number;             // 所属专栏ID
  columnName: string;
  settings: CourseSettings;
  chapters: Chapter[];
  coursewares: Courseware[];
  stats: CourseStats;
  students: Student[];
  createTime: string;
  updateTime: string;
  publishTime: string;
}

// 订单
export interface CourseOrder {
  id: number;
  orderNo: string;
  userId: number;
  userName: string;
  courseId: number;
  courseTitle: string;
  price: number;
  paymentMethod: string;
  paymentStatus: boolean;
  orderStatus: string;
  createTime: string;
  payTime: string;
  refundTime: string;
  refundAmount: number;
}

// 课程评论
export interface CourseComment {
  id: number;
  userId: number;
  userName: string;
  avatar: string;
  courseId: number;
  content: string;
  rating: number;               // 评分（1-5星）
  reply: string;
  status: boolean;
  createTime: string;
  updateTime: string;
}

// 课程搜索参数
export interface CourseSearchParams {
  keyword?: string;
  categoryId?: number;
  type?: CourseType;
  status?: CourseStatus;
  vipLevelRequired?: number;
  startPrice?: number;
  endPrice?: number;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 课程响应数据
export interface CourseResponse {
  list: Course[];
  total: number;
  page: number;
  pageSize: number;
}

// 课件搜索参数
export interface CoursewareSearchParams {
  keyword?: string;
  type?: CoursewareType;
  status?: CoursewareStatus;
  chapterId?: number;
  courseId?: number;
  page: number;
  pageSize: number;
}

// 课件响应数据
export interface CoursewareResponse {
  list: Courseware[];
  total: number;
  page: number;
  pageSize: number;
}

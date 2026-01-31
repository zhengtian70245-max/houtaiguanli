<template>
  <div class="column-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ isCreate ? '创建专栏' : '专栏详情' }}</h1>
      <div class="header-actions">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <el-button type="primary" @click="handleSave">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
        <el-button type="warning" @click="handlePreview">
          <el-icon><View /></el-icon>
          预览
        </el-button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-content">
      <el-card shadow="hover" class="form-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-form :model="columnForm" label-width="120px" class="detail-form">
          <!-- 专栏名称 -->
          <el-form-item label="专栏名称" prop="name" required>
            <el-input
              v-model="columnForm.name"
              placeholder="请输入专栏名称，最多不超过11个字"
              :maxlength="11"
            />
            <div class="form-tip">* 专栏名称，最多不超过11个字</div>
          </el-form-item>

          <!-- 专栏封面 -->
          <el-form-item label="专栏封面" prop="cover" required>
            <div class="cover-upload">
              <div class="cover-preview" v-if="columnForm.cover">
                <img :src="columnForm.cover" alt="专栏封面" />
                <el-button type="text" @click="handleRemoveCover" class="remove-btn">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
              <div class="cover-placeholder" v-else>
                <el-icon><PictureFilled /></el-icon>
                <span>上传图片</span>
                <input type="file" class="file-input" @change="handleCoverUpload" accept="image/jpg,image/png" />
              </div>
              <div class="form-tip">* 图片尺寸750*750px，支持jpg、png格式，且不能超过2M</div>
            </div>
          </el-form-item>

          <!-- 所属分类 -->
          <el-form-item label="所属分类">
            <el-select v-model="columnForm.categoryId" placeholder="请选择所属分类">
              <el-option label="默认分组" :value="1" />
              <el-option label="热门专栏" :value="2" />
              <el-option label="推荐专栏" :value="3" />
            </el-select>
          </el-form-item>

          <!-- 专栏类型 -->
          <el-form-item label="专栏类型">
            <el-radio-group v-model="columnForm.columnType">
              <el-radio label="1">生产资料</el-radio>
              <el-radio label="2">销售资料</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 内容类型 -->
          <el-form-item label="内容类型">
            <el-checkbox-group v-model="columnForm.contentTypes">
              <el-checkbox label="1"><el-icon><Document /></el-icon> 文章</el-checkbox>
              <el-checkbox label="2"><el-icon><PictureFilled /></el-icon> 图文</el-checkbox>
              <el-checkbox label="3"><el-icon><VideoCameraFilled /></el-icon> 视频</el-checkbox>
              <el-checkbox label="4"><el-icon><Headset /></el-icon> 音频</el-checkbox>
              <el-checkbox label="5"><el-icon><Reading /></el-icon> 课程</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- 商品详情类型 -->
          <el-form-item label="商品详情类型">
            <el-radio-group v-model="columnForm.detailType">
              <el-radio label="1">独立详情页</el-radio>
              <el-radio label="2">课程默认设置</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 内容更新提示 -->
          <el-form-item label="内容更新提示">
            <el-switch v-model="columnForm.updateNotice" />
            <span class="switch-tip">添加新内容时通知</span>
          </el-form-item>

          <!-- 专栏简介 -->
          <el-form-item label="专栏简介">
            <el-input
              v-model="columnForm.intro"
              type="textarea"
              :rows="3"
              placeholder="请输入专栏简介"
            />
          </el-form-item>

          <!-- 专栏详情 -->
          <el-form-item label="专栏详情">
            <div class="rich-text-editor">
              <!-- 模拟富文本编辑器 -->
              <el-input
                v-model="columnForm.detail"
                type="textarea"
                :rows="8"
                placeholder="请输入专栏详情"
              />
              <div class="editor-toolbar">
                <el-button size="small" @click="handleInsertImage">
                  <el-icon><PictureFilled /></el-icon>
                  插入图片
                </el-button>
                <el-button size="small" @click="handleInsertVideo">
                  <el-icon><VideoCameraFilled /></el-icon>
                  插入视频
                </el-button>
                <el-button size="small" @click="handleInsertAudio">
                  <el-icon><Headset /></el-icon>
                  插入音频
                </el-button>
                <el-button size="small" @click="handleInsertCourse">
                  <el-icon><Reading /></el-icon>
                  插入课程
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="hover" class="form-card" style="margin-top: 24px;">
        <template #header>
          <div class="card-header">
            <span>销售信息</span>
          </div>
        </template>
        <el-form :model="columnForm.sales" label-width="120px" class="detail-form">
          <!-- 原价 -->
          <el-form-item label="原价">
            <el-input-number
              v-model="columnForm.sales.originalPrice"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入原价"
            />
          </el-form-item>

          <!-- 现价 -->
          <el-form-item label="现价" prop="price" required>
            <el-input-number
              v-model="columnForm.sales.price"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入现价"
            />
          </el-form-item>

          <!-- 购买方式 -->
          <el-form-item label="购买方式">
            <el-radio-group v-model="columnForm.sales.purchaseType">
              <el-radio label="1">单独购买</el-radio>
              <el-radio label="2">订阅</el-radio>
              <el-radio label="3">加盟</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 分销设置 -->
          <el-form-item label="分销设置">
            <el-switch v-model="columnForm.sales.enableDistribution" />
            <span class="switch-tip">启用分销</span>
            <el-button size="small" type="text" @click="handleDistributionSettings" style="margin-left: 10px;">
              设置分销比例
            </el-button>
          </el-form-item>

          <!-- 推荐用户 -->
          <el-form-item label="推荐用户">
            <el-switch v-model="columnForm.sales.recommend" />
            <span class="switch-tip">是否推荐</span>
          </el-form-item>

          <!-- 专栏权益 -->
          <el-form-item label="专栏权益">
            <el-radio-group v-model="columnForm.sales.rights">
              <el-radio label="1">长期有效</el-radio>
              <el-radio label="2">购买后30天</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="hover" class="form-card" style="margin-top: 24px;">
        <template #header>
          <div class="card-header">
            <span>上架设置</span>
          </div>
        </template>
        <el-form :model="columnForm.publish" label-width="120px" class="detail-form">
          <!-- 上架选项 -->
          <el-form-item label="上架选项">
            <el-radio-group v-model="columnForm.publish.publishOption">
              <el-radio label="1">立即上架</el-radio>
              <el-radio label="2">定时上架</el-radio>
              <el-radio label="3">暂不上架</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 上架时间 -->
          <el-form-item label="上架时间" v-if="columnForm.publish.publishOption === '2'">
            <el-date-picker
              v-model="columnForm.publish.publishTime"
              type="datetime"
              placeholder="请选择上架时间"
              style="width: 100%"
            />
            <div class="form-tip">提示：上架时间必须是当前时间之后，否则将自动改为立即上架</div>
          </el-form-item>

          <!-- 下载设置 -->
          <el-form-item label="下载设置">
            <el-checkbox-group v-model="columnForm.publish.downloadSettings">
              <el-checkbox label="1">允许下载</el-checkbox>
              <el-checkbox label="2">定时访问</el-checkbox>
            </el-checkbox-group>
            <el-input
              v-if="columnForm.publish.downloadSettings.includes('2')"
              v-model="columnForm.publish.accessTime"
              placeholder="请输入访问时间"
              style="width: 200px; margin-top: 10px;"
            />
            <div class="form-tip">提示：文件类型、免费/付费内容的下载方式不相同，且受平台协议约束。例如：视频、音频、图片、文档、大文件、高清资源、VIP资源等。小程序端的视频将自动转为链接</div>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="hover" class="form-card" style="margin-top: 24px;">
        <template #header>
          <div class="card-header">
            <span>关联课程</span>
            <el-button size="small" type="primary" @click="handleAddCourse">
              <el-icon><Plus /></el-icon>
              添加课程
            </el-button>
          </div>
        </template>
        <div class="related-courses">
          <el-table
            :data="columnForm.relatedCourses"
            style="width: 100%"
            border
          >
            <el-table-column prop="id" label="课程ID" width="100" align="center" />
            <el-table-column label="课程封面" width="100" align="center">
              <template #default="{ row }">
                <img :src="row.cover" alt="课程封面" style="width: 60px; height: 60px; object-fit: cover;" />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="课程名称" min-width="200" />
            <el-table-column prop="price" label="价格" width="100" align="center" />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                  {{ row.status === 1 ? '已发布' : '未发布' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button size="small" type="danger" @click="handleRemoveCourse(row.id)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="empty-courses" v-if="columnForm.relatedCourses.length === 0">
            <el-icon class="empty-icon"><Document /></el-icon>
            <p>暂无关联课程，请点击上方按钮添加</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分销设置对话框 -->
    <el-dialog
      v-model="distributionDialogVisible"
      title="分销设置"
      width="400px"
    >
      <el-form :model="distributionForm" label-width="100px">
        <el-form-item label="分销比例">
          <el-input-number
            v-model="distributionForm.rate"
            :min="0"
            :max="100"
            :step="1"
            suffix="%"
          />
        </el-form-item>
        <el-form-item label="分销层级">
          <el-select v-model="distributionForm.level">
            <el-option label="一级分销" :value="1" />
            <el-option label="二级分销" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="distributionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveDistribution">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加课程对话框 -->
    <el-dialog
      v-model="addCourseDialogVisible"
      title="添加课程"
      width="800px"
    >
      <el-form :inline="true" :model="courseSearchForm" class="search-form">
        <el-form-item label="课程名称">
          <el-input v-model="courseSearchForm.name" placeholder="请输入课程名称" clearable />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="courseSearchForm.category" placeholder="请选择课程分类" clearable>
            <el-option label="前端开发" :value="1" />
            <el-option label="后端开发" :value="2" />
            <el-option label="移动开发" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchCourse">搜索</el-button>
          <el-button @click="handleResetCourseSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="courseLoading"
        :data="availableCourses"
        style="width: 100%"
        border
        stripe
        @selection-change="handleCourseSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="课程ID" width="100" align="center" />
        <el-table-column label="课程封面" width="100" align="center">
          <template #default="{ row }">
            <img :src="row.cover" alt="课程封面" style="width: 60px; height: 60px; object-fit: cover;" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="课程名称" min-width="200" />
        <el-table-column prop="price" label="价格" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '已发布' : '未发布' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCourseDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmAddCourse">确定添加</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 是否为创建模式
const isCreate = computed(() => route.path.includes('/create'))
const columnId = computed(() => route.params.id as string)

// 分销设置对话框
const distributionDialogVisible = ref(false)
// 添加课程对话框
const addCourseDialogVisible = ref(false)
// 课程加载状态
const courseLoading = ref(false)
// 选中的课程
const selectedCourses = ref([])

// 专栏表单
const columnForm = reactive({
  id: 0,
  name: '',
  cover: '',
  categoryId: 1,
  columnType: '1',
  contentTypes: ['1', '2', '3', '4', '5'],
  detailType: '1',
  updateNotice: true,
  intro: '',
  detail: '',
  sales: {
    originalPrice: 0,
    price: 0,
    purchaseType: '1',
    enableDistribution: false,
    recommend: false,
    rights: '1'
  },
  publish: {
    publishOption: '1',
    publishTime: new Date(),
    downloadSettings: ['1'],
    accessTime: ''
  },
  relatedCourses: []
})

// 分销设置表单
const distributionForm = reactive({
  rate: 20,
  level: 1
})

// 课程搜索表单
const courseSearchForm = reactive({
  name: '',
  category: ''
})

// 可选课程列表
const availableCourses = ref([
  {
    id: 1,
    title: 'JavaScript基础教程',
    cover: 'https://via.placeholder.com/60x60',
    price: '¥99.00',
    status: 1
  },
  {
    id: 2,
    title: 'Vue3实战开发',
    cover: 'https://via.placeholder.com/60x60',
    price: '¥199.00',
    status: 1
  },
  {
    id: 3,
    title: 'React入门到精通',
    cover: 'https://via.placeholder.com/60x60',
    price: '¥299.00',
    status: 1
  },
  {
    id: 4,
    title: 'Node.js后端开发',
    cover: 'https://via.placeholder.com/60x60',
    price: '¥199.00',
    status: 2
  }
])

// 初始化
onMounted(() => {
  if (!isCreate.value && columnId.value) {
    // 模拟加载专栏数据
    loadColumnData()
  }
})

// 加载专栏数据
const loadColumnData = () => {
  // 模拟数据
  Object.assign(columnForm, {
    id: Number(columnId.value),
    name: '自动化思考模型',
    cover: 'https://via.placeholder.com/150x150',
    categoryId: 1,
    columnType: '1',
    contentTypes: ['1', '2', '3', '4', '5'],
    detailType: '1',
    updateNotice: true,
    intro: '本专栏介绍自动化思考模型，帮助你提升思考效率',
    detail: '详细介绍自动化思考模型的原理和应用方法...',
    sales: {
      originalPrice: 199,
      price: 99,
      purchaseType: '1',
      enableDistribution: true,
      recommend: true,
      rights: '1'
    },
    publish: {
      publishOption: '1',
      publishTime: new Date(),
      downloadSettings: ['1'],
      accessTime: ''
    },
    relatedCourses: [
      {
        id: 1,
        title: 'JavaScript基础教程',
        cover: 'https://via.placeholder.com/60x60',
        price: '¥99.00',
        status: 1
      },
      {
        id: 2,
        title: 'Vue3实战开发',
        cover: 'https://via.placeholder.com/60x60',
        price: '¥199.00',
        status: 1
      }
    ]
  })
}

// 返回列表
const handleBack = () => {
  router.push('/column/list')
}

// 保存
const handleSave = () => {
  if (!columnForm.name) {
    ElMessage.warning('请输入专栏名称')
    return
  }
  if (!columnForm.cover) {
    ElMessage.warning('请上传专栏封面')
    return
  }
  if (!columnForm.sales.price) {
    ElMessage.warning('请输入专栏价格')
    return
  }

  // 模拟保存
  setTimeout(() => {
    ElMessage.success(isCreate.value ? '创建成功' : '保存成功')
    if (isCreate.value) {
      router.push('/column/list')
    }
  }, 500)
}

// 预览
const handlePreview = () => {
  ElMessage.info('预览功能开发中')
}

// 移除封面
const handleRemoveCover = () => {
  columnForm.cover = ''
}

// 上传封面
const handleCoverUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.warning('图片大小不能超过2M')
      return
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      ElMessage.warning('只支持jpg、png格式的图片')
      return
    }
    // 模拟上传
    setTimeout(() => {
      columnForm.cover = URL.createObjectURL(file)
      ElMessage.success('上传成功')
    }, 500)
  }
}

// 分销设置
const handleDistributionSettings = () => {
  distributionDialogVisible.value = true
}

// 保存分销设置
const handleSaveDistribution = () => {
  distributionDialogVisible.value = false
  ElMessage.success('分销设置保存成功')
}

// 插入图片
const handleInsertImage = () => {
  ElMessage.info('插入图片功能开发中')
}

// 插入视频
const handleInsertVideo = () => {
  ElMessage.info('插入视频功能开发中')
}

// 插入音频
const handleInsertAudio = () => {
  ElMessage.info('插入音频功能开发中')
}

// 插入课程
const handleInsertCourse = () => {
  ElMessage.info('插入课程功能开发中')
}

// 添加课程
const handleAddCourse = () => {
  addCourseDialogVisible.value = true
}

// 搜索课程
const handleSearchCourse = () => {
  courseLoading.value = true
  // 模拟搜索
  setTimeout(() => {
    courseLoading.value = false
    ElMessage.success('搜索成功')
  }, 500)
}

// 重置课程搜索
const handleResetCourseSearch = () => {
  Object.keys(courseSearchForm).forEach(key => {
    courseSearchForm[key as keyof typeof courseSearchForm] = ''
  })
}

// 课程选择变化
const handleCourseSelectionChange = (val: any[]) => {
  selectedCourses.value = val
}

// 确认添加课程
const handleConfirmAddCourse = () => {
  if (selectedCourses.value.length === 0) {
    ElMessage.warning('请选择要添加的课程')
    return
  }

  // 检查是否已存在
  selectedCourses.value.forEach(course => {
    const exists = columnForm.relatedCourses.some(item => item.id === course.id)
    if (!exists) {
      columnForm.relatedCourses.push(course)
    }
  })

  addCourseDialogVisible.value = false
  ElMessage.success(`成功添加 ${selectedCourses.value.length} 门课程`)
}

// 移除课程
const handleRemoveCourse = (courseId: number) => {
  columnForm.relatedCourses = columnForm.relatedCourses.filter(item => item.id !== courseId)
  ElMessage.success('移除成功')
}
</script>

<style scoped lang="scss">
.column-detail {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .form-content {
    .form-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
      }

      .detail-form {
        .form-tip {
          color: #999;
          font-size: 12px;
          margin-top: 5px;
        }

        .switch-tip {
          margin-left: 10px;
          color: #666;
        }

        .cover-upload {
          .cover-preview {
            position: relative;
            display: inline-block;
            
            img {
              width: 150px;
              height: 150px;
              object-fit: cover;
              border-radius: 4px;
            }

            .remove-btn {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.5);
              color: #fff;
              border-radius: 0 0 4px 4px;
              margin: 0;
            }
          }

          .cover-placeholder {
            width: 150px;
            height: 150px;
            border: 1px dashed #d9d9d9;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #1890ff;
              color: #1890ff;
            }

            .el-icon {
              font-size: 24px;
              margin-bottom: 8px;
            }

            .file-input {
              position: absolute;
              width: 150px;
              height: 150px;
              opacity: 0;
              cursor: pointer;
            }
          }
        }

        .rich-text-editor {
          position: relative;

          .editor-toolbar {
            position: absolute;
            bottom: 10px;
            right: 10px;
            display: flex;
            gap: 5px;
          }
        }
      }

      .related-courses {
        min-height: 300px;

        .empty-courses {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          color: #999;

          .empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
        }
      }
    }
  }
}
</style>
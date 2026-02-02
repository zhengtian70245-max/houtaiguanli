<template>
  <div class="column-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ isCreate ? '创建专栏' : '专栏详情' }}</h1>
      <div class="header-actions">
        <a-button @click="handleBack">
          <template #icon>
            <icon-arrow-left />
          </template>
          返回列表
        </a-button>
        <a-button type="primary" @click="handleSave">
          <template #icon>
            <icon-check />
          </template>
          保存
        </a-button>
        <a-button type="warning" @click="handlePreview">
          <template #icon>
            <icon-eye />
          </template>
          预览
        </a-button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-content">
      <a-card :bordered="false" class="form-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <a-form :model="columnForm" label-width="120px" class="detail-form">
          <!-- 专栏名称 -->
          <a-form-item label="专栏名称" prop="name" required>
            <a-input
              v-model="columnForm.name"
              placeholder="请输入专栏名称，最多不超过11个字"
              :maxlength="11"
            />
            <div class="form-tip">* 专栏名称，最多不超过11个字</div>
          </a-form-item>

          <!-- 专栏封面 -->
          <a-form-item label="专栏封面" prop="cover" required>
            <div class="cover-upload">
              <div class="cover-preview" v-if="columnForm.cover">
                <img :src="columnForm.cover" alt="专栏封面" />
                <a-button type="text" @click="handleRemoveCover" class="remove-btn">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-button>
              </div>
              <div class="cover-placeholder" v-else>
                <template #icon>
                  <icon-picture />
                </template>
                <span>上传图片</span>
                <input type="file" class="file-input" @change="handleCoverUpload" accept="image/jpg,image/png" />
              </div>
              <div class="form-tip">* 图片尺寸750*750px，支持jpg、png格式，且不能超过2M</div>
            </div>
          </a-form-item>

          <!-- 所属分类 -->
          <a-form-item label="所属分类">
            <a-select v-model="columnForm.categoryId" placeholder="请选择所属分类">
              <a-option label="默认分组" :value="1" />
              <a-option label="热门专栏" :value="2" />
              <a-option label="推荐专栏" :value="3" />
            </a-select>
          </a-form-item>

          <!-- 专栏类型 -->
          <a-form-item label="专栏类型">
            <a-radio-group v-model="columnForm.columnType">
              <a-radio value="1">生产资料</a-radio>
              <a-radio value="2">销售资料</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 内容类型 -->
          <a-form-item label="内容类型">
            <a-checkbox-group v-model="columnForm.contentTypes">
              <a-checkbox value="1">
                <template #icon>
                  <icon-document />
                </template>
                文章
              </a-checkbox>
              <a-checkbox value="2">
                <template #icon>
                  <icon-picture />
                </template>
                图文
              </a-checkbox>
              <a-checkbox value="3">
                <template #icon>
                  <icon-video />
                </template>
                视频
              </a-checkbox>
              <a-checkbox value="4">
                <template #icon>
                  <icon-audio />
                </template>
                音频
              </a-checkbox>
              <a-checkbox value="5">
                <template #icon>
                  <icon-book />
                </template>
                课程
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <!-- 商品详情类型 -->
          <a-form-item label="商品详情类型">
            <a-radio-group v-model="columnForm.detailType">
              <a-radio value="1">独立详情页</a-radio>
              <a-radio value="2">课程默认设置</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 内容更新提示 -->
          <a-form-item label="内容更新提示">
            <a-switch v-model="columnForm.updateNotice" />
            <span class="switch-tip">添加新内容时通知</span>
          </a-form-item>

          <!-- 专栏简介 -->
          <a-form-item label="专栏简介">
            <a-input
              v-model="columnForm.intro"
              type="textarea"
              :rows="3"
              placeholder="请输入专栏简介"
            />
          </a-form-item>

          <!-- 专栏详情 -->
          <a-form-item label="专栏详情">
            <div class="rich-text-editor">
              <a-input
                v-model="columnForm.detail"
                type="textarea"
                :rows="8"
                placeholder="请输入专栏详情"
              />
              <div class="editor-toolbar">
                <a-button size="small" @click="handleInsertImage">
                  <template #icon>
                    <icon-picture />
                  </template>
                  插入图片
                </a-button>
                <a-button size="small" @click="handleInsertVideo">
                  <template #icon>
                    <icon-video />
                  </template>
                  插入视频
                </a-button>
                <a-button size="small" @click="handleInsertAudio">
                  <template #icon>
                    <icon-audio />
                  </template>
                  插入音频
                </a-button>
                <a-button size="small" @click="handleInsertCourse">
                  <template #icon>
                    <icon-book />
                  </template>
                  插入课程
                </a-button>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </a-card>

      <a-card :bordered="false" class="form-card" style="margin-top: 24px;">
        <template #header>
          <div class="card-header">
            <span>销售信息</span>
          </div>
        </template>
        <a-form :model="columnForm.sales" label-width="120px" class="detail-form">
          <!-- 原价 -->
          <a-form-item label="原价">
            <a-input-number
              v-model="columnForm.sales.originalPrice"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入原价"
            />
          </a-form-item>

          <!-- 现价 -->
          <a-form-item label="现价" prop="price" required>
            <a-input-number
              v-model="columnForm.sales.price"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="请输入现价"
            />
          </a-form-item>

          <!-- 购买方式 -->
          <a-form-item label="购买方式">
            <a-radio-group v-model="columnForm.sales.purchaseType">
              <a-radio value="1">单独购买</a-radio>
              <a-radio value="2">订阅</a-radio>
              <a-radio value="3">加盟</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 分销设置 -->
          <a-form-item label="分销设置">
            <a-switch v-model="columnForm.sales.enableDistribution" />
            <span class="switch-tip">启用分销</span>
            <a-button size="small" type="text" @click="handleDistributionSettings" style="margin-left: 10px;">
              设置分销比例
            </a-button>
          </a-form-item>

          <!-- 推荐用户 -->
          <a-form-item label="推荐用户">
            <a-switch v-model="columnForm.sales.recommend" />
            <span class="switch-tip">是否推荐</span>
          </a-form-item>

          <!-- 专栏权益 -->
          <a-form-item label="专栏权益">
            <a-radio-group v-model="columnForm.sales.rights">
              <a-radio value="1">长期有效</a-radio>
              <a-radio value="2">购买后30天</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-card>

      <a-card :bordered="false" class="form-card" style="margin-top: 24px;">
        <template #header>
          <div class="card-header">
            <span>上架设置</span>
          </div>
        </template>
        <a-form :model="columnForm.publish" label-width="120px" class="detail-form">
          <!-- 上架选项 -->
          <a-form-item label="上架选项">
            <a-radio-group v-model="columnForm.publish.publishOption">
              <a-radio value="1">立即上架</a-radio>
              <a-radio value="2">定时上架</a-radio>
              <a-radio value="3">暂不上架</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 上架时间 -->
          <a-form-item label="上架时间" v-if="columnForm.publish.publishOption === '2'">
            <a-date-picker
              v-model="columnForm.publish.publishTime"
              placeholder="请选择上架时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            <div class="form-tip">提示：上架时间必须是当前时间之后，否则将自动改为立即上架</div>
          </a-form-item>

          <!-- 下载设置 -->
          <a-form-item label="下载设置">
            <a-checkbox-group v-model="columnForm.publish.downloadSettings">
              <a-checkbox value="1">允许下载</a-checkbox>
              <a-checkbox value="2">定时访问</a-checkbox>
            </a-checkbox-group>
            <a-input
              v-if="columnForm.publish.downloadSettings.includes('2')"
              v-model="columnForm.publish.accessTime"
              placeholder="请输入访问时间"
              style="width: 200px; margin-top: 10px;"
            />
            <div class="form-tip">提示：文件类型、免费/付费内容的下载方式不相同，且受平台协议约束。例如：视频、音频、图片、文档、大文件、高清资源、VIP资源等。小程序端的视频将自动转为链接</div>
          </a-form-item>
        </a-form>
      </a-card>

      <a-card :bordered="false" class="form-card" style="margin-top: 24px;">
        <template #header>
          <div class="card-header">
            <span>关联课程</span>
            <a-button size="small" type="primary" @click="handleAddCourse">
              <template #icon>
                <icon-plus />
              </template>
              添加课程
            </a-button>
          </div>
        </template>
        <div class="related-courses">
          <!-- 手动渲染的完整表格 -->
          <table class="manual-table">
            <thead>
              <tr>
                <th style="width: 100px; text-align: center;">课程ID</th>
                <th style="width: 100px; text-align: center;">课程封面</th>
                <th style="min-width: 200px;">课程名称</th>
                <th style="width: 100px; text-align: center;">价格</th>
                <th style="width: 100px; text-align: center;">状态</th>
                <th style="width: 100px; text-align: center;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in columnForm.relatedCourses" :key="item.id">
                <td style="text-align: center;">{{ item.id }}</td>
                <td style="text-align: center;">
                  <img :src="item.cover" alt="课程封面" style="width: 60px; height: 60px; object-fit: cover;" />
                </td>
                <td>{{ item.title }}</td>
                <td style="text-align: center;">{{ item.price }}</td>
                <td style="text-align: center;">
                  <a-tag :color="item.status === 1 ? 'green' : 'red'">
                    {{ item.status === 1 ? '已发布' : '未发布' }}
                  </a-tag>
                </td>
                <td style="text-align: center;">
                  <a-button size="small" type="danger" @click="handleRemoveCourse(item.id)">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="empty-courses" v-if="columnForm.relatedCourses.length === 0">
            <div class="empty-icon">
              <icon-document />
            </div>
            <p>暂无关联课程，请点击上方按钮添加</p>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 分销设置对话框 -->
    <a-modal
      v-model:visible="distributionDialogVisible"
      title="分销设置"
      width="400px"
    >
      <a-form :model="distributionForm" label-width="100px">
        <a-form-item label="分销比例">
          <a-input-number
            v-model="distributionForm.rate"
            :min="0"
            :max="100"
            :step="1"
            suffix="%"
          />
        </a-form-item>
        <a-form-item label="分销层级">
          <a-select v-model="distributionForm.level">
            <a-option value="1">一级分销</a-option>
            <a-option value="2">二级分销</a-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="distributionDialogVisible = false">取消</a-button>
        <a-button type="primary" @click="handleSaveDistribution">确定</a-button>
      </template>
    </a-modal>

    <!-- 添加课程对话框 -->
    <a-modal
      v-model:visible="addCourseDialogVisible"
      title="添加课程"
      width="800px"
    >
      <a-form :inline="true" :model="courseSearchForm" class="search-form">
        <a-form-item label="课程名称">
          <a-input v-model="courseSearchForm.name" placeholder="请输入课程名称" allow-clear />
        </a-form-item>
        <a-form-item label="课程分类">
          <a-select v-model="courseSearchForm.category" placeholder="请选择课程分类" allow-clear>
            <a-option value="1">前端开发</a-option>
            <a-option value="2">后端开发</a-option>
            <a-option value="3">移动开发</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearchCourse">搜索</a-button>
            <a-button @click="handleResetCourseSearch">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <!-- 手动渲染的完整表格 -->
      <table class="manual-table">
        <thead>
          <tr>
            <th style="width: 55px;"><input type="checkbox" /></th>
            <th style="width: 100px; text-align: center;">课程ID</th>
            <th style="width: 100px; text-align: center;">课程封面</th>
            <th style="min-width: 200px;">课程名称</th>
            <th style="width: 100px; text-align: center;">价格</th>
            <th style="width: 100px; text-align: center;">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in availableCourses" :key="item.id">
            <td><input type="checkbox" /></td>
            <td style="text-align: center;">{{ item.id }}</td>
            <td style="text-align: center;">
              <img :src="item.cover" alt="课程封面" style="width: 60px; height: 60px; object-fit: cover;" />
            </td>
            <td>{{ item.title }}</td>
            <td style="text-align: center;">{{ item.price }}</td>
            <td style="text-align: center;">
              <a-tag :color="item.status === 1 ? 'green' : 'red'">
                {{ item.status === 1 ? '已发布' : '未发布' }}
              </a-tag>
            </td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <a-button @click="addCourseDialogVisible = false">取消</a-button>
        <a-button type="primary" @click="handleConfirmAddCourse">确定添加</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconDelete,
  IconPicture,
  IconDocument,
  IconVideo,
  IconAudio,
  IconBook,
  IconPlus
} from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()

const distributionDialogVisible = ref(false)
const addCourseDialogVisible = ref(false)
const courseLoading = ref(false)
const selectedCourses = ref([])

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
    publishTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    downloadSettings: ['1'],
    accessTime: ''
  },
  relatedCourses: []
})

const distributionForm = reactive({
  rate: 20,
  level: 1
})

const courseSearchForm = reactive({
  name: '',
  category: ''
})

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

const isCreate = computed(() => route.path.includes('/create'))
const columnId = computed(() => route.params.id as string)

onMounted(() => {
  if (!isCreate.value && columnId.value) {
    const mockData = {
      id: Number(columnId.value),
      name: '自动化思考模型',
      cover: 'https://via.placeholder.com/150x150',
      categoryId: 1,
      columnType: '1',
      contentTypes: ['1', '2', '3', '4', '5'],
      detailType: '1',
      updateNotice: true,
      intro: '本平台介绍自动化思考模型，帮助你提升思考效率',
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
        publishTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
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
    }
    Object.assign(columnForm, mockData)
  }
})

const handleBack = () => {
  router.push('/column/list')
}

const handleSave = () => {
  if (!columnForm.name) {
    Message.warning('请输入专栏名称')
    return
  }
  if (!columnForm.cover) {
    Message.warning('请上传专栏封面')
    return
  }
  if (!columnForm.sales.price) {
    Message.warning('请输入专栏价格')
    return
  }

  setTimeout(() => {
    Message.success(isCreate.value ? '创建成功' : '保存成功')
    if (isCreate.value) {
      router.push('/column/list')
    }
  }, 500)
}

const handlePreview = () => {
  Message.info('预览功能开发中')
}

const handleRemoveCover = () => {
  columnForm.cover = ''
}

const handleCoverUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      Message.warning('图片大小不能超过2M')
      return
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      Message.warning('只支持jpg、png格式的图片')
      return
    }
    setTimeout(() => {
      columnForm.cover = URL.createObjectURL(file)
      Message.success('上传成功')
    }, 500)
  }
}

const handleDistributionSettings = () => {
  distributionDialogVisible.value = true
}

const handleSaveDistribution = () => {
  distributionDialogVisible.value = false
  Message.success('分销设置保存成功')
}

const handleAddCourse = () => {
  addCourseDialogVisible.value = true
}

const handleRemoveCourse = (id: number) => {
  columnForm.relatedCourses = columnForm.relatedCourses.filter(item => item.id !== id)
}

const handleConfirmAddCourse = () => {
  Message.success('添加课程成功')
  addCourseDialogVisible.value = false
}

const handleSearchCourse = () => {
  courseLoading.value = true
  setTimeout(() => {
    courseLoading.value = false
  }, 500)
}

const handleResetCourseSearch = () => {
  courseSearchForm.name = ''
  courseSearchForm.category = ''
}

const handleInsertImage = () => {
  Message.info('插入图片功能开发中')
}

const handleInsertVideo = () => {
  Message.info('插入视频功能开发中')
}

const handleInsertAudio = () => {
  Message.info('插入音频功能开发中')
}

const handleInsertCourse = () => {
  Message.info('插入课程功能开发中')
}
</script>

<style scoped lang="scss">
.form-card {
  margin-bottom: 24px;
}

.form-tip {
  color: #86909c;
  font-size: 12px;
  margin-top: 8px;
}

.switch-tip {
  margin-left: 8px;
  color: #86909c;
  font-size: 12px;
}

.rich-text-editor {
  .editor-toolbar {
    margin-top: 16px;
    padding: 16px;
    background: #f7f8fa;
    border-radius: 4px;
  }
}

.related-courses {
  .empty-courses {
    text-align: center;
    padding: 40px 0;
    color: #86909c;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
  }
}

.manual-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;

  th {
    background-color: #fafbfc;
    color: #333;
    font-weight: 500;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid #eaeef2;
    font-size: 14px;
  }

  th:first-child,
  td:first-child {
    padding-left: 20px;
  }

  th:last-child,
  td:last-child {
    padding-right: 20px;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f2f5;
    font-size: 14px;
    color: #333;
  }

  tr:hover {
    background-color: #f7f9fc;
  }

  tr:last-child td {
    border-bottom: none;
  }
}
</style>
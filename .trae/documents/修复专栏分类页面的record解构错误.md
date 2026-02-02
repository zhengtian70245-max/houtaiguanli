## 问题分析

错误信息：`TypeError: Cannot destructure property 'record' of 'undefined' as it is undefined.`

### 根本原因
- 专栏分类页面使用了 Arco Design 的 `a-table` 组件
- 在模板中使用了 `{ record }` 解构赋值，例如 `#default="{ record }"`
- 当 Arco Design 表格组件在某些情况下传递 `undefined` 作为作用域插槽的参数时，解构赋值会失败

### 解决方案

将专栏分类页面的表格实现改为与课程分类页面一致，使用原生的 `<table>` 元素和 `v-for` 循环，避免使用 Arco Design 的 `a-table` 组件及其作用域插槽。

## 修复步骤

1. **修改模板部分**：
   - 移除 `a-table` 组件
   - 使用原生 `<table>` 元素
   - 添加 `<thead>` 和 `<tbody>` 结构
   - 使用 `v-for` 循环渲染分类数据
   - 直接使用 `item` 变量，而不是解构 `record`

2. **保持功能不变**：
   - 保留所有原有的功能，包括：
     - 分类列表显示
     - 新增分类按钮
     - 编辑和删除功能
     - 排序功能
     - 分页功能

3. **优化样式**：
   - 使用与课程分类页面相同的样式结构
   - 确保表格样式美观、一致

4. **测试验证**：
   - 确保页面加载正常，无错误
   - 验证所有功能正常工作
   - 确保与课程分类页面的风格一致

## 预期结果

- 专栏分类页面不再出现 `TypeError: Cannot destructure property 'record' of 'undefined' as it is undefined.` 错误
- 页面功能完全正常
- 样式与课程分类页面一致
- 代码结构更加清晰、可靠
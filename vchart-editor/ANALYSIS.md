# VChart Editor JS Analysis Report

## 核心功能模块发现

### 1. 编辑器模式 (Editor Modes)
从代码中发现以下编辑模式：
- `addTool` - 添加工具模式
- `editData` - 编辑数据模式
- `changeChart` - 更改图表类型
- `addMarkPoint` - 添加标记点
- `addAxisBreak` - 添加坐标轴断点
- `addChartConnector` - 添加图表连接线
- `boxSelectionSelecting` - 框选模式
- `normal` - 正常模式

### 2. 元素类型 (Element Types)
```javascript
Pe = {
  chart: "chart",      // 图表
  table: "table",      // 表格
  rect: "rect",        // 矩形
  oval: "oval",        // 椭圆
  diamond: "diamond",  // 菱形
  callout: "callout",  // 标注
  text: "text",        // 文本
  straightLine: "straightLine",  // 直线
  elbowLine: "elbowLine",        // 折线
  curveLine: "curveLine",        // 曲线
  image: "image",      // 图片
  svg: "svg",          // SVG
  chartConnectorLine: "chartConnectorLine",  // 图表连接线
  base: "base"
}
```

### 3. 图表编辑功能 (Chart Edit Features)
```javascript
Be = {
  valueLine: "valueLine",          // 数值线
  markArea: "markArea",            // 标记区域
  growthLine: "growthLine",        // 增长线
  hierarchicalDiffLine: "hierarchicalDiffLine",  // 层级差异线
  layout: "layout",                // 布局
  barLink: "barLink",              // 柱状图连接
  label: "label",                  // 标签
  axisGrid: "axisGrid",            // 坐标轴网格
  axis: "axis",                    // 坐标轴
  legend: "legend",                // 图例
  seriesMarkAll: "seriesMarkAll",  // 系列标记
  barWidth: "barWidth",            // 柱宽
  markPoint: "markPoint",          // 标记点
  trendLine: "trendLine",          // 趋势线
  partitionLine: "partitionLine",  // 分割线
  partitionArea: "partitionArea",  // 分割区域
  axisBreak: "axisBreak",          // 坐标轴断点
  title: "title"                   // 标题
}
```

### 4. 状态管理关键方法
- `saveSnapshot()` - 保存快照（用于历史记录）
- `pushHistory()` - 推入历史栈
- `updateEditorSpec()` - 更新编辑器规格
- `changeElementLayoutZIndex()` - 改变元素层级

### 5. 主题和样式
- `colorScheme` - 配色方案
- `theme` - 主题配置
- `fontFamily` - 字体配置
- `headerStyle` - 头部样式

### 6. 数据编辑
- `dataParser` - 数据解析器
- `specProcess` - 规格处理
- `editSpec` - 编辑规格
- `dataTempTransform` - 数据临时转换

## 建议的优先实现功能

### Phase 1: 核心编辑功能
1. **右侧属性面板** - 选中元素后显示详细配置
   - 图表类型切换
   - 数据字段映射
   - 样式配置

2. **数据编辑器** 
   - 表格形式的数据编辑
   - 支持导入/导出 CSV

### Phase 2: 高级功能
3. **图层面板** - 显示所有元素层级
4. **主题切换** - 预设配色方案
5. **标记功能** - 标记点、标记线、标记区域

### Phase 3: 导入导出
6. **导出功能** - PNG、PDF、HTML
7. **保存/加载** - 项目文件格式

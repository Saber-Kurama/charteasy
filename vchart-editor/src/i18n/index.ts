export type Language = 'zh' | 'en'

interface Translations {
  [key: string]: string | Translations
}

const zh: Translations = {
  title: '图表助手',
  new: '新建图表',
  home: '图表管理',
  feedback: '联系我们',
  editor: '图表编辑器',
  chartName: '图表名称',
  chartType: '图表类型',
  chartTitle: '图表标题',
  showLegend: '显示图例',
  specJson: 'JSON 配置',
  preview: '图表预览',
  save: '保存',
  export: '导出',
  delete: '删除',
  edit: '编辑',
  createTime: '创建时间',
  updateTime: '更新时间',
  noVisualizations: '暂无图表，点击新建图表开始创建',
  confirmDelete: '确定要删除这个图表吗？',
  bar: '柱状图',
  line: '折线图',
  pie: '饼图',
  scatter: '散点图',
  area: '面积图',
  radar: '雷达图',
}

const en: Translations = {
  title: 'Chart Assistant',
  new: 'New Chart',
  home: 'Chart Management',
  feedback: 'Feedback',
  editor: 'Chart Editor',
  chartName: 'Chart Name',
  chartType: 'Chart Type',
  chartTitle: 'Chart Title',
  showLegend: 'Show Legend',
  specJson: 'JSON Spec',
  preview: 'Chart Preview',
  save: 'Save',
  export: 'Export',
  delete: 'Delete',
  edit: 'Edit',
  createTime: 'Created At',
  updateTime: 'Updated At',
  noVisualizations: 'No charts yet, click New Chart to create one',
  confirmDelete: 'Are you sure you want to delete this chart?',
  bar: 'Bar',
  line: 'Line',
  pie: 'Pie',
  scatter: 'Scatter',
  area: 'Area',
  radar: 'Radar',
}

const translations: Record<Language, Translations> = { zh, en }

export function t(key: string, lang: Language): string {
  const keys = key.split('.')
  let value: unknown = translations[lang]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}

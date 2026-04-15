import { useNavigate } from 'react-router-dom'
import { Nav, Tag } from '@douyinfe/semi-ui'
import {
  IconBarChartHStroked,
  IconPlusStroked,
  IconHelpCircleStroked,
} from '@douyinfe/semi-icons'
import './Navigator.css'

interface NavigatorProps {
  language: string
  pageKey: string
}

// Translation strings matching the screenshot
const translations = {
  chartManagement: {
    zh: '图表管理',
    en: 'Chart Management',
  },
  newChart: {
    zh: '新建图表',
    en: 'New Chart',
  },
  contactUs: {
    zh: '联系我们',
    en: 'Contact Us',
  },
  title: {
    zh: '图表助手',
    en: 'Chart Assistant',
  },
  beta: {
    zh: 'BETA',
    en: 'BETA',
  },
  collapse: {
    zh: '收起侧边栏',
    en: 'Collapse Sidebar',
  },
}

// Original: k = e => { const { language: t, pageKey: i } = e, n = useNavigate(); ... }
export function Navigator({ language, pageKey }: NavigatorProps) {
  const navigate = useNavigate()

  const items = [
    {
      itemKey: 'chart-management',
      text: translations.chartManagement[language as keyof typeof translations.chartManagement] || translations.chartManagement.zh,
      icon: <IconBarChartHStroked />,
    },
    {
      itemKey: 'new-chart',
      text: translations.newChart[language as keyof typeof translations.newChart] || translations.newChart.zh,
      icon: <IconPlusStroked />,
    },
    {
      itemKey: 'contact-us',
      text: translations.contactUs[language as keyof typeof translations.contactUs] || translations.contactUs.zh,
      icon: <IconHelpCircleStroked />,
    },
  ]

  // Original: onSelect: e => { ... }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (data: any) => {
    const itemKey = String(data.itemKey)

    if (itemKey === 'chart-management') {
      navigate(`/${language}/app/home`)
    } else if (itemKey === 'new-chart') {
      navigate(`/${language}/app/new`)
    } else if (itemKey === 'contact-us') {
      window.open('https://github.com/VisActor/VChart/issues', '_blank')
    }
  }

  // Header matching screenshot: "图表助手 BETA"
  const header = {
    logo: (
      <div className="navigator-logo">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#1e7eff"/>
          <path d="M6 12h12M6 8h8M6 16h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    ),
    text: (
      <div className="navigator-header-text">
        <span className="navigator-title">
          {translations.title[language as keyof typeof translations.title] || translations.title.zh}
        </span>
        <Tag size="small" color="blue" className="navigator-beta-tag">
          {translations.beta[language as keyof typeof translations.beta] || translations.beta.zh}
        </Tag>
      </div>
    ),
  }

  return (
    <div className="navigator">
      <Nav
        className="navigator-content"
        style={{ backgroundColor: '#FBFBFB' }}
        selectedKeys={[pageKey]}
        items={items}
        onSelect={handleSelect}
        header={header}
        footer={{ collapseButton: true }}
      />
    </div>
  )
}

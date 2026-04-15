import { useNavigate, useLocation } from 'react-router-dom'
import { t, type Language } from '../i18n'

interface NavigatorProps {
  language: Language
}

export function Navigator({ language }: NavigatorProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const getPageKey = () => {
    const path = location.pathname
    if (path.includes('/new') || path.includes('/edit/') || path.includes('/visualization/')) return 'new'
    return 'home'
  }
  
  const pageKey = getPageKey()
  
  const navItems = [
    { key: 'home', label: t('home', language), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'new', label: t('new', language), icon: 'M12 4v16m8-8H4' },
    { key: 'feedback', label: t('feedback', language), icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ]
  
  const handleNavClick = (key: string) => {
    if (key === 'home') {
      navigate(`/${language}/app/home`)
    } else if (key === 'new') {
      navigate(`/${language}/app/new`)
    } else if (key === 'feedback') {
      window.open('https://github.com/VisActor/VChart/issues', '_blank')
    }
  }
  
  return (
    <div className="navigator">
      <div className="navigator-header">
        <div className="navigator-logo" onClick={() => window.open('/', '_blank')}>
          <svg width="36" height="36" viewBox="0 0 26 26" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13 0C20.1797 0 26 5.8203 26 13C26 14.1592 25.8483 15.283 25.5636 16.3525L18.2377 4.25581H18.2291C17.5709 3.254 16.4371 2.59256 15.1489 2.59256C13.8606 2.59256 12.7268 3.254 12.0686 4.25581H12.0599L11.9686 4.41693C11.951 4.44707 11.9337 4.47747 11.9169 4.50815L3.88731 18.6779C3.56947 19.2224 3.38736 19.8558 3.38736 20.5318C3.38736 21.1089 3.52009 21.655 3.75667 22.1412C1.43409 19.7928 0 16.5639 0 13C0 5.8203 5.8203 0 13 0ZM6.27755 24.1292C6.53287 24.1852 6.79812 24.2147 7.07026 24.2147C9.10427 24.2147 10.7532 22.5658 10.7532 20.5318C10.7532 19.8794 10.5835 19.2667 10.286 18.7353L10.2879 18.7345L8.49328 15.6288C7.52634 13.954 8.10016 11.8124 9.77496 10.8455C11.4498 9.87854 13.5913 10.4524 14.5582 12.1272L20.8887 22.8559L20.8912 22.8548C20.9571 22.962 21.0284 23.0655 21.1045 23.1651C18.8821 24.9394 16.0649 26 13 26C10.5397 26 8.23908 25.3166 6.27755 24.1292Z"
              fill="#1e7eff"
            />
          </svg>
          <span className="navigator-title-text">{t('title', language)}</span>
        </div>
      </div>
      
      <nav className="navigator-menu">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`navigator-item ${pageKey === item.key ? 'active' : ''}`}
            onClick={() => handleNavClick(item.key)}
          >
            <svg className="navigator-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

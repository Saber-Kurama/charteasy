import './PageLoader.css'

interface PageLoaderProps {
  className?: string
  style?: React.CSSProperties
}

// Original: _w = e => { const { className: t, style: i } = e; ... }
// Animated grid loader with 9 squares
export function PageLoader({ className = '', style }: PageLoaderProps) {
  return (
    <div className={`loader-container ${className}`} style={style}>
      <svg
        width="60"
        height="60"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Row 1 */}
        <rect x="10" y="10" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="22" y="10" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.1s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="34" y="10" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.2s"
            repeatCount="indefinite"
          />
        </rect>
        
        {/* Row 2 */}
        <rect x="10" y="22" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="22" y="22" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.4s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="34" y="22" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </rect>
        
        {/* Row 3 */}
        <rect x="10" y="34" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="22" y="34" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.7s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="34" y="34" width="8" height="8" fill="#60A5FA" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.5s"
            begin="0.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="0;4;0"
            dur="1.5s"
            begin="0.8s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  )
}

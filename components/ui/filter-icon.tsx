import React from 'react'

interface FilterIconProps {
  className?: string
}

export const FilterIcon: React.FC<FilterIconProps> = ({ className = "h-4 w-4" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top line with circle on right */}
      <line x1="3" y1="6" x2="21" y2="6" />
      <circle cx="18" cy="6" r="2" />
      
      {/* Middle line with circle in center */}
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="2" />
      
      {/* Bottom line with circle on left */}
      <line x1="3" y1="18" x2="21" y2="18" />
      <circle cx="6" cy="18" r="2" />
    </svg>
  )
}



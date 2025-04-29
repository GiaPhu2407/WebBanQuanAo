"use client"

import { useEffect, useState, type ReactNode } from "react"

interface ResponsiveContainerProps {
  children: ReactNode
}

export const ResponsiveContainer = ({ children }: ResponsiveContainerProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  useEffect(() => {
    // Listen for sidebar toggle events
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail && "expanded" in customEvent.detail) {
        setSidebarExpanded(customEvent.detail.expanded)
      }
    }

    window.addEventListener("sidebarToggle", handleSidebarToggle)

    // Check initial state
    const sidebar = document.querySelector("nav")
    if (sidebar) {
      const width = window.getComputedStyle(sidebar).width
      setSidebarExpanded(parseInt(width) > 50)
    }

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle)
    }
  }, [])

  return (
    <div
      className="transition-all duration-300 ease-in-out"
      style={{
        marginLeft: sidebarExpanded ? "16rem" : "4rem", // 16rem (64px) khi mở rộng, 4rem (16px) khi thu gọn
        width: sidebarExpanded ? "calc(100% - 16rem)" : "calc(100% - 4rem)",
      }}
    >
      {children}
    </div>
  )
}
export default ResponsiveContainer
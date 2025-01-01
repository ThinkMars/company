import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ThemeDetector } from '../../../core/theme-detector'
import { ThemeModifier } from '../../../core/theme-modifier'
import { leftThemes, rightThemes } from '../../../constants/preset-themes'
import './ThemeBall.css'

interface ThemeBallProps {
  initialColor?: string
  position?: 'left' | 'right'
  offset?: number
}

export const ReactThemeBall: React.FC<ThemeBallProps> = ({
  initialColor = '#409EFF',
  position = 'right',
  offset = 20,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentColor, setCurrentColor] = useState(initialColor)
  const [ballPosition, setBallPosition] = useState({
    y: window.innerHeight / 2,
    x: offset,
  })

  const hideTimerRef = useRef<number>()
  const startPosRef = useRef({ x: 0, y: 0, right: 0, top: 0 })
  const dragStartTimeRef = useRef(0)
  const hasMovedRef = useRef(false)

  // const DRAG_THRESHOLD = 3
  const CLICK_THRESHOLD = 200

  const updateTheme = useCallback((color: string) => {
    const palette = ThemeModifier.generatePalette(color)
    ThemeModifier.applyTheme(palette)
    setCurrentColor(color)
  }, [])

  const handleResize = useCallback(() => {
    setBallPosition((prev) => ({
      y: Math.max(50, Math.min(window.innerHeight - 50, prev.y)),
      x: Math.max(offset, Math.min(window.innerWidth - offset, prev.x)),
    }))
  }, [offset])

  const startHideTimer = useCallback(() => {
    if (!isOpen) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
      hideTimerRef.current = window.setTimeout(() => {
        setIsHidden(true)
      }, 5000)
    }
  }, [isOpen])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      hasMovedRef.current = true

      const deltaY = e.clientY - startPosRef.current.y
      const deltaX = startPosRef.current.x - e.clientX
      const newY = startPosRef.current.top + deltaY
      const newX = startPosRef.current.right + deltaX

      setBallPosition({
        y: Math.max(50, Math.min(window.innerHeight - 50, newY)),
        x: Math.max(offset, Math.min(window.innerWidth - offset, newX)),
      })
    },
    [isDragging, offset],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    const dragEndTime = Date.now()
    const isDragClick =
      !hasMovedRef.current &&
      dragEndTime - dragStartTimeRef.current < CLICK_THRESHOLD

    if (isDragClick) {
      setIsOpen((prev) => !prev)
    }

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      if (isOpen) return
      setIsDragging(true)
      hasMovedRef.current = false
      dragStartTimeRef.current = Date.now()

      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        right: ballPosition.x,
        top: ballPosition.y,
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [isOpen, ballPosition, handleMouseMove, handleMouseUp],
  )

  useEffect(() => {
    const detector = new ThemeDetector()
    const variables = detector.detectThemeVariables()
    const primaryColor = variables.find(
      (v) => v.name === `${detector.getPrefix()}color-primary`,
    )
    if (primaryColor) {
      setCurrentColor(primaryColor.value)
    }

    startHideTimer()
    window.addEventListener('resize', handleResize)

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, startHideTimer])

  return (
    <div
      className={`theme-ball ${isOpen ? 'active' : ''} ${isHidden ? 'hidden' : ''}`}
      style={{
        top: `${ballPosition.y}px`,
        [position]: `${ballPosition.x}px`,
      }}
      onMouseEnter={() => {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current)
        }
        setIsHidden(false)
      }}
      onMouseLeave={startHideTimer}
    >
      <div
        className={`ball ${isDragging ? 'dragging' : ''}`}
        onMouseDown={startDrag}
      >
        <div className="ball-inner" style={{ backgroundColor: currentColor }}>
          <div className="ball-glow" style={{ backgroundColor: currentColor }}>
            <div
              className="ball-pulse"
              style={{ backgroundColor: currentColor }}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="theme-panel">
          <div className="panel-header">
            <h3>超级主题球</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          <div className="panel-content">
            <div className="preset-colors">
              <h4>推荐主题</h4>
              <div className="themes-container">
                <div className="themes-column">
                  {leftThemes.map((category) => (
                    <div key={category.name} className="color-category">
                      <div className="category-name">{category.name}</div>
                      <div className="color-list">
                        {category.colors.map((color) => (
                          <div
                            key={color.value}
                            className="color-item"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            onClick={() => updateTheme(color.value)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="themes-column">
                  {rightThemes.map((category) => (
                    <div key={category.name} className="color-category">
                      <div className="category-name">{category.name}</div>
                      <div className="color-list">
                        {category.colors.map((color) => (
                          <div
                            key={color.value}
                            className="color-item"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            onClick={() => updateTheme(color.value)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="divider">或</div>
            <div className="color-picker">
              <label>自定义主题色</label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => updateTheme(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

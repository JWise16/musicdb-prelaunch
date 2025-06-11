import { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
  showFinalCursor?: boolean
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
  text, 
  speed = 100, 
  className = '',
  onComplete,
  showFinalCursor = false
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  // Typing effect
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      // Animation complete
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, onComplete, isComplete])

  // Blinking cursor effect - while typing and after if showFinalCursor is true
  useEffect(() => {
    if (!isComplete || showFinalCursor) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev)
      }, 530) // Blink every 530ms for realistic terminal feel

      return () => clearInterval(cursorTimer)
    } else {
      // Hide cursor when complete (unless showFinalCursor is true)
      setShowCursor(false)
    }
  }, [isComplete, showFinalCursor])

  return (
    <span className={className}>
      {displayedText}
      {(!isComplete || showFinalCursor) && (
        <span 
          className={`inline-block ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
          style={{ width: '3px' }}
        >
          _
        </span>
      )}
    </span>
  )
} 
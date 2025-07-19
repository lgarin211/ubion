import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  image: {
    src: string
    alt: string
    description?: string
  }
}

export function ImageModal({ isOpen, onClose, image }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  // Reset zoom and position when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.5, Math.min(5, scale + delta))
    setScale(newScale)
  }, [scale])

  // Handle mouse drag for panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart, scale])

  if (!isOpen) return null

  // Handle zoom buttons
  const handleZoomIn = () => {
    setScale(prev => Math.min(5, prev + 0.25))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Double click to zoom
  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2)
    } else {
      handleReset()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content - Made much larger */}
      <div className="relative z-10 w-[95vw] h-[95vh] max-w-7xl mx-4 flex flex-col">
        {/* Control Bar */}
        <div className="flex justify-between items-center mb-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              disabled={scale <= 0.5}
            >
              <ZoomOut size={20} className="text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              disabled={scale >= 5}
            >
              <ZoomIn size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <RotateCcw size={20} className="text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        
        {/* Image Container - Much larger */}
        <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-2xl relative">
          <div 
            ref={imageRef}
            className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </div>
          </div>
          
          {/* Zoom hint */}
          {scale === 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              Double click to zoom • Scroll to zoom • Drag to pan
            </div>
          )}
        </div>

        {/* Description */}
        {image.description && (
          <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
            <p className="text-gray-700 text-center text-lg">{image.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

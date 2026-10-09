"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface ProductZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  productName: string;
}

export default function ProductZoomModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  productName,
}: ProductZoomModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Refs para tracking de gestos (mouse e touch)
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sincronizar índice inicial quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Travar scroll do body quando modal estiver aberto
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      } else if (e.key === "0") {
        resetZoom();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, currentIndex, scale]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const setClampedScale = useCallback((newScale: number) => {
    const clamped = Math.min(Math.max(newScale, 1), 4);
    setScale(clamped);
    if (clamped <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  const zoomIn = useCallback(() => {
    setClampedScale(scale + 0.5);
  }, [scale, setClampedScale]);

  const zoomOut = useCallback(() => {
    setClampedScale(scale - 0.5);
  }, [scale, setClampedScale]);

  const handlePrev = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, resetZoom]);

  // DUPLO CLIQUE / DUPLO TOQUE: alterna entre 1x e 2.5x
  const handleDoubleTap = useCallback(
    (clientX?: number, clientY?: number) => {
      if (scale > 1.2) {
        resetZoom();
      } else {
        setScale(2.5);
        if (clientX && clientY && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const offsetX = (clientX - (rect.left + rect.width / 2)) * -0.8;
          const offsetY = (clientY - (rect.top + rect.height / 2)) * -0.8;
          setPosition({ x: offsetX, y: offsetY });
        }
      }
    },
    [scale, resetZoom]
  );

  // MOUSE DRAG & PAN
  function handleMouseDown(e: React.MouseEvent) {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || scale <= 1) return;
    const nextX = e.clientX - dragStartRef.current.x;
    const nextY = e.clientY - dragStartRef.current.y;
    // Limita o deslocamento conforme o nível de zoom
    const maxOffset = (scale - 1) * 350;
    setPosition({
      x: Math.max(Math.min(nextX, maxOffset), -maxOffset),
      y: Math.max(Math.min(nextY, maxOffset), -maxOffset),
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  // TOUCH GESTURES: PINÇA (PINCH-TO-ZOOM) E ARRASTO
  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      // Início do gesto de pinça com 2 dedos
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      // Detecção de duplo toque
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        handleDoubleTap(e.touches[0].clientX, e.touches[0].clientY);
      }
      lastTapRef.current = now;

      // Início de arrasto caso esteja com zoom
      if (scale > 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        };
      } else {
        dragStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      // Calculando ampliação pela pinça
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / initialPinchDistRef.current;
      const targetScale = initialPinchScaleRef.current * factor;
      setClampedScale(targetScale);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan com 1 dedo enquanto ampliado
      const nextX = e.touches[0].clientX - dragStartRef.current.x;
      const nextY = e.touches[0].clientY - dragStartRef.current.y;
      const maxOffset = (scale - 1) * 350;
      setPosition({
        x: Math.max(Math.min(nextX, maxOffset), -maxOffset),
        y: Math.max(Math.min(nextY, maxOffset), -maxOffset),
      });
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) {
      initialPinchDistRef.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
      // Se swipe horizontal quando não estiver com zoom, permite trocar foto
      if (scale <= 1) {
        const deltaX = (e.changedTouches[0]?.clientX || 0) - dragStartRef.current.x;
        if (Math.abs(deltaX) > 60) {
          if (deltaX > 0) {
            handlePrev();
          } else {
            handleNext();
          }
        }
      }
    }
  }

  // Roda do mouse (Wheel) para zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    if (e.deltaY < 0) {
      setClampedScale(scale + 0.2);
    } else {
      setClampedScale(scale - 0.2);
    }
  }

  if (!isOpen || !mounted) return null;

  const currentImage = images[currentIndex] || images[0];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de zoom do produto"
      className="fixed inset-0 z-[99999] flex flex-col bg-black/75 backdrop-blur-md text-ivory animate-fade-in select-none"
    >
      {/* BOTÃO FECHAR FLUTUANTE */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar zoom"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-ivory backdrop-blur-md transition hover:bg-white/20 active:scale-95 border border-white/10 shadow-lg"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


      {/* ÁREA CENTRAL PRINCIPAL DA IMAGEM */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={(e) => handleDoubleTap(e.clientX, e.clientY)}
        className={`relative flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-8 ${
          scale > 1
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-zoom-in"
        }`}
      >
        {/* BOTÃO NAVEGAÇÃO ANTERIOR */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Foto anterior"
            className="absolute left-3 sm:left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-ivory border border-white/15 backdrop-blur-md transition hover:bg-white/20 hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* CONTAINER DO ZOOM / IMAGEM */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
          className="relative max-h-[76vh] max-w-[85vw] aspect-[3/4] w-full max-w-2xl origin-center will-change-transform flex items-center justify-center pointer-events-none drop-shadow-2xl"
        >
          <Image
            src={currentImage}
            alt={`${productName} — foto ampliada`}
            fill
            sizes="100vw"
            priority
            draggable={false}
            className="object-contain select-none pointer-events-none rounded-2xl"
          />
        </div>

        {/* BOTÃO NAVEGAÇÃO PRÓXIMO */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Próxima foto"
            className="absolute right-3 sm:right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-ivory border border-white/15 backdrop-blur-md transition hover:bg-white/20 hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* MINIATURAS FLUTUANTES MINIMALISTAS (SEM BARRA PRETA E SEM TEXTOS) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
          <div className="pointer-events-auto flex gap-2 sm:gap-2.5 overflow-x-auto max-w-[92vw] p-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
            {images.map((src, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    resetZoom();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Ver foto ${idx + 1}`}
                  className={`group relative aspect-[3/4] h-13 sm:h-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    isSelected
                      ? "border-gold-light scale-105 shadow-md shadow-gold/20 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-100 hover:border-white/30"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>,
    document.body
  );

}

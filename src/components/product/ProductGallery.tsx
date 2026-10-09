"use client";

import Image from "next/image";
import { useState } from "react";
import ProductZoomModal from "./ProductZoomModal";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState(0);

  function openZoom(index: number) {
    setZoomInitialIndex(index);
    setIsZoomOpen(true);
  }

  const currentDisplayImage = images[active] || images[0];

  return (
    <>
      <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
        {/* MINIATURAS LATERAIS */}
        {images.length > 1 && (
          <div
            className="flex gap-2.5 overflow-x-auto pb-1 md:flex-col md:overflow-visible"
            role="tablist"
            aria-label="Fotos do produto"
          >
            {images.map((src, i) => {
              const isModelPhoto = src.includes("model");
              const isCurrent = i === active;

              return (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Ver foto ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`group relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-xl bg-sand transition md:w-20 ${
                    isCurrent ? "opacity-100 shadow-sm" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  {isModelPhoto && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold/90 text-ink text-[10px] shadow-xs">
                      ✦
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ÁREA DA IMAGEM PRINCIPAL */}
        <div className="relative flex-1 select-none">
          <div
            onClick={() => openZoom(active)}
            className="group relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-sand transition duration-500 shadow-xs cursor-zoom-in"
          >
            <Image
              key={currentDisplayImage}
              src={currentDisplayImage}
              alt={`${name} — visualização`}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="animate-fade-in object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>

      {/* MODAL LIGHTBOX COM ZOOM E PINÇA MOBILE */}
      <ProductZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={images}
        initialIndex={zoomInitialIndex}
        productName={name}
      />
    </>
  );
}

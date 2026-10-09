"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Estilos essenciais do Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [mounted, setMounted] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR / Prerender estático seguro para SEO
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 2} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* CONTROLES DO CARROSSEL (SETAS DE NAVEGAÇÃO CUSTOMIZADAS) */}
      <div className="absolute -top-14 right-0 hidden sm:flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={() => swiperInstance?.slidePrev()}
          disabled={isBeginning}
          aria-label="Produto anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white text-ink transition hover:border-ink hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-xs"
        >
          <ArrowLeftIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => swiperInstance?.slideNext()}
          disabled={isEnd}
          aria-label="Próximo produto"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white text-ink transition hover:border-ink hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-xs"
        >
          <ArrowRightIcon size={18} />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        spaceBetween={12}
        slidesPerView={2.15}
        grabCursor={true}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
          bulletClass: "inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-stone transition-all duration-300 mx-0.5 sm:mx-1 cursor-pointer",
          bulletActiveClass: "!w-5 sm:!w-7 !bg-gold",
        }}
        breakpoints={{
          480: {
            slidesPerView: 2.3,
            spaceBetween: 14,
          },
          640: {
            slidesPerView: 2.8,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3.2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="w-full !overflow-hidden pb-4"
      >
        {products.map((p, i) => (
          <SwiperSlide key={p.id} className="h-auto">
            <div className="h-full">
              <ProductCard product={p} priority={i < 4} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* PAGINAÇÃO COM BULLETS ELEGANTES */}
      <div className="custom-swiper-pagination mt-6 flex justify-center items-center" />
    </div>
  );
}

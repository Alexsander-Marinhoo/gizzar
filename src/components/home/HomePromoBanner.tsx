"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AdminBannerConfig,
  DEFAULT_BANNER_CONFIG,
  getStoredBannerConfig,
} from "@/lib/admin-store";

export default function HomePromoBanner() {
  const [banner, setBanner] = useState<AdminBannerConfig>(DEFAULT_BANNER_CONFIG);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBanner(getStoredBannerConfig());

    const handleUpdate = () => {
      setBanner(getStoredBannerConfig());
    };

    window.addEventListener("gizzar_banner_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("gizzar_banner_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (!banner.active) {
    return null;
  }

  // Se o banner for o padrão ou possuir uma imagem direta
  const isDirectImage =
    banner.imageUrl === "/brand/sem titulo.jpg" ||
    banner.imageUrl === "/brand/banner-frete-gratis.jpg" ||
    banner.imageUrl === "/brand/banner-promocional.jpg";

  return (
    <section className="container-page pt-3 sm:pt-4">
      <Link
        href={banner.linkUrl || "/catalogo"}
        aria-label={`${banner.headline} — ${banner.subheadline}`}
        className="group relative block overflow-hidden rounded-2xl sm:rounded-3xl bg-sand shadow-xs transition-all duration-300 hover:shadow-md aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5.2] max-h-[380px] w-full"
      >
        <Image
          src={banner.imageUrl || "/brand/sem titulo.jpg"}
          alt={banner.altText || `${banner.headline} — ${banner.subheadline}`}
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
        />

        {/* Overlay elegante caso o banner tenha headline ou textos personalizados customizados diferentes do padrão direto */}
        {mounted && !isDirectImage && (banner.headline || banner.subheadline) && (
          <div className="absolute inset-0 bg-gradient-to-r from-sand/90 via-sand/70 to-transparent p-6 sm:p-10 lg:p-14 flex flex-col justify-center max-w-xl">
            {banner.tag && (
              <span className="inline-block eyebrow mb-2 text-gold-dark font-semibold">
                {banner.tag}
              </span>
            )}
            {banner.headline && (
              <h2 className="heading-display text-2xl sm:text-4xl lg:text-5xl text-ink font-semibold tracking-tight">
                {banner.headline}
              </h2>
            )}
            {banner.subheadline && (
              <p className="mt-2 text-sm sm:text-lg lg:text-xl font-medium uppercase tracking-wider text-ink/80">
                {banner.subheadline}
              </p>
            )}
            {banner.showButton && (
              <div className="mt-4">
                <span className="btn-primary text-xs sm:text-sm py-2 px-5 sm:px-6">
                  {banner.buttonText || "Aproveitar"}
                </span>
              </div>
            )}
          </div>
        )}
      </Link>
    </section>
  );
}

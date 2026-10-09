import { siteConfig } from "@/config/site";

export default function AnnouncementBar() {
  const items = [...siteConfig.announcement, ...siteConfig.announcement];
  return (
    <div className="relative overflow-hidden bg-ink py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-gold-light">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="flex items-center gap-12">
            {text}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

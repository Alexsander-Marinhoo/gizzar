import { whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/Icons";

export default function WhatsAppFloat() {
  return (
    <a
      id="whatsapp-float"
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="group fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
      <WhatsAppIcon size={26} />
    </a>
  );
}

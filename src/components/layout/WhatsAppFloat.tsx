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
      className="group fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-110 max-md:bottom-24"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
      <WhatsAppIcon size={28} />
    </a>
  );
}

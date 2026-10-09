import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig, whatsappLink } from "@/config/site";
import { InstagramIcon, MailIcon, PinIcon, ShieldIcon, SparkleIcon, TruckIcon, WhatsAppIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Sobre & Contato",
  description: "Conheça a história da GIZZAR. Bolsas com design atemporal, sofisticação e acabamento premium. Fale com nosso atendimento exclusivo.",
};

export default function AboutPage() {
  return (
    <div className="container-page pt-10 sm:pt-16 pb-24">
      {/* CABEÇALHO */}
      <header className="max-w-2xl">
        <span className="eyebrow">Sobre a GIZZAR</span>
        <h1 className="heading-display mt-3 text-5xl sm:text-6xl">
          Elegância atemporal feita para inspirar
        </h1>
        <p className="mt-4 text-base sm:text-lg text-taupe leading-relaxed">
          Nascemos do desejo de entregar bolsas e acessórios que unem refinamento, funcionalidade e durabilidade.
        </p>
      </header>

      {/* BLOCO EDITORIAL / HISTÓRIA */}
      <section className="mt-14 grid gap-12 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden rounded-3xl bg-sand shadow-sm">
          <Image
            src="/brand/hero.jpg"
            alt="Atelier e Coleção GIZZAR"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="gold-line" />
          <h2 className="heading-display text-3xl sm:text-4xl text-ink">
            Mais do que um acessório, uma extensão do seu estilo
          </h2>
          <p className="text-base leading-relaxed text-taupe">
            A <strong>GIZZAR</strong> foi criada para a mulher contemporânea que valoriza presença e sofisticação sem abrir mão da praticidade cotidiana. Cada modelo é desenhado com proporções harmônicas, ferragens selecionadas e texturas impecáveis.
          </p>
          <p className="text-base leading-relaxed text-taupe">
            Iniciamos nossa trajetória com uma curadoria exclusiva de bolsas — das clássicas totes de trabalho às minibags e clutches para celebrações memoráveis. Em breve, expandiremos nossa linha para uma gama completa de acessórios finos.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone/60">
            <div>
              <span className="font-display text-3xl font-semibold text-gold-dark">100%</span>
              <p className="text-xs uppercase tracking-wider text-taupe mt-1">Acabamento Selecionado</p>
            </div>
            <div>
              <span className="font-display text-3xl font-semibold text-gold-dark">Brasil</span>
              <p className="text-xs uppercase tracking-wider text-taupe mt-1">Envio Seguro e Rápido</p>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES DA MARCA */}
      <section className="mt-24 rounded-3xl bg-sand/60 p-8 sm:p-14">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="eyebrow">Compromisso</span>
          <h2 className="heading-display mt-2 text-3xl sm:text-4xl">Nossos Pilares</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl bg-ivory p-6 shadow-xs">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand text-gold-dark">
              <SparkleIcon size={24} />
            </div>
            <h3 className="font-display text-xl font-medium">Design Autêntico</h3>
            <p className="mt-2 text-sm text-taupe leading-relaxed">
              Silhuetas elegantes pensadas para transcender temporadas e tendências passageiras.
            </p>
          </div>

          <div className="rounded-2xl bg-ivory p-6 shadow-xs">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand text-gold-dark">
              <ShieldIcon size={24} />
            </div>
            <h3 className="font-display text-xl font-medium">Qualidade & Detalhes</h3>
            <p className="mt-2 text-sm text-taupe leading-relaxed">
              Materiais nobres, costuras reforçadas e ferragens com banho de alta durabilidade.
            </p>
          </div>

          <div className="rounded-2xl bg-ivory p-6 shadow-xs">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand text-gold-dark">
              <TruckIcon size={24} />
            </div>
            <h3 className="font-display text-xl font-medium">Cuidado no Envio</h3>
            <p className="mt-2 text-sm text-taupe leading-relaxed">
              Embalagem especial tipo presente com envio rastreado para qualquer cidade brasileira.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE CONTATO / ATENDIMENTO */}
      <section id="contato" className="mt-24 pt-4 scroll-mt-28">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <span className="eyebrow">Fale Conosco</span>
            <h2 className="heading-display mt-3 text-4xl sm:text-5xl">
              Estamos sempre à disposição
            </h2>
            <p className="mt-4 text-base text-taupe leading-relaxed max-w-lg">
              Precisa de ajuda para escolher um modelo, dúvidas sobre medidas ou prazo de entrega? Fale diretamente com nossa equipe de concierge.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-stone/70 bg-white p-5 shadow-xs transition hover:border-[#25D366] hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppIcon size={26} />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-taupe">WhatsApp Exclusivo</span>
                  <p className="text-base font-semibold text-ink">Conversar com atendimento</p>
                  <span className="text-xs text-taupe">Resposta rápida em horário comercial</span>
                </div>
              </a>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-4 rounded-2xl border border-stone/70 bg-white p-5 shadow-xs transition hover:border-gold hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand text-gold-dark">
                  <MailIcon size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-taupe">E-mail</span>
                  <p className="text-base font-semibold text-ink">{siteConfig.contact.email}</p>
                  <span className="text-xs text-taupe">Para parcerias e informações gerais</span>
                </div>
              </a>

              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-stone/70 bg-white p-5 shadow-xs transition hover:border-gold hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand text-gold-dark">
                  <InstagramIcon size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-taupe">Instagram Oficial</span>
                  <p className="text-base font-semibold text-ink">{siteConfig.contact.instagramHandle}</p>
                  <span className="text-xs text-taupe">Novidades, editoriais e bastidores</span>
                </div>
              </a>
            </div>
          </div>

          {/* CARD DE INFORMAÇÕES DE COMPRA & LOCALIZAÇÃO */}
          <div className="card p-8 space-y-6">
            <h3 className="font-display text-2xl font-medium text-ink">Informações Úteis</h3>

            <div className="flex items-start gap-3">
              <PinIcon size={20} className="shrink-0 text-gold-dark mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-ink">Centro de Distribuição</p>
                <p className="text-xs text-taupe mt-0.5">{siteConfig.contact.city}</p>
              </div>
            </div>

            <div className="border-t border-stone/50 pt-5 space-y-3 text-xs text-taupe leading-relaxed">
              <p>
                <strong>Horário de Atendimento:</strong><br />
                Segunda a Sexta: 09h às 18h<br />
                Sábado: 09h às 13h
              </p>
              <p>
                <strong>Política de Trocas:</strong><br />
                Garantimos a primeira troca gratuita em até 7 dias corridos após o recebimento da peça, conforme o Código de Defesa do Consumidor.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={whatsappLink("Olá! Gostaria de tirar uma dúvida sobre a GIZZAR.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 text-center"
              >
                Iniciar conversa no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

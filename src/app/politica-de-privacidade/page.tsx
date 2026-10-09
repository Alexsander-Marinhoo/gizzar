import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappLink } from "@/config/site";
import { ArrowLeftIcon, LockIcon, ShieldIcon, WhatsAppIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Políticas de Privacidade",
  description:
    "Conheça a política de privacidade e proteção de dados da GIZZAR, em conformidade com a LGPD. Saiba como seus dados são tratados com total segurança.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page pt-10 sm:pt-16 pb-24 max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-taupe">
        <Link href="/" className="hover:text-ink">Início</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Política de Privacidade</span>
      </nav>

      <header className="mb-12 border-b border-stone/60 pb-8">
        <span className="eyebrow flex items-center gap-2">
          <ShieldIcon size={14} className="text-success" /> Segurança e Transparência
        </span>
        <h1 className="heading-display mt-3 text-4xl sm:text-5xl text-ink">
          Política de Privacidade
        </h1>
        <p className="mt-3 text-sm text-taupe">
          Última atualização: Outubro de 2026 · Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>
      </header>

      <div className="space-y-10 text-ink/85 leading-relaxed text-sm sm:text-base">
        {/* INTRODUÇÃO */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            1. Nosso Compromisso com a sua Privacidade
          </h2>
          <p>
            Na <strong>{siteConfig.name}</strong>, a proteção das suas informações pessoais é tratada com o mais alto nível de rigor e respeito. Esta Política descreve como coletamos, utilizamos, armazenamos e protegemos seus dados pessoais durante sua experiência de compra em nossa loja virtual.
          </p>
        </section>

        {/* DADOS COLETADOS */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            2. Quais Dados Coletamos e para Qual Finalidade
          </h2>
          <p className="mb-3">
            Coletamos apenas as informações estritamente necessárias para a prestação dos nossos serviços de e-commerce:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-taupe">
            <li>
              <strong className="text-ink">Dados Cadastrais e de Contato:</strong> Nome completo, endereço de e-mail e número de WhatsApp/telefone. Usados para identificar o comprador, enviar atualizações do pedido e prestar suporte pós-venda.
            </li>
            <li>
              <strong className="text-ink">Dados de Entrega:</strong> Endereço completo com CEP, rua, número, complemento, bairro, cidade e estado. Compartilhados exclusivamente com os Correios para viabilizar a entrega física da sua mercadoria.
            </li>
            <li>
              <strong className="text-ink">Dados de Navegação:</strong> Informações técnicas temporárias (como endereço IP, dispositivo e histórico de itens na sacola) para garantir a funcionalidade e segurança da plataforma.
            </li>
          </ul>
        </section>

        {/* PAGAMENTOS E GATEWAY INFINITEPAY */}
        <section className="rounded-2xl border border-stone/70 bg-sand/40 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-gold-dark shadow-xs">
              <LockIcon size={20} />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              3. Segurança nos Pagamentos (InfinitePay)
            </h2>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-taupe">
            Todos os pagamentos realizados em nossa loja (via <strong>Pix</strong> ou <strong>Cartão de Crédito parcelado</strong>) são processados diretamente pelo gateway certificado <strong>InfinitePay</strong> (CloudWalk Instituição de Pagamento).
          </p>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-taupe">
            <strong>Importante:</strong> Os dados confidenciais do seu cartão de crédito trafegam com criptografia de ponta a ponta e <em>nunca são armazenados</em> nos servidores da {siteConfig.name}.
          </p>
        </section>

        {/* COMPARTILHAMENTO DE DADOS */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            4. Compartilhamento de Dados com Terceiros
          </h2>
          <p className="mb-3">
            A {siteConfig.name} <strong>não comercializa nem aluga</strong> seus dados pessoais sob nenhuma hipótese. O compartilhamento ocorre exclusivamente com parceiros indispensáveis para a conclusão do seu pedido:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-taupe">
            <li>Empresa Brasileira de Correios e Telégrafos (Correios) para transporte e entrega.</li>
            <li>Instituição de Pagamento InfinitePay para liquidação financeira e prevenção a fraudes.</li>
            <li>Autoridades judiciais ou governamentais, exclusivamente mediante estrita obrigação legal.</li>
          </ul>
        </section>

        {/* DIREITOS DO TITULAR (LGPD) */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            5. Seus Direitos conforme a LGPD
          </h2>
          <p className="mb-3">
            Em conformidade com a legislação brasileira, você possui total direito de:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-taupe">
            <li>Confirmar a existência de tratamento e acessar seus dados cadastrais.</li>
            <li>Solicitar a correção de dados incompletos ou desatualizados.</li>
            <li>Solicitar a eliminação dos seus dados após o encerramento do ciclo do pedido (respeitados os prazos legais de guarda fiscal).</li>
            <li>Revogar qualquer consentimento fornecido anteriormente.</li>
          </ul>
        </section>

        {/* COOKIES E ARMAZENAMENTO LOCAL */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            6. Armazenamento Local e Cookies
          </h2>
          <p>
            Utilizamos armazenamento local do navegador (<em>localStorage</em>) essencial para lembrar os produtos colocados na sua sacola enquanto você navega pelas páginas. Não utilizamos cookies invasivos para rastreamento não autorizado em sites de terceiros.
          </p>
        </section>

        {/* CANAL DE CONTATO E DPO */}
        <section className="border-t border-stone/60 pt-8">
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            7. Dúvidas ou Solicitações de Privacidade
          </h2>
          <p className="mb-6 text-taupe">
            Para exercer qualquer um dos seus direitos ou tirar dúvidas sobre como seus dados são cuidados, entre em contato diretamente com nossa equipe de atendimento:
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Privacidade%20de%20Dados%20GIZZAR`}
              className="btn-primary"
            >
              Enviar E-mail para {siteConfig.contact.email}
            </a>
            <a
              href={whatsappLink("Olá! Gostaria de falar sobre a política de privacidade da GIZZAR.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
            >
              <WhatsAppIcon size={18} /> Conversar no WhatsApp
            </a>
          </div>
        </section>
      </div>

      <div className="mt-14 pt-8 border-t border-stone/60">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-taupe hover:text-ink">
          <ArrowLeftIcon size={16} /> Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Amiga IA en Español — Zari Habla Tu Idioma",
  description:
    "Conoce a Zari, tu compañera de IA que habla español con fluidez nativa. Recuerda todo, habla en voz alta, y crece contigo.",
  openGraph: {
    title: "Amiga IA en Español — Zari",
    description:
      "Una compañera de IA que realmente escucha, recuerda tu vida, y habla español de verdad.",
    url: "https://www.zari.help/ai-friend-spanish",
  },
};

export default function SpanishPage() {
  return (
    <div className="min-h-screen bg-[#06060e] font-mono">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <span className="text-5xl mb-6 block">🇪🇸</span>
        <h1 className="text-4xl md:text-5xl font-bold text-zari-text mb-6 leading-tight">
          Tu{" "}
          <span className="bg-gradient-to-r from-zari-accent to-zari-pink bg-clip-text text-transparent">
            Compañera de IA
          </span>{" "}
          en Español
        </h1>
        <p className="text-lg text-zari-muted max-w-xl mx-auto mb-4">
          Zari no traduce — habla español de verdad. Con conciencia cultural,
          expresiones naturales, y una voz que suena como una amiga real.
        </p>
        <p className="text-base text-zari-muted/70 max-w-lg mx-auto mb-10">
          Recuerda tu nombre, tus metas, tu familia. Piensa por adelantado.
          Habla en voz alta. Y siempre está disponible — en tu idioma, a tu
          manera.
        </p>

        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25"
        >
          Habla con Zari Gratis
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="mt-6 text-xs text-zari-muted/50">
          Gratis para empezar. Sin tarjeta de crédito.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-zari-surface border border-white/5">
            <h3 className="text-sm font-semibold text-zari-text mb-2">
              Memoria Permanente
            </h3>
            <p className="text-xs text-zari-muted">
              Zari recuerda cada detalle — nombres, fechas, metas, preferencias.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zari-surface border border-white/5">
            <h3 className="text-sm font-semibold text-zari-text mb-2">
              Habla en Voz Alta
            </h3>
            <p className="text-xs text-zari-muted">
              Voces naturales de Zari. Ponte los audífonos y solo habla.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zari-surface border border-white/5">
            <h3 className="text-sm font-semibold text-zari-text mb-2">
              3 Personalidades
            </h3>
            <p className="text-xs text-zari-muted">
              Cálida y cariñosa, equilibrada y adaptable, o directa y audaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

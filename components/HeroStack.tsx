import Image from "next/image";
import { heroFallback, type Resource } from "@/config/quiz";

/**
 * Abanico de 5 tarjetas.
 * - Si `resources` viene vacío: abanico dibujado 100% en CSS (lo que se ve en
 *   producción hoy, porque los assets reales del cliente aún no existen).
 * - Si `resources` trae imágenes: se renderizan en las mismas posiciones y
 *   rotaciones.
 *
 * El abanico se dibuja siempre a 700x330 y se escala con `transform` según el
 * ancho de pantalla, así en móvil entra completo sin recortarse.
 */

type Props = { resources: Resource[] };

const STAGE_WIDTH = 700;
const STAGE_HEIGHT = 330;

/**
 * Posición, rotación y tamaño de cada tarjeta.
 * `align` decide de qué lado va el contenido, para que no quede tapado por la
 * tarjeta central.
 */
const SLOTS = [
  { x: -242, y: 30, rotate: -9, w: 176, h: 224, align: "left" },
  { x: -128, y: 10, rotate: -4, w: 176, h: 240, align: "left" },
  { x: 0, y: 0, rotate: 0, w: 204, h: 296, align: "left" },
  { x: 128, y: 10, rotate: 4, w: 176, h: 240, align: "right" },
  { x: 242, y: 30, rotate: 9, w: 176, h: 224, align: "right" },
] as const;

export default function HeroStack({ resources }: Props) {
  const useImages = resources.length > 0;

  return (
    // `overflow-hidden` evita que el lienzo de 700px ensanche la página en móvil.
    <div className="flex w-full justify-center overflow-hidden">
      {/* La altura acompaña a la escala para no dejar hueco en móvil. */}
      {/*
        Escalas calculadas para que el abanico (660px de ancho real) entre
        completo dentro del ancho disponible en cada breakpoint, sin recortes.
      */}
      <div className="h-[139px] min-[380px]:h-[165px] min-[430px]:h-[191px] sm:h-[238px] md:h-[291px]">
        <div className="origin-top scale-[0.42] min-[380px]:scale-[0.50] min-[430px]:scale-[0.58] sm:scale-[0.72] md:scale-[0.88]">
          <div className="relative" style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}>
            {SLOTS.map((slot, index) => {
              const isCenter = index === 2;
              const resource = resources[index];

              return (
                <div
                  key={index}
                  className="absolute left-1/2 top-0 overflow-hidden bg-[#141414] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)]"
                  style={{
                    width: slot.w,
                    height: slot.h,
                    zIndex: isCenter ? 30 : 20 - Math.abs(index - 2),
                    borderRadius: isCenter ? 12 : 10,
                    transform: `translateX(calc(-50% + ${slot.x}px)) translateY(${slot.y}px) rotate(${slot.rotate}deg)`,
                  }}
                >
                  {useImages && resource ? (
                    <Image
                      src={resource.src}
                      alt={resource.alt}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  ) : isCenter ? (
                    <CenterCard />
                  ) : (
                    <SideCard title={heroFallback.cards[index]} align={slot.align} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Franja de cada tarjeta lateral que NO queda tapada por la de al lado. */
const SIDE_CONTENT_WIDTH = 96;

function SideCard({ title, align }: { title: string; align: "left" | "right" }) {
  const subtitle = heroFallback.side[title];
  const isRight = align === "right";

  return (
    <div
      className={`flex h-full flex-col gap-3 p-4 ${isRight ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex h-full w-full flex-col gap-3 ${isRight ? "items-end text-right" : ""}`}
        style={{ maxWidth: SIDE_CONTENT_WIDTH }}
      >
        <div className="h-7 w-7 shrink-0 rounded-md bg-[#7A2222]" />

        <div className="w-full">
          {subtitle ? (
            <>
              <p className="truncate text-[11px] text-[#8A8A8A]">{title}</p>
              <p className="truncate text-[13px] font-medium text-white">{subtitle}</p>
            </>
          ) : (
            <p className="text-[13px] font-medium leading-snug text-white">{title}</p>
          )}
        </div>

        <div className={`mt-1 w-full space-y-2 ${isRight ? "flex flex-col items-end" : ""}`}>
          <div className="h-1.5 w-[92%] rounded-full bg-[#2E2E2E]" />
          <div className="h-1.5 w-[72%] rounded-full bg-[#2E2E2E]" />
          <div className="h-1.5 w-[54%] rounded-full bg-[#2E2E2E]" />
        </div>

        <div className="mt-auto h-1.5 w-[48%] rounded-full bg-[#A32D2D]" />
      </div>
    </div>
  );
}

function CenterCard() {
  const { center } = heroFallback;

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div>
        <p className="text-[14px] font-medium text-white">{center.title}</p>
        <p className="text-[11px] text-[#8A8A8A]">{center.subtitle}</p>
      </div>

      <div className="rounded-lg bg-[#1F1F1F] p-3">
        <p className="text-[10px] uppercase tracking-wide text-[#8A8A8A]">
          {center.metric.label}
        </p>
        <p className="text-[26px] font-medium leading-tight text-white">
          {center.metric.value}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {center.small.map((item) => (
          <div key={item.label} className="rounded-lg bg-[#1F1F1F] p-2.5">
            <p className="text-[10px] text-[#8A8A8A]">{item.label}</p>
            <p
              className={`text-[13px] font-medium ${
                item.accent ? "text-[#C94A4A]" : "text-white"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-2">
        <div className="h-1.5 w-[80%] rounded-full bg-[#2E2E2E]" />
        <div className="h-1.5 w-[60%] rounded-full bg-[#2E2E2E]" />
      </div>
    </div>
  );
}

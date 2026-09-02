"use client";

import { useEffect, useState } from "react";
import { whatsappAutoOpenSeconds, whatsappOutcome } from "@/config/quiz";
import { WhatsAppIcon } from "./icons";

type Props = {
  message: string;
  link: string;
};

export default function WhatsAppScreen({ message, link }: Props) {
  const outcome = whatsappOutcome;
  const [seconds, setSeconds] = useState(whatsappAutoOpenSeconds);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) return;

    if (seconds <= 0) {
      setOpened(true);
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }

    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, opened, link]);

  return (
    <div className="step-in text-center">
      {outcome.eyebrow ? (
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          {outcome.eyebrow}
        </p>
      ) : null}

      <h2 className="mt-3 text-[30px] font-medium uppercase leading-[1.1] tracking-tight text-ink sm:text-[38px]">
        {outcome.title}
      </h2>

      <p className="mx-auto mt-4 max-w-[400px] text-[15px] leading-relaxed text-muted">
        {outcome.subtitle}{" "}
        {outcome.subtitleStrong ? (
          <strong className="font-medium text-ink">{outcome.subtitleStrong}</strong>
        ) : null}
      </p>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpened(true)}
        className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#22C15E] px-6 py-4 text-[16px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(34,193,94,0.9)] transition-colors hover:bg-[#1BA850]"
      >
        <WhatsAppIcon />
        {outcome.cta}
      </a>

      <p className="mt-4 text-[13px] text-muted" aria-live="polite">
        {opened ? (
          "Si no se ha abierto solo, pulsa el botón de arriba."
        ) : (
          <Countdown template={outcome.countdown ?? ""} seconds={seconds} />
        )}
      </p>

      <div className="mt-6 rounded-2xl border border-hairline bg-white p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          {outcome.previewLabel}
        </p>

        <div className="mt-3 rounded-xl rounded-tr-sm bg-[#E7F8D8] px-4 py-3">
          <p className="whitespace-pre-wrap text-left text-[14px] leading-relaxed text-ink">
            {message}
          </p>
        </div>

        {outcome.previewFootnote ? (
          <p className="mt-3 text-[12px] text-muted">{outcome.previewFootnote}</p>
        ) : null}
      </div>

      {outcome.privacyNote ? (
        <p className="mt-5 text-[12px] text-muted">{outcome.privacyNote}</p>
      ) : null}
    </div>
  );
}

/** "Abriendo WhatsApp en {seconds} segundos..." con el número en negrita. */
function Countdown({ template, seconds }: { template: string; seconds: number }) {
  const [before, after] = template.split("{seconds}");

  return (
    <>
      {before}
      <strong className="font-medium tabular-nums text-ink">{seconds}</strong>
      {after}
    </>
  );
}

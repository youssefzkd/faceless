"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  copy,
  hardFilters,
  heroResources,
  questions,
  rejectImmediately,
  showChannelFieldWhen,
  socialProofAvatars,
  socialProofCount,
  socialProofCountIntervalMs,
  socialProofCountStep,
  withCount,
  type Tier,
} from "@/config/quiz";
import type { Answers, Contact } from "@/lib/types";
import ContactStep from "./ContactStep";
import HeroStack from "./HeroStack";
import ProgressBar from "./ProgressBar";
import QuestionStep from "./QuestionStep";
import RejectionScreen from "./RejectionScreen";
import ThankYouScreen from "./ThankYouScreen";
import WhatsAppScreen from "./WhatsAppScreen";
import { CheckIcon } from "./icons";

type Outcome = {
  tier: Tier;
  kind: "whatsapp" | "thankyou" | "rechazo";
  message: string;
  link: string;
};

const CONTACT_STEP = questions.length;

export default function Funnel() {
  const searchParams = useSearchParams();

  // Progreso parcial en estado de React (nunca localStorage).
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [source, setSource] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // ?src=youtube | x | ig ... se captura al montar y viaja como tag a GHL.
  useEffect(() => {
    const src = searchParams.get("src");
    if (src) setSource(src.trim().slice(0, 40));
  }, [searchParams]);

  // El número del pill de prueba social sube solo mientras la persona
  // está en la página (ver socialProofCountStep / socialProofCountIntervalMs).
  const countPrefix = socialProofCount.match(/^\D*/)?.[0] ?? "";
  const [liveCount, setLiveCount] = useState(
    () => parseInt(socialProofCount.replace(/\D/g, ""), 10) || 0,
  );

  useEffect(() => {
    const id = setInterval(() => {
      setLiveCount((prev) => prev + socialProofCountStep);
    }, socialProofCountIntervalMs);
    return () => clearInterval(id);
  }, []);

  function selectOption(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    // Si la respuesta descalifica, se corta acá mismo: no se le piden los datos.
    const rejects = hardFilters.some(
      (f) => f.reject && f.questionId === questionId && f.optionId === optionId,
    );

    if (rejectImmediately && rejects) {
      setOutcome({ tier: "bajo", kind: "rechazo", message: "", link: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStep((prev) => prev + 1);
  }

  function goBack() {
    setStep((prev) => Math.max(0, prev - 1));
  }

  async function submit(contact: Contact) {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, contact, source }),
      });

      if (!response.ok) throw new Error("request_failed");

      setOutcome((await response.json()) as Outcome);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(copy.contact.errors.generic);
    } finally {
      setSubmitting(false);
    }
  }

  const showChannelField = (
    showChannelFieldWhen.optionIds as readonly string[]
  ).includes(answers[showChannelFieldWhen.questionId] ?? "");

  // Al terminar, la pantalla de resultado se queda sola: sin hero ni bullets.
  if (outcome) {
    return (
      <main className="mx-auto flex w-full max-w-page flex-col px-5 pb-16 pt-14 sm:pt-20">
        {outcome.kind === "rechazo" ? (
          <RejectionScreen onBack={() => setOutcome(null)} />
        ) : outcome.kind === "whatsapp" ? (
          <WhatsAppScreen
            tier={outcome.tier}
            message={outcome.message}
            link={outcome.link}
          />
        ) : (
          <ThankYouScreen />
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-page flex-col items-center px-5 pb-16 pt-10 sm:pt-14">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] text-brand-deep">
        <Avatars />
        {withCount(copy.socialProof, `${countPrefix}${liveCount}`)}
      </span>

      <h1 className="mt-6 text-center text-[30px] font-medium leading-[1.15] tracking-tight text-ink sm:text-[38px]">
        <span className="block">{copy.headline.line1}</span>
        <span className="block">{copy.headline.line2}</span>
        <span className="block text-brand">{copy.headline.accent}</span>
      </h1>

      <div className="mt-6 w-full sm:mt-8">
        <HeroStack resources={heroResources} />
      </div>

      <section className="mt-8 w-full rounded-2xl border border-hairline bg-white p-5 sm:p-7">
        {step < CONTACT_STEP ? (
          <>
            <ProgressBar current={step + 1} total={questions.length} />
            <div className="mt-6">
              <QuestionStep
                key={questions[step].id}
                question={questions[step]}
                selected={answers[questions[step].id]}
                onSelect={(optionId) => selectOption(questions[step].id, optionId)}
                onBack={step > 0 ? goBack : undefined}
              />
            </div>
          </>
        ) : (
          <>
            <ProgressBar current={questions.length} total={questions.length} />
            <div className="mt-6">
              <ContactStep
                showChannelField={showChannelField}
                submitting={submitting}
                submitError={submitError}
                onSubmit={submit}
                onBack={goBack}
              />
            </div>
          </>
        )}
      </section>

      <ul className="mt-7 flex flex-col items-center gap-2">
        {copy.closingBullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-2 text-[14px] text-ink">
            <CheckIcon className="text-brand" />
            {withCount(bullet)}
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-[520px] text-center text-[11px] leading-relaxed text-muted">
        {copy.legal}
      </p>
    </main>
  );
}

/**
 * Caritas del pill de prueba social. Con `socialProofAvatars` lleno usa esas
 * fotos; vacío, dibuja los círculos rojos de siempre.
 */
function Avatars() {
  const shades = ["#A32D2D", "#801F1F", "#C25454"];

  if (socialProofAvatars.length > 0) {
    return (
      <span className="flex -space-x-1.5" aria-hidden="true">
        {socialProofAvatars.map((avatar) => (
          <Image
            key={avatar.src}
            src={avatar.src}
            alt={avatar.alt}
            width={36}
            height={36}
            className="h-[18px] w-[18px] rounded-full object-cover ring-2 ring-brand-soft"
          />
        ))}
      </span>
    );
  }

  return (
    <span className="flex -space-x-1.5" aria-hidden="true">
      {shades.map((shade) => (
        <span
          key={shade}
          className="h-4 w-4 rounded-full ring-2 ring-brand-soft"
          style={{ backgroundColor: shade }}
        />
      ))}
    </span>
  );
}

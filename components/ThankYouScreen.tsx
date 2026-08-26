import { outcomes } from "@/config/quiz";

export default function ThankYouScreen() {
  const outcome = outcomes.bajo;

  return (
    <div className="step-in text-center">
      <h2 className="text-[20px] font-medium leading-snug text-ink sm:text-[22px]">
        {outcome.title}
      </h2>
      <p className="mx-auto mt-2 max-w-[420px] text-[14px] leading-relaxed text-muted">
        {outcome.subtitle}
      </p>

      {outcome.resourceUrl ? (
        <a
          href={outcome.resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-4 text-[16px] font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {outcome.resourceCta}
        </a>
      ) : null}
    </div>
  );
}

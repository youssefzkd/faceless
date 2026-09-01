import { copy, rejectionScreen } from "@/config/quiz";

type Props = {
  onBack: () => void;
};

export default function RejectionScreen({ onBack }: Props) {
  return (
    <div className="step-in text-center">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
        {rejectionScreen.eyebrow}
      </p>

      <h2 className="mt-3 text-[30px] font-medium uppercase leading-[1.1] tracking-tight text-ink sm:text-[38px]">
        {rejectionScreen.title}
      </h2>

      <p className="mx-auto mt-4 max-w-[420px] text-[15px] leading-relaxed text-muted">
        {rejectionScreen.subtitle}
      </p>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-2 py-1 text-[13px] text-muted transition-colors hover:text-ink"
        >
          ← {copy.back}
        </button>
      </div>
    </div>
  );
}

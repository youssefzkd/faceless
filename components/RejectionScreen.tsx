import { rejectionScreen } from "@/config/quiz";

export default function RejectionScreen() {
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
    </div>
  );
}

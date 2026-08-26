"use client";

import { copy, type Question } from "@/config/quiz";
import { ArrowIcon } from "./icons";

type Props = {
  question: Question;
  selected?: string;
  onSelect: (optionId: string) => void;
  onBack?: () => void;
};

export default function QuestionStep({ question, selected, onSelect, onBack }: Props) {
  return (
    <div className="step-in">
      <h2 className="text-center text-[19px] font-medium leading-snug text-ink sm:text-[21px]">
        {question.title}
      </h2>

      <div
        className="mt-6 flex flex-col gap-3"
        role="radiogroup"
        aria-label={question.title}
      >
        {question.options.map((option) => {
          const isSelected = selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.id)}
              className={[
                "group flex w-full items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left text-[15px] transition-colors",
                isSelected
                  ? "border-brand bg-brand font-medium text-white"
                  : "border-hairline bg-white text-ink hover:border-brand/40 hover:bg-brand-soft/40",
              ].join(" ")}
            >
              <span>{option.label}</span>
              <ArrowIcon
                className={
                  isSelected ? "text-white" : "text-hairline group-hover:text-brand/60"
                }
              />
            </button>
          );
        })}
      </div>

      {question.note ? (
        <p className="mt-4 text-center text-[13px] leading-relaxed text-muted">
          {question.note}
        </p>
      ) : null}

      {onBack ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md px-2 py-1 text-[13px] text-muted transition-colors hover:text-ink"
          >
            ← {copy.back}
          </button>
        </div>
      ) : null}
    </div>
  );
}

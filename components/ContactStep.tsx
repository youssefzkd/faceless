"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { copy, defaultPhoneCountry } from "@/config/quiz";
import { isValidEmail, isValidName, isValidPhone } from "@/lib/validate";
import type { Contact } from "@/lib/types";

type Props = {
  showChannelField: boolean;
  submitting: boolean;
  submitError: string | null;
  onSubmit: (contact: Contact) => void;
  onBack: () => void;
};

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

export default function ContactStep({
  showChannelField,
  submitting,
  submitError,
  onSubmit,
  onBack,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [channel, setChannel] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const next: Errors = {};
    if (!isValidName(name)) next.name = copy.contact.errors.name;
    if (!isValidEmail(email)) next.email = copy.contact.errors.email;
    if (!isValidPhone(phone)) next.phone = copy.contact.errors.phone;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone as string,
      channel: channel.trim() || undefined,
    });
  }

  return (
    <form className="step-in" onSubmit={handleSubmit} noValidate>
      <h2 className="text-center text-[19px] font-medium leading-snug text-ink sm:text-[21px]">
        {copy.contact.title}
      </h2>
      <p className="mt-2 text-center text-[14px] text-muted">{copy.contact.subtitle}</p>

      <div className="mt-6 flex flex-col gap-4">
        <Field label={copy.contact.nameLabel} htmlFor="name" error={errors.name}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={copy.contact.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field label={copy.contact.emailLabel} htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.contact.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            className={inputClass(Boolean(errors.email))}
          />
        </Field>

        <Field label={copy.contact.phoneLabel} htmlFor="phone" error={errors.phone}>
          <PhoneInput
            id="phone"
            international
            defaultCountry={defaultPhoneCountry as never}
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
            style={errors.phone ? { borderColor: "#A32D2D" } : undefined}
          />
        </Field>

        {showChannelField ? (
          <Field label={copy.contact.channelLabel} htmlFor="channel">
            <input
              id="channel"
              type="url"
              inputMode="url"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder={copy.contact.channelPlaceholder}
              className={inputClass(false)}
            />
          </Field>
        ) : null}
      </div>

      {submitError ? (
        <p className="mt-4 text-center text-[13px] text-brand" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-xl bg-brand px-5 py-4 text-[16px] font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {submitting ? copy.contact.submitting : copy.contact.submit}
      </button>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-2 py-1 text-[13px] text-muted transition-colors hover:text-ink"
        >
          ← {copy.back}
        </button>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "w-full rounded-[10px] border bg-white px-3.5 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-[#9A9A9A]",
    hasError ? "border-brand" : "border-hairline focus:border-brand",
  ].join(" ");
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[13px] text-brand" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

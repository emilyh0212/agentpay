"use client";

import { useMemo, useState } from "react";

type OnboardingKey = "name" | "agentName" | "phone" | "address";

type Step = {
  key: OnboardingKey;
  prompt: string | ((values: Record<OnboardingKey, string>) => string);
  placeholder: string;
  helper: string;
};

const steps: Step[] = [
  {
    key: "name",
    prompt: "What’s your name?",
    placeholder: "Your name",
    helper: "Your agent will use this in every conversation.",
  },
  {
    key: "agentName",
    prompt: "What should your shopping agent be called?",
    placeholder: "Scout",
    helper: "Examples: Scout, Ava, Mia, Bean",
  },
  {
    key: "phone",
    prompt: (values) =>
      `What number should ${values.agentName || "your agent"} text you at?`,
    placeholder: "(201) 555-0134",
    helper: "Your agent will run through SMS first.",
  },
  {
    key: "address",
    prompt: (values) =>
      `Where should ${values.agentName || "your agent"} send your orders?`,
    placeholder: "123 Washington St, Hoboken, NJ",
    helper: "You can confirm or change this before every purchase.",
  },
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Record<OnboardingKey, string>>({
    name: "",
    agentName: "",
    phone: "",
    address: "",
  });
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = steps[index];
  const currentPrompt =
    typeof currentStep.prompt === "function"
      ? currentStep.prompt(values)
      : currentStep.prompt;
  const currentValue = values[currentStep.key];
  const canContinue = currentValue.trim().length > 0;

  const profilePreview = useMemo(
    () => ({
      name: values.name || "You",
      agentName: values.agentName || "Your agent",
      phone: values.phone || "Pending",
      address: values.address || "Pending",
    }),
    [values],
  );
  const starterMessage = `hey it's ${profilePreview.name}, set me up`;
  const smsHref = `sms:+14155550198&body=${encodeURIComponent(starterMessage)}`;

  function updateValue(nextValue: string) {
    setValues((prev) => ({ ...prev, [currentStep.key]: nextValue }));
  }

  function nextStep() {
    if (!canContinue) return;

    if (index < steps.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    localStorage.setItem("agentpay_profile", JSON.stringify(values));
    setIsComplete(true);
  }

  function resetFlow() {
    setIndex(0);
    setIsComplete(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(236,72,153,0.28),transparent_38%),radial-gradient(circle_at_88%_85%,rgba(236,72,153,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_30%,transparent_70%,rgba(255,255,255,0.03))]" />

      <main className="relative z-10 w-full max-w-4xl">
        {!isComplete ? (
          <section className="mx-auto flex min-h-[74vh] max-w-3xl flex-col items-center justify-center text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-pink-400/95">
              AgentPay Setup
            </p>
            <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {currentPrompt}
            </h1>
            <p className="mt-4 text-sm text-zinc-400">{currentStep.helper}</p>

            <input
              value={currentValue}
              onChange={(event) => updateValue(event.target.value)}
              placeholder={currentStep.placeholder}
              className="mt-10 w-full max-w-xl border-b border-zinc-700 bg-transparent px-1 pb-3 text-center text-xl text-white outline-none transition placeholder:text-zinc-500 focus:border-pink-500"
            />

            <div className="mt-10 flex items-center gap-3">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => setIndex((prev) => prev - 1)}
                  className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-pink-500 hover:text-white"
                >
                  Back
                </button>
              ) : null}
              <button
                type="button"
                onClick={nextStep}
                disabled={!canContinue}
                className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
                  canContinue
                    ? "bg-pink-500 text-black hover:bg-pink-400"
                    : "cursor-not-allowed bg-zinc-800 text-zinc-500"
                }`}
              >
                {index === steps.length - 1 ? "Finish setup" : "Continue"}
              </button>
            </div>

            <div className="mt-8 flex gap-2">
              {steps.map((step, stepIndex) => (
                <span
                  key={step.key}
                  className={`h-1.5 rounded-full transition-all ${
                    stepIndex === index ? "w-8 bg-pink-400" : "w-3 bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 text-center shadow-[0_20px_80px_rgba(236,72,153,0.15)] sm:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-pink-400">
              Agent Ready
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {profilePreview.agentName} is ready to text.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400">
              You are set. The experience now continues in messaging, where{" "}
              {profilePreview.agentName} finds products, compares retailers, and asks for
              approval before purchase.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left text-sm text-zinc-300 sm:grid-cols-4">
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Name</p>
                <p className="mt-1 text-base text-white">{profilePreview.name}</p>
              </article>
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Agent</p>
                <p className="mt-1 text-base text-white">{profilePreview.agentName}</p>
              </article>
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Phone</p>
                <p className="mt-1 text-base text-white">{profilePreview.phone}</p>
              </article>
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Address</p>
                <p className="mt-1 text-base text-white">{profilePreview.address}</p>
              </article>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFlow}
                className="rounded-full border border-zinc-700 px-7 py-3 text-sm font-semibold text-zinc-200 transition hover:border-pink-500 hover:text-white"
              >
                Edit onboarding details
              </button>
            </div>

            <section className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border border-pink-500/30 bg-pink-500/10 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300">
                Text {profilePreview.agentName} to get started
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">+1 415 555 0198</p>
              <p className="mt-4 text-sm text-zinc-200">&ldquo;{starterMessage}&rdquo;</p>
              <a
                href={smsHref}
                className="mt-6 inline-block rounded-full bg-pink-500 px-10 py-3 text-base font-semibold text-black transition hover:bg-pink-400"
              >
                Open Messages
              </a>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

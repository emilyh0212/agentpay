"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const productName = searchParams.get("product") ?? "Selected Product";
  const retailer = searchParams.get("retailer") ?? "Selected Retailer";
  const address = searchParams.get("address") ?? "No address provided.";
  const total = Number(searchParams.get("total") ?? "0");
  const reasoning =
    searchParams.get("reason") ??
    "Best overall blend of your preferences and target budget.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(236,72,153,0.2),transparent_35%),radial-gradient(circle_at_85%_90%,rgba(236,72,153,0.12),transparent_35%)]" />
      <main className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-[0_20px_80px_rgba(236,72,153,0.14)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-pink-400">
          Receipt
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Purchase approved
        </h1>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <dl className="space-y-3 text-sm text-zinc-300">
            <div className="flex items-center justify-between gap-4">
              <dt>Product</dt>
              <dd className="text-right font-medium text-white">{productName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-3">
              <dt>Retailer</dt>
              <dd className="text-right font-medium text-white">{retailer}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-3">
              <dt>Total spent</dt>
              <dd className="text-right text-base font-semibold text-white">{toCurrency(total)}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-5 rounded-2xl border border-pink-500/40 bg-pink-500/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-300">
            Agent reasoning
          </p>
          <p className="mt-2 text-sm text-zinc-100">{reasoning}</p>
        </section>

        <section className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Shipping destination
          </p>
          <p className="mt-2 text-sm text-zinc-200">{address}</p>
        </section>

        <p className="mt-6 text-sm text-zinc-400">
          In a real version, AgentPay would now complete checkout using Stripe or retailer checkout.
        </p>

        <div className="mt-8">
          <Link
            href="/agent"
            className="rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-pink-400"
          >
            Start another purchase request
          </Link>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function ApprovalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productName = searchParams.get("product") ?? "Rhode Barrier Restore Cream";
  const retailer = searchParams.get("retailer") ?? "Sephora";
  const basePrice = Number(searchParams.get("productPrice") ?? "30");
  const shipping = Number(searchParams.get("shippingCost") ?? "0");
  const tax = Number(searchParams.get("estimatedTax") ?? "2.48");
  const delivery = searchParams.get("delivery") ?? "3-4 business days";
  const address =
    searchParams.get("address") ?? "123 Washington St, Hoboken, NJ";
  const request =
    searchParams.get("request") ?? "can you buy me the Rhode milk moisturizer";
  const reasoning =
    searchParams.get("reason") ??
    "Selected for strong trust score and the best landed-cost-to-delivery balance.";
  const total = Number(searchParams.get("total") ?? "32.48");

  const successHref = `/success?${new URLSearchParams({
    product: productName,
    retailer,
    address,
    total: String(total),
    reason: reasoning,
  }).toString()}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(236,72,153,0.2),transparent_40%),radial-gradient(circle_at_90%_85%,rgba(236,72,153,0.12),transparent_35%)]" />

      <main className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-[0_20px_80px_rgba(236,72,153,0.15)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-pink-400">
          Approval Checkpoint
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Final confirmation before purchase
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Your texting agent did the comparison. This page is only for final trust and approval.
        </p>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">{productName}</h2>
            <p className="text-sm text-pink-300">via {retailer}</p>
          </div>
          <dl className="mt-5 space-y-2 text-sm text-zinc-300">
            <div className="flex items-center justify-between"><dt>Product price</dt><dd>{toCurrency(basePrice)}</dd></div>
            <div className="flex items-center justify-between"><dt>Shipping</dt><dd>{toCurrency(shipping)}</dd></div>
            <div className="flex items-center justify-between"><dt>Estimated tax</dt><dd>{toCurrency(tax)}</dd></div>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-3 text-base font-semibold text-white"><dt>Total landed cost</dt><dd>{toCurrency(total)}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-zinc-500">Estimated delivery: {delivery}</p>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Original message</p>
            <p className="mt-2 text-sm text-zinc-200">{request}</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Shipping address</p>
            <p className="mt-2 text-sm text-zinc-200">{address}</p>
          </article>
          <article className="rounded-2xl border border-pink-500/40 bg-pink-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-pink-300">Agent reasoning</p>
            <p className="mt-2 text-sm text-zinc-100">{reasoning}</p>
          </article>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={successHref} className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-400">Confirm purchase</Link>
          <button type="button" onClick={() => router.back()} className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-pink-500 hover:text-white">Go back</button>
          <Link href="/agent" className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-pink-500 hover:text-white">Cancel</Link>
        </div>
      </main>
    </div>
  );
}

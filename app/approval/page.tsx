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

  const productName = searchParams.get("name") ?? "Selected Product";
  const basePrice = Number(searchParams.get("price") ?? "0");
  const request = searchParams.get("request") ?? "No request captured.";
  const reasoning =
    searchParams.get("reason") ??
    "Best overall blend of your preferences and target budget.";

  const shipping = basePrice >= 25 ? 0 : 4.99;
  const tax = Number((basePrice * 0.0825).toFixed(2));
  const total = Number((basePrice + shipping + tax).toFixed(2));

  const successHref = `/success?${new URLSearchParams({
    name: productName,
    total: String(total),
    reason: reasoning,
  }).toString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-100 px-6 py-10">
      <main className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/80">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          AgentPay Approval
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Final approval checkpoint
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review your agent-selected purchase before confirmation.
        </p>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">{productName}</p>
          <dl className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <dt>Product price</dt>
              <dd>{toCurrency(basePrice)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Estimated shipping</dt>
              <dd>{toCurrency(shipping)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Estimated tax</dt>
              <dd>{toCurrency(tax)}</dd>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <dt>Total price</dt>
              <dd>{toCurrency(total)}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Original request
            </p>
            <p className="mt-2 text-sm text-slate-800">{request}</p>
          </article>
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Why agent selected this
            </p>
            <p className="mt-2 text-sm text-slate-800">{reasoning}</p>
          </article>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={successHref}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Confirm purchase
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go back
          </button>
          <Link
            href="/agent"
            className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Cancel
          </Link>
        </div>
      </main>
    </div>
  );
}

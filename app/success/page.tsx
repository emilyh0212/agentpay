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

  const productName = searchParams.get("name") ?? "Selected Product";
  const total = Number(searchParams.get("total") ?? "0");
  const reasoning =
    searchParams.get("reason") ??
    "Best overall blend of your preferences and target budget.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 px-6 py-12">
      <main className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          AgentPay Receipt
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Purchase approved
        </h1>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <dl className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Product</dt>
              <dd className="text-right font-medium text-slate-900">{productName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
              <dt className="text-slate-500">Total spent</dt>
              <dd className="text-right text-base font-semibold text-slate-900">
                {toCurrency(total)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Agent reasoning
          </p>
          <p className="mt-2 text-sm text-slate-800">{reasoning}</p>
        </section>

        <p className="mt-6 text-sm text-slate-600">
          In a real version, AgentPay would now complete checkout using Stripe or
          retailer checkout.
        </p>

        <div className="mt-8">
          <Link
            href="/agent"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Start another request
          </Link>
        </div>
      </main>
    </div>
  );
}

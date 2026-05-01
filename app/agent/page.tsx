"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import offers from "@/data/retailer_offers.json";

type RetailerOffer = {
  productName: string;
  retailer: string;
  productUrl: string;
  productPrice: number;
  shippingCost: number;
  estimatedTax: number;
  totalCost: number;
  deliveryEstimate: string;
  trustLevel: number;
  sellerRisk: number;
  inStock: boolean;
};

type RankedOffer = RetailerOffer & {
  calculatedTotal: number;
  etaDays: number;
  score: number;
};

const DEFAULT_REQUEST = "can you buy me the Rhode milk moisturizer";
const SAVED_ADDRESS = "123 Washington St, Hoboken, NJ";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function estimateDays(deliveryEstimate: string) {
  const values = deliveryEstimate.match(/\d+/g);
  if (!values?.length) return 7;
  const nums = values.map(Number);
  return nums.length > 1 ? nums[0] : nums[0];
}

function identifyRequestedProduct(input: string) {
  const normalized = input.toLowerCase();
  if (normalized.includes("rhode") && normalized.includes("milk")) {
    return "Rhode Barrier Restore Cream (Milk Moisturizer)";
  }

  const byName = (offers as RetailerOffer[]).find((offer) =>
    normalized.includes(offer.productName.toLowerCase().split("(")[0].trim().toLowerCase()),
  );

  return byName?.productName ?? null;
}

function rankOffers(input: string) {
  const requestedProduct = identifyRequestedProduct(input);
  const matchingOffers = (offers as RetailerOffer[]).filter(
    (offer) => requestedProduct && offer.productName === requestedProduct,
  );

  const ranked = matchingOffers
    .map((offer) => {
      const calculatedTotal = Number(
        (offer.productPrice + offer.shippingCost + offer.estimatedTax).toFixed(2),
      );
      const etaDays = estimateDays(offer.deliveryEstimate);

      let score = 100;
      score -= calculatedTotal * 1.4;
      score -= etaDays * 2.2;
      score += offer.trustLevel * 6;
      score -= offer.sellerRisk * 7;
      score += offer.inStock ? 10 : -40;

      return {
        ...offer,
        calculatedTotal,
        etaDays,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    requestedProduct,
    ranked,
  };
}

function buildReasoning(best: RankedOffer, second?: RankedOffer) {
  const reasons = [
    `${best.retailer} has a landed total of ${toCurrency(best.calculatedTotal)}.`,
    `Delivery estimate is ${best.deliveryEstimate}.`,
    `Trust level ${best.trustLevel}/10 with seller risk ${best.sellerRisk}/10.`,
  ];

  if (second) {
    reasons.push(
      `Compared with ${second.retailer}, this option scored better on cost/trust/speed balance.`,
    );
  }

  return reasons.join(" ");
}

export default function AgentPage() {
  const [request, setRequest] = useState(DEFAULT_REQUEST);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  const { requestedProduct, ranked } = useMemo(() => rankOffers(request), [request]);
  const recommended = ranked[0];
  const alternatives = ranked.slice(1);
  const reasoning = recommended
    ? buildReasoning(recommended, ranked[1])
    : "No matching offers found for this request.";

  const approvalHref = recommended
    ? `/approval?${new URLSearchParams({
        product: recommended.productName,
        retailer: recommended.retailer,
        productPrice: String(recommended.productPrice),
        shippingCost: String(recommended.shippingCost),
        estimatedTax: String(recommended.estimatedTax),
        total: String(recommended.calculatedTotal),
        delivery: recommended.deliveryEstimate,
        address: SAVED_ADDRESS,
        reason: reasoning,
        request,
      }).toString()}`
    : "/approval";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 px-6 py-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            AgentPay Purchase Agent
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Purchase comparison and checkout planning
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Agent identifies your requested product, compares retailers, and prepares approval.
          </p>

          <label htmlFor="request" className="sr-only">
            Shopping request
          </label>
          <input
            id="request"
            value={request}
            onChange={(event) => {
              setRequest(event.target.value);
              setAddressConfirmed(false);
            }}
            className="mt-5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-blue-500 transition focus:ring-2"
          />

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Requested product: {requestedProduct ?? "Not detected"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Offers found: {ranked.length}
            </span>
          </div>
        </section>

        {recommended ? (
          <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Recommended retailer
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                {recommended.retailer}
              </h2>
              <p className="mt-1 text-sm text-slate-700">{recommended.productName}</p>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs text-slate-500">Product</dt>
                  <dd className="font-semibold text-slate-900">
                    {toCurrency(recommended.productPrice)}
                  </dd>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs text-slate-500">Shipping</dt>
                  <dd className="font-semibold text-slate-900">
                    {toCurrency(recommended.shippingCost)}
                  </dd>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs text-slate-500">Tax</dt>
                  <dd className="font-semibold text-slate-900">
                    {toCurrency(recommended.estimatedTax)}
                  </dd>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs text-slate-500">Landed total</dt>
                  <dd className="font-semibold text-slate-900">
                    {toCurrency(recommended.calculatedTotal)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-sm text-slate-700">
                Delivery: {recommended.deliveryEstimate} · Trust {recommended.trustLevel}/10 ·
                Risk {recommended.sellerRisk}/10
              </p>

              <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Why this retailer</p>
                <p className="mt-2 text-sm text-slate-700">{reasoning}</p>
              </div>

              <a
                href={recommended.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4"
              >
                View mock retailer listing
              </a>
            </article>

            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Other retailer options</p>
              <div className="mt-3 space-y-3">
                {alternatives.map((offer) => (
                  <article key={offer.retailer} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{offer.retailer}</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {toCurrency(offer.calculatedTotal)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Delivery {offer.deliveryEstimate} · Trust {offer.trustLevel}/10 · Risk {offer.sellerRisk}/10
                    </p>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        ) : (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Product could not be identified from the request. Try:
            {" \"can you buy me the Rhode milk moisturizer\"."}
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Confirm shipping address</p>
          <p className="mt-1 text-sm text-slate-600">Saved address: {SAVED_ADDRESS}</p>
          <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={addressConfirmed}
              onChange={(event) => setAddressConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            I confirm this is the correct shipping address for this purchase.
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={addressConfirmed ? approvalHref : "#"}
              aria-disabled={!addressConfirmed || !recommended}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white transition ${
                addressConfirmed && recommended
                  ? "bg-slate-900 hover:bg-slate-700"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Continue to approval
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

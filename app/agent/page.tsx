"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import products from "@/data/sample_products.json";

type Product = {
  name: string;
  price: number;
  tags: string[];
  shortDescription: string;
};

const DEFAULT_PROMPT =
  "Find me the best SPF moisturizer under $30 for acne prone skin";

const queryTokenMap: Record<string, string[]> = {
  acne: ["acne", "acne-prone", "breakout", "non-comedogenic", "acne-safe"],
  korean: ["korean", "k-beauty"],
  lightweight: ["lightweight", "light", "water", "gel"],
  matte: ["matte", "oil", "oil-control", "shine"],
  hydrating: ["hydrating", "moisturizer", "moisturizing", "dry"],
  sensitive: ["sensitive", "gentle", "calming"],
  spf: ["spf", "sunscreen", "sun"],
  budget: ["budget", "affordable", "cheap"],
};

function parseRequest(input: string) {
  const normalized = input.toLowerCase();
  const budgetMatch = normalized.match(/under\s*\$?(\d+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;

  const desiredTags = Object.entries(queryTokenMap)
    .filter(([, phrases]) => phrases.some((phrase) => normalized.includes(phrase)))
    .map(([tag]) => tag);

  return { budget, desiredTags, normalized };
}

function rankProducts(input: string) {
  const { budget, desiredTags } = parseRequest(input);

  const ranked = (products as Product[])
    .map((product) => {
      const tagMatches = desiredTags.filter((tag) => product.tags.includes(tag));
      const priceDelta = budget ? budget - product.price : 0;
      const withinBudget = budget ? product.price <= budget : true;

      let score = tagMatches.length * 14;
      if (budget !== null) {
        score += withinBudget ? 16 : Math.max(-16, -Math.abs(priceDelta));
      }
      score += Math.max(0, 7 - product.price / 10);

      const reasons = [
        ...tagMatches.map((tag) => `Matches preference: ${tag}`),
        budget !== null && withinBudget
          ? `Within your budget at $${product.price}`
          : null,
      ].filter(Boolean) as string[];

      const misses = [
        ...desiredTags
          .filter((tag) => !product.tags.includes(tag))
          .slice(0, 2)
          .map((tag) => `Missing ${tag} focus`),
        budget !== null && !withinBudget
          ? `$${product.price} is above your $${budget} budget`
          : null,
      ].filter(Boolean) as string[];

      return {
        ...product,
        score,
        reasons,
        misses,
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    ranked,
    budget,
    desiredTags,
  };
}

export default function AgentPage() {
  const [request, setRequest] = useState(DEFAULT_PROMPT);

  const { ranked, budget, desiredTags } = useMemo(() => rankProducts(request), [request]);
  const topThree = ranked.slice(0, 3);
  const recommended = topThree[0];
  const others = topThree.slice(1);
  const approvalHref = recommended
    ? `/approval?${new URLSearchParams({
        name: recommended.name,
        price: String(recommended.price),
        request,
        reason:
          recommended.reasons.slice(0, 3).join(" | ") ||
          "Best overall blend of preference match and price.",
      }).toString()}`
    : "/approval";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 px-6 py-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            AgentPay AI Shopper
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Ask your agent what to buy
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Demo decision engine: parses your intent, compares products, and explains picks.
          </p>

          <label htmlFor="shop-request" className="sr-only">
            Shopping request
          </label>
          <input
            id="shop-request"
            value={request}
            onChange={(event) => setRequest(event.target.value)}
            className="mt-5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500 transition focus:ring-2"
            placeholder="Type your request..."
          />

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Budget: {budget ? `$${budget}` : "No cap"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Preferences: {desiredTags.length ? desiredTags.join(", ") : "General match"}
            </span>
          </div>
        </section>

        {recommended ? (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Recommended
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{recommended.name}</h2>
              <p className="mt-1 text-sm font-medium text-slate-700">${recommended.price}</p>
              <p className="mt-3 text-sm text-slate-700">{recommended.shortDescription}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {recommended.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs text-emerald-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-900">Why I picked this</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {recommended.reasons.slice(0, 3).map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              </div>
            </article>

            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Why not the others</p>
              <div className="mt-3 space-y-4">
                {others.map((product) => (
                  <div key={product.name} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">${product.price}</p>
                    <p className="mt-2 text-xs text-slate-700">
                      {product.misses[0] || "Strong option, but scored slightly lower overall."}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        ) : null}

        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Top 3 options</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {topThree.map((product, index) => (
              <article
                key={product.name}
                className={`rounded-2xl border p-4 shadow-sm ${
                  index === 0
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                <p className="mt-1 text-xs text-slate-600">${product.price}</p>
                <p className="mt-2 text-xs text-slate-700">{product.shortDescription}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="flex justify-center pb-4">
          <Link
            href={approvalHref}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Approve purchase
          </Link>
        </div>
      </main>
    </div>
  );
}

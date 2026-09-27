import "server-only";
import { RuleCMSWidgetServer } from "@rulecms/widget-react/server";
import type { Scenario } from "@/lib/scenarios";
import {
  localeRulesetKey,
  nestedRulesetKey,
  ruleCmsTarget,
  ruleCmsToken,
  tokenEnvName,
  widgetKeyEnvName,
  widgetKeyForSlug,
} from "@/lib/rulecms-env";

const libraries = {
  default: () => import("@rulecms/source-components-react"),
};

const priceTextId = "5d7f0604-ddfa-4db4-9d2c-da677faba851";
const priceChildEmbeddingId = "fed4c349-6dca-478e-bba2-99cdebb8ceba";

/** First tree on the page is $125. Second tree is $250. */
const twoTreePrices = {
  [`ddcabae5-0245-47b3-95db-f8fbc872ea26/${priceChildEmbeddingId}/${priceTextId}`]:
    { placeholderValues: { price: "$125" } },
  [`e0a36146-d0d5-4358-a70e-5480ed898e0b/${priceChildEmbeddingId}/${priceTextId}`]:
    { placeholderValues: { price: "$250" } },
};

function placeholderValuesFor(slug: string): unknown {
  if (slug === "text-component") {
    return { price: 65 };
  }
  if (slug === "collection-dynamic-price") {
    return { price: "$125" };
  }
  if (slug === "two-embedded-price-trees") {
    return null;
  }
  return undefined;
}

function LocaleRulesetWidgets({
  token,
}: {
  token: string | undefined;
}) {
  const ruleset = localeRulesetKey();

  if (!token || !ruleset.value) {
    const names = [!token ? tokenEnvName() : null, !ruleset.value ? ruleset.name : null].filter(
      (name): name is string => name !== null,
    );
    return (
      <p>
        Not configured for the {ruleCmsTarget()} environment. Set{" "}
        {names.join(" and ")} on the server.
      </p>
    );
  }

  return (
    <>
      <RuleCMSWidgetServer
        token={token}
        rulesetPublishedKey={ruleset.value}
        params={{ locale: "de-DE" }}
        libraries={libraries}
        fetchOptions={{ cache: "no-store" }}
        errorFallback={<p>The German locale could not be resolved.</p>}
      />
      <RuleCMSWidgetServer
        token={token}
        rulesetPublishedKey={ruleset.value}
        params={{ locale: "en-US" }}
        libraries={libraries}
        fetchOptions={{ cache: "no-store" }}
        errorFallback={<p>The other locale could not be resolved.</p>}
      />
    </>
  );
}

const nestedRulesetCases = [
  {
    label: "The Pro plan case",
    params: { user: { plan: "pro" }, cart: { value: 10 } },
  },
  {
    label: "The high-cart case",
    params: { user: { plan: "free" }, cart: { value: 100 } },
  },
  {
    label: "The recent-purchase case",
    params: {
      user: { plan: "free", lastPurchaseAt: "2026-06-01T00:00:00Z" },
      cart: { value: 10 },
    },
  },
  {
    label: "The default case",
    params: { user: { plan: "free" }, cart: { value: 10 } },
  },
];

function NestedRulesetWidgets({
  token,
}: {
  token: string | undefined;
}) {
  const ruleset = nestedRulesetKey();
  const rulesetKey = ruleset.value;

  if (!token || !rulesetKey) {
    const names = [!token ? tokenEnvName() : null, !rulesetKey ? ruleset.name : null].filter(
      (name): name is string => name !== null,
    );
    return (
      <p>
        Not configured for the {ruleCmsTarget()} environment. Set{" "}
        {names.join(" and ")} on the server.
      </p>
    );
  }

  return (
    <>
      {nestedRulesetCases.map((entry) => (
        <RuleCMSWidgetServer
          key={entry.label}
          token={token}
          rulesetPublishedKey={rulesetKey}
          params={entry.params}
          libraries={libraries}
          fetchOptions={{ cache: "no-store" }}
          errorFallback={<p>{entry.label} could not be resolved.</p>}
        />
      ))}
    </>
  );
}

export async function RuleCmsWidgetSlot({ scenario }: { scenario: Scenario }) {
  const target = ruleCmsTarget();
  const token = ruleCmsToken(target);

  if (scenario.slug === "locale-ruleset") {
    return <LocaleRulesetWidgets token={token} />;
  }

  if (scenario.slug === "nested-ruleset") {
    return <NestedRulesetWidgets token={token} />;
  }

  const publishedKey = widgetKeyForSlug(scenario.slug, target);

  if (!token || !publishedKey) {
    const missing = [
      !token ? tokenEnvName(target) : null,
      !publishedKey ? widgetKeyEnvName(scenario.slug, target) : null,
    ].filter((name): name is string => name !== null);

    return (
      <p>
        Not configured for the {target} environment. Set {missing.join(" and ")}{" "}
        on the server.
      </p>
    );
  }

  return (
    <RuleCMSWidgetServer
      token={token}
      publishedKey={publishedKey}
      libraries={libraries}
      fetchOptions={{ cache: "no-store" }}
      placeholderValues={placeholderValuesFor(scenario.slug)}
      componentProps={
        scenario.slug === "two-embedded-price-trees" ? twoTreePrices : undefined
      }
      errorFallback={<p>This widget could not be loaded.</p>}
    />
  );
}

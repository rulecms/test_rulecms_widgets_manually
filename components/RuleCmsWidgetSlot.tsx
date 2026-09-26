import "server-only";
import {
  fetchRuleCMSWidget,
  RuleCMSWidgetServer,
} from "@rulecms/widget-react/server";
import { TextComponentWidget } from "@/components/TextComponentWidget";
import type { Scenario } from "@/lib/scenarios";
import {
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

export async function RuleCmsWidgetSlot({ scenario }: { scenario: Scenario }) {
  const target = ruleCmsTarget();
  const token = ruleCmsToken(target);
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

  if (
    scenario.slug === "text-component" ||
    scenario.slug === "collection-dynamic-price" ||
    scenario.slug === "two-embedded-price-trees"
  ) {
    try {
      const initialData = await fetchRuleCMSWidget({
        token,
        publishedKey,
        fetchOptions: { cache: "no-store" },
      });
      return (
        <TextComponentWidget
          publishedKey={publishedKey}
          initialData={initialData}
          placeholderValues={
            scenario.slug === "collection-dynamic-price"
              ? { price: "$125" }
              : scenario.slug === "two-embedded-price-trees"
                ? null
                : undefined
          }
          componentProps={
            scenario.slug === "two-embedded-price-trees"
              ? twoTreePrices
              : undefined
          }
        />
      );
    } catch {
      return <p>This widget could not be loaded.</p>;
    }
  }

  return (
    <RuleCMSWidgetServer
      token={token}
      publishedKey={publishedKey}
      libraries={libraries}
      fetchOptions={{ cache: "no-store" }}
      errorFallback={<p>This widget could not be loaded.</p>}
    />
  );
}

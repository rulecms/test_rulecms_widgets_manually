import "server-only";
import { scenarios } from "@/lib/scenarios";
import {
  localeRulesetKey,
  nestedRulesetKey,
  tokenEnvName,
  widgetKeyEnvName,
  widgetKeyForSlug,
  type RuleCmsTarget,
} from "@/lib/rulecms-env";

export type WidgetCall = {
  paragraphs: string[];
  code: string;
};

const priceTextId = "5d7f0604-ddfa-4db4-9d2c-da677faba851";
const priceChildEmbeddingId = "fed4c349-6dca-478e-bba2-99cdebb8ceba";
const firstTreeEmbeddingId = "ddcabae5-0245-47b3-95db-f8fbc872ea26";
const secondTreeEmbeddingId = "e0a36146-d0d5-4358-a70e-5480ed898e0b";

function serverTag(lines: string[], fallback: string): string {
  const body = [...lines, `errorFallback={<p>${fallback}</p>}`]
    .flatMap((line) => line.split("\n"))
    .map((line) => `  ${line}`)
    .join("\n");
  return `<RuleCMSWidgetServer\n${body}\n/>`;
}

function tokenLine(target: RuleCmsTarget): string {
  return `token={process.env.${tokenEnvName(target)}}`;
}

function quotedOrEnv(value: string | undefined, envName: string): string {
  return value ? `"${value}"` : `{process.env.${envName}}`;
}

function sharedLines(target: RuleCmsTarget): string[] {
  return [
    tokenLine(target),
    `libraries={{`,
    `  default: () => import("@rulecms/source-components-react"),`,
    `}}`,
    `fetchOptions={{ cache: "no-store" }}`,
  ];
}

function publishedKeyLine(slug: string, target: RuleCmsTarget): string {
  const envName = widgetKeyEnvName(slug, target);
  return `publishedKey=${quotedOrEnv(widgetKeyForSlug(slug, target), envName)}`;
}

function tokenSentence(target: RuleCmsTarget): string {
  return `The token is read from ${tokenEnvName(target)} on the server. Its value is not shown here.`;
}

const librariesSentence =
  "libraries loads the source components that draw the widget. fetchOptions uses cache: \"no-store\" so each request reads the current widget instead of a cached copy.";

function nestedCollections(target: RuleCmsTarget): WidgetCall {
  return {
    paragraphs: [
      "This page loads one widget by its published key. The collections and their text are stored in the widget, so the call does not pass placeholder values or per-component props.",
      librariesSentence,
      tokenSentence(target),
    ],
    code: serverTag(
      [tokenLine(target), publishedKeyLine("nested-collections", target), ...sharedLines(target).slice(1)],
      "This widget could not be loaded.",
    ),
  };
}

function textComponent(target: RuleCmsTarget): WidgetCall {
  return {
    paragraphs: [
      "The widget stores the show-more text, but not a price. A sentence in it contains {{ price }}. placeholderValues supplies price: 65 for the whole widget, and that number is filled in when the text renders. One widget-wide value is enough because this page has a single price.",
      librariesSentence,
      tokenSentence(target),
    ],
    code: serverTag(
      [
        tokenLine(target),
        publishedKeyLine("text-component", target),
        ...sharedLines(target).slice(1),
        `placeholderValues={{ price: 65 }}`,
      ],
      "This widget could not be loaded.",
    ),
  };
}

function collectionDynamicPrice(target: RuleCmsTarget): WidgetCall {
  return {
    paragraphs: [
      "The child collection text contains {{ price }} and does not store a price. placeholderValues supplies price: \"$125\" for the whole widget. One widget-wide value is enough because this page has a single price.",
      librariesSentence,
      tokenSentence(target),
    ],
    code: serverTag(
      [
        tokenLine(target),
        publishedKeyLine("collection-dynamic-price", target),
        ...sharedLines(target).slice(1),
        `placeholderValues={{ price: "$125" }}`,
      ],
      "This widget could not be loaded.",
    ),
  };
}

function twoEmbeddedPriceTrees(target: RuleCmsTarget): WidgetCall {
  const firstPath = `${firstTreeEmbeddingId}/${priceChildEmbeddingId}/${priceTextId}`;
  const secondPath = `${secondTreeEmbeddingId}/${priceChildEmbeddingId}/${priceTextId}`;
  return {
    paragraphs: [
      "Both trees use {{ price }} and neither stores a price. A widget-wide price would fill both trees with the same value, so placeholderValues is null.",
      `componentProps targets each tree by its embedding path: the outer embedding id, then the shared child embedding id ${priceChildEmbeddingId}, then the shared text id ${priceTextId}. The first path gets $125 and the second gets $250. The longest matching path wins, which is why the two outer ids have to differ.`,
      librariesSentence,
      tokenSentence(target),
    ],
    code: serverTag(
      [
        tokenLine(target),
        publishedKeyLine("two-embedded-price-trees", target),
        ...sharedLines(target).slice(1),
        `placeholderValues={null}`,
        `componentProps={{`,
        `  "${firstPath}": {`,
        `    placeholderValues: { price: "$125" },`,
        `  },`,
        `  "${secondPath}": {`,
        `    placeholderValues: { price: "$250" },`,
        `  },`,
        `}}`,
      ],
      "This widget could not be loaded.",
    ),
  };
}

function localeRuleset(target: RuleCmsTarget): WidgetCall {
  const ruleset = localeRulesetKey(target);
  const rulesetProp = `rulesetPublishedKey=${quotedOrEnv(ruleset.value, ruleset.name)}`;
  const shared = sharedLines(target).slice(1);
  return {
    paragraphs: [
      "This page does not pass a widget key. It passes the ruleset key and a params object, and the ruleset chooses the widget. The first call sends locale de-DE, which matches the German rule. The second sends locale en-US, which does not, so the ruleset uses its default widget. Both calls use the same ruleset key.",
      librariesSentence,
      `The ruleset key comes from ${ruleset.name}. ${tokenSentence(target)}`,
    ],
    code: [
      serverTag(
        [tokenLine(target), rulesetProp, `params={{ locale: "de-DE" }}`, ...shared],
        "The German locale could not be resolved.",
      ),
      serverTag(
        [tokenLine(target), rulesetProp, `params={{ locale: "en-US" }}`, ...shared],
        "The other locale could not be resolved.",
      ),
    ].join("\n\n"),
  };
}

function nestedRuleset(target: RuleCmsTarget): WidgetCall {
  const ruleset = nestedRulesetKey(target);
  const rulesetProp = `rulesetPublishedKey=${quotedOrEnv(ruleset.value, ruleset.name)}`;
  const shared = sharedLines(target).slice(1);
  const cases: { params: string; fallback: string }[] = [
    {
      params: `params={{ user: { plan: "pro" }, cart: { value: 10 } }}`,
      fallback: "The Pro plan case could not be resolved.",
    },
    {
      params: `params={{ user: { plan: "free" }, cart: { value: 100 } }}`,
      fallback: "The high-cart case could not be resolved.",
    },
    {
      params: [
        `params={{`,
        `  user: { plan: "free", lastPurchaseAt: "2026-06-01T00:00:00Z" },`,
        `  cart: { value: 10 },`,
        `}}`,
      ].join("\n"),
      fallback: "The recent-purchase case could not be resolved.",
    },
    {
      params: `params={{ user: { plan: "free" }, cart: { value: 10 } }}`,
      fallback: "The default case could not be resolved.",
    },
  ];
  return {
    paragraphs: [
      "This page does not pass a widget key. It passes the ruleset key four times, each time with a different params object. The server flattens that object into user.plan, cart.value, and user.lastPurchaseAt before the rules run.",
      "Rules are first match wins. The first object has plan pro, so the Pro rule matches. The second has a free plan and a cart of 100, so the cart rule matches. The third has a purchase date in 2026 and a small cart, so the recent-purchase rule matches. The fourth has a free plan, a small cart, and no purchase date, so the ruleset uses its default.",
      librariesSentence,
      `The ruleset key comes from ${ruleset.name}. ${tokenSentence(target)}`,
    ],
    code: cases
      .map((entry) =>
        serverTag([tokenLine(target), rulesetProp, entry.params, ...shared], entry.fallback),
      )
      .join("\n\n"),
  };
}

/**
 * Every scenario page needs a writeup. Adding a page to `scenarios` without
 * an entry here fails when this module loads.
 */
const writeups: Record<string, (target: RuleCmsTarget) => WidgetCall> = {
  "nested-collections": nestedCollections,
  "text-component": textComponent,
  "collection-dynamic-price": collectionDynamicPrice,
  "two-embedded-price-trees": twoEmbeddedPriceTrees,
  "locale-ruleset": localeRuleset,
  "nested-ruleset": nestedRuleset,
};

for (const scenario of scenarios) {
  if (!writeups[scenario.slug]) {
    throw new Error(
      `Missing "How is this widget called" for ${scenario.slug}`,
    );
  }
}

export function widgetCallFor(slug: string, target: RuleCmsTarget): WidgetCall {
  const write = writeups[slug];
  if (!write) {
    throw new Error(`Missing "How is this widget called" for ${slug}`);
  }
  return write(target);
}

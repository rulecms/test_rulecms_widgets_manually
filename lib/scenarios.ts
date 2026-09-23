export type Scenario = {
  slug: string;
  /** Accordion title: the specific widget behavior this page is testing. */
  title: string;
  /** Shown when the accordion is opened. Safe to expand later. */
  details: string;
};

export const scenarios: Scenario[] = [
  {
    slug: "example",
    title: "Example: one server-rendered widget",
    details: `Placeholder notes. Replace this title and these details when this page becomes a specific widget scenario.

This page renders one RuleCMS widget on the server. The fetch skips the Next.js cache so a refresh shows the current widget.

Locally, set:
- RULECMS_DEVELOPMENT_TOKEN
- RULECMS_WIDGET_KEY_EXAMPLE_DEVELOPMENT (Development draft key)

On Vercel (preview or production), set:
- RULECMS_PRODUCTION_TOKEN
- RULECMS_WIDGET_KEY_EXAMPLE_PRODUCTION (Production published key)

Add another page by appending an entry to lib/scenarios.ts. Its widget keys follow RULECMS_WIDGET_KEY_<SLUG>_DEVELOPMENT and RULECMS_WIDGET_KEY_<SLUG>_PRODUCTION.`,
  },
];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.slug === slug);
}

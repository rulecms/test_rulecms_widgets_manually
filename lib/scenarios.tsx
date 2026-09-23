import type { ReactNode } from "react";

export type Scenario = {
  slug: string;
  /** Accordion title: the specific widget behavior this page is testing. */
  title: string;
  /** Shown when the accordion is opened. Safe to expand later. */
  details: ReactNode;
};

const nestedCollectionsWidgetUrl =
  "https://rulecms.com/app/d/orgs/75ef64a0-2e59-4c10-864d-e6a24704baf4/t/6ce05d39-3efb-41e7-bf42-66e8b3a2ec58/p/ba3bfabc-96d1-4d99-ae41-29c8c5af429b/e/b35446f1-4661-4194-af57-6ec87a7b94b7/widgets/f7c73214-df13-442c-bac2-dd02963584e5";

export const scenarios: Scenario[] = [
  {
    slug: "nested-collections",
    title:
      "Nested collections in one widget: shared collections, collections that contain shared collections, collections with embedded collections, and a widget with embedded collections",
    details: (
      <>
        {`One widget renders every nested-collection case on this page.

- Shared collections: collections that are shared so other collections and widgets can reuse them.
- Collections that contain other shared collections: a collection whose contents are those shared collections.
- Collections that have embedded collections: a collection with collections embedded inside it.
- A widget that has embedded collections: the widget embeds collections directly, along with the cases above.

All four show up in that single widget. Collection names and what to look for in the render can be filled in here once they exist.`}
        <p className="mt-2">
          Widget name:{" "}
          <a href={nestedCollectionsWidgetUrl} className="underline">
            widget with shared and embedded nested collections
          </a>
        </p>
      </>
    ),
  },
];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.slug === slug);
}

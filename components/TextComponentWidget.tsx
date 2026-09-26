"use client";

import { RuleCMSWidget } from "@rulecms/widget-react";
import type { RuleCMSWidgetData } from "@rulecms/widget-react/server";
import * as sourceComponents from "@rulecms/source-components-react";

const libraries = { default: sourceComponents };

/** The widget stores `{{ price }}`. This page supplies the number at render time. */
const placeholderValues = { price: 65 };

export function TextComponentWidget({
  publishedKey,
  initialData,
}: {
  publishedKey: string;
  initialData: RuleCMSWidgetData;
}) {
  return (
    <RuleCMSWidget
      mode="pre-fetched"
      publishedKey={publishedKey}
      initialData={initialData}
      libraries={libraries}
      placeholderValues={placeholderValues}
    />
  );
}

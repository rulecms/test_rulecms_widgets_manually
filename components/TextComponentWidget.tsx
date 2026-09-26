"use client";

import { RuleCMSWidget } from "@rulecms/widget-react";
import type { RuleCMSWidgetData } from "@rulecms/widget-react/server";
import * as sourceComponents from "@rulecms/source-components-react";

const libraries = { default: sourceComponents };

/** The widget stores `{{ price }}`. The page supplies the value at render time. */
const defaultPlaceholderValues = { price: 65 };

export function TextComponentWidget({
  publishedKey,
  initialData,
  placeholderValues = defaultPlaceholderValues,
  componentProps,
}: {
  publishedKey: string;
  initialData: RuleCMSWidgetData;
  placeholderValues?: unknown;
  componentProps?: {
    [columnPath: string]: { placeholderValues?: unknown };
  };
}) {
  return (
    <RuleCMSWidget
      mode="pre-fetched"
      publishedKey={publishedKey}
      initialData={initialData}
      libraries={libraries}
      placeholderValues={placeholderValues}
      componentProps={componentProps}
    />
  );
}

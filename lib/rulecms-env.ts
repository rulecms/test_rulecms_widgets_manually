import "server-only";

export type RuleCmsTarget = "development" | "production";

/**
 * A local Next.js process uses Development. Vercel preview and production
 * deployments use Production. `vercel dev` sets VERCEL_ENV to development,
 * so it stays on the Development token.
 */
export function ruleCmsTarget(): RuleCmsTarget {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "production" || vercelEnv === "preview") {
    return "production";
  }
  return "development";
}

export function tokenEnvName(target: RuleCmsTarget = ruleCmsTarget()): string {
  return target === "production"
    ? "RULECMS_PRODUCTION_TOKEN"
    : "RULECMS_DEVELOPMENT_TOKEN";
}

export function ruleCmsToken(
  target: RuleCmsTarget = ruleCmsTarget(),
): string | undefined {
  const value = process.env[tokenEnvName(target)]?.trim();
  return value || undefined;
}

/** nested-collections → RULECMS_WIDGET_KEY_NESTED_COLLECTIONS_DEVELOPMENT */
export function widgetKeyEnvName(
  slug: string,
  target: RuleCmsTarget = ruleCmsTarget(),
): string {
  const suffix = slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  const side = target === "production" ? "PRODUCTION" : "DEVELOPMENT";
  return `RULECMS_WIDGET_KEY_${suffix}_${side}`;
}

export function widgetKeyForSlug(
  slug: string,
  target: RuleCmsTarget = ruleCmsTarget(),
): string | undefined {
  const value = process.env[widgetKeyEnvName(slug, target)]?.trim();
  return value || undefined;
}

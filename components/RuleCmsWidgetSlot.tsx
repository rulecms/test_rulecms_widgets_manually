import "server-only";
import { RuleCMSWidgetServer } from "@rulecms/widget-react/server";
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

export function RuleCmsWidgetSlot({ scenario }: { scenario: Scenario }) {
  const target = ruleCmsTarget();
  const token = ruleCmsToken(target);
  const publishedKey = widgetKeyForSlug(scenario.slug, target);

  if (!token || !publishedKey) {
    const missing = [
      !token ? tokenEnvName(target) : null,
      !publishedKey ? widgetKeyEnvName(scenario.slug, target) : null,
    ].filter((name): name is string => name !== null);

    return (
      <p className="px-3 py-2 text-sm text-zinc-600">
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
      errorFallback={
        <p className="px-3 py-2 text-sm text-zinc-600">
          This widget could not be loaded.
        </p>
      }
    />
  );
}

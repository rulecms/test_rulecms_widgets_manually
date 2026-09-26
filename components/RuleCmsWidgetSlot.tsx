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

  if (scenario.slug === "text-component") {
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

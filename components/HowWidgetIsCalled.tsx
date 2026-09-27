import "server-only";
import { WidgetCallDialog } from "@/components/WidgetCallDialog";
import { widgetCallFor } from "@/lib/widget-calls";
import { ruleCmsTarget } from "@/lib/rulecms-env";

export function HowWidgetIsCalled({ slug }: { slug: string }) {
  const call = widgetCallFor(slug, ruleCmsTarget());
  return <WidgetCallDialog paragraphs={call.paragraphs} code={call.code} />;
}

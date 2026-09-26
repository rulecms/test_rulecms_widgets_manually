import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RuleCmsWidgetSlot } from "@/components/RuleCmsWidgetSlot";
import { TestNotes } from "@/components/TestNotes";
import { getScenario, scenarios } from "@/lib/scenarios";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return scenarios.map((scenario) => ({ slug: scenario.slug }));
}

type ScenarioPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ScenarioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getScenario(slug);
  return {
    title: scenario?.title ?? "Unknown scenario",
  };
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const { slug } = await params;
  const scenario = getScenario(slug);
  if (!scenario) {
    notFound();
  }

  return (
    <>
      <TestNotes title={scenario.title} details={scenario.details} />
      <RuleCmsWidgetSlot scenario={scenario} />
    </>
  );
}

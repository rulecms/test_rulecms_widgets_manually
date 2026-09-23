import Link from "next/link";
import { ruleCmsTarget } from "@/lib/rulecms-env";
import { scenarios } from "@/lib/scenarios";

export default function Home() {
  const target = ruleCmsTarget();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          RuleCMS widget tests
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Server-rendered widget pages. This process is using the {target}{" "}
          token and {target} widget keys.
        </p>
      </div>
      <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
        {scenarios.map((scenario) => (
          <li key={scenario.slug}>
            <Link
              href={`/scenarios/${scenario.slug}`}
              className="block px-1 py-3 text-sm hover:bg-zinc-50"
            >
              {scenario.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

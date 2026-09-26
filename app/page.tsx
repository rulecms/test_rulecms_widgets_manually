import Link from "next/link";
import { ruleCmsTarget } from "@/lib/rulecms-env";
import { scenarios } from "@/lib/scenarios";
import styles from "./home.module.css";

export default function Home() {
  const target = ruleCmsTarget();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>RuleCMS widget tests</h1>
      <p className={styles.intro}>
        Server-rendered widget pages. This process is using the {target} token
        and {target} widget keys.
      </p>
      <ul className={styles.list}>
        {scenarios.map((scenario) => (
          <li key={scenario.slug} className={styles.item}>
            <Link
              href={`/scenarios/${scenario.slug}`}
              className={styles.link}
            >
              {scenario.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

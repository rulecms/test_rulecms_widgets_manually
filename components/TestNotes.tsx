import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./TestNotes.module.css";

type TestNotesProps = {
  title: string;
  details: ReactNode;
};

/** Collapsed by default. Styles stay on this accordion, not the widget below. */
export function TestNotes({ title, details }: TestNotesProps) {
  return (
    <div className={styles.notes}>
      <Link href="/" className={styles.nav}>
        Home
      </Link>
      <details className={styles.accordion}>
        <summary className={styles.summary}>{title}</summary>
        <div className={styles.details}>{details}</div>
      </details>
      <Link href="/" className={styles.nav}>
        Back
      </Link>
    </div>
  );
}

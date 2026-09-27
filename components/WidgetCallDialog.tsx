"use client";

import { useRef } from "react";
import styles from "./WidgetCallDialog.module.css";

type WidgetCallDialogProps = {
  paragraphs: string[];
  code: string;
};

export function WidgetCallDialog({ paragraphs, code }: WidgetCallDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className={styles.bar}>
      <button
        type="button"
        className={styles.open}
        onClick={() => dialogRef.current?.showModal()}
      >
        How is this widget called
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="how-widget-is-called"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
      >
        <div className={styles.panel}>
          <h2 id="how-widget-is-called" className={styles.title}>
            How is this widget called
          </h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.explanation}>
              {paragraph}
            </p>
          ))}
          <pre className={styles.code}>
            <code>{code}</code>
          </pre>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}

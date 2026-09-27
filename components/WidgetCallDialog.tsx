"use client";

import { useRef } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./WidgetCallDialog.module.css";

SyntaxHighlighter.registerLanguage("tsx", tsx);

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
          <div className={styles.editor}>
            <div className={styles.editorBar}>
              <span>TSX</span>
              <span className={styles.editorMode}>Read only</span>
            </div>
            {/*
              Theme colors are inline styles on this tree. The chrome uses a
              CSS module. Neither adds a page stylesheet, so widget CSS is
              unchanged.
            */}
            <SyntaxHighlighter
              language="tsx"
              style={vscDarkPlus}
              useInlineStyles
              showLineNumbers
              customStyle={{
                margin: 0,
                padding: "0.85rem 0",
                background: "#1e1e1e",
                fontSize: "0.8125rem",
                lineHeight: 1.6,
                overflow: "auto",
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                },
              }}
              lineNumberStyle={{
                minWidth: "2.5rem",
                paddingRight: "1rem",
                color: "#858585",
                textAlign: "right",
                userSelect: "none",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
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

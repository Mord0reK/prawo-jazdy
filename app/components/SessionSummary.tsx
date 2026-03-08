import React from "react";
import { formatCategoryLabel, type CategorySelection } from "../lib/sign-session";
import styles from "./SignsTrainer.module.css";

type SessionSummaryProps = {
  category: CategorySelection;
  total: number;
  known: number;
  unknown: number;
  onRestart: () => void;
  onBackToPicker: () => void;
};

export function SessionSummary({
  category,
  total,
  known,
  unknown,
  onRestart,
  onBackToPicker,
}: SessionSummaryProps) {
  const title =
    category === "all"
      ? "Wszystkie znaki"
      : `Kategoria: ${formatCategoryLabel(category)}`;

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <p className={styles.eyebrow}>Etap 3</p>
        <h2>Sesja zakonczona</h2>
        <p>{title}</p>
      </header>

      <div className={styles.summaryGrid}>
        <article className={styles.summaryTile}>
          <span>Wszystkie znaki</span>
          <strong>{total}</strong>
        </article>

        <article className={styles.summaryTile}>
          <span>Znam</span>
          <strong>{known}</strong>
        </article>

        <article className={styles.summaryTile}>
          <span>Nie znam</span>
          <strong>{unknown}</strong>
        </article>
      </div>

      <div className={styles.actionsRow}>
        <button type="button" className={styles.primaryButton} onClick={onRestart}>
          Zacznij od nowa
        </button>
        <button
          type="button"
          className={styles.ghostButton}
          onClick={onBackToPicker}
        >
          Wybierz inna kategorie
        </button>
      </div>
    </section>
  );
}

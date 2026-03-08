import React, { useMemo, useState } from "react";

import type { StudyMode } from "../lib/sign-session";
import { formatCategoryLabel } from "../lib/sign-session";
import styles from "./SignsTrainer.module.css";

type CategoryPickerProps = {
  categories: string[];
  onStart: (category: string, mode: StudyMode) => void;
  onStartAllRandom: () => void;
};

export function CategoryPicker({
  categories,
  onStart,
  onStartAllRandom,
}: CategoryPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mode, setMode] = useState<StudyMode>("sequential");

  const resolvedSelectedCategory = useMemo(() => {
    if (selectedCategory && categories.includes(selectedCategory)) {
      return selectedCategory;
    }

    return categories[0] ?? "";
  }, [categories, selectedCategory]);

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <p className={styles.eyebrow}>Etap 1</p>
        <h2>Wybierz kategorie i tryb nauki</h2>
        <p>
          Najpierw zdecyduj, ktore znaki chcesz przejrzec. Potem zacznij sesje i
          oznaczaj, czy dany znak znasz.
        </p>
      </header>

      {categories.length === 0 ? (
        <p className={styles.notice}>Brak kategorii do wyswietlenia.</p>
      ) : (
        <>
          <div className={styles.categoryGrid}>
            {categories.map((category) => {
              const selected = category === resolvedSelectedCategory;

              return (
                <button
                  key={category}
                  type="button"
                  className={`${styles.categoryButton} ${
                    selected ? styles.categoryButtonSelected : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {formatCategoryLabel(category)}
                </button>
              );
            })}
          </div>

          <fieldset className={styles.modeSwitcher}>
            <legend>Tryb wyswietlania</legend>

            <label className={styles.modeOption}>
              <input
                type="radio"
                name="study-mode"
                checked={mode === "sequential"}
                onChange={() => setMode("sequential")}
              />
              <span>Po kolei</span>
            </label>

            <label className={styles.modeOption}>
              <input
                type="radio"
                name="study-mode"
                checked={mode === "random"}
                onChange={() => setMode("random")}
              />
              <span>Losowo</span>
            </label>
          </fieldset>

          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={!resolvedSelectedCategory}
              onClick={() => onStart(resolvedSelectedCategory, mode)}
            >
              Zacznij nauke
            </button>

            <button
              type="button"
              className={styles.ghostButton}
              onClick={onStartAllRandom}
            >
              Wszystkie znaki losowo
            </button>
          </div>
        </>
      )}
    </section>
  );
}

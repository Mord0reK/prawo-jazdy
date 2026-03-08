import React from "react";
import { useMemo, useState } from "react";

import type { Sign, UserAnswer } from "../lib/sign-session";
import styles from "./SignsTrainer.module.css";

type LearningSessionProps = {
  deck: Sign[];
  onFinish: (answers: UserAnswer[]) => void;
};

export function LearningSession({ deck, onFinish }: LearningSessionProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<UserAnswer | null>(null);

  const currentSign = deck[index];
  const isLastSign = index === deck.length - 1;

  const progressLabel = useMemo(
    () => `${index + 1} / ${deck.length}`,
    [deck.length, index],
  );

  const handleAnswer = (answer: UserAnswer) => {
    if (currentAnswer) {
      return;
    }

    setCurrentAnswer(answer);
  };

  const handleNext = () => {
    if (!currentAnswer) {
      return;
    }

    const nextAnswers = [...answers, currentAnswer];

    if (isLastSign) {
      onFinish(nextAnswers);
      return;
    }

    setAnswers(nextAnswers);
    setCurrentAnswer(null);
    setIndex((current) => current + 1);
  };

  if (!currentSign) {
    return (
      <section className={styles.card}>
        <p className={styles.notice}>Brak znakow w tej sesji.</p>
      </section>
    );
  }

  return (
    <section className={styles.card}>
      <div className={styles.sessionHeader}>
        <p className={styles.eyebrow}>Etap 2</p>
        <strong>{progressLabel}</strong>
      </div>

      <div className={styles.signFrame}>
        <img
          src={currentSign.obrazek}
          alt={`Znak ${currentSign.kod}`}
          className={styles.signImage}
        />
      </div>

      {currentAnswer ? (
        <div className={styles.answerReveal}>
          <h3>{currentSign.nazwa}</h3>
          <p>
            <strong>Znaczenie:</strong> {currentSign.znaczenie}
          </p>
        </div>
      ) : (
        <p className={styles.helperText}>
          Zastanow sie, czy znasz ten znak, i wybierz odpowiedz.
        </p>
      )}

      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={Boolean(currentAnswer)}
          onClick={() => handleAnswer("tak")}
        >
          Znam
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          disabled={Boolean(currentAnswer)}
          onClick={() => handleAnswer("nie")}
        >
          Nie znam
        </button>

        <button
          type="button"
          className={styles.ghostButton}
          disabled={!currentAnswer}
          onClick={handleNext}
        >
          {isLastSign ? "Zakoncz" : "Dalej"}
        </button>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useMemo, useState } from "react";

import {
  buildCategoryOptions,
  createSessionDeck,
  summarizeAnswers,
  type CategorySelection,
  type Sign,
  type StudyMode,
  type UserAnswer,
} from "../lib/sign-session";
import { CategoryPicker } from "./CategoryPicker";
import { LearningSession } from "./LearningSession";
import { SessionSummary } from "./SessionSummary";
import styles from "./SignsTrainer.module.css";

type TrainerStep = "picker" | "learning" | "summary";

type SignsTrainerProps = {
  signs: Sign[];
};

type SessionConfig = {
  category: CategorySelection;
  mode: StudyMode;
};

export function SignsTrainer({ signs }: SignsTrainerProps) {
  const categories = useMemo(() => buildCategoryOptions(signs), [signs]);
  const [step, setStep] = useState<TrainerStep>("picker");
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [sessionDeck, setSessionDeck] = useState<Sign[]>([]);
  const [sessionAnswers, setSessionAnswers] = useState<UserAnswer[]>([]);

  const startSession = (category: CategorySelection, mode: StudyMode) => {
    const deck = createSessionDeck(signs, category, mode);

    if (deck.length === 0) {
      return;
    }

    setSessionConfig({ category, mode });
    setSessionAnswers([]);
    setSessionDeck(deck);
    setStep("learning");
  };

  const handleFinishSession = (answers: UserAnswer[]) => {
    setSessionAnswers(answers);
    setStep("summary");
  };

  const handleRestartSession = () => {
    if (!sessionConfig) {
      setStep("picker");
      return;
    }

    startSession(sessionConfig.category, sessionConfig.mode);
  };

  const handleBackToPicker = () => {
    setStep("picker");
    setSessionConfig(null);
    setSessionDeck([]);
    setSessionAnswers([]);
  };

  const summary = summarizeAnswers(sessionAnswers);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.badge}>Teoria prawa jazdy</p>
        <h1>Trening znakow drogowych</h1>
        <p>
          Przechodz znaki krok po kroku i od razu sprawdzaj, czy kojarzysz ich
          nazwe oraz znaczenie.
        </p>
      </section>

      {step === "picker" && (
        <CategoryPicker
          categories={categories}
          onStart={startSession}
          onStartAllRandom={() => startSession("all", "random")}
        />
      )}

      {step === "learning" && (
        <LearningSession deck={sessionDeck} onFinish={handleFinishSession} />
      )}

      {step === "summary" && sessionConfig && (
        <SessionSummary
          category={sessionConfig.category}
          total={sessionDeck.length}
          known={summary.known}
          unknown={summary.unknown}
          onRestart={handleRestartSession}
          onBackToPicker={handleBackToPicker}
        />
      )}
    </main>
  );
}

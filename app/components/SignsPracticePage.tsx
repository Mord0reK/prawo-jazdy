"use client";

import React from "react";
import { useEffect, useState } from "react";

import type { Sign } from "../lib/sign-session";
import { SignsTrainer } from "./SignsTrainer";
import styles from "./SignsPracticePage.module.css";

type LoadState = "loading" | "ready" | "error";

export function SignsPracticePage() {
  const [status, setStatus] = useState<LoadState>("loading");
  const [signs, setSigns] = useState<Sign[]>([]);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSigns() {
      try {
        setStatus("loading");

        const response = await fetch("/api/znaki", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const payload = await response.json();
        setSigns(normalizeSigns(payload));
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Nie udalo sie pobrac znakow:", error);
        setStatus("error");
      }
    }

    loadSigns();

    return () => controller.abort();
  }, [requestId]);

  if (status === "loading") {
    return (
      <main className={styles.centered}>
        <div className={styles.messageCard}>
          <h1>Trwa ladowanie znakow</h1>
          <p>Za chwile rozpoczniesz cwiczenie teorii.</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.centered}>
        <div className={styles.messageCard}>
          <h1>Nie udalo sie pobrac danych</h1>
          <p>Sprawdz polaczenie z API i sprobuj ponownie.</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => setRequestId((value) => value + 1)}
          >
            Sprobuj ponownie
          </button>
        </div>
      </main>
    );
  }

  if (signs.length === 0) {
    return (
      <main className={styles.centered}>
        <div className={styles.messageCard}>
          <h1>Brak znakow do nauki</h1>
          <p>API zwrocilo pusta liste. Dodaj dane i odswiez strone.</p>
        </div>
      </main>
    );
  }

  return <SignsTrainer signs={signs} />;
}

function normalizeSigns(value: unknown): Sign[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const id = Number(extractField(item, "id"));
    const kod = String(extractField(item, "kod") ?? "").trim();
    const kategoria = String(extractField(item, "kategoria") ?? "").trim();
    const nazwa = String(extractField(item, "nazwa") ?? "").trim();
    const znaczenie = String(extractField(item, "znaczenie") ?? "").trim();
    const obrazek = String(extractField(item, "obrazek") ?? "").trim();

    if (
      Number.isNaN(id) ||
      !kod ||
      !kategoria ||
      !nazwa ||
      !znaczenie ||
      !obrazek
    ) {
      return [];
    }

    return [{ id, kod, kategoria, nazwa, znaczenie, obrazek }];
  });
}

function extractField(source: object, field: string): unknown {
  if (!Object.hasOwn(source, field)) {
    return null;
  }

  return (source as Record<string, unknown>)[field];
}

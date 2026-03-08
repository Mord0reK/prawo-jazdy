// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { LearningSession } from "./LearningSession";
import type { Sign } from "../lib/sign-session";

const signs: Sign[] = [
  {
    id: 1,
    kod: "A-1",
    kategoria: "ostrzegawcze",
    nazwa: "niebezpieczny zakret w prawo",
    znaczenie: "ostrzega przed niebezpiecznym zakretem w prawo",
    obrazek: "/znaki/A/a01.png",
  },
  {
    id: 2,
    kod: "A-2",
    kategoria: "ostrzegawcze",
    nazwa: "niebezpieczny zakret w lewo",
    znaczenie: "ostrzega przed niebezpiecznym zakretem w lewo",
    obrazek: "/znaki/A/a02.png",
  },
];

describe("LearningSession", () => {
  it("reveals details after answer and reports results after final sign", () => {
    const onFinish = vi.fn();

    render(<LearningSession deck={signs} onFinish={onFinish} />);

    expect(screen.queryByText(/Znaczenie/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Znam" }));

    expect(screen.getByText("niebezpieczny zakret w prawo")).toBeInTheDocument();
    expect(
      screen.getByText("ostrzega przed niebezpiecznym zakretem w prawo"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dalej" }));
    fireEvent.click(screen.getByRole("button", { name: "Nie znam" }));
    fireEvent.click(screen.getByRole("button", { name: "Zakoncz" }));

    expect(onFinish).toHaveBeenCalledWith(["tak", "nie"]);
  });
});

// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CategoryPicker } from "./CategoryPicker";

afterEach(() => {
  cleanup();
});

describe("CategoryPicker", () => {
  it("starts a category session with selected mode", () => {
    const onStart = vi.fn();
    const onStartAllRandom = vi.fn();

    render(
      <CategoryPicker
        categories={["ostrzegawcze", "zakazu"]}
        onStart={onStart}
        onStartAllRandom={onStartAllRandom}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Zakazu" }));
    fireEvent.click(screen.getByRole("radio", { name: "Losowo" }));
    fireEvent.click(screen.getByRole("button", { name: "Zacznij nauke" }));

    expect(onStart).toHaveBeenCalledWith("zakazu", "random");
    expect(onStartAllRandom).not.toHaveBeenCalled();
  });

  it("starts all signs random mode", () => {
    const onStart = vi.fn();
    const onStartAllRandom = vi.fn();

    render(
      <CategoryPicker
        categories={["ostrzegawcze", "zakazu"]}
        onStart={onStart}
        onStartAllRandom={onStartAllRandom}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Wszystkie znaki losowo" }));

    expect(onStartAllRandom).toHaveBeenCalledOnce();
    expect(onStart).not.toHaveBeenCalled();
  });
});

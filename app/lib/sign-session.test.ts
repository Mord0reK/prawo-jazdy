import { describe, expect, it } from "vitest";

import {
  buildCategoryOptions,
  createSessionDeck,
  summarizeAnswers,
  type Sign,
} from "./sign-session";

const sampleSigns: Sign[] = [
  {
    id: 1,
    kod: "A-2",
    kategoria: "ostrzegawcze",
    nazwa: "niebezpieczny zakret w lewo",
    znaczenie: "ostrzega przed niebezpiecznym zakretem w lewo",
    obrazek: "/znaki/A/a02.png",
  },
  {
    id: 2,
    kod: "A-1",
    kategoria: "ostrzegawcze",
    nazwa: "niebezpieczny zakret w prawo",
    znaczenie: "ostrzega przed niebezpiecznym zakretem w prawo",
    obrazek: "/znaki/A/a01.png",
  },
  {
    id: 3,
    kod: "B-2",
    kategoria: "zakazu",
    nazwa: "zakaz wjazdu",
    znaczenie: "zakaz wjazdu wszystkich pojazdow",
    obrazek: "/znaki/B/b02.png",
  },
];

describe("buildCategoryOptions", () => {
  it("returns unique and alphabetically sorted categories", () => {
    expect(buildCategoryOptions(sampleSigns)).toEqual(["ostrzegawcze", "zakazu"]);
  });
});

describe("createSessionDeck", () => {
  it("returns signs from one category in deterministic order for sequential mode", () => {
    const deck = createSessionDeck(sampleSigns, "ostrzegawcze", "sequential");

    expect(deck.map((sign) => sign.kod)).toEqual(["A-1", "A-2"]);
  });

  it("returns all signs shuffled for all-random mode", () => {
    const randomValues = [0, 0];
    const random = () => randomValues.shift() ?? 0;
    const deck = createSessionDeck(sampleSigns, "all", "random", random);

    expect(deck.map((sign) => sign.kod)).toEqual(["A-1", "B-2", "A-2"]);
  });
});

describe("summarizeAnswers", () => {
  it("counts known and unknown answers", () => {
    const summary = summarizeAnswers(["tak", "nie", "tak", "nie", "tak"]);

    expect(summary).toEqual({ known: 3, unknown: 2 });
  });
});

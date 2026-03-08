export type StudyMode = "sequential" | "random";
export type CategorySelection = string | "all";
export type UserAnswer = "tak" | "nie";

export type Sign = {
  id: number;
  kod: string;
  kategoria: string;
  nazwa: string;
  znaczenie: string;
  obrazek: string;
};

type RandomFn = () => number;

export function formatCategoryLabel(category: string): string {
  if (!category) {
    return "";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function buildCategoryOptions(signs: Sign[]): string[] {
  return [...new Set(signs.map((sign) => sign.kategoria))].sort((a, b) =>
    a.localeCompare(b, "pl"),
  );
}

export function createSessionDeck(
  signs: Sign[],
  category: CategorySelection,
  mode: StudyMode,
  random: RandomFn = Math.random,
): Sign[] {
  const baseDeck =
    category === "all"
      ? [...signs]
      : signs.filter((sign) => sign.kategoria === category);

  if (mode === "sequential") {
    return [...baseDeck].sort((a, b) => a.kod.localeCompare(b.kod, "pl"));
  }

  return shuffle(baseDeck, random);
}

export function summarizeAnswers(answers: UserAnswer[]): {
  known: number;
  unknown: number;
} {
  let known = 0;
  let unknown = 0;

  answers.forEach((answer) => {
    if (answer === "tak") {
      known += 1;
      return;
    }

    unknown += 1;
  });

  return { known, unknown };
}

function shuffle(items: Sign[], random: RandomFn): Sign[] {
  const deck = [...items];

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

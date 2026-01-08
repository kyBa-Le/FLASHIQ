export type ImportCard = {
  term: string;
  definition: string;
  example?: string;
};

export function importBulkCards(
  text: string,
  cardDelimiter: "newline" | "semicolon",
  termDelimiter: "tab" | "comma"
): ImportCard[] {
  if (!text.trim()) return [];

  const cardSplit =
    cardDelimiter === "newline" ? /\r?\n/ : ";";

  const termSplit =
    termDelimiter === "tab" ? "\t" : ",";

  return text
    .split(cardSplit)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(termSplit).map((p) => p.trim());

      const term = parts[0];
      const definition = parts[1];
      const example = parts[2];

      if (!term || !definition) return null;

      return {
        term,
        definition,
        example,
      };
    })
    .filter(Boolean) as ImportCard[];
}

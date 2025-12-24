export const createEmptyCards = (count = 2) =>
  Array.from({ length: count }, () => ({
    term: "",
    definition: "",
    example: "",
  }));

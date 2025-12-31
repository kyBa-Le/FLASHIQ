export const StudyMode = {
  FLASHCARD: "flashcard",
  MULTIPLE_CHOICE: "multiple_choice",
  FILL_BLANK: "fill_blank",
  TRUE_FALSE: "true_false",
} as const;

export type StudyMode = (typeof StudyMode)[keyof typeof StudyMode];

export const STUDY_MODES = [
  { key: StudyMode.FLASHCARD, label: "FlashCard", path: "/sets/:id/study/flashcard" },
  { key: StudyMode.MULTIPLE_CHOICE, label: "Multiple Choice", path: "/sets/:id/study/multiple-choice" },
  { key: StudyMode.FILL_BLANK, label: "Fill in blank", path: "/sets/:id/study/ill-blank" },
  { key: StudyMode.TRUE_FALSE, label: "True / False", path: "/sets/:id/study/true-false" },
];

interface StudyRecord {
  score: number;
  last_reviewed: string;
}

interface StudyCard {
  studyRecords?: StudyRecord[];
}

export const calculateLearningProgress = (cards: StudyCard[]) => {
  let mastered = 0;
  let learning = 0;
  let newOrForgot = 0;

  cards.forEach((card) => {
    const score = card.studyRecords?.[0]?.score ?? 0;

    if (score >= 0.8) {
      mastered++;
    } else if (score >= 0.31) {
      learning++;
    } else {
      newOrForgot++;
    }
  });

  return {
    mastered,
    learning,
    newOrForgot,
    total: cards.length,
  };
};

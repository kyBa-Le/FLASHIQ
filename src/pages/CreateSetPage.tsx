import { useNavigate } from "react-router-dom";
import { SetService } from "@/services/set.service";
import { useSetStore } from "@/store/set.store";
import { createEmptyCards } from "@/utils/createEmptyCards";
import {
  SetFormContainer,
  type SubmitAction,
} from "@/components/set/SetFormContainer";
import type { SetFormValues } from "@/schema/flashCard.schema";

const CREATE_DRAFT_KEY = "new-set-draft";

export default function CreateSetPage() {
  const navigate = useNavigate();
  const addSet = useSetStore((s) => s.addSet);

  const draft = localStorage.getItem(CREATE_DRAFT_KEY);
  const defaultValues: SetFormValues = draft
    ? JSON.parse(draft)
    : {
        title: "",
        description: "",
        isPublic: true,
        cards: createEmptyCards(2),
      };

  const handleCreate = async (data: SetFormValues, action: SubmitAction) => {
    try {
      const cardsData = data.cards
        .filter((c) => c.term?.trim() || c.definition?.trim())
        .map(({ term, definition, example }) => ({
          term: term || "",
          definition: definition || "",
          example: example || "",
        }));

      const createdSet = await SetService.createSet({
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
      });

      const setId = createdSet.data.id;
      let cardCount = cardsData.length;

      if (cardsData.length > 0) {
        const res = await SetService.bulkAddCards(setId, cardsData);
        cardCount = res.data?.count ?? cardsData.length;
      }

      addSet({
        id: setId,
        title: data.title,
        cardCount: cardCount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      localStorage.removeItem(CREATE_DRAFT_KEY);

      if (action === "create_and_study") {
        navigate(`/sets/${setId}/study`);
      } else {
        navigate(`/sets/${setId}/view`);
      }
    } catch (error) {
      console.error("Failed to create set:", error);
    }
  };

  return (
    <SetFormContainer
      mode="create"
      defaultValues={defaultValues}
      submitLabel="Create Set"
      showStudyButton
      onSubmit={handleCreate}
      draftKey={CREATE_DRAFT_KEY} 
    />
  );
}

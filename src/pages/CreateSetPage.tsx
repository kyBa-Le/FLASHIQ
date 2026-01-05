/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { SetService } from "@/services/set.service";
import { UploadService } from "@/services/upload.service";
import { useSetStore } from "@/store/set.store";
import { createEmptyCards } from "@/utils/createEmptyCards";
import {
  SetFormContainer,
  type SubmitAction,
} from "@/components/set/SetFormContainer";
import type { SetFormValues } from "@/schema/flashCard.schema";
import { toast } from "sonner";

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
      const validInitialCards = data.cards.filter(
        (c) => c.term?.trim() || c.definition?.trim()
      );

      if (validInitialCards.length === 0) {
        toast.error("At least one card is required.");
        return;
      }

      const processedCards = [];
      for (const card of validInitialCards) {
        let finalUrl = "";
        const val = card.image_url as any;

        if (typeof val === "string") {
          finalUrl = val;
        } else if (val instanceof File || val instanceof Blob) {
          finalUrl = await UploadService.uploadImage(val);
        }

        processedCards.push({
          term: card.term?.trim() || "",
          definition: card.definition?.trim() || "",
          example: card.example?.trim() || "",
          image_url: finalUrl,
        });
      }

      const createdSetResponse = await SetService.createSet({
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
      });

      const setId =
        createdSetResponse.data?.id || (createdSetResponse as any).id;

      await SetService.bulkAddCards(setId, processedCards);

      addSet({
        id: setId,
        title: data.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      localStorage.removeItem(CREATE_DRAFT_KEY);
      toast.success("Create Set sucessfully!");

      navigate(
        action === "create_and_study"
          ? `/sets/${setId}/study`
          : `/sets/${setId}/view`
      );
    } catch (error) {
      console.error("error during create set:", error);
      toast.error("Error during create set. Try again!");
    }
  };

  return (
    <SetFormContainer
      mode="create"
      defaultValues={defaultValues}
      onSubmit={handleCreate}
      draftKey={CREATE_DRAFT_KEY}
      submitLabel="Create Set"
      showStudyButton
    />
  );
}

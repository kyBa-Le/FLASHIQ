import { useParams, useNavigate } from "react-router-dom";
import { SetFormContainer } from "@/components/set/SetFormContainer";
import { useSetDetail } from "@/hooks/useSetDetail";
import { SetService } from "@/services/set.service";
import { CardService } from "@/services/card.service";
import { useSetStore } from "@/store/set.store";
import type { SetFormValues } from "@/schema/flashCard.schema";

export default function EditSetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateCountsCache = useSetStore((s) => s.updateCountsCache);
  const { set, cards, loading } = useSetDetail(id);

  const draftKey = `set-draft-${id}`;

  if (loading && !set)
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!set) return <div className="p-6 text-destructive">Set not found</div>;

  const draft = localStorage.getItem(draftKey);
  const defaultValues: SetFormValues = draft
    ? JSON.parse(draft)
    : {
        id: set.id,
        title: set.title,
        description: set.description ?? "",
        isPublic: set.isPublic ?? false,
        cards: cards.map((c) => ({
          id: c.id,
          term: c.term,
          definition: c.definition,
          example: c.example ?? "",
        })),
      };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdate = async (data: SetFormValues) => {
    if (!id) return;

    try {
      await SetService.updateSet(id, {
        title: data.title,
        description: data.description ?? "",
        isPublic: data.isPublic ?? false,
      });

      const validCards = data.cards.filter((c) => c.term && c.definition);

      const cardPromises = validCards.map((card) => {
        if (card.id) {
          return CardService.updateCard(card.id, {
            term: card.term ?? "",
            definition: card.definition ?? "",
            example: card.example ?? "",
          });
        }
        return SetService.bulkAddCards(id, [card]);
      });

      await Promise.all(cardPromises);

      updateCountsCache(id, validCards.length);

      localStorage.removeItem(draftKey);
      navigate("/library");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <SetFormContainer
      mode="edit"
      defaultValues={defaultValues}
      submitLabel="Save Changes"
      onSubmit={handleUpdate}
      draftKey={draftKey}
    />
  );
}

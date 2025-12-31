import { useParams, useNavigate } from "react-router-dom";
import { SetFormContainer } from "@/components/set/SetFormContainer";
import { useSetDetail } from "@/hooks/useSetDetail";
import { SetService } from "@/services/set.service";
import { CardService } from "@/services/card.service";
import { UploadService } from "@/services/upload.service";
import type { SetFormValues } from "@/schema/flashCard.schema";
import { toast } from "sonner";

export default function EditSetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { set, cards, loading } = useSetDetail(id);

  const draftKey = `set-draft-${id}`;

  if (loading && !set)
    return (
      <div className="flex items-center justify-center p-20 text-muted-foreground italic">
        Loading set data...
      </div>
    );

  if (!set)
    return (
      <div className="p-6 text-center text-destructive font-semibold">
        Set not found
      </div>
    );

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
          image_url: c.image_url ?? "",
        })),
      };

  const handleUpdate = async (data: SetFormValues) => {
    if (!id) return;

    try {
      await SetService.updateSet(id, {
        title: data.title,
        description: data.description ?? "",
        isPublic: data.isPublic ?? false,
      });

      const validCards = data.cards.filter(
        (c) => c.term?.trim() && c.definition?.trim()
      );

      const processedCards = await Promise.all(
        validCards.map(async (card) => {
          let imageUrl = card.image_url;

          if (imageUrl instanceof File || imageUrl instanceof Blob) {
            imageUrl = await UploadService.uploadImage(imageUrl);
          }

          return {
            ...card,
            image_url: imageUrl as string,
          };
        })
      );

      const oldCards = processedCards
        .filter((c) => c.id)
        .map((c) => ({
          id: c.id!,
          term: c.term!,
          definition: c.definition!,
          example: c.example ?? "",
          image_url: c.image_url ?? "",
        }));

      const newCards = processedCards
        .filter((c) => !c.id)
        .map((c) => ({
          term: c.term!,
          definition: c.definition!,
          example: c.example ?? "",
          image_url: c.image_url ?? "",
        }));

      await CardService.bulkUpdateCards({
        setId: id,
        oldCards,
        newCards,
      });

      localStorage.removeItem(draftKey);
      updateCountsCache(id, validCards.length);

      toast.success("Set updated successfully!");
      navigate(`/sets/${id}/view`);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update set. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <SetFormContainer
        mode="edit"
        defaultValues={defaultValues}
        submitLabel="Save Changes"
        onSubmit={handleUpdate}
        draftKey={draftKey}
      />
    </div>
  );
}

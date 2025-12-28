import { useParams, useNavigate } from "react-router-dom";
import { SetFormContainer } from "@/components/set/SetFormContainer";
import { useSetDetail } from "@/hooks/useSetDetail";
import { useSetStore } from "@/store/set.store";
import type { SetFormValues } from "@/schema/flashCard.schema";

export default function ViewSetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const cachedSet = useSetStore((s) => s.sets.find((i) => i.id === id));
  const { set, cards, loading, deleteSet } = useSetDetail(id);

  const displaySet = set || cachedSet;

  if (loading && !displaySet)
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading set...
      </div>
    );
  if (!displaySet)
    return <div className="p-6 text-destructive">Set not found</div>;

  const defaultValues: SetFormValues = {
    id: displaySet.id,
    title: displaySet.title,
    description: displaySet.description ?? "",
    isPublic: displaySet.isPublic ?? false,
    cards: cards.map((c) => ({
      id: c.id,
      term: c.term,
      definition: c.definition,
      example: c.example ?? "",
      image_url: c.image_url ?? "",
    })),
  };

  const handleDelete = async () => {
    // if (!id || !window.confirm("Are you sure?")) return;
    const success = await deleteSet();
    if (success) navigate("/library");
  };

  return (
    <SetFormContainer
      mode="view"
      onSubmit={async () => {}}
      defaultValues={defaultValues}
      submitLabel=""
      onDelete={handleDelete}
      onEdit={() => navigate(`/sets/${id}/edit`)}
    />
  );
}

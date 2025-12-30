import { useParams, useNavigate } from "react-router-dom";
import { useSetDetail } from "@/hooks/useSetDetail";
import { useSetStore } from "@/store/set.store";
import { SetService } from "@/services/set.service";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SetFormHeader } from "@/components/set/SetFormHeader";

export default function ViewSetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const removeSetFromStore = useSetStore((s) => s.removeSet);

  const cachedSet = useSetStore((s) => s.sets.find((i) => i.id === id));
  const { set, cards, loading } = useSetDetail(id);

  const displaySet = set || cachedSet;

  if (loading && !displaySet)
    return (
      <div className="flex items-center justify-center p-20 text-muted-foreground animate-pulse italic">
        Loading set details...
      </div>
    );

  if (!displaySet)
    return (
      <div className="p-6 text-center text-destructive font-semibold">
        Set not found
      </div>
    );

  const handleDelete = async () => {
    if (!id) return;
    try {
      await SetService.deleteSet(id);
      removeSetFromStore(id);
      toast.success("Set deleted successfully");
      navigate("/library");
    } catch (err) {
      console.error("Delete set error:", err);
      toast.error("Failed to delete set");
    }
  };

  return (
    <div className="max-w-5xl mx-auto md:px-12 space-y-6 pb-20">
      <SetFormHeader
        mode="view"
        isPublic={displaySet.isPublic ?? false}
        submitLabel=""
        onBack={() => navigate("/library")}
        onEdit={() => navigate(`/sets/${id}/edit`)}
        onDelete={handleDelete}
        onTogglePublic={() => {}}
        onOpenPublicModal={() => {}}
      />

      <div className="space-y-2 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">{displaySet.title}</h1>
        {displaySet.description && (
          <p className="text-gray-600 text-lg">{displaySet.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <Card
            key={card.id || index}
            className="rounded-xl p-6 border bg-white"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_140px] gap-6">
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Term (English)
                    </Label>
                    <div className="text-base font-medium text-gray-900 min-h-[24px]">
                      {card.term}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Definition (Vietnamese)
                    </Label>
                    <div className="text-base text-gray-700 min-h-[24px]">
                      {card.definition}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-50">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Example
                  </Label>
                  <div className="text-sm text-gray-600 italic leading-relaxed">
                    {card.example || (
                      <span className="text-gray-300 italic">
                        No example provided
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end items-start">
                {card.image_url ? (
                  <img
                    src={card.image_url}
                    alt="preview"
                    className="w-[140px] h-[140px] object-cover rounded-xl border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-[140px] h-[140px] bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 font-medium">
                      No Image
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

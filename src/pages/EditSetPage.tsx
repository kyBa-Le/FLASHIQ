// src/pages/EditSetPage.tsx
import { SetFormContainer } from "@/components/set/SetFormContainer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { SetFormValues } from "@/schema/flashCard.schema";

export default function EditSetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialData, setInitialData] =
    useState<SetFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSetDetail = async () => {
      setLoading(true);

      // Mock API
      const data: SetFormValues = {
        title: "Common English Phrases",
        description: "Used in daily conversation",
        is_public: true,
        cards: [
          {
            term: "Break the ice",
            definition: "Phá vỡ bầu không khí",
            example: "He told a joke to break the ice.",
          },
          {
            term: "Hit the books",
            definition: "Học chăm chỉ",
            example: "I need to hit the books tonight.",
          },
        ],
      };

      setInitialData(data);
      setLoading(false);
    };

    fetchSetDetail();
  }, [id]);

  const handleUpdate = async (data: SetFormValues) => {
    if (!id) return;

    console.log("UPDATE SET:", id, data);

    // await setService.update(id, data);

    navigate("/library");
  };

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!initialData) {
    return <div className="p-6 text-sm text-destructive">Set not found</div>;
  }

  return (
    <SetFormContainer
      submitLabel="Save Changes"
      defaultValues={initialData}
      onSubmit={handleUpdate}
    />
  );
}

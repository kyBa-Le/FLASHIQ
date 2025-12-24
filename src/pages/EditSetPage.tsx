// src/pages/EditSetPage.tsx
import { SetFormContainer } from "@/components/set/SetFormContainer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { SetFormValues } from "@/schema/flashCard.schema";

export default function EditSetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] =
    useState<SetFormValues | null>(null);

  useEffect(() => {
    // Mock API GET /sets/:id
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialData({
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
    });
  }, [id]);

  const handleUpdate = async (
    data: SetFormValues
  ) => {
    console.log("UPDATE:", id, data);

    // await setService.update(id!, data);
    navigate(`/sets/${id}/edit`);
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <SetFormContainer
      submitLabel="Save Changes"
      defaultValues={initialData}
      onSubmit={(data) =>
        handleUpdate(data)
      }
    />
  );
}

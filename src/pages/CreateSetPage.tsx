// src/pages/CreateSetPage.tsx
import { SetFormContainer, type SubmitAction } from "@/components/set/SetFormContainer";
import type { SetFormValues } from "@/schema/flashCard.schema";
import { createEmptyCards } from "@/utils/createEmptyCards";
import { useNavigate } from "react-router-dom";

export default function CreateSetPage() {
  const navigate = useNavigate();

  const handleCreate = async (
    data: SetFormValues,
    action: SubmitAction
  ) => {
    console.log("CREATE:", data, action);

    // const createdSet = await setService.create(data);
    const fakeSetId = "123"; // mock

    if (action === "create_and_study") {
      navigate(`/sets/${fakeSetId}/study`);
    } else {
      navigate(`/sets/${fakeSetId}`);
    }
  };

  return (
    <SetFormContainer
      submitLabel="Create Set"
      showStudyButton
      defaultValues={{
        title: "",
        description: "",
        is_public: true,
        cards: createEmptyCards(2),
      }}
      onSubmit={handleCreate}
    />
  );
}

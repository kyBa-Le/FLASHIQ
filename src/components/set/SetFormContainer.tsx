import { useState, useEffect } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { setSchema, type SetFormValues } from "@/schema/flashCard.schema";
import { SetForm } from "./SetForm";
import { SetFormHeader } from "./SetFormHeader";
import { SetFormControls } from "./SetFormControls";
import { SetFormFooter } from "./SetFormFooter";
import { ModalPublicSet } from "./ModalPuclicSet";
import { InputSet } from "../common/InputSet";
import { Textarea } from "../ui/textarea";

export type SubmitAction = "create" | "create_and_study" | "update";
export type Mode = "create" | "view" | "edit";

type Props = {
  defaultValues: SetFormValues;
  mode: Mode;
  submitLabel: string;
  showStudyButton?: boolean;
  onSubmit: (data: SetFormValues, action: SubmitAction) => Promise<void>;
  onDelete?: () => void;
  onEdit?: () => void;
  draftKey?: string;
};

export function SetFormContainer({
  defaultValues,
  mode,
  submitLabel,
  showStudyButton = false,
  onSubmit,
  onDelete,
  onEdit,
  draftKey,
}: Props) {
  const navigate = useNavigate();
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit";

  const [submitAction, setSubmitAction] = useState<SubmitAction>(
    isCreateMode ? "create" : "update"
  );
  const [openPublicModal, setOpenPublicModal] = useState(false);

  const methods = useForm<SetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(setSchema) as any,
    defaultValues,
  });
  const { reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });

  const isPublic = watch("isPublic");

  useEffect(() => {
    if ((isEditMode || isCreateMode) && draftKey) {
      const subscription = watch((value) => {
        localStorage.setItem(draftKey, JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isEditMode, isCreateMode, draftKey]);

  const handleFormSubmit = async (data: SetFormValues) => {
    if (isViewMode) return;
    await onSubmit(data, submitAction);
  };

  const submitWithAction = (action: SubmitAction) => {
    setSubmitAction(action);
    handleSubmit(handleFormSubmit)();
  };

  return (
    <FormProvider {...methods}>
      <form className="min-h-screen px-12 py-4 space-y-4">
        <SetFormHeader
          mode={mode}
          isPublic={isPublic}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
          onBack={() => navigate("/library")}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublic={() => methods.setValue("isPublic", !isPublic)}
          onOpenPublicModal={() => setOpenPublicModal(true)}
          onSubmit={() => submitWithAction(isCreateMode ? "create" : "update")}
        />

        <div className="space-y-4">
          <InputSet
            placeholder="Title"
            disabled={isViewMode}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}

          <Textarea
            placeholder="Description"
            disabled={isViewMode}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        {!isViewMode && (
          <SetFormControls
            control={control}
            onImport={() =>
              append({ term: "", definition: "", example: "", image_url: "" })
            }
            onDeleteAllCards={async () => {
              if (fields.length === 0) return;
              for (let i = fields.length - 1; i >= 0; i--) remove(i);
            }}
          />
        )}
        {fields.map((field, index) => (
          <SetForm
            key={field.id}
            index={index}
            disabled={isViewMode}
            onRemove={isViewMode ? undefined : () => remove(index)}
          />
        ))}
        {!isViewMode && (
          <SetFormFooter
            submitLabel={submitLabel}
            showStudyButton={showStudyButton}
            isSubmitting={isSubmitting}
            onAddCard={() =>
              append({ term: "", definition: "", example: "", image_url: "" })
            }
            onCancel={() => navigate("/library")}
            onSubmit={() =>
              submitWithAction(isCreateMode ? "create" : "update")
            }
            onCreateAndStudy={() => submitWithAction("create_and_study")}
          />
        )}
        <ModalPublicSet
          open={openPublicModal}
          onClose={() => setOpenPublicModal(false)}
          defaultRole="viewer"
          onSave={() => {
            methods.setValue("isPublic", true);
            setOpenPublicModal(false);
          }}
        />
      </form>
    </FormProvider>
  );
}

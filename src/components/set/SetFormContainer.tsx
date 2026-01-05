/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  // const isEditMode = mode === "edit";

  const [submitAction, setSubmitAction] = useState<SubmitAction>(
    isCreateMode ? "create" : "update"
  );
  const [openPublicModal, setOpenPublicModal] = useState(false);

  const methods = useForm<SetFormValues>({
    resolver: zodResolver(setSchema) as any,
    mode: "onTouched",
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
    if (!draftKey) return;

    const subscription = methods.watch((value) => {
      const draftData = {
        ...value,
        cards: value.cards?.map((card: any) => ({
          ...card,
          image_url: typeof card?.image_url === "string" ? card.image_url : "",
        })),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
    });

    return () => subscription.unsubscribe();
  }, [methods, draftKey]);

  const handleFormSubmit = async (data: SetFormValues) => {
    if (isViewMode) return;
    await onSubmit(data, submitAction);
  };

  const submitWithAction = (action: SubmitAction) => {
    setSubmitAction(action);
    handleSubmit(handleFormSubmit)();
  };
  const handleCancel = () => {
    if (draftKey) {
      localStorage.removeItem(draftKey);
    }

    navigate("/library");
  };
  return (
    <FormProvider {...methods}>
      <form className="min-h-screen md:px-12 space-y-4 max-w-5xl mx-auto">
        <SetFormHeader
          mode={mode}
          isPublic={isPublic}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
          onBack={handleCancel}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublic={() => methods.setValue("isPublic", !isPublic)}
          onOpenPublicModal={() => setOpenPublicModal(true)}
          onSubmit={() => submitWithAction(isCreateMode ? "create" : "update")}
        />

        <div className="space-y-4">
          {isViewMode ? (
            <div className="space-y-2 border-b pb-4 border-gray-200">
              <div className="max-w-full overflow-hidden">
                <h1
                  className="text-xl font-bold text-gray-900 truncate leading-tight"
                  title={watch("title")}
                >
                  <span>Title:</span> {watch("title") || "Untitled Set"}
                </h1>
              </div>

              {watch("description") && (
                <div className="max-w-full overflow-hidden">
                  <p
                    className="text-md text-gray-600 truncate"
                    title={watch("description")}
                  >
                    {watch("description")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <InputSet
                placeholder="Title"
                className="text-md font-bold border-gray-300 shadow-none focus:ring-0"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
              <Textarea
                placeholder="Description"
                className="resize-none border-gray-300 shadow-none focus:ring-0 min-h-[100px]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          )}
        </div>
        {!isViewMode && (
          <SetFormControls
            control={control}
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
            onCancel={handleCancel}
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

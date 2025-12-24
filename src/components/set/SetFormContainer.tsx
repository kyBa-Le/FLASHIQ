// src/components/set/SetFormContainer.tsx
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ToggleRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setSchema, type SetFormValues } from "@/schema/flashCard.schema";
import { SetForm } from "./SetForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ModalPublicSet } from "./ModalPuclicSet";

export type SubmitAction = "create" | "create_and_study" | "update";

type Props = {
  defaultValues: SetFormValues;
  onSubmit: (data: SetFormValues, action: SubmitAction) => Promise<void> | void;
  submitLabel: string;
  showStudyButton?: boolean;
};

export function SetFormContainer({
  defaultValues,
  onSubmit,
  submitLabel,
  showStudyButton = false,
}: Props) {
  const navigate = useNavigate();
  const [submitAction, setSubmitAction] = useState<SubmitAction>(
    showStudyButton ? "create" : "update"
  );

  const methods = useForm<SetFormValues>({
    resolver: zodResolver(setSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });
  const handleClearAllCards = () => {
    if (!fields.length) return;

    const ok = confirm("Delete all cards?");
    if (!ok) return;

    remove();
  };

  const handleFormSubmit = async (data: SetFormValues) => {
    await onSubmit(data, submitAction);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openPublicModal, setOpenPublicModal] = useState(false);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="min-h-screen px-12 py-6 space-y-6"
      >
        <div
          className="flex items-center gap-2 cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="px-4 py-1 rounded-full bg-purple-600 text-sm text-white
                 cursor-pointer hover:bg-purple-500 transition"
              onClick={() => setOpenPublicModal(true)}
            >
              Public
            </span>

            <ToggleRight
              className="h-5 w-5 text-primary cursor-pointer"
              onClick={() => setOpenPublicModal(true)}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() =>
              setSubmitAction(showStudyButton ? "create" : "update")
            }
            className="rounded-full"
          >
            {submitLabel}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Input
              placeholder="Title"
              {...register("title")}
              className="border bg-white shadow-sm rounded-md px-3 py-2 text-sm w-full"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Textarea
              placeholder="Description"
              {...register("description")}
              className="bg-background"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full px-4"
          >
            + Import
          </Button>

          <div className="flex items-center gap-3">
            {/* <Pencil
              className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-primary transition"
              onClick={() =>
                navigate(`/sets/${id}/edit`, {
                  state: { from: location.pathname },
                })
              }
            /> */}
            {fields.length > 0 && (
              <Trash2
                className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-destructive transition"
                onClick={handleClearAllCards}
              />
            )}
          </div>
          <ModalPublicSet
            open={openPublicModal}
            onClose={() => setOpenPublicModal(false)}
            defaultRole="viewer"
            onSave={(role) => {
              console.log("Public role:", role);

              methods.setValue("is_public", true);
              // methods.setValue("public_role", role);

              setOpenPublicModal(false);
            }}
          />
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <SetForm
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ term: "", definition: "", example: "" })}
            className="rounded-full"
          >
            Add Card
          </Button>
        </div>

        <div className="bottom-0 left-0 w-full p-4 flex justify-end gap-3">
          {showStudyButton && (
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => setSubmitAction("create_and_study")}
              className="rounded-full"
            >
              Create & Study
            </Button>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() =>
              setSubmitAction(showStudyButton ? "create" : "update")
            }
            className="rounded-full"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

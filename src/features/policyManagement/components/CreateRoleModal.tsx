import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/components/Modal/Modal";
import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";
import Select from "@/shared/components/UI/Select/Select";
import { createGlobalRoleSchema, type CreateGlobalRoleFormData } from "../schema/globalRoles.schema";
import { CATEGORY_CONFIG, CATEGORY_OPTIONS } from "../config/categoryConfig";
import type { RoleCategory } from "../schema/globalRoles.schema";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGlobalRoleFormData) => Promise<boolean>;
  isLoading: boolean;
}

const CreateRoleModal = ({ isOpen, onClose, onSubmit, isLoading }: CreateRoleModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateGlobalRoleFormData>({
    resolver: zodResolver(createGlobalRoleSchema),
    defaultValues: {
      name:     "",
      code:     "",
      category: "STAFF",
      level:    undefined,
    },
  });

  const watchedName     = watch("name");
  const watchedCategory = watch("category") as RoleCategory;
  const categoryMeta    = CATEGORY_CONFIG[watchedCategory];

  // Auto-generate code from name
  useEffect(() => {
    const generated = watchedName
      .toUpperCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "");
    setValue("code", generated, { shouldValidate: false });
  }, [watchedName, setValue]);

  // Auto-set default level when category changes
  useEffect(() => {
    if (watchedCategory && CATEGORY_CONFIG[watchedCategory]) {
      setValue("level", CATEGORY_CONFIG[watchedCategory].defaultLevel, { shouldValidate: false });
    }
  }, [watchedCategory, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: CreateGlobalRoleFormData) => {
    const ok = await onSubmit(data);
    if (ok) handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      width="560px"
      header={
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${categoryMeta?.bg}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${categoryMeta?.color}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Create New Role</h2>
            <p className="text-xs text-slate-500 mt-0.5">Define the role's identity and authority level</p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">

        {/* Name */}
        <Input
          label="Display Name"
          placeholder="e.g. Senior Waiter"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />

        {/* Auto-generated Code */}
        <div>
          <Input
            label="System Code"
            placeholder="AUTO-GENERATED"
            error={!!errors.code}
            helperText={errors.code?.message ?? "Auto-generated from name. You can edit it."}
            {...register("code")}
            onChange={(e) =>
              setValue("code", e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""), { shouldValidate: true })
            }
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Select
            label="Category"
            options={CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
            value={watchedCategory}
            onChange={(e) => setValue("category", e.target.value as RoleCategory, { shouldValidate: true })}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
          {watchedCategory && (
            <p className={`text-xs px-3 py-2 rounded-lg ${categoryMeta?.bg} ${categoryMeta?.color} border ${categoryMeta?.border}`}>
              {categoryMeta?.description}
            </p>
          )}
        </div>

        {/* Level */}
        <Input
          label="Authority Level"
          type="number"
          placeholder="e.g. 50"
          error={!!errors.level}
          helperText={errors.level?.message ?? "Lower number = more authority. 1 = highest, 999 = lowest."}
          {...register("level", { valueAsNumber: true })}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-1">
          <Button type="button" variant="outlineSecondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRoleModal;

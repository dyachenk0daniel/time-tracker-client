import { create } from 'zustand';
import { z } from 'zod';
import { omit } from 'lodash-es';

interface FormState<T> {
  formData: T;
  errors: Partial<Record<keyof T, string>>;
  setFieldValue: (field: keyof T, value: string) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  clearErrors: () => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  clearValues: () => void;
}

type ZodShape<T> = {
  [K in keyof T]: z.ZodType<T[K]>;
};

function createFormStore<T extends object>(initialValues: T, schema: z.ZodObject<ZodShape<T>>) {
  return create<FormState<T>>((set, get) => ({
    formData: initialValues,
    errors: {},

    setFieldValue: (field, value) =>
      set((state) => ({
        formData: {
          ...state.formData,
          [field]: value,
        },
      })),

    validateField: (field) => {
      try {
        const fieldSchema = z.object({ [field]: schema.shape[field] });

        fieldSchema.parse({ [field]: get().formData[field] });
        set((state) => ({
          errors: omit(state.errors, [field]) as Partial<Record<keyof T, string>>,
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors[0]?.message;

          set((state) => ({
            errors: { ...state.errors, [field]: fieldError },
          }));
        }
      }
    },

    validateForm: () => {
      try {
        schema.parse(get().formData);
        set({ errors: {} });

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.errors.reduce(
            (acc, err) => ({
              ...acc,
              [err.path[0]]: err.message,
            }),
            {}
          );
          set({ errors: fieldErrors });

          return false;
        }
        return false;
      }
    },

    clearErrors: () => set({ errors: {} }),

    clearValues: () => set({ formData: { ...initialValues } }),

    setErrors: (errors) => set({ errors }),
  }));
}

export default createFormStore;

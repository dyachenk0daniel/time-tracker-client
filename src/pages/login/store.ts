import { create } from 'zustand';
import { z } from 'zod';
import { omit } from 'lodash-es';
import { LoginRequest } from '@entities/user/types';
import { passwordPattern } from '@shared/constants.ts';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
  password: z.string().regex(passwordPattern, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)',
  }),
});

interface LoginFormState {
  formData: LoginRequest;
  errors: Partial<Record<keyof LoginRequest, string>>;
  setFieldValue: (field: keyof LoginRequest, value: string) => void;
  validateField: (field: keyof LoginRequest) => void;
  validateForm: () => boolean;
  clearErrors: () => void;
  setErrors: (errors: Partial<Record<keyof LoginRequest, string>>) => void;
  clearValues: () => void;
}

const initialValues = {
  email: '',
  password: '',
};

export const useLoginFormStore = create<LoginFormState>((set, get) => ({
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
      const fieldSchema = loginSchema.pick({ [field]: true } as Record<string | number, never>);

      fieldSchema.parse({ [field]: get().formData[field] });
      set((state) => ({
        errors: omit(state.errors, [field]),
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
      loginSchema.parse(get().formData);
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

  clearValues: () => set({ formData: initialValues }),

  setErrors: (errors) => set({ errors }),
}));

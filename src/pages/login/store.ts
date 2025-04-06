import { z } from 'zod';
import createFormStore from '@shared/utils/create-form-store.ts';
import { passwordPattern } from '@entities/user/constants.ts';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
  password: z.string().regex(passwordPattern, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)',
  }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

const initialValues: LoginSchemaType = {
  email: '',
  password: '',
};

export const useLoginFormStore = createFormStore(initialValues, loginSchema);

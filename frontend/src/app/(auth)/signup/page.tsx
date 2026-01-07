'use client';

import { useState } from 'react';
import { useAuth } from 'better-auth/hooks';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const SignupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<z.ZodError | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = SignupSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error);
      return;
    }

    setErrors(null);

    try {
      await signUp('credentials', { email: result.data.email, password: result.data.password });
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup error (e.g., show a toast notification)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors?.issues.find((issue) => issue.path[0] === 'email') && (
            <p className="text-red-500 text-xs mt-1">
              {errors.issues.find((issue) => issue.path[0] === 'email')?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors?.issues.find((issue) => issue.path[0] === 'password') && (
            <p className="text-red-500 text-xs mt-1">
              {errors.issues.find((issue) => issue.path[0] === 'password')?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors?.issues.find((issue) => issue.path[0] === 'confirmPassword') && (
            <p className="text-red-500 text-xs mt-1">
              {errors.issues.find((issue) => issue.path[0] === 'confirmPassword')?.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

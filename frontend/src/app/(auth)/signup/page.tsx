'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Toaster, toast } from 'sonner';
import { authClient } from '@/lib/auth';

const SignupSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
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
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<z.ZodError | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null);
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = SignupSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error);
      return;
    }

    setErrors(null);
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await authClient.signUp.email({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });

      if (response.error) {
        const errorMessage = response.error.message || 'Signup failed. Please try again.';
        // 409 Conflict for "User already exists"
        if (response.error.status === 409) {
          setServerError(errorMessage);
        }
        return;
      }

      if (response.data.user) {
        toast.success('Signup successful! Redirecting to dashboard...');
        router.push('/dashboard');
      }
    } catch (e: any) {
      console.error('Signup failed unexpectedly:', e);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background text-foreground">
      <Toaster />
      <form onSubmit={handleSubmit} className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Sign Up</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors?.issues.find((issue) => issue.path[0] === 'name') && (
            <p className="text-accent2 text-xs mt-1">
              {errors.issues.find((issue) => issue.path[0] === 'name')?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors?.issues.find((issue) => issue.path[0] === 'email') && (
            <p className="text-accent2 text-xs mt-1">
              {errors.issues.find((issue) => issue.path[0] === 'email')?.message}
            </p>
          )}
          {serverError && (
            <p className="text-accent2 text-xs mt-1">{serverError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors?.issues.find((issue) => issue.path[0] === 'password') && (
            <p className="text-accent2 text-xs mt-1">
              {errors.issues.find((issue) => issue.path[0] === 'password')?.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors?.issues.find((issue) => issue.path[0] === 'confirmPassword') && (
            <p className="text-accent2 text-xs mt-1">
              {errors.issues.find((issue) => issue.path[0] === 'confirmPassword')?.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center text-sm">
          Already signed up?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
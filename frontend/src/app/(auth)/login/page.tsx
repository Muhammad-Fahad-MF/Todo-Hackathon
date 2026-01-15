'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Toaster, toast } from 'sonner';
import { authClient } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type FormData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<z.ZodError | null>(null);
  const [serverError, setServerError] = useState<{field: 'email' | 'password', message: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null);
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error);
      return;
    }

    setErrors(null);
    setServerError(null);
    setIsSubmitting(true);

    try {
      const { user, error } = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        const errorMessage = error.message || 'Invalid email or password.';
        if (error.status === 401) { // 401 for Invalid credentials
          setServerError({ field: 'password', message: errorMessage });
        } else { // Other errors (like 404 Not Found) on email
          setServerError({ field: 'email', message: errorMessage });
        }
        return;
      }

      if (user) {
        toast.success('Login successful! Redirecting to dashboard...');
        router.push('/dashboard');
      }
      
    } catch (e: any) {
        console.error('Login failed unexpectedly:', e);
        toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background text-foreground">
      <Toaster />
      <form onSubmit={handleSubmit} className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Login</h1>
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
          {serverError?.field === 'email' && (
            <p className="text-accent2 text-xs mt-1">{serverError.message}</p>
          )}
        </div>
        <div className="mb-6">
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
          {serverError?.field === 'password' && (
            <p className="text-accent2 text-xs mt-1">{serverError.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
        >
          Login
        </button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
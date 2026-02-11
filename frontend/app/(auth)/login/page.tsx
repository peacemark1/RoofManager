
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import LiquidGlassLogin from '@/components/auth/LiquidGlassLogin';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      throw new Error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <LiquidGlassLogin onSubmit={handleSubmit} />
    </div>
  );
}

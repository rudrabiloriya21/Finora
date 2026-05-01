import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { cn } from '../../lib/utils';

export const Login: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Failed to login with Google", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left section - Branding/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-950 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <Logo className="text-3xl" iconClassName="w-7 h-7 mx-0.5 text-accent-400" />
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6 mt-20">
            Take control of<br />your finances.
          </h1>
          <p className="text-primary-300 text-lg max-w-md">
            Track expenses, manage goals, and get intelligent predictive insights on your spending habits all in one place.
          </p>
        </div>

        <div className="relative z-10 grid gap-6 grid-cols-2 mt-auto pb-12">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-accent-400 mb-3" />
            <h3 className="font-semibold mb-1">Visual Tracking</h3>
            <p className="text-primary-300 text-sm">See exactly where your money goes with clear charts.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-yellow-400 mb-3" />
            <h3 className="font-semibold mb-1">Predictive Insights</h3>
            <p className="text-primary-300 text-sm">Forecast end-of-month balances to stay ahead.</p>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      </div>

      {/* Right section - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-10 text-primary-900">
            <Logo className="text-4xl" iconClassName="w-8 h-8 mx-0.5 text-accent-500" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Finora
          </h2>
          <p className="mt-2 text-gray-500 mb-8">
            Sign in to start tracking your finances securely.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-primary-200 rounded-xl shadow-sm text-sm font-medium text-primary-900 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 text-sm">
             <ShieldCheck className="w-4 h-4" />
             <span>Your data is stored securely in the cloud.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

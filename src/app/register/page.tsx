import Link from "next/link";
import Image from "next/image";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — nature photo */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Mountain nature"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-white/90 text-3xl font-light leading-snug tracking-wide">
            Build habits that<br />
            <span className="font-semibold text-violet-300">last a lifetime.</span>
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70"
            alt="Mountain nature"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm z-10">
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="4 12 9 17 20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-white text-xl font-bold tracking-wide">Habbits</span>
            </div>
            <p className="text-slate-400 text-sm">Start tracking your habits</p>
          </div>

          {/* Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-7 shadow-2xl">
            <h2 className="text-white text-2xl font-semibold mb-6">Create account</h2>
            <RegisterForm />
            <p className="text-center text-sm text-slate-500 mt-5">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

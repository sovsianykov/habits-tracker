"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema, LoginInput } from "@/lib/validations";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setError("");
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <p className="text-sm text-red-400 bg-red-950/50 border border-red-800/50 p-3 rounded-lg">{error}</p>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
        <input
          {...register("email")}
          type="email"
          className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 text-white rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
        <input
          {...register("password")}
          type="password"
          className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 text-white rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium disabled:opacity-50 transition-colors mt-1"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

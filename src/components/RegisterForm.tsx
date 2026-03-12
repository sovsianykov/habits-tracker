"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, RegisterInput } from "@/lib/validations";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 409) {
      setError("Email already in use");
    } else if (!res.ok) {
      setError("Something went wrong. Please try again.");
    } else {
      router.push("/login?registered=1");
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
          placeholder="Min. 8 characters"
        />
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium disabled:opacity-50 transition-colors mt-1"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full py-2.5 px-4 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
    >
      Sign out
    </button>
  );
}

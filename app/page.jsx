"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center dark:bg-black">
      <button
        onClick={() => router.push("/chat_window")}
        className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
      >
        Go to Chat Window
      </button>
    </div>
  );
}
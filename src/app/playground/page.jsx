"use client";
import Playground from "@/components/chatpage/playground";

export default function PlaygroundPage() {
  // Optionally, you can add a toggle button or always show the playground
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Drawing Playground</h1>
        {/* Always open Playground for simplicity */}
        <Playground isOpen={true} onClose={undefined} />
      </div>
    </div>
  );
}

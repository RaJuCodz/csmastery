"use client";
import { Send, Pencil } from "lucide-react";
import { useState, useRef } from "react";

export const InputPanel = ({ onSendMessage }) => {
  const [query, setQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (query.trim()) {
      onSendMessage(query);
      setQuery("");
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl flex items-end gap-2 bg-[#23232b] rounded-xl shadow-lg border border-gray-800 px-4 py-2">
        <textarea
          ref={textareaRef}
          className="h-10 text-base px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1 bg-gray-900 text-white placeholder-gray-400 resize-none no-scrollbar"
          placeholder="Ask your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          style={{ minHeight: "40px", maxHeight: "120px", overflowY: "auto" }}
        />
        <button
          className="rounded-full hover:cursor-pointer bg-purple-700 flex items-center justify-center w-10 h-10"
          onClick={handleSend}
          type="button"
        >
          <Send className="text-white" />
        </button>
      </div>
    </div>
  );
};

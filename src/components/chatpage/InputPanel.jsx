"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Send, Pencil } from "lucide-react";

export const InputPanel = ({ onSendMessage, onTogglePlayground }) => {
  const [query, setQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const handleSend = () => {
    if (query.trim()) {
      onSendMessage(query);
      setQuery("");
      textareaRef.current?.focus();
    }
  };

  useEffect(() => {
    if (textareaRef.current && containerRef.current) {
      const textarea = textareaRef.current;
      const container = containerRef.current;

      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
      container.style.height = `${newHeight + 16}px`;
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 w-full bg-background flex justify-center">
      <div
        ref={containerRef}
        className="flex flex-col-reverse py-10 justify-center items-center w-1/2 mb-5 bg-secondary rounded-2xl p-4"
      >
        <div className="relative w-full py-10">
          <Textarea
            ref={textareaRef}
            className="w-full resize-none no-scrollbar pl-5 pr-28 outline-none border-none focus:outline-none focus:border-none shadow-none"
            placeholder="Ask your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            style={{ minHeight: "10px", maxHeight: "200px", overflowY: "auto" }}
          />
          <div className="absolute right-4 bottom-14 flex gap-2">
            <Button
              className="rounded-full hover:cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={onTogglePlayground}
              title="Open Playground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              className="rounded-full hover:cursor-pointer"
              onClick={handleSend}
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

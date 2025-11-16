import React, { useRef, useCallback } from "react";
import { Search, Mic } from "lucide-react";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";

/**
 * ChatAssistant - Isolated chat component to prevent re-renders from parent
 * This prevents input focus loss when parent component re-renders
 */
export default function ChatAssistant({
  chat,
  chatInput,
  setChatInput,
  listening,
  toggleVoiceListen,
  onSubmit,
}) {
  const inputRef = useRef(null);

  const handleSubmit = useCallback(() => {
    if (inputRef.current && inputRef.current.value) {
      onSubmit(inputRef.current.value);
      inputRef.current.value = "";
    }
  }, [onSubmit]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <Card className="flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Smart Assistant</div>
        <div className="text-xs text-gray-500">Real-time (demo)</div>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-2 rounded ${
              m.from === "assistant"
                ? "bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 self-start"
                : "bg-agoraTeal text-black self-end ml-auto"
            }`}
          >
            <div className="text-sm">{m.text}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(m.ts || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          onKeyPress={handleKeyPress}
          placeholder="Ask assistant..."
          className="flex-1 px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-agoraTeal"
        />
        <Button size="sm" variant="primary" onClick={handleSubmit}>
          <Search className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={listening ? "accent" : "ghost"}
          onClick={toggleVoiceListen}
        >
          <Mic className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

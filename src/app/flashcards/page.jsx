"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import "./flipcard.css";

// Helper to get real AI responses for each Q
async function getFlashcardResponses(topic) {
  const questions = [
    `What is ${topic}?`,
    `Why is ${topic} important?`,
    `Give an example of ${topic}.`,
    `Explain a key concept in ${topic}.`,
    `How to apply ${topic}?`
  ];
  try {
    const res = await fetch("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, questions })
    });
    const data = await res.json();
    if (Array.isArray(data.answers) && data.answers.length === questions.length) {
      const facts = [
        `Fun fact: ${topic} has interesting applications!`,
        `Did you know? ${topic} is used in various fields.`,
        `Tip: Try relating ${topic} to real-life situations.`,
        `Remember: Understanding ${topic} helps with mastery.`,
        `Pro tip: Practice using ${topic} in exercises.`
      ];
      return questions.map((q, i) => ({
        question: q,
        answer: data.answers[i],
        fact: facts[i % facts.length]
      }));
    }
    throw new Error(data.error || "Invalid response from AI");
  } catch (err) {
    // fallback to mock answers
    return questions.map((q, i) => ({
      question: q,
      answer: `Could not fetch answer for: ${q}`,
      fact: `Fun fact about ${topic}!`
    }));
  }
}

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIndex(0);
    setFlipped(false);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      // Get all flashcard Q&A at once (simulate AI)
      const cards = await getFlashcardResponses(topic);
      setFlashcards(cards.filter(card => card.answer && card.answer.trim() !== ""));
    } catch (err) {
      setError("Failed to generate flashcards. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setIndex((i) => (i > 0 ? i - 1 : flashcards.length - 1));
    setFlipped(false);
  };
  const handleNext = () => {
    setIndex((i) => (i < flashcards.length - 1 ? i + 1 : 0));
    setFlipped(false);
  };
  const handleRegenerate = () => {
    setFlashcards([]);
    setIndex(0);
    setTopic("");
    setFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center p-0">
      <Navbar />
      <main className="flex flex-col items-center w-full flex-1 mt-24">
        <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white/90 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl p-8 border-2 border-purple-200 dark:border-purple-900 relative overflow-hidden animate-fadeIn">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 drop-shadow-lg tracking-tight select-none">Learn Funfacts with Flashcards</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-6 mb-8 border border-purple-100 dark:border-gray-800">
            <label className="text-lg font-semibold text-gray-700 dark:text-gray-100">Enter a topic or subject:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg bg-white dark:bg-gray-800"
              placeholder="e.g. Photosynthesis, React Hooks, World War II"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold py-2 px-6 rounded-lg shadow hover:from-purple-700 hover:to-pink-600 transition text-lg"
              disabled={loading || !topic.trim()}
            >
              {loading ? "Generating..." : "Generate Flashcards"}
            </button>
          </form>
          {error && <div className="text-red-500 mt-4 text-center font-semibold">{error}</div>}
          {flashcards.length > 0 && (
            <div className="flex flex-col items-center gap-6 mt-6">
              <div className="relative w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-purple-200 dark:bg-gray-700 hover:bg-purple-400 dark:hover:bg-purple-600 transition shadow"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-7 h-7 text-purple-800 dark:text-purple-200" />
                  </button>
                  <span className="text-base text-gray-700 dark:text-gray-300 font-semibold">
                    Card {index + 1} of {flashcards.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-purple-200 dark:bg-gray-700 hover:bg-purple-400 dark:hover:bg-purple-600 transition shadow"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-7 h-7 text-purple-800 dark:text-purple-200" />
                  </button>
                </div>
                <div
                  className={`group perspective w-full flex justify-center items-center min-h-[260px] select-none cursor-pointer`}
                  onClick={() => setFlipped((f) => !f)}
                >
                  <div
                    className={`relative w-full max-w-md h-[260px] transition-transform duration-500 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}
                  >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-tr from-purple-100 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 p-8 flex flex-col items-center justify-center">
                      <div className="text-xl font-bold text-purple-700 dark:text-purple-200 mb-3 text-center">
                        {flashcards[index].question}
                      </div>
                      <div className="text-xs italic text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-4 py-2 rounded mt-auto text-center shadow mt-8">
                        Click to reveal answer
                      </div>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-tr from-yellow-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 p-8 flex flex-col items-center justify-center rotate-y-180">
                      <div className="text-lg text-gray-800 dark:text-gray-100 mb-6 text-center font-semibold">
                        {flashcards[index].answer}
                      </div>
                      <div className="text-xs italic text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-4 py-2 rounded mt-auto text-center shadow">
                        {flashcards[index].fact}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRegenerate}
                  className="absolute -top-10 right-0 flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white rounded-lg shadow hover:from-purple-700 hover:to-pink-600 transition text-sm font-semibold"
                  aria-label="Regenerate"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Generate Again
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

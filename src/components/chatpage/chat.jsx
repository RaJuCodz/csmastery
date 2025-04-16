"use client";
import { useState, useEffect, useRef } from "react";
import { InputPanel } from "./InputPanel";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Cookies from "js-cookie";
import { Loader, User, Bot } from "lucide-react";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import { Playground } from "./playground";
import jsPDF from "jspdf";

export const ChatComp = ({ subject }) => {
  // Improved system prompt for subject-focused, well-formatted notes
  const systemPrompt = `You are an expert study assistant for the subject: ${subject}.
Your job is to help students learn and revise efficiently. When the user asks for notes, explanations, or summaries, always:
- Use clear headings and bullet points where appropriate
- Avoid unnecessary markdown like double asterisks (**) unless for actual bold text
- Keep formatting clean and easy to read for study and revision
- Use concise, exam-oriented language
- Structure content as: Introduction, Key Concepts, Examples, and Summary (if relevant)
- Avoid repetition and clutter
If the user requests notes, generate them in a clean, readable format for students.`;

  const [messages, setMessages] = useState([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [username, setUsername] = useState("User"); // Default username
  const cookieKey = `chat_${subject.toLowerCase().replace(/\s+/g, "_")}`;
  const [hasShownGreeting, setHasShownGreeting] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom
   = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Get username from cookies or local storage
    const savedUsername =
      Cookies.get("username") || localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    const savedMessages = Cookies.get(cookieKey);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      generateGreeting();
    }
  }, [cookieKey]);

  const generateGreeting = async () => {
    try {
      setLoadingResponse(true);
      const greetingPrompt = `Generate a greeting for a ${subject} expert. 
        The greeting should be formatted exactly as follows:
        
        Hello mentee, I am this ${subject} expert I can help you with:
        - Topic 1
        - Topic 2
        - Topic 3
        - Topic 4
        
        Keep it concise and use markdown formatting.`;

      const response = await axios.post(
        "/api/gemini",
        { prompt: greetingPrompt },
        { headers: { "Content-Type": "application/json" } }
      );

      const greetingMessage = { sender: "bot", text: response.data.response };
      setMessages([greetingMessage]);
      setHasShownGreeting(true);
    } catch (error) {
      console.error("Error generating greeting:", error);
      const fallbackGreeting = {
        sender: "bot",
        text: `Hello mentee, I am this ${subject} expert I can help you with:
- Topic 1
- Topic 2
- Topic 3
- Topic 4`,
      };
      setMessages([fallbackGreeting]);
      setHasShownGreeting(true);
    } finally {
      setLoadingResponse(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      Cookies.set(cookieKey, JSON.stringify(messages), { expires: 1 });
    }
  }, [messages, cookieKey]);

  const handleSendMessage = async (query) => {
    if (!query.trim()) return;
    const newUserMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, newUserMessage]);

    const conversationContext =
      `${systemPrompt}\n\n` +
      messages.reduce((acc, msg) => {
        const role = msg.sender === "user" ? "User" : "Assistant";
        return acc + `${msg.text}\n`;
      }, "") +
      `User: ${query}\n`;

    try {
      setLoadingResponse(true);

      const response = await axios.post(
        "/api/gemini",
        { prompt: conversationContext },
        { headers: { "Content-Type": "application/json" } }
      );

      const newBotMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoadingResponse(false);
    }
  };

  // PDF Download Handler (Q&A, all history, text-based)
  const handleDownloadPDF = () => {
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 32;
    let y = margin + 40;
    const lineHeight = 18;
    const maxLineWidth = pdfWidth - 2 * margin;

    // Title and meta
    pdf.setFontSize(18);
    pdf.setTextColor(90, 36, 170); // Purple title
    pdf.text("Study Notes", pdfWidth / 2, margin + 10, { align: "center" });
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80); // Subtitle gray
    pdf.text(
      `Subject: ${subject}    Date: ${new Date().toLocaleString()}`,
      pdfWidth / 2,
      margin + 28,
      { align: "center" }
    );
    y += 10;
    pdf.setFontSize(12);

    let i = 0;
    while (i < messages.length) {
      if (messages[i].sender === "user") {
        pdf.setFont(undefined, "bold");
        pdf.setTextColor(30, 144, 255); // Dodger blue for Question
        pdf.text("Question:", margin, y);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(33, 37, 41); // Default text
        y += lineHeight;
        const userLines = pdf.splitTextToSize(messages[i].text.replace(/\*\*/g, ''), maxLineWidth);
        userLines.forEach(line => {
          pdf.text(line, margin + 24, y);
          y += lineHeight;
        });
        if (i + 1 < messages.length && messages[i + 1].sender === "bot") {
          pdf.setFont(undefined, "bold");
          pdf.setTextColor(76, 175, 80); // Green for Answer
          pdf.text("Answer:", margin, y);
          pdf.setFont(undefined, "normal");
          pdf.setTextColor(33, 37, 41); // Default text
          y += lineHeight;
          const botLines = pdf.splitTextToSize(messages[i + 1].text.replace(/\*\*/g, ''), maxLineWidth);
          botLines.forEach(line => {
            pdf.text(line, margin + 24, y);
            y += lineHeight;
          });
          i += 2;
        } else {
          i += 1;
        }
        y += lineHeight / 2;
      } else if (messages[i].sender === "bot") {
        pdf.setFont(undefined, "bold");
        pdf.setTextColor(156, 39, 176); // Purple for Bot
        pdf.text("Bot:", margin, y);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(33, 37, 41); // Default text
        y += lineHeight;
        const botLines = pdf.splitTextToSize(messages[i].text.replace(/\*\*/g, ''), maxLineWidth);
        botLines.forEach(line => {
          pdf.text(line, margin + 24, y);
          y += lineHeight;
        });
        i += 1;
        y += lineHeight / 2;
      } else {
        i += 1;
      }
      if (y > pdf.internal.pageSize.getHeight() - margin - lineHeight * 2) {
        pdf.addPage();
        y = margin;
      }
    }
    pdf.save("study-notes.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-5xl flex-1 flex flex-col justify-end">
        <div className="w-full flex-1 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-4xl bg-[#18181b] rounded-2xl shadow-2xl border border-gray-800 flex flex-col relative" style={{ minHeight: '80vh', height: '80vh', maxHeight: '90vh' }}>
            {/* Chat Messages */}
            <div id="chat-messages-container" className="flex-1 overflow-y-auto pr-2 pb-32 pt-8 px-4" style={{ minHeight: '60vh', maxHeight: '72vh', color: 'white' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  {msg.sender === "user" ? (
                    <div className="bg-gray-700 text-white rounded-2xl px-6 py-3 max-w-xl shadow-md border border-gray-600">
                      <span className="font-bold text-lg">You</span>
                      <ReactMarkdown
                        className="whitespace-pre-wrap break-words overflow-hidden mt-1 text-base font-medium"
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="bg-gray-800 text-white rounded-2xl px-6 py-3 max-w-xl shadow-md border border-gray-700">
                      <span className="font-bold text-lg">Mentor.Ai</span>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="whitespace-pre-wrap prose dark:prose-invert break-words mt-1 text-base font-medium"
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-gray-200">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-bold text-gray-300">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold text-gray-400">{children}</h3>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-gray-200">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-gray-300">{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-base">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-1 text-gray-300 text-base">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="ml-0 text-gray-300 text-base">{children}</li>
                          ),
                          p: ({ children }) => (
                            <p className="text-gray-300 text-base">{children}</p>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-200 bg-gray-800 p-2 rounded-r-lg text-base">
                              {children}
                            </blockquote>
                          ),
                          code: ({ inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || "");
                            if (!inline && match) {
                              return (
                                <Highlight
                                  themes={themes.oneDark}
                                  code={String(children).replace(/\n$/, "")}
                                  language={match[1] || "plaintext"}
                                >
                                  {({
                                    className,
                                    style,
                                    tokens,
                                    getLineProps,
                                    getTokenProps,
                                  }) => (
                                    <pre
                                      className="p-3 rounded-lg shadow-lg text-sm bg-gray-900 text-gray-200"
                                      style={{
                                        ...style,
                                        fontSize: "0.9rem",
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      {tokens.map((line, i) => (
                                        <div key={i} {...getLineProps({ line })}>
                                          {line.map((token, key) => (
                                            <span
                                              key={key}
                                              {...getTokenProps({ token })}
                                            />
                                          ))}
                                        </div>
                                      ))}
                                    </pre>
                                  )}
                                </Highlight>
                              );
                            } else {
                              return (
                                <code
                                  className="bg-gray-900 text-gray-200 px-2 py-1 rounded break-all text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                          },
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
              {loadingResponse && (
                <div className="flex justify-center">
                  <Loader className="animate-spin w-6 h-6 text-gray-200" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input Panel at the bottom center inside chat box */}
            <div className="absolute left-0 right-0 bottom-0 flex justify-center pb-6">
              <div className="w-full max-w-2xl flex items-end gap-2 bg-[#23232b] rounded-xl shadow-lg border border-gray-800 px-4 py-3">
                <InputPanel
                  onSendMessage={handleSendMessage}
                  onTogglePlayground={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
                  inputClassName="h-10 text-base px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1 bg-gray-900 text-white placeholder-gray-400"
                />
                <button
                  onClick={handleDownloadPDF}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-700 font-semibold text-base transition-all"
                  style={{ minWidth: '110px' }}
                >
                  Get Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Playground Component */}
      <Playground
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />
    </div>
  );
};

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

export const ChatComp = ({ subject }) => {
  const [messages, setMessages] = useState([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [username, setUsername] = useState("User"); // Default username
  const cookieKey = `chat_${subject.toLowerCase().replace(/\s+/g, "_")}`;
  const [hasShownGreeting, setHasShownGreeting] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
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

  const systemPrompt = `You are an AI mentor specialized in ${subject}.  
        Your job is to assist students ONLY with questions related to ${subject}.  
        - If someone asks about another subject (e.g., Operating Systems when you're the Computer Networks bot), respond with:  
        *"I specialize in ${subject}. For {other subject}, please ask the respective mentor!"*  
        - If someone asks, "What subject bot are you?", reply:  
        *"I am your dedicated mentor for ${subject}. Ask me anything!"*  
        - Stay engaging, provide clear explanations, and ensure answers are strictly within ${subject}.`;

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col w-full mx-10 mb-40 mt-10 max-w-4xl">
        {/* Main Content */}
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender === "user" ? (
                <div className="flex ml-10">
                  <ReactMarkdown
                    className={`whitespace-pre-wrap break-words overflow-hidden 
                      p-3 rounded-xl mb-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white self-end ml-auto
                      inline-block max-w-2xl shadow-lg text-base`}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  <User className="mt-2 ml-2 bg-blue-500 text-white rounded-full min-h-7 min-w-7 p-1 shadow-md" />
                </div>
              ) : (
                <div className="flex">
                  <Bot className="mt-3 ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full min-h-7 min-w-7 p-1 shadow-md" />
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="whitespace-pre-wrap prose dark:prose-invert break-words p-4 max-w-3xl mb-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 self-start rounded-xl shadow-lg text-base"
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-purple-400">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-purple-300">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-bold text-purple-200">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-base font-semibold text-purple-100">
                          {children}
                        </h4>
                      ),
                      h5: ({ children }) => (
                        <h5 className="text-sm font-semibold text-purple-100">
                          {children}
                        </h5>
                      ),
                      h6: ({ children }) => (
                        <h6 className="text-sm font-semibold text-purple-100">
                          {children}
                        </h6>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-purple-300">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-purple-200">{children}</em>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-none pl-5 space-y-1 text-gray-200 text-base">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-none pl-5 space-y-1 text-gray-200 text-base">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="ml-0 text-gray-200 text-base">
                          {children}
                        </li>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-200 text-base">{children}</p>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-300 bg-gray-700/50 p-2 rounded-r-lg text-base">
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
                                  className="p-3 rounded-lg shadow-lg text-sm"
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
                              className="bg-gray-700 text-purple-300 px-2 py-1 rounded break-all text-sm"
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
              <Loader className="animate-spin w-6 h-6 text-purple-500" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Panel */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-start pb-4 bg-gradient-to-t from-gray-900 to-transparent pt-8">
        <div className="w-full max-w-4xl mx-10">
          <InputPanel
            onSendMessage={handleSendMessage}
            onTogglePlayground={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
          />
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

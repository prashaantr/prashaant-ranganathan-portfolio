"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // Use usePathname instead of useRouter
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

declare global {
  interface Window {
    gtag?: (event: string, action: string, params: object) => void;
  }
}

export default function AIChat() {
  const pathname = usePathname(); // Get current page path
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm your AI Chat Assistant. I can help answer questions about your previous projects and work. Feel free to ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [insights, setInsights] = useState({ prompts: [], mainPoints: [] });
  const [showPrompts, setShowPrompts] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);
  const [arePromptsLoading, setArePromptsLoading] = useState(false);
  const [shouldUpdatePrompts, setShouldUpdatePrompts] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(true);

  const promptColors = ["#24CB71", "#874FFF", "#FF3737", "#FF7237"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 500);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to fetch insights
  const fetchInsights = async () => {
    const pageKey = `insights-${pathname}`; // Unique key for each page
    const storedInsights = sessionStorage.getItem(pageKey);
    if (storedInsights) {
      setInsights(JSON.parse(storedInsights));
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    const pageContent = document.body.innerText || "";
    const resumeContent = await getResumeContent();
    const combinedContent = `${pageContent}\n\nThis is the resume context:\n${resumeContent}`;

    try {
      const response = await fetch("https://us-central1-prashaant-portfo.cloudfunctions.net/generateInsights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageContent: combinedContent }),
      });

      if (!response.ok) {
        console.error(`Error fetching insights: ${await response.text()}`);
        return;
      }

      const data = await response.json();
      console.log("Fetched insights data:", data);
      setInsights(data);
      sessionStorage.setItem(pageKey, JSON.stringify(data)); // Store insights with unique key
      setIsSummaryVisible(true);
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Trigger fetchInsights when the pathname changes
  useEffect(() => {
    setShouldUpdatePrompts(true); // Set flag to update prompts
  }, [pathname]); // Only depend on pathname

  useEffect(() => {
    if (shouldUpdatePrompts && !input.trim()) { // Ensure input is empty before fetching new prompts
      setShowPrompts(false); // Hide old prompts
      setArePromptsLoading(true); // Indicate loading of new prompts
      fetchInsights().then(() => {
        setArePromptsLoading(false); // Stop loading indicator once new prompts are fetched
        setShowPrompts(true); // Show new prompts
        setShouldUpdatePrompts(false); // Reset flag after updating prompts
      });
    }
  }, [shouldUpdatePrompts, input]); // Depend on shouldUpdatePrompts and input

  if (!isVisible) return null;

  const getResumeContent = async () => {
    try {
      const response = await fetch('/resume.txt');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching resume content:', error);
      return '';
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setShowPrompts(false);
    sendMessage(prompt);

    // Track prompt click event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'prompt_click', {
        event_category: 'Chat',
        event_label: prompt,
      });
    }
  };

  const sendMessage = async (message = input) => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setShowPrompts(false);
    setIsSummaryVisible(false);

    // Track send message event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'send_message', {
        event_category: 'Chat',
        event_label: 'User sent a message',
        value: message.length,
      });
    }

    const pageContent = document.body.innerText || "";
    const resumeContent = await getResumeContent();
    const combinedContent = `${pageContent}\n\nThis is the resume context:\n${resumeContent}`;

    try {
      const response = await fetch("https://us-central1-prashaant-portfo.cloudfunctions.net/openaiEndpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, pageContent: combinedContent }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        setMessages((prev) => [...prev, { role: "ai", content: "Error fetching response." }]);
        setLoading(false);
        setShowPrompts(true);
        return;
      }

      const decoder = new TextDecoder("utf-8");
      let aiMessage = "";

      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMessage += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = { role: "ai", content: aiMessage };
          return updatedMessages;
        });
      }

    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error fetching response." }]);
    } finally {
      setLoading(false);
      setShowPrompts(true);
    }
  };

  // Track summary visibility toggle
  const toggleSummaryVisibility = () => {
    setIsSummaryVisible(!isSummaryVisible);

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'toggle_summary', {
        event_category: 'UI Interaction',
        event_label: isSummaryVisible ? 'Minimize' : 'Expand',
      });
    }
  };

  // Track guide visibility toggle
  const toggleGuideVisibility = () => {
    setIsGuideVisible(!isGuideVisible);

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'toggle_guide', {
        event_category: 'UI Interaction',
        event_label: isGuideVisible ? 'Minimize' : 'Expand',
      });
    }
  };

  return (
    <div className="w-[30vw] min-w-[300px] p-5 bg-white text-gray-900 border-l border-gray-200 fixed right-0 top-24 bottom-0 rounded-tl-xl rounded-bl-xl flex flex-col">
      <div className="p-4 text-xl font-semibold bg-white border-b border-gray-200">
        TL;DR
      </div>

      {isFetching ? (
        <div className="flex justify-between items-center h-20 border border-gray-300 rounded-md p-4">
          <h2 className="text-base font-bold">Summary</h2>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-gray-300 rounded-md p-4 transition-all duration-700 ease-in-out"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold">Summary</h2>
            <button
              className="text-xs text-blue-500"
              onClick={toggleSummaryVisibility}
            >
              {isSummaryVisible ? "Minimize" : "Expand"}
            </button>
          </div>
          <div className={`overflow-hidden transition-max-height duration-700 ease-in-out ${isSummaryVisible ? 'max-h-screen' : 'max-h-0'}`}>
            {isSummaryVisible && (
              <ul className="mb-4 list-none pl-5">
                {insights.mainPoints.slice(0, 3).map((point, index) => (
                  <li key={index} className="p-2 text-gray-900 rounded-md shadow-sm text-sm flex items-center mb-2">
                    <span className="mr-3 text-lg">
                      {index === 0 ? '🚀' : index === 1 ? '💡' : '📈'}
                    </span>
                    <em>{point}</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              className={`flex items-start mb-2 ${msg.role === "user" ? 'justify-end' : 'justify-start'}`}>
              {msg.role === "ai" && <Sparkles size={18} className="text-yellow-500 mr-2" />}
              <div className={`relative p-3 rounded-lg max-w-[85%] ${msg.role === "user" ? 'bg-[#46509d] text-white' : 'bg-gray-200 text-gray-900'} shadow-sm`}>
                {msg.role === "ai" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {arePromptsLoading ? (
        <div className="flex justify-center items-center h-20">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      ) : (
        showPrompts && (
          <div className="mb-4 border border-gray-300 rounded-md p-4 transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] text-[#6600FF] font-semibold mb-2">Conversation Guide</h2>
              <button
                className="text-xs text-blue-500"
                onClick={toggleGuideVisibility}
              >
                {isGuideVisible ? "Minimize" : "Expand"}
              </button>
            </div>
            <div className={`overflow-hidden transition-max-height duration-700 ease-in-out ${isGuideVisible ? 'max-h-screen' : 'max-h-0'}`}>
              {isGuideVisible && (
                <div className="grid grid-cols-2 gap-2">
                  {insights.prompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-md text-sm cursor-pointer border font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105"
                      style={{
                        backgroundColor: "rgba(135, 79, 255, 0.05)",
                        color: "#6600FF",
                        borderColor: "#6600FF",
                      }}
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

      <div className="p-4 border-t border-gray-200 bg-white flex items-center">
        <input type="text" className="flex-1 p-2 border rounded-lg" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
        <Button className="ml-2 p-2 bg-[#46509d] text-white rounded-lg" onClick={() => sendMessage()} disabled={loading}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}

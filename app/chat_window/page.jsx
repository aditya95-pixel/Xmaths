"use client";
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ChatWindow() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);
  const showScrollToBottomRef = useRef(false);

  // Sync messages with the selected chat from context
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const threshold = 64;
        const distanceFromBottom =
          container.scrollHeight - (container.scrollTop + container.clientHeight);
        const atBottom = distanceFromBottom <= threshold;
        const nextShow = !atBottom;
        if (showScrollToBottomRef.current !== nextShow) {
          showScrollToBottomRef.current = nextShow;
          setShowScrollToBottom(nextShow);
        }
      });
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const threshold = 64;
    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);
    const atBottom = distanceFromBottom <= threshold;
    const nextShow = !atBottom;
    if (showScrollToBottomRef.current !== nextShow) {
      showScrollToBottomRef.current = nextShow;
      setShowScrollToBottom(nextShow);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Close sidebar when clicking the main workspace area
  const handleWorkspaceClick = () => {
    if (expand) {
      setExpand(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar expand={expand} setExpand={setExpand} />
      
      <div 
        onClick={handleWorkspaceClick}
        className="flex-1 flex flex-col items-center justify-center px-4 pb-8 dark:bg-black dark:text-white relative overflow-hidden"
      >
        
        {/* Mobile Header */}
        <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full z-10">
          <Image
            onClick={(e) => {
              e.stopPropagation(); // Prevents the workspace click from immediately closing the sidebar we just opened
              setExpand(!expand);
            }}
            className={`cursor-pointer ${expand ? "" : "rotate-180"}`}
            src={assets.menu_icon}
            alt="Menu"
          />
          <Image className="opacity-70" src={assets.chat_icon} alt="Chat" />
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 dark:bg-black px-4 py-6">
              <Image src={assets.logo_icon} alt="Logo" className="h-10" />
              <p className="text-2xl font-medium">
                Hello I am  
                <span className="text-red-600 font-extrabold tracking-wide text-3xl"> X</span>
                <span className="dark:text-white font-extrabold tracking-wide">MATHS</span>
              </p>
            </div>
            <p className="text-sm mt-2">Which problems can I solve today?</p>
          </div>
        ) : (
          <div 
            ref={containerRef} 
            className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
          >
            <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
              {selectedChat?.name || "New Chat"}
            </p>
            
            {messages.map((msg, index) => (
              <Message key={index} role={msg.role} content={msg.content} />
            ))}

            {isLoading && (
              <div className="flex gap-4 max-w-3xl w-full py-3">
                <Image 
                  className="h-9 w-9 p-1 border border-white/15 rounded-full"
                  src={assets.logo_icon} 
                  alt="logo"
                />
                <div className="loader flex justify-center items-center gap-1">
                  <div className="w-1 h-1 rounded-full dark:bg-white bg-black animate-bounce"></div>
                  <div className="w-1 h-1 rounded-full dark:bg-white bg-black animate-bounce [animation-delay:-.15s]"></div>
                  <div className="w-1 h-1 rounded-full dark:bg-white bg-black animate-bounce [animation-delay:-.3s]"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {showScrollToBottom && messages.length > 0 && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="absolute left-1/2 -translate-x-1/2 bottom-28 md:bottom-44 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-[#161a22] dark:text-white/80"
          >
            <span className="text-sm">↓</span>
          </button>
        )}

        {/* PromptBox wrapper to stop propagation and handle layout */}
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl flex justify-center">
             <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>
        
        <p className="text-xs absolute bottom-1 dark:text-gray-500">
          Developed by Problem Solvers Inc.
        </p>
      </div>
    </div>
  );
}
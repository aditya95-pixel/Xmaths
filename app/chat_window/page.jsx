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
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);

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

  return (
    <div className="flex h-screen">
      <Sidebar expand={expand} setExpand={setExpand} />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 dark:bg-black dark:text-white relative">
        
        {/* Mobile Header */}
        <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
          <Image
            onClick={() => setExpand(!expand)}
            className={`cursor-pointer ${expand ? "" : "rotate-180"}`}
            src={assets.menu_icon}
            alt="Menu"
          />
          <Image className="opacity-70" src={assets.chat_icon} alt="Chat" />
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 dark:bg-black px-4 py-2">
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

        <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
        
        <p className="text-xs absolute bottom-1 dark:text-gray-500">
          Developed by Problem Solvers Inc.
        </p>
      </div>
    </div>
  );
}
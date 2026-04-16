import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Mic, X, MoreVertical, Check, Paperclip, Printer } from 'lucide-react';

const PromptBox = ({ isLoading, setIsLoading, onPrintChat }) => {
  const MAX_TEXTAREA_ROWS = 8;
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const { user, chats, setChats, selectedChat, setSelectedChat, fetchUsersChats } = useAppContext();
  const timeouts = useRef([]);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const recognitionRef = useRef(
    SpeechRecognition ? new SpeechRecognition() : null
  );

  if (recognitionRef.current) {
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
  }

  const clearTypingTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';

    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
    const maxHeight = lineHeight * MAX_TEXTAREA_ROWS;
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    resizeTextarea();
  }, [prompt]);

  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return toast.error('Voice recognition not supported on this browser.');

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      toast.dismiss();
    } else {
      toast.loading('🎙 Listening...', { id: 'voice-toast' });
      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prev) => (prev ? prev + ' ' + transcript : transcript));
        toast.dismiss('voice-toast');
        toast.success('Voice captured');
        setIsRecording(false);
      };

      recognition.onerror = () => {
        toast.error('Voice recognition error');
        setIsRecording(false);
        toast.dismiss('voice-toast');
      };
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const handlePaste = (e) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (!imageItem) return;

    const file = imageItem.getAsFile();
    if (!file) return;

    const hasText = items.some((item) => item.type === 'text/plain');
    if (!hasText) e.preventDefault();

    setSelectedImage(file);
    toast.success('Image pasted');
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt && !selectedImage) return;

    if (!user) return toast.error('User not authenticated');
    if (isLoading) return toast.error('Wait for previous prompt response');

    const imageToSend = selectedImage;

    setIsLoading(true);
    setPrompt('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    clearTypingTimeouts();

    const userPrompt = {
      role: 'user',
      content: trimmedPrompt,
      image: imageToSend ? URL.createObjectURL(imageToSend) : null,
      timestamp: Date.now()
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === selectedChat._id
          ? { ...chat, messages: [...chat.messages, userPrompt] }
          : chat
      )
    );

    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userPrompt]
    }));

    try {
      const formData = new FormData();
      formData.append('chatId', selectedChat._id);
      formData.append('prompt', trimmedPrompt);
      if (imageToSend) formData.append('image', imageToSend);
      if (selectedDomain) formData.append('domain', selectedDomain);

      const { data } = await axios.post('/api/chat/ai', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        if(data.isFirstMessage){
          fetchUsersChats();
        }
        const assistantMessage = {
          role: 'system',
          content: data.data.content,
          timestamp: Date.now()
        };

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, assistantMessage] }
              : chat
          )
        );

        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage]
        }));
      } else {
        toast.error(data.message);
        setPrompt(trimmedPrompt);
        setSelectedImage(imageToSend);
      }
    } catch (error) {
      toast.error(error.message);
      setPrompt(trimmedPrompt);
      setSelectedImage(imageToSend);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePrint = () => {
    onPrintChat?.();
  };

  const hasContent = prompt.trim() || selectedImage;

  return (
  <form
    onSubmit={sendPrompt}
    className={`mx-auto w-full ${
      selectedChat?.messages.length > 0 ? 'max-w-4xl' : 'max-w-3xl'
    } relative overflow-visible rounded-[28px] border transition-all duration-300
      bg-white border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.12)]
      dark:bg-[#111318] dark:border-white/10 dark:shadow-[0_10px_35px_rgba(0,0,0,0.55)]`}
  >
    {/* top highlight */}
    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/10" />

    <div className="p-4 md:p-5">
      {/* Domain chip */}
      {selectedDomain && (
      <div className="mb-3 flex items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs md:text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <span className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400" />
          <span>{selectedDomain}</span>

          <button
            type="button"
            onClick={() => setSelectedDomain(null)}
            className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-red-500/80 transition hover:bg-red-200/60 hover:text-red-700 dark:text-red-300/80 dark:hover:bg-red-500/20 dark:hover:text-red-200"
            aria-label="Clear selected domain"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="w-full resize-none break-words bg-transparent outline-none text-sm md:text-base min-h-[24px] md:min-h-[28px] max-h-48 leading-6 text-gray-900 placeholder:text-gray-400 dark:text-white dark:placeholder:text-white/40"
        rows={1}
        placeholder="Ask XMaths anything... solve a problem, explain a concept or get help with your homework!"
        required={!selectedImage}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Image Preview */}
      {selectedImage && (
        <div className="relative mt-3 inline-block">
          <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-[#1a1d24]">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 rounded-full p-1.5 bg-black text-white border border-black/10 hover:bg-gray-900 transition dark:bg-black dark:border-white/10"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom toolbar */}
      <div className="mt-4 flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="h-10 w-10 rounded-full border flex items-center justify-center transition
              border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900
              dark:border-white/10 dark:bg-[#1a1d24] dark:text-white/80 dark:hover:bg-[#222630] dark:hover:text-white"
            aria-label="Print Full Chat"
          >
            <Printer size={18} />
          </button>
          {/* Image Upload */}
          <button
            type="button"
            onClick={handleFileClick}
            className="h-10 w-10 rounded-full border flex items-center justify-center transition
              border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900
              dark:border-white/10 dark:bg-[#1a1d24] dark:text-white/80 dark:hover:bg-[#222630] dark:hover:text-white"
            aria-label="Attach file"
          >
            <Paperclip size={18} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Voice Input */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`h-10 w-10 rounded-full border flex items-center justify-center transition ${
              isRecording
                ? 'bg-red-600 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)] text-white'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-white/10 dark:bg-[#1a1d24] dark:text-white/80 dark:hover:bg-[#222630] dark:hover:text-white'
            }`}
            aria-label="Voice input"
          >
            <Mic size={18} />
          </button>

          {/* Domain Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="h-10 w-10 rounded-full border flex items-center justify-center transition
                border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900
                dark:border-white/10 dark:bg-[#1a1d24] dark:text-white/80 dark:hover:bg-[#222630] dark:hover:text-white"
              aria-label="Select domain"
            >
              <MoreVertical size={18} />
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-14 left-0 z-50 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#151922]">
                <div className="px-4 py-3 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 dark:border-white/5 dark:text-white/40">
                  Select domain
                </div>

                <ul className="flex flex-col py-2">
                  {[
                    'Mathematics',
                    'Algorithms',
                    'Linear Algebra',
                    'Machine Learning',
                    'Deep Learning',
                  ].map((item) => (
                    <li
                      key={item}
                      className="px-4 py-3 cursor-pointer flex justify-between items-center text-sm transition
                        text-gray-700 hover:bg-gray-50
                        dark:text-white/85 dark:hover:bg-white/[0.04]"
                      onClick={() => {
                        setSelectedDomain(item);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>{item}</span>
                      {selectedDomain === item && (
                        <Check size={18} className="text-red-500 dark:text-red-400" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-200 ${
            hasContent
              ? 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600 shadow-[0_0_24px_rgba(239,68,68,0.25)] hover:scale-105'
              : 'bg-gray-100 border border-gray-200 opacity-80 dark:bg-[#1a1d24] dark:border-white/10 dark:opacity-80'
          }`}
          disabled={isLoading}
          aria-label="Send message"
        >
          <Image
            className="w-4 h-4"
            src={hasContent ? assets.arrow_icon : assets.arrow_icon_dull}
            alt="Send message"
          />
        </button>
      </div>
    </div>
  </form>
);}
export default PromptBox;

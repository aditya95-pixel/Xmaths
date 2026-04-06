import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Mic, X, MoreVertical, Check, Paperclip } from 'lucide-react';

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();
  const timeouts = useRef([]);
  const fileInputRef = useRef(null);

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

    setIsLoading(true);
    setPrompt('');
    clearTypingTimeouts();

    const userPrompt = {
      role: 'user',
      content: trimmedPrompt,
      image: selectedImage ? URL.createObjectURL(selectedImage) : null,
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
      if (selectedImage) formData.append('image', selectedImage);
      if (selectedDomain) formData.append('domain', selectedDomain);

      const { data } = await axios.post('/api/chat/ai', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
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
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  const hasContent = prompt.trim() || selectedImage;

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? 'max-w-4xl' : 'max-w-3xl'
      } relative rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)] transition-all duration-300 overflow-visible`}
    >
      {/* subtle top highlight */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="p-4 md:p-5">
        {/* Domain chip row (only show when selected) */}
        {selectedDomain && (
          <div className="mb-3 flex items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs md:text-sm text-red-200">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              {selectedDomain}
            </span>
          </div>
        )}

        {/* Textarea */}
        <textarea
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="w-full resize-none overflow-hidden break-words bg-transparent outline-none text-sm md:text-base text-white placeholder:text-white/45 min-h-[24px] md:min-h-[28px] leading-6"
          rows={1}
          placeholder="Ask XMaths anything... solve a problem, explain a concept, or generate a quiz"
          required={!selectedImage}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative mt-3 inline-block">
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-black/80 border border-white/10 rounded-full p-1.5 hover:bg-black transition"
              >
                <X size={14} color="white" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom toolbar */}
        <div className="mt-4 flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-2">
            {/* Image Upload */}
            <button
              type="button"
              onClick={handleFileClick}
              className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-white/80 hover:bg-white/[0.08] hover:text-white transition"
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
                  ? 'bg-red-600 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
                  : 'border-white/10 bg-white/[0.05] text-white/80 hover:bg-white/[0.08] hover:text-white'
              }`}
              aria-label="Voice input"
            >
              <Mic size={18} color="white" />
            </button>

            {/* Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] flex items-center justify-center transition"
                aria-label="Select domain"
              >
                <MoreVertical size={18} color="white" />
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-14 left-0 z-50 w-64 rounded-2xl border border-white/10 bg-[#111114]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5 text-xs uppercase tracking-wider text-white/40">
                    Select domain
                  </div>
                  <ul className="flex flex-col py-2">
                    {['Mathematics', 'Algorithms', 'Linear Algebra', 'Machine Learning', 'Deep Learning'].map((item) => (
                      <li
                        key={item}
                        className="px-4 py-3 hover:bg-white/[0.05] cursor-pointer flex justify-between items-center text-sm text-white/85 transition"
                        onClick={() => {
                          setSelectedDomain(item);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span>{item}</span>
                        {selectedDomain === item && (
                          <Check size={18} className="text-red-400" />
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
                : 'bg-white/[0.05] border border-white/10 opacity-70'
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
  );
};

export default PromptBox;
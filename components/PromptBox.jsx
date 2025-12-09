import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Mic, X, MoreVertical, Check } from 'lucide-react'; // Added Check icon

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

      recognition.onerror = (e) => {
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
    fileInputRef.current.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
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
          content: '',
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

        const messageTokens = data.data.content.split(' ');

        messageTokens.forEach((_, i) => {
          const timeout = setTimeout(() => {
            const updatedContent = messageTokens.slice(0, i + 1).join(' ');
            setSelectedChat((prev) => {
              const updatedMessages = [...prev.messages];
              updatedMessages[updatedMessages.length - 1] = {
                ...assistantMessage,
                content: updatedContent
              };
              return { ...prev, messages: updatedMessages };
            });
          }, i * 100);
          timeouts.current.push(timeout);
        });
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

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? 'max-w-3xl' : 'max-w-2xl'
      }  dark:bg-[#404045] bg-gray-200 p-4 rounded-3xl mt-4 transition-all relative`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message Xmaths"
        required={!selectedImage}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Image Preview */}
      {selectedImage && (
        <div className="relative mt-2 inline-block">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
          >
            <X size={16} color="white" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between text-sm mt-2 relative">
        <div className="flex items-center gap-2">
          {/* Image Upload */}
          <Image
            className="h-5 cursor-pointer"
            src={assets.pin_icon}
            alt="Attach file"
            onClick={handleFileClick}
          />
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
            className={`rounded-full p-2 cursor-pointer ${
              isRecording ? 'bg-red-600' : 'dark:bg-gray-500 bg-black'
            }`}
          >
            <Mic size={24} color="white" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            className={`${
              prompt.trim() || selectedImage ? 'bg-primary' : 'dark:bg-gray-500 bg-gray-200'
            } rounded-full p-2 cursor-pointer`}
            disabled={isLoading}
          >
            <Image
              className="w-3.5 aspect-square"
              src={
                prompt.trim() || selectedImage
                  ? assets.arrow_icon
                  : assets.arrow_icon_dull
              }
              alt="Send message"
            />
          </button>

          {/* Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="dark:bg-gray-600 bg-black hover:bg-gray-700 rounded-full p-2 ml-2 cursor-pointer"
            >
              <MoreVertical size={20} color="white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-12 right-0 dark:bg-[#2e2e32] bg-gray-200 dark:text-white rounded-lg shadow-lg w-56">
                <ul className="flex flex-col">
                  {['Mathematics', 'Algorithms', 'Linear Algebra', 'Machine Learning', 'Deep Learning'].map((item) => (
                    <li
                      key={item}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        setSelectedDomain(item);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>{item}</span>
                      {selectedDomain === item && (
                        <Check size={18} className="text-green-400" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
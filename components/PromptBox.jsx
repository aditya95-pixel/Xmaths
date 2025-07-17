import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();
  const timeouts = useRef([]);

  const SpeechRecognition = typeof window !== 'undefined' &&
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    if (!user) return toast.error('User not authenticated');
    if (isLoading) return toast.error('Wait for previous prompt response');

    setIsLoading(true);
    setPrompt('');
    clearTypingTimeouts();

    const userPrompt = {
      role: 'user',
      content: trimmedPrompt,
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
      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: trimmedPrompt
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
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? 'max-w-3xl' : 'max-w-2xl'
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message Xmaths"
        required
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex items-center justify-between text-sm mt-2">
        <div className="flex items-center gap-2">
          <Image
            className="h-5 cursor-pointer"
            src={assets.pin_icon}
            alt="Attach file"
          />
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`rounded-full p-2 cursor-pointer ${
              isRecording ? 'bg-red-600' : 'bg-gray-500'
            }`}
          >
            🎤
          </button>
          <button
            type="submit"
            className={`${
              prompt.trim() ? 'bg-primary' : 'bg-gray-500'
            } rounded-full p-2 cursor-pointer`}
            disabled={isLoading}
          >
            <Image
              className="w-3.5 aspect-square"
              src={
                prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull
              }
              alt="Send message"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;

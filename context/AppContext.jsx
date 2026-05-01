"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; 



export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppContextProvider = ({ children }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const router = useRouter();
    // --- NEW: Admin Logic ---
    // Safely checks if the metadata role is set to 'admin'
    const isAdmin = user?.publicMetadata?.role === 'admin';

    const isChatEmpty = (chat) => !chat?.messages || chat.messages.length === 0;
    const sortChatsByUpdatedAt = (chatList) =>
        [...chatList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const deleteChatById = async (chatId, token) => {
        if (!chatId) return;
        await axios.post(
            '/api/chat/delete',
            { chatId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };

    const cleanupEmptyChats = async (chatList, token, preserveChatId = null) => {
        const nonEmptyChats = chatList.filter((chat) => !isChatEmpty(chat));
        const emptyChats = chatList.filter(
            (chat) => isChatEmpty(chat) && chat._id !== preserveChatId
        );

        // Keep the preserved draft when provided; otherwise keep a single
        // draft only when it is the user's only chat.
        const chatsToDelete =
            nonEmptyChats.length > 0 ? emptyChats : emptyChats.slice(1);

        if (chatsToDelete.length === 0) {
            return chatList;
        }

        await Promise.all(
            chatsToDelete.map((chat) => deleteChatById(chat._id, token))
        );

        return chatList.filter(
            (chat) => !chatsToDelete.some((draft) => draft._id === chat._id)
        );
    };

    const selectChatById = async (chatId) => {
        const nextChat = chats.find((chat) => chat._id === chatId);
        if (!nextChat) return;

        if (selectedChat?._id !== chatId && isChatEmpty(selectedChat)) {
            try {
                const token = await getToken();
                await deleteChatById(selectedChat._id, token);
                setChats((prevChats) => prevChats.filter((chat) => chat._id !== selectedChat._id));
            } catch (error) {
                toast.error(error.message);
            }
        }

        setSelectedChat(nextChat);
    };

    const createNewChat = async () => {
        try {
            if (!user) return null;
            router.push('/chat_window');

            const tempChatId = `temp-${Date.now()}`;
            const optimisticChat = {
                _id: tempChatId,
                name: "New Chat",
                messages: [],
                userId: user.id,
                pending: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setIsCreatingChat(true);
            setChats((prevChats) => [
                optimisticChat,
                ...sortChatsByUpdatedAt(prevChats.filter((chat) => !isChatEmpty(chat)))
            ]);
            setSelectedChat(optimisticChat);

            const token = await getToken();
            const { data: existingChatsResponse } = await axios.get('/api/chat/get', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!existingChatsResponse.success) {
                throw new Error(existingChatsResponse.message || 'Failed to load chats');
            }

            const emptyChats = existingChatsResponse.data.filter((chat) => isChatEmpty(chat));

            if (emptyChats.length > 0) {
                await Promise.all(
                    emptyChats.map((chat) => deleteChatById(chat._id, token))
                );
            }

            const { data } = await axios.post(
                '/api/chat/create',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!data.success || !data.data) {
                throw new Error(data.message || 'Failed to create chat');
            }

            const newChat = data.data;
            setChats((prevChats) => [
                newChat,
                ...sortChatsByUpdatedAt(
                    prevChats.filter((chat) => chat._id !== tempChatId && !isChatEmpty(chat))
                )
            ]);
            setSelectedChat((prevSelectedChat) =>
                prevSelectedChat?._id === tempChatId ? newChat : prevSelectedChat
            );
            return newChat;
        } catch (error) {
            setChats((prevChats) => prevChats.filter((chat) => !String(chat._id).startsWith('temp-')));
            setSelectedChat((prevSelectedChat) =>
                String(prevSelectedChat?._id || '').startsWith('temp-') ? null : prevSelectedChat
            );
            toast.error(error.message);
        } finally {
            setIsCreatingChat(false);
        }
    }

    const fetchUsersChats = async (preserveChatId = null) => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/chat/get', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                const cleanedChats = await cleanupEmptyChats(data.data, token, preserveChatId);

                if (cleanedChats.length === 0) {
                    await createNewChat();
                } else {
                    const sortedChats = sortChatsByUpdatedAt(cleanedChats);
                    setChats(sortedChats);
                    const nextSelectedChat =
                        sortedChats.find((chat) => chat._id === preserveChatId) || sortedChats[0];
                    setSelectedChat(nextSelectedChat);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            fetchUsersChats();
        }
    }, [user]);

    const value = {
        user,
        isAdmin, // Expose this to the rest of the app
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        selectChatById,
        fetchUsersChats,
        createNewChat,
        isCreatingChat
    }
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

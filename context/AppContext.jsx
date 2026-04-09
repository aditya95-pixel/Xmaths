"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppContextProvider = ({ children }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    // Safely checks if the metadata role is set to 'admin'
    const isAdmin = user?.publicMetadata?.role === 'admin';

    const createNewChat = async () => {
        try {
            if (!user) return null;
            const token = await getToken();
            await axios.post('/api/chat/create', {}, { headers: { Authorization: `Bearer ${token}` } });
            
            // Added await so it finishes fetching before routing
            await fetchUsersChats(); 
            return true; // Return true to indicate successful creation
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    }

    const fetchUsersChats = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/chat/get', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                if (data.data.length === 0) {
                    await createNewChat();
                } else {
                    const sortedChats = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    setChats(sortedChats);
                    setSelectedChat(sortedChats[0]);
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
        isAdmin, 
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChats,
        createNewChat
    }
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
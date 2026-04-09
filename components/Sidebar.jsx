import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import { useClerk, UserButton, useAuth } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'
import { ModeToggle } from '@/toggle'
import ChatLabel from './ChatLabel'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import axios from 'axios'
import toast from 'react-hot-toast'

const Sidebar = ({ expand, setExpand }) => {
    const { openSignIn } = useClerk();
    const { getToken } = useAuth();
    const { 
        user, chats, setChats, createNewChat, 
        selectedChat, setSelectedChat, fetchUsersChats 
    } = useAppContext();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // Tracks which chat has the action menu or is being edited
    const [openMenu, setOpenMenu] = useState({ id: 0, open: false });
    const [editingChatId, setEditingChatId] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLight = mounted && resolvedTheme === 'light';

    // --- 1. AUTO-RENAME LOGIC ---
    useEffect(() => {
        const autoRename = async () => {
            if (selectedChat?.name === "New Chat" && selectedChat?.messages?.length > 0) {
                const firstUserMsg = selectedChat.messages.find(m => m.role === "user");
                if (firstUserMsg) {
                    let generatedName = firstUserMsg.content.substring(0, 32);
                    if (firstUserMsg.content.length > 32) generatedName += "...";
                    
                    try {
                        const token = await getToken();
                        await axios.post('/api/chat/rename', {
                            chatId: selectedChat._id,
                            name: generatedName
                        }, { headers: { Authorization: `Bearer ${token}` } });
                        
                        setChats(prev => prev.map(c => c._id === selectedChat._id ? { ...c, name: generatedName } : c));
                        setSelectedChat(prev => ({ ...prev, name: generatedName }));
                    } catch (error) {
                        console.error("Auto-rename failed", error);
                    }
                }
            }
        };
        autoRename();
    }, [selectedChat?.messages, selectedChat?._id, getToken, setChats, setSelectedChat]);

    // --- 2. DELETE LOGIC ---
    const handleDeleteChat = async (chatId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
        if (!confirmDelete) return;

        try {
            const token = await getToken();
            await axios.post('/api/chat/delete', { chatId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Chat deleted");
            fetchUsersChats(); 
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    };

    // --- HELPER STYLES ---
    const getNavButtonStyle = (isExpand) => `
        flex items-center justify-center cursor-pointer mb-2.5 transition-all duration-300 border
        ${isExpand ?
            "bg-neutral-100 dark:bg-[#0a0000] hover:bg-red-50 dark:hover:bg-red-950/40 border-neutral-200 dark:border-red-900/60 hover:border-red-700/80 rounded-xl gap-3 p-3 w-full shadow-sm" :
            "group relative h-10 w-10 mx-auto bg-neutral-100 dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-950/30 border-neutral-200 dark:border-red-900/40 hover:border-red-700 rounded-lg"
        }`;

    const navTooltipStyle = 'absolute w-max left-14 opacity-0 group-hover:opacity-100 transition bg-white dark:bg-[#0a0000] text-neutral-800 dark:text-red-100 text-xs font-mono tracking-tight px-3.5 py-2 rounded border border-neutral-200 dark:border-red-900/80 shadow-md pointer-events-none z-50';

    return (
        <div className={`
            flex flex-col h-screen sticky top-0
            bg-white dark:bg-[#050505] pt-7 transition-all
            z-50 max-md:absolute max-md:h-screen 
            ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}
            border-r border-neutral-200 dark:border-red-950/30
        `}>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                
                {/* Logo & Toggle */}
                <div className={`flex ${expand ? 'flex-row gap-10 mb-5' : 'flex-col items-center gap-8 mb-5'}`}>
                    <Image 
                        className={`${expand ? 'w-36' : 'w-10'} dark:filter dark:hue-rotate-[340deg] dark:saturate-200`} 
                        src={expand ? (isLight ? assets.logo_text_light : assets.logo_text) : assets.logo_icon} 
                        alt="Logo" 
                    />
                    <div 
                        onClick={() => setExpand(!expand)} 
                        className='group relative flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-red-950/30 transition-all h-9 w-9 rounded-lg cursor-pointer border border-neutral-200 dark:border-red-900/40'
                    >
                        <Image src={assets.menu_icon} alt="" className='md:hidden dark:filter dark:hue-rotate-[340deg]' />
                        <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt="" className='hidden md:block w-7 dark:filter dark:hue-rotate-[340deg]' />
                        <div className={navTooltipStyle.replace('left-14', 'left-10')}>
                            {expand ? 'Close' : 'Open'}
                        </div>
                    </div>
                </div>

                {/* Profile & Theme */}
                <div className={`flex items-center mt-5 mb-5 ${expand ? 'justify-between' : 'justify-center'} px-1`}>
                    <div onClick={user ? null : openSignIn} className={`flex items-center gap-3 text-neutral-700 dark:text-red-100 text-sm p-2 cursor-pointer ${expand ? 'hover:bg-neutral-100 dark:hover:bg-red-950/30 rounded-lg w-full' : ''}`}>
                        {user ? <UserButton /> : <Image src={assets.profile_icon} alt="" className='w-6 dark:filter dark:hue-rotate-[340deg]' />}
                        {expand && <span className="font-medium">My Profile</span>}
                    </div>
                    {expand && <div className="scale-90 dark:filter dark:hue-rotate-[340deg]"><ModeToggle /></div>}
                </div>

                {/* New Chat Button */}
                <button onClick={createNewChat} className={`${getNavButtonStyle(expand)} border-red-200 dark:border-red-600/50 bg-red-50 dark:bg-red-950/20 mt-4`}>
                    <Image className={`${expand ? 'w-6' : 'w-7'} dark:filter dark:hue-rotate-[340deg]`} src={expand ? assets.chat_icon : assets.chat_icon_dull} alt="" />
                    {!expand && <div className={navTooltipStyle}>New Chat</div>}
                    {expand && <p className='text-red-700 dark:text-red-50 font-bold flex-1 text-left'>New chat</p>}
                </button>

                {/* Recents Section */}
                <div className={`mt-9 ${expand ? "block" : "hidden"} px-1`}>
                    <p className='text-red-600 dark:text-red-500 font-mono text-xs uppercase tracking-widest mb-3'>Recents</p>
                    <div className="space-y-1 max-h-[40vh] overflow-y-auto overflow-x-visible pr-4 custom-scrollbar">
                        {chats.map((chat, index) => (
                            <ChatLabel 
                                key={chat._id || index} 
                                name={chat.name} 
                                id={chat._id} 
                                isSelected={selectedChat?._id === chat._id}
                                openMenu={openMenu} 
                                setOpenMenu={setOpenMenu}
                                editingChatId={editingChatId}
                                setEditingChatId={setEditingChatId}
                                onDelete={() => handleDeleteChat(chat._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
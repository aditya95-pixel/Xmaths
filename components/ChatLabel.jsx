import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import Image from 'next/image'
import React from 'react'
import toast from 'react-hot-toast'

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
    const { fetchUsersChats, selectChatById, selectedChat } = useAppContext();

    const isSelected = selectedChat?._id === id;

    const selectChat = () => {
        selectChatById(id);
    }

    const renameHandler = async (e) => {
        e.stopPropagation();
        try {
            const newName = prompt('Enter new name', name);
            if (!newName || newName === name) return;
            
            const { data } = await axios.post('/api/chat/rename', { chatId: id, name: newName });
            if (data.success) {
                fetchUsersChats();
                setOpenMenu({ id: 0, open: false });
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const deleteHandler = async (e) => {
        e.stopPropagation();
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
            if (!confirmDelete) return;

            const { data } = await axios.post('/api/chat/delete', { chatId: id });
            if (data.success) {
                fetchUsersChats();
                setOpenMenu({ id: 0, open: false });
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div 
            onClick={selectChat} 
            className={`flex items-center justify-between p-2 rounded-lg text-sm group cursor-pointer transition-all duration-200
            ${isSelected 
                ? 'bg-red-100 dark:bg-red-950/30 text-red-900 dark:text-red-100 shadow-sm' 
                : 'text-neutral-700 dark:text-white/80 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
            }`}
        >
            <p className="truncate flex-1 pr-2 font-medium">
                {name}
            </p>

            <div 
                onClick={e => {
                    e.stopPropagation();
                    setOpenMenu({ id: id, open: openMenu.id === id ? !openMenu.open : true });
                }}
                className={`relative flex items-center justify-center h-7 w-7 aspect-square rounded-md transition-colors
                ${openMenu.id === id && openMenu.open ? 'bg-neutral-200 dark:bg-white/10' : 'hover:bg-neutral-200 dark:hover:bg-white/10'}`}
            >
                {/* Dots Icon - Visible on hover or when menu is open */}
                <Image 
                    src={assets.three_dots} 
                    alt="Options" 
                    className={`w-4 transition-opacity dark:filter dark:invert
                    ${openMenu.id === id && openMenu.open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />

                {/* Dropdown Menu */}
                <div className={`
                    absolute top-full -translate-x-7 z-[60] w-32 p-1.5 mt-1
                    bg-white dark:bg-[#0a0000] 
                    border border-neutral-200 dark:border-red-900/40 
                    rounded-xl shadow-xl dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]
                    ${openMenu.id === id && openMenu.open ? 'block' : 'hidden'}
                `}>
                    <div 
                        onClick={renameHandler} 
                        className='flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-red-950/40 px-3 py-2 rounded-lg text-neutral-700 dark:text-red-100 transition-colors'
                    >
                        <Image src={assets.pencil_icon} alt="" className='w-3.5 dark:filter dark:invert'/>
                        <span className="text-xs font-medium">Rename</span>
                    </div>
                    
                    <div 
                        onClick={deleteHandler} 
                        className='flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-900/40 px-3 py-2 rounded-lg text-red-600 dark:text-red-500 transition-colors'
                    >
                        <Image src={assets.delete_icon} alt="" className='w-3.5 filter sepia saturate-[1000%] hue-rotate-[-50deg]'/>
                        <span className="text-xs font-medium">Delete</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatLabel

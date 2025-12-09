import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'
import { ModeToggle } from '@/toggle'
import ChatLabel from './ChatLabel'

const Sidebar = ({expand,setExpand}) => {
    const  {openSignIn}=useClerk();
    const {user,chats,createNewChat}=useAppContext();
    const [openMenu,setOpenMenu]=useState({id:0,open:false});

  return (
    <div className={`flex flex-col justify-between dark:bg-[#212327] bg-gray-300 pt-7 transition-all
    z-50 max-md:absolute max-md:h-screen ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}>
        <div>
            <div className={`flex ${expand ? 'flex-row gap-10 mb-5' : 'flex-col items-center gap-8 mb-5'}`}>
                <Image  className={expand ? 'w-36' : 'w-10' } src={expand ? assets.logo_text : assets.logo_icon} alt=""/>
                <div onClick={()=> expand ? setExpand(false) : setExpand(true)} className='group relative flex items-center justify-center
                hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
                    <Image src={assets.menu_icon} alt="" className='md:hidden'/>
                    <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt="" className='hidden md:block w-7'/>
                    <div className={`absolute w-max ${expand ? 'left-1/2 -translate-x-1/2 top-12' : '-top-12 left-0' } opacity-0 group-hover:opacity-100 transition  dark:bg-black dark:text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}>
                        {expand ? 'Close sidebar' : 'Open sidebar'}
                        <div className={`w-3 h-3 absolute rotate-45 ${expand ? 'left-1/2 top-1.5 -translate-x-1/2' : 'left-4 -bottom-1.5'}`}></div>
                    </div>
                </div>
            </div>
            <div className='ml-4.5'>
                <ModeToggle></ModeToggle>
            </div>
            <button onClick={createNewChat} className={`mt-8 flex items-center justify-center cursor-pointer
                ${expand ? "dark:bg-black bg-gray-400 hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max" : 
                    "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"
                }`}>
                <Image className={expand ? 'w-6' : 'w-7'}src={expand ? assets.chat_icon : assets.chat_icon_dull} alt=""/>
                <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition dark:bg-black dark:text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
                    New chat 
                    <div className='w-3 h-3 absolute dark:bg-black rotate-45 left-4 -bottom-1.5'></div>
                </div>
                {expand && <p className='dark:text-white text font-medium'>New chat</p>}
            </button>
            <div className={`mt-8 dark:text-white/100 text-sm ${expand ? "block":"hidden"}`}>
                <p className='my-1'>Recents</p>
                {chats.map((chat,index)=><ChatLabel key={index} name={chat.name} id={chat._id} openMenu={openMenu} setOpenMenu={setOpenMenu}/>)}
            </div>
            <div onClick={user ? null : openSignIn}
            className={`flex items-center ${expand ? 'hover:bg-white/10 rounded-lg mt-105': 'justify-center w-full mt-105'} gap-3 dark:text-white/100 text-sm p-2 cursor-pointer`}>
                { user ?  <UserButton/> : <Image src={assets.profile_icon} alt="" className='w-7'/>}
                {expand && <span>My Profile</span>}
            </div>
        </div>
    </div>
  )
}

export default Sidebar
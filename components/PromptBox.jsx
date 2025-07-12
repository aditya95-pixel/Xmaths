import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'

const PromptBox = ({isLoading,setIsLoading}) => {
    const [prompt,setPrompt]=useState('');
  return (
    <form className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"}
    bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
        <textarea
        className='outline-none w-full resize-none overflow-hidden
        break-words bg-transparent'
        rows={2}
        placeholder='Message Xmaths' required
        onChange={(e)=>setPrompt(e.target.value)} value={prompt}/>
        <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2'>
                <Image className="h-5 cursor-pointer" src={assets.pin_icon} alt=""/>
                <button className={`${prompt ? "bg-primary" : "bg-gray-500"} rounded-full p-2 cursor-pointer`}>
                    <Image className="w-3.5 aspect-square" src={ prompt? assets.arrow_icon : assets.arrow_icon_dull} alt=""/>
                </button>
            </div>
        </div>
    </form>
  )
}

export default PromptBox
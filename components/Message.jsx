import React, { useEffect } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
// 1. Import remarkGfm
import remarkGfm from 'remark-gfm' 
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import Prism from 'prismjs';
import toast from 'react-hot-toast'
import Mermaid from './Mermaid'

const Message = ({role,content}) => {
    useEffect(()=>{
        Prism.highlightAll()
    },[content])

    const copyMessage=()=>{
        navigator.clipboard.writeText(content)
        toast.success("Message copied to clipboard")
    }
  return (
    <div className='flex flex-col items-center w-full max-w-6xl text-base'>
        <div className={`flex flex-col w-full mb-8 ${role==='user' && 'items-end'}`}>
            <div className={`group relative flex max-w-full py-3 rounded-xl
                ${role==='user' ? 'dark:bg-[#414158] bg-gray-300 px-5' : 'gap-3'}`}>
                    <div className={`opacity-0 group-hover:opacity-100 absolute
                    ${role=='user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'} transition-all`}>
                        <div className='flex items-center gap-2 opacity-70'>
                            {
                                role === 'user' ? (
                                    <>
                                        <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4 cursor-pointer'/>
                                        <Image src={assets.pencil_icon} alt='' className='w-4.5 cursor-pointer'/>
                                    </>
                                ):(
                                    <>
                                        <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4.5 cursor-pointer'/>
                                        <Image src={assets.regenerate_icon} alt='' className='w-4 cursor-pointer'/>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    { 
                        role === 'user' ? 
                        (
                            <span className='dark:text-white/90 leading-relaxed'>{content}</span>
                        )
                        :
                        (
                            <>
                                <Image src={assets.logo_icon} alt='' className='h-9 w-9 p-1
                                border border-white/15 rounded-full'/>
                                <div className='space-y-4 w-full overflow-scroll'>
                                    <div className="prose prose-invert max-w-none leading-relaxed">
                                    <ReactMarkdown
                                        children={content}
                                        // 2. Add remarkGfm to the plugins array
                                        remarkPlugins={[remarkMath, remarkGfm]} 
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            p: ({node, ...props}) => <p className="mb-4" {...props} />,
                                            li: ({node, ...props}) => <li className="mb-2" {...props} />,
                                            
                                            // Optional: Add table styling for Tailwind Typography (prose)
                                            table: ({node, ...props}) => <table className="table-auto border-collapse border border-gray-400 w-full my-4" {...props} />,
                                            th: ({node, ...props}) => <th className="border border-gray-500 px-4 py-2 bg-gray-800 text-left" {...props} />,
                                            td: ({node, ...props}) => <td className="border border-gray-600 px-4 py-2" {...props} />,

                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                const codeValue = String(children).replace(/\n$/, '');

                                                if (!inline && match && match[1] === 'mermaid') {
                                                    return <Mermaid chart={codeValue} />;
                                                }

                                                return (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }
                                        }}
                                    />
                                    </div>
                                </div>
                            </>
                        )
                    }
            </div>
        </div>
    </div>
  )
}

export default Message
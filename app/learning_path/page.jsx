import React from 'react'
import Link from 'next/link'
import { assets } from '@/assets/assets'
import Image from 'next/image'

const paths = [
  {
    title: "Mathematics",
    description: "Calculus, Linear Algebra, and Probability for AI.",
    icon: assets.math_icon,
    link: "/learning_path/math",
    glowColor: "group-hover:shadow-blue-500/40",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400"
  },
  {
    title: "Data Structures",
    description: "Master Arrays, Linked Lists, Trees, and Graphs.",
    icon: assets.ds_icon,
    link: "/learning_path/data-structures",
    glowColor: "group-hover:shadow-emerald-500/40",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400"
  },
  {
    title: "Algorithms",
    description: "Sorting, Searching, and Dynamic Programming.",
    icon: assets.algo_icon,
    link: "/learning_path/algorithms",
    glowColor: "group-hover:shadow-purple-500/40",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-400"
  },
  {
    title: "Machine Learning",
    description: "Regression, Classification, and Scikit-Learn.",
    icon: assets.ml_icon,
    link: "/learning_path/machine-learning",
    glowColor: "group-hover:shadow-orange-500/40",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-400"
  },
  {
    title: "Deep Learning",
    description: "Neural Networks, CNNs, and Transformers.",
    icon: assets.dl_icon,
    link: "/learning_path/deep-learning",
    glowColor: "group-hover:shadow-cyan-500/40",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-400"
  }
]

const LearningPath = () => {
  return (
    <div className="relative min-h-screen p-8 ml-0 md:ml-20 overflow-hidden bg-[#0a0a0a] transition-all selection:bg-cyan-500/30">
      
      {/* Futuristic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 [background-image:radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Path</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-400 font-light leading-relaxed">
            Navigate the architectural foundations of maths and computer science through our specialized modules.
          </p>
        </header>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <Link href={path.link} key={index} className="group">
              <div className={`relative h-72 p-8 border rounded-[2rem] flex flex-col justify-between 
                transition-all duration-500 ease-out 
                bg-white/5 backdrop-blur-xl ${path.borderColor}
                hover:bg-white/[0.08] hover:-translate-y-2 
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${path.glowColor}`}>
                
                {/* Decorative corner accent */}
                <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${path.textColor} shadow-[0_0_10px_currentColor] opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="space-y-6">
                  <div className="relative w-fit">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner">
                      <Image 
                        src={path.icon || assets.chat_icon} 
                        alt={path.title} 
                        className="w-10 h-10 brightness-110" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {path.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                      {path.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                    Initialize Module
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <span className="text-xl transform group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LearningPath
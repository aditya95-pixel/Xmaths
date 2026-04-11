"use client";

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
// Import specific topic icons from Lucide React
import { Calculator, Network, GitGraph, Sparkles, Brain } from 'lucide-react'

const paths = [
  {
    title: "Mathematics",
    description: "Calculus, Linear Algebra, and Probability for AI.",
    icon: Calculator, // Beautiful math/calculation icon
    link: "/learning_path/math",
    glowColor: "group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-500/40",
    borderColor: "border-blue-500/20 dark:border-blue-500/30",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "Data Structures",
    description: "Master Arrays, Linked Lists, Trees, and Graphs.",
    icon: Network, // Perfect for nodes, trees, and graphs
    link: "/learning_path/data-structures",
    glowColor: "group-hover:shadow-emerald-500/20 dark:group-hover:shadow-emerald-500/40",
    borderColor: "border-emerald-500/20 dark:border-emerald-500/30",
    textColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Algorithms",
    description: "Sorting, Searching, and Dynamic Programming.",
    icon: GitGraph, // Represents branching paths and logic
    link: "/learning_path/algorithms",
    glowColor: "group-hover:shadow-purple-500/20 dark:group-hover:shadow-purple-500/40",
    borderColor: "border-purple-500/20 dark:border-purple-500/30",
    textColor: "text-purple-600 dark:text-purple-400"
  },
  {
    title: "Machine Learning",
    description: "Regression, Classification, and Scikit-Learn.",
    icon: Sparkles, // AI/Magic generation icon
    link: "/learning_path/machine-learning",
    glowColor: "group-hover:shadow-orange-500/20 dark:group-hover:shadow-orange-500/40",
    borderColor: "border-orange-500/20 dark:border-orange-500/30",
    textColor: "text-orange-600 dark:text-orange-400"
  },
  {
    title: "Deep Learning",
    description: "Neural Networks, CNNs, and Transformers.",
    icon: Brain, // Literal brain for neural networks
    link: "/learning_path/deep-learning",
    glowColor: "group-hover:shadow-cyan-500/20 dark:group-hover:shadow-cyan-500/40",
    borderColor: "border-cyan-500/20 dark:border-cyan-500/30",
    textColor: "text-cyan-600 dark:text-cyan-400"
  }
]

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
}

const LearningPath = () => {
  return (
    <div className="relative min-h-screen p-8 ml-0 md:ml-20 overflow-hidden bg-slate-50 dark:bg-[#0a0a0a] transition-all selection:bg-cyan-500/30">
      
      {/* Animated Futuristic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, -20, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/30 dark:bg-purple-600/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -60, 40, 0], y: [0, 50, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 dark:bg-blue-600/10 blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 dark:opacity-20 [background-image:radial-gradient(#0000001a_1px,transparent_1px)] dark:[background-image:radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">Path</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-600 dark:text-gray-400 font-light leading-relaxed">
            Navigate the architectural foundations of maths and computer science through our specialized modules.
          </p>
        </motion.header>

        {/* The Animated Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {paths.map((path, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={path.link} className="group block h-full">
                <div className={`relative h-72 p-8 border rounded-[2rem] flex flex-col justify-between 
                  transition-all duration-500 ease-out 
                  bg-white/40 dark:bg-white/5 backdrop-blur-2xl ${path.borderColor}
                  hover:bg-white/80 dark:hover:bg-white/[0.08] hover:-translate-y-2 
                  hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${path.glowColor}`}>
                  
                  {/* Decorative corner accent */}
                  <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${path.textColor} shadow-[0_0_10px_currentColor] opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className="space-y-6">
                    <div className="relative w-fit">
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-white/80 to-transparent dark:from-white/10 dark:to-white/5 border border-black/5 dark:border-white/10 shadow-sm dark:shadow-inner flex items-center justify-center">
                        {/* Rendering the Lucide Component directly */}
                        <path.icon strokeWidth={1.5} className={`w-8 h-8 ${path.textColor} drop-shadow-md`} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {path.title}
                      </h2>
                      <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm group-hover:text-slate-900 dark:group-hover:text-gray-300 transition-colors">
                        {path.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      Initialize Module
                    </span>
                    <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-300">
                      <span className="text-xl transform group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LearningPath
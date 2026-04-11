"use client";

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
// Import specific topic icons from Lucide React
import { Calculator, Network, GitGraph, Sparkles, Brain } from 'lucide-react'

const paths = [
  {
    title: "Mathematics",
    description: "Calculus, Linear Algebra, and Probability.",
    icon: Calculator,
    link: "/take_quiz/math",
    color: "bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "Data Structures",
    description: "Master Arrays, Linked Lists, Trees, and Graphs.",
    icon: Network,
    link: "/take_quiz/data-structures",
    color: "bg-green-50/50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20",
    iconColor: "text-green-600 dark:text-green-400"
  },
  {
    title: "Algorithms",
    description: "Sorting, Searching, and Dynamic Programming.",
    icon: GitGraph,
    link: "/take_quiz/algorithms",
    color: "bg-purple-50/50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  {
    title: "Machine Learning",
    description: "Regression, Classification, and Scikit-Learn.",
    icon: Sparkles,
    link: "/take_quiz/machine-learning",
    color: "bg-orange-50/50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400"
  },
  {
    title: "Deep Learning",
    description: "Neural Networks, CNNs, and Transformers.",
    icon: Brain,
    link: "/take_quiz/deep-learning",
    color: "bg-red-50/50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
    iconColor: "text-red-600 dark:text-red-400"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
}

const TakeQuiz = () => {
  return (
    <div className="relative min-h-screen p-8 ml-0 md:ml-20 overflow-hidden bg-slate-50 dark:bg-[#171717] transition-colors duration-500">
      
      {/* Animated Background Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-200/40 dark:bg-emerald-600/10 blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], x: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-200/40 dark:bg-cyan-600/10 blur-[140px]" 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors">Take A quiz</h1>
          <p className="mt-2 text-slate-500 dark:text-gray-400 transition-colors">Select a module to assess yourself.</p>
        </motion.header>

        {/* The Animated Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paths.map((path, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Link href={path.link} className="block h-full">
                <motion.div 
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group p-8 h-64 border-2 rounded-3xl flex flex-col justify-between 
                    transition-colors duration-300 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none dark:hover:shadow-xl cursor-pointer
                    ${path.color} bg-white/60 hover:bg-white dark:bg-transparent dark:hover:bg-white/5 backdrop-blur-sm`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="p-3 w-fit rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-slate-100 dark:border-transparent transition-colors flex items-center justify-center">
                      {/* Rendering the Lucide Component directly */}
                      <path.icon strokeWidth={1.5} className={`w-7 h-7 ${path.iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white transition-colors">
                      {path.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-gray-400 transition-colors">
                      {path.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white transition-colors">
                    Get Started 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default TakeQuiz
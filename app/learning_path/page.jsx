import React from 'react'
import Link from 'next/link'
import { assets } from '@/assets/assets'
import Image from 'next/image'

const paths = [
  {
    title: "Mathematics",
    description: "Calculus, Linear Algebra, and Probability for AI.",
    icon: assets.math_icon, // Ensure these exist in your assets
    link: "/learning_path/math",
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    title: "Data Structures",
    description: "Master Arrays, Linked Lists, Trees, and Graphs.",
    icon: assets.ds_icon,
    link: "/learning_path/data-structures",
    color: "bg-green-500/10 border-green-500/20"
  },
  {
    title: "Algorithms",
    description: "Sorting, Searching, and Dynamic Programming.",
    icon: assets.algo_icon,
    link: "/learning_path/algorithms",
    color: "bg-purple-500/10 border-purple-500/20"
  },
  {
    title: "Machine Learning",
    description: "Regression, Classification, and Scikit-Learn.",
    icon: assets.ml_icon,
    link: "/learning_path/machine-learning",
    color: "bg-orange-500/10 border-orange-500/20"
  },
  {
    title: "Deep Learning",
    description: "Neural Networks, CNNs, and Transformers.",
    icon: assets.dl_icon,
    link: "/learning_path/deep-learning",
    color: "bg-red-500/10 border-red-500/20"
  }
]

const LearningPath = () => {
  return (
    <div className="min-h-screen p-8 ml-0 md:ml-20 dark:bg-[#171717] bg-gray-50 transition-all">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold dark:text-white text-gray-800">Learning Path</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Select a module to start your journey.</p>
        </header>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path, index) => (
            <Link href={path.link} key={index}>
              <div className={`group p-8 h-64 border-2 rounded-3xl flex flex-col justify-between 
                transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer
                ${path.color} dark:hover:bg-white/5 hover:bg-white`}>
                
                <div className="flex flex-col gap-4">
                  <div className="p-3 w-fit rounded-xl bg-white dark:bg-zinc-800 shadow-sm">
                    <Image src={path.icon || assets.chat_icon} alt={path.title} className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-semibold dark:text-white text-gray-800">
                    {path.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {path.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium dark:text-white">
                  Get Started 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
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
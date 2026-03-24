"use client"
import React, { useEffect, useState } from 'react'

export default function DeepLearningPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetching data for the deep-learning category
        const response = await fetch('/api/resources?category=deep-learning');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching Deep Learning resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="p-10 dark:text-white">
      {/* Header with Pulse Effect */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-600 shadow-lg shadow-red-900/40"></span>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Deep Learning & Neural Networks</h1>
          <p className="text-gray-400 mt-1">Exploring Transformers, CNNs, and Generative AI.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-10">
          <div className="w-6 h-6 border-t-2 border-red-500 rounded-full animate-spin"></div>
          <p className="text-red-400 font-medium">Initializing Neural Networks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource) => (
            <div 
              key={resource._id} 
              className="group flex flex-col justify-between p-8 bg-zinc-900/40 border border-red-500/20 rounded-[2rem] hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/5"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                  {resource.topicName}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {resource.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 px-5 py-3 rounded-xl text-sm font-semibold transition-all group/btn"
                  >
                    <span className="flex items-center gap-2">
                      {link.type === 'video' ? '📽️' : '🧠'}
                      {link.title}
                    </span>
                    <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">→</span>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {!loading && resources.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-[2rem]">
              <p className="text-gray-500">The Neural Network is empty.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
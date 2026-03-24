"use client"
import React, { useEffect, useState } from 'react'

export default function MachineLearningPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetching data for the machine-learning category
        const response = await fetch('/api/resources?category=machine-learning');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching ML resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="p-10 dark:text-white">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold">Machine Learning</h1>
        <p className="mt-2 text-gray-400">From Linear Regression to advanced Ensemble methods.</p>
      </header>

      {loading ? (
        <div className="flex justify-center md:justify-start items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-orange-400 font-medium">Loading ML Modules...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {resources.map((resource) => (
            <div 
              key={resource._id} 
              className="group p-8 bg-orange-500/5 border border-orange-500/20 rounded-3xl hover:bg-orange-500/10 transition-all duration-300 shadow-sm hover:shadow-orange-500/5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
                    Module
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {resource.topicName}
                  </h2>
                  <p className="text-gray-400 leading-relaxed max-w-2xl">
                    {resource.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {resource.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white dark:bg-orange-600 dark:hover:bg-orange-500 text-black dark:text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/10"
                    >
                      <span>{link.type === 'video' ? '🎬' : '📘'}</span>
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {!loading && resources.length === 0 && (
            <div className="max-w-2xl mx-auto py-20 border-2 border-dashed border-orange-500/20 rounded-3xl text-center">
              <p className="text-gray-500 font-medium">No Machine Learning resources found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
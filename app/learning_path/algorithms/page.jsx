"use client"
import React, { useEffect, useState } from 'react'

export default function AlgorithmsPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetching data specifically for the algorithms category
        const response = await fetch('/api/resources?category=algorithms');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching algorithms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="p-10 dark:text-white">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Algorithm Design</h1>
        <p className="mt-2 text-gray-400">Master problem-solving techniques and efficiency.</p>
      </header>

      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-purple-400">Loading algorithms...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {resources.map((resource) => (
            <div 
              key={resource._id} 
              className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-purple-500/15 transition-all"
            >
              <div>
                <h2 className="text-xl font-semibold text-purple-300">{resource.topicName}</h2>
                <p className="text-sm text-gray-400 mt-1 max-w-xl">{resource.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {resource.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/20"
                  >
                    <span>{link.type === 'video' ? '▶' : '📄'}</span>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {!loading && resources.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
              <p className="text-gray-500 italic">Algorithm database is currently empty.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
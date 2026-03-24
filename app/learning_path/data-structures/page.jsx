"use client" // Required for fetching data on the client side
import React, { useEffect, useState } from 'react'

export default function DataStructuresPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Note the category change here to match your MongoDB enum
        const response = await fetch('/api/resources?category=data-structures');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching data structures resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="p-10 dark:text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Fundamentals of Data Structures</h1>
        <p className="text-gray-500 mt-2">Master the building blocks of efficient software.</p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 animate-ping rounded-full"></div>
          <p>Loading modules...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {resources.map((resource) => (
            <section 
              key={resource._id} 
              className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl transition-all hover:bg-green-500/15"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-green-400">{resource.topicName}</h2>
                  <p className="text-gray-400 mt-1">{resource.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {resource.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 border border-green-500/30 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <span>{link.type === 'video' ? '📺' : '📖'}</span>
                    {link.title}
                  </a>
                ))}
              </div>
            </section>
          ))}
          
          {!loading && resources.length === 0 && (
            <div className="p-10 border-2 border-dashed border-gray-700 rounded-2xl text-center">
              <p className="text-gray-500">No data structures content found in the database.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
"use client"
import React, { useEffect, useState } from 'react'

export default function MathematicsPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources?category=mathematics');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="p-10 dark:text-white">
      <h1 className="text-4xl font-bold mb-8">Mathematics for AI</h1>

      {loading ? (
        <p>Loading topics...</p>
      ) : (
        <div className="grid gap-6">
          {resources.map((resource) => (
            <section key={resource._id} className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <h2 className="text-xl font-semibold mb-2">{resource.topicName}</h2>
              <p className="text-gray-400 mb-4">{resource.description}</p>
              
              <div className="flex flex-wrap gap-3">
                {resource.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {link.title} ({link.type})
                  </a>
                ))}
              </div>
            </section>
          ))}
          
          {resources.length === 0 && <p>No resources found for this category.</p>}
        </div>
      )}
    </div>
  )
}
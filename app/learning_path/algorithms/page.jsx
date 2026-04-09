"use client"
import React, { useEffect, useMemo, useState } from 'react'

export default function MathematicsPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTopic, setOpenTopic] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources?category=algorithms');
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setResources(data);
        } else {
          setResources([]);
        }
      } catch (error) {
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const groupedResources = useMemo(() => {
    return resources.reduce((acc, resource) => {
      const topic = resource.topicName;
      if (!acc[topic]) {
        acc[topic] = [];
      }
      acc[topic].push(resource);
      return acc;
    }, {});
  }, [resources]);

  const toggleTopic = (topicName) => {
    setOpenTopic((prev) => (prev === topicName ? null : topicName));
  };

  return (
    <div className="p-10 dark:text-white">
      <h1 className="text-4xl font-bold mb-8">Algorithms</h1>

      {loading ? (
        <p>Loading topics...</p>
      ) : (
        <div className="grid gap-6">
          {Object.keys(groupedResources).length > 0 ? (
            Object.entries(groupedResources).map(([topicName, topicResources]) => {
              const isOpen = openTopic === topicName;
              const totalLinks = topicResources.reduce(
                (count, resource) => count + (resource.links?.length || 0),
                0
              );

              return (
                <section
                  key={topicName}
                  className="bg-blue-500/10 border border-blue-500/20 rounded-2xl overflow-hidden"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleTopic(topicName)}
                    className="w-full flex items-center justify-between px-6 py-6 text-left hover:bg-blue-500/5 transition-colors"
                  >
                    <div>
                      <h2 className="text-xl font-semibold">{topicName}</h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {topicResources.length} subtopic{topicResources.length > 1 ? "s" : ""} • {totalLinks} resource{totalLinks > 1 ? "s" : ""}
                      </p>
                    </div>

                    <span
                      className={`text-3xl font-light text-blue-400 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 space-y-5">
                        {topicResources.map((resource) => (
                          <div
                            key={resource._id}
                            className="border-t border-blue-500/10 pt-5 first:border-t first:border-blue-500/10"
                          >
                            <p className="text-gray-300 mb-4">{resource.description}</p>

                            <div className="flex flex-wrap gap-3">
                              {resource.links?.map((link, idx) => (
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <p>No resources found for this category.</p>
          )}
        </div>
      )}
    </div>
  )
}
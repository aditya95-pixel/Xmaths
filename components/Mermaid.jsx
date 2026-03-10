"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import toast from "react-hot-toast";

mermaid.initialize({
  startOnLoad: true,
  theme: "dark", // You can switch this based on your app's theme
  securityLevel: "loose",
  fontFamily: "inherit",
});

const Mermaid = ({ chart }) => {
  const [svg, setSvg] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Generate a unique ID to avoid collisions in a list of messages
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error("Mermaid error:", error);
      }
    };
    renderDiagram();
  }, [chart]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chart);
    toast.success("Mermaid code copied!");
  };

  return (
    <div className="relative my-6 group">
      <button 
        onClick={copyToClipboard}
        className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded transition-all"
      >
        Copy Code
      </button>
      <div 
        className="flex justify-center bg-white/5 p-4 rounded-lg overflow-hidden" 
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
    </div>
  );
};

export default Mermaid;
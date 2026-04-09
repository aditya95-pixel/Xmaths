"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import toast from "react-hot-toast";

mermaid.initialize({
  startOnLoad: false, 
  theme: "dark", 
  securityLevel: "loose",
  fontFamily: "inherit",
  suppressErrorConsole: true, 
});

const Mermaid = ({ chart }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // 1. Try to parse the chart first to see if it's valid
        const isValid = await mermaid.parse(chart, { suppressErrors: true });
        
        if (isValid) {
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
          setError(false);
        }
      } catch (err) {
        // 2. If it fails, we catch it here instead of letting Mermaid "bomb" the UI
        setError(true);
      }
    };

    if (chart) {
      renderDiagram();
    }
  }, [chart]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chart);
    toast.success("Mermaid code copied!");
  };

  // 3. Render a clean fallback if there's a syntax error
  if (error) {
    return (
      <div className="my-6 p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
        <p className="text-sm text-red-400 mb-2">Failed to render diagram (Syntax Error)</p>
        <button 
          onClick={copyToClipboard}
          className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-all"
        >
          Copy Code to Fix
        </button>
      </div>
    );
  }

  return (
    <div className="relative my-6 group">
      <button 
        onClick={copyToClipboard}
        className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded transition-all"
      >
        Copy Code
      </button>
      <div 
        className="flex justify-center bg-white/5 p-4 rounded-lg overflow-x-auto" 
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
    </div>
  );
};

export default Mermaid;
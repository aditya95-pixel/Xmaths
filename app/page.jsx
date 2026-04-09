"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image"; 
import { useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import { assets } from "@/assets/assets"; 
import { motion } from "framer-motion"; 

export default function Home() {
  const { openSignIn } = useClerk();
  const canvasRef = useRef(null);
  const router = useRouter();
  
  // Destructure createNewChat from context
  const { user, createNewChat, isAdmin } = useAppContext();
  
  // Add a loading state to prevent spam-clicking the button
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animId;
    let time = 0;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const COLS = 48;
      const ROWS = 28;
      const GRID_W = W * 2.2;
      const GRID_D = 700;
      const FOV = 320;
      const ORIGIN_Y = H * 0.82;
      const CAM_Y = -80;

      const project = (x, y, z) => {
        const s = FOV / (FOV + z);
        return { x: W * 0.5 + x * s, y: ORIGIN_Y + (y + CAM_Y) * s };
      };

      const waveY = (cx, rz) =>
        Math.sin(cx * Math.PI * 3.5 + rz * Math.PI * 1.2 + time * 0.6) * 38 +
        Math.sin(cx * Math.PI * 6 + time * 0.4) * 14;

      const getColor = (xNorm, opacity) => {
        const r = Math.round(255 - (200 * xNorm)); 
        const g = Math.round(20 * (1 - xNorm)); 
        const b = Math.round(50 + (125 * xNorm)); 
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      };

      for (let row = 0; row < ROWS; row++) {
        const rz = (row / (ROWS - 1)) * GRID_D;
        const depthOpacity = 0.2 + (row / ROWS) * 0.65;
        for (let col = 0; col < COLS - 1; col++) {
          const xn1 = col / (COLS - 1);
          const xn2 = (col + 1) / (COLS - 1);
          const x1 = (xn1 - 0.5) * GRID_W;
          const x2 = (xn2 - 0.5) * GRID_W;
          const p1 = project(x1, waveY(xn1, row / ROWS), rz);
          const p2 = project(x2, waveY(xn2, row / ROWS), rz);
          ctx.strokeStyle = getColor((xn1 + xn2) / 2, depthOpacity);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      for (let col = 0; col < COLS; col++) {
        const xNorm = col / (COLS - 1);
        const x = (xNorm - 0.5) * GRID_W;
        for (let row = 0; row < ROWS - 1; row++) {
          const rz1 = (row / (ROWS - 1)) * GRID_D;
          const rz2 = ((row + 1) / (ROWS - 1)) * GRID_D;
          const op1 = 0.2 + (row / ROWS) * 0.65;
          const op2 = 0.2 + ((row + 1) / ROWS) * 0.65;
          const avgOp = (op1 + op2) / 2;
          const p1 = project(x, waveY(xNorm, row / ROWS), rz1);
          const p2 = project(x, waveY(xNorm, (row + 1) / ROWS), rz2);
          ctx.strokeStyle = getColor(xNorm, avgOp);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      time += 0.006; 
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, 
        delayChildren: 0.2,   
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  // Logic to handle creating a new chat and navigating
  const handleChatNowClick = async () => {
    setIsCreatingChat(true);
    // This creates a new chat in the DB and sets it as the active one in the Context
    const success = await createNewChat(); 
    if (success) {
      router.push("/chat_window");
    }
    setIsCreatingChat(false);
  };

  return (
    <main className="landing-root">
     <nav className="fixed top-0 right-0 left-0 flex justify-end items-center p-6 z-50">
      <div className="nav-auth">
        {user ? (
          <UserButton/>
        ) : (
          <button 
            onClick={() =>router.push("/sign-in")}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20 backdrop-blur-md"          >
            Login
          </button>
        )}
      </div>
    </nav>
      <section className="hero-section">
        
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <h1 className="hero-heading">
            <motion.span variants={itemVariants} style={{ display: 'inline-block' }}>
              <span className="hero-gradient-text">Xmaths</span>
            </motion.span>
            <br />
            <motion.span variants={itemVariants} style={{ display: 'inline-block' }}>
              <span className="hero-white-text">AI Problem Solving Platform</span>
            </motion.span>
          </h1>

          <motion.p variants={itemVariants} className="hero-description">
            A structured learning platform for mastering the mathematics behind data structures, algorithms,
            machine learning and AI — from algebra and calculus to probability,
            linear algebra, and beyond.
          </motion.p>

          {user && (
            <motion.div variants={itemVariants} className="hero-actions">
              <button 
                onClick={handleChatNowClick} 
                disabled={isCreatingChat}
                className="btn-get-started flex items-center justify-center gap-2"
              >
                {isCreatingChat ? (
                   <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Starting Chat...
                   </>
                ) : (
                  "Chat now!"
                )}
              </button>
              <button 
                onClick={() => router.push("/learning_path")} 
                className="btn-get-started"
              >
                Learn
              </button>
              <button 
                onClick={() => router.push("/take_quiz")} 
                className="btn-get-started"
              >
                Take quiz
              </button>
              {isAdmin && <button 
                onClick={() => router.push("/contribute_resources")} 
                className="btn-ecosystems"
              >
                Contribute
              </button>
              }
            </motion.div>
          )}
        </motion.div>
        
        <canvas ref={canvasRef} className="wave-canvas" />
      </section>
    </main>
  );
}
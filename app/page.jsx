"use client";
import { useEffect, useRef } from "react";
import { Github, Twitter } from "lucide-react";

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.043.034.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

export default function Home() {
  const canvasRef = useRef(null);

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
        // Starts Red (255) on the left, fades as it moves right
        const r = Math.round(255 - (200 * xNorm)); 
        
        const g = Math.round(20 * (1 - xNorm)); 
        
        // Starts Low, ends at a strong Blue (175)
        const b = Math.round(50 + (125 * xNorm)); 

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      };
      // horizontal lines (across columns)
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

      // depth lines (across rows)
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

      time += 0.012;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="landing-root">
      {/* ── Navigation ── */}
      <nav className="landing-nav">
        <span className="nav-brand">Serendale</span>

        <div className="nav-menu">
          <a href="#" className="nav-link">Smart Contracts</a>
          <span className="nav-sep">|</span>
          <a href="#" className="nav-link">Services</a>
          <span className="nav-sep">|</span>
          <a href="#" className="nav-link">Solutions</a>
          <span className="nav-sep">|</span>
          <a href="#" className="nav-link">Roadmap</a>
          <span className="nav-sep">|</span>
          <a href="#" className="nav-link">Whitepaper</a>
        </div>

        <div className="nav-socials">
          <a href="#" className="social-link" aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href="#" className="social-link" aria-label="Discord">
            <DiscordIcon />
          </a>
          <a href="#" className="social-link" aria-label="Reddit">
            <RedditIcon />
          </a>
          <a href="#" className="social-link" aria-label="Twitter">
            <Twitter size={20} />
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-heading">
            <span className="hero-gradient-text">Xmaths</span>
            <br />
            <span className="hero-white-text">AI Problem Solving Platform</span>
          </h1>

          <p className="hero-description">
            A structured learning platform for mastering the mathematics behind data structures, algorithms,
            machine learning and AI — from algebra and calculus to probability,
            linear algebra, and beyond.
          </p>

          <div className="hero-actions">
            <button className="btn-get-started">Chat now!</button>
            <button className="btn-ecosystems">Ecosystems</button>
          </div>
        </div>

        <canvas ref={canvasRef} className="wave-canvas" />
      </section>
    </main>
  );
}

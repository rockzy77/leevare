import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sky: #38bdf8;
    --sky-light: #7dd3fc;
    --sky-dark: #0ea5e9;
    --sky-deep: #0284c7;
    --sky-glow: #bae6fd;
    --night: #020c14;
    --night2: #041526;
    --night3: #062035;
    --card: rgba(3, 30, 55, 0.7);
    --card-border: rgba(56, 189, 248, 0.15);
    --text: #e0f2fe;
    --muted: rgba(186, 230, 253, 0.5);
    --white: #f0f9ff;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--night);
    color: var(--text);
    overflow-x: hidden;
    cursor: none;
  }

  *, *::before, *::after { cursor: none !important; }

  /* CURSOR */
  .cursor-dot {
    position: fixed;
    width: 8px; height: 8px;
    background: var(--sky);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 99999;
    box-shadow: 0 0 12px var(--sky), 0 0 24px var(--sky-dark);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cursor-dot.active { opacity: 1; }

  .cursor-ring {
    position: fixed;
    width: 36px; height: 36px;
    border: 1.5px solid var(--sky-light);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 99998;
    transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease, opacity 0.3s;
    opacity: 0;
  }
  .cursor-ring.active { opacity: 0.6; }
  .cursor-ring.hovered {
    width: 56px; height: 56px;
    border-color: var(--sky);
    opacity: 1;
    background: rgba(56, 189, 248, 0.05);
  }

  /* NOISE OVERLAY */
  .noise {
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1000;
    opacity: 0.4;
  }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 500;
    padding: 20px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.4s ease;
  }
  nav.scrolled {
    background: rgba(2, 12, 20, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--card-border);
    padding: 14px 60px;
  }
  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.6rem;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, var(--sky-glow) 0%, var(--sky) 50%, var(--sky-deep) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .logo span { color: var(--sky); -webkit-text-fill-color: var(--sky); }
  nav ul {
    list-style: none;
    display: flex;
    gap: 40px;
    align-items: center;
  }
  nav ul li a {
    text-decoration: none;
    color: var(--muted);
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: color 0.2s;
    position: relative;
  }
  nav ul li a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: var(--sky);
    transition: width 0.3s ease;
  }
  nav ul li a:hover { color: var(--sky); }
  nav ul li a:hover::after { width: 100%; }
  .nav-cta {
    background: transparent;
    border: 1px solid var(--sky);
    color: var(--sky) !important;
    padding: 8px 22px;
    border-radius: 4px;
    transition: all 0.3s ease !important;
  }
  .nav-cta:hover {
    background: var(--sky) !important;
    color: var(--night) !important;
    -webkit-text-fill-color: var(--night) !important;
  }
  .nav-cta::after { display: none !important; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 120px 60px 80px;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(14, 165, 233, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 80% 80%, rgba(56, 189, 248, 0.06) 0%, transparent 50%),
                linear-gradient(180deg, var(--night2) 0%, var(--night) 100%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: 
      linear-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56, 189, 248, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  }
  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: orb-float 8s ease-in-out infinite;
  }
  .orb1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
    top: -100px; right: 0;
    animation-delay: 0s;
  }
  .orb2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
    bottom: 0; left: 200px;
    animation-delay: -3s;
  }
  @keyframes orb-float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 760px;
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.2);
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sky-light);
    margin-bottom: 28px;
    animation: fade-up 0.8s ease both;
  }
  .badge-dot {
    width: 6px; height: 6px;
    background: var(--sky);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--sky);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }
  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -0.03em;
    margin-bottom: 24px;
    animation: fade-up 0.8s ease 0.1s both;
  }
  .hero h1 .line1 { display: block; color: var(--white); }
  .hero h1 .line2 {
    display: block;
    background: linear-gradient(90deg, var(--sky) 0%, var(--sky-light) 50%, var(--sky-glow) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero p {
    font-size: 1.15rem;
    color: var(--muted);
    line-height: 1.7;
    max-width: 520px;
    margin-bottom: 40px;
    animation: fade-up 0.8s ease 0.2s both;
  }
  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    animation: fade-up 0.8s ease 0.3s both;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--sky-dark), var(--sky));
    color: var(--night);
    border: none;
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(14, 165, 233, 0.3);
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--sky), var(--sky-glow));
    opacity: 0;
    transition: opacity 0.3s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(14, 165, 233, 0.5); }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary span { position: relative; z-index: 1; }
  .btn-ghost {
    background: transparent;
    color: var(--sky-light);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    letter-radius: 0.02em;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-ghost:hover {
    border-color: var(--sky);
    background: rgba(56, 189, 248, 0.05);
    transform: translateY(-2px);
  }
  .hero-scroll {
    position: absolute;
    bottom: 40px; left: 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--muted);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    animation: fade-up 0.8s ease 0.5s both;
  }
  .scroll-line {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--sky));
    animation: scroll-line 2s ease-in-out infinite;
  }
  @keyframes scroll-line {
    0%, 100% { width: 40px; }
    50% { width: 60px; }
  }
  .hero-stats {
    position: absolute;
    right: 60px; bottom: 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: fade-up 0.8s ease 0.4s both;
  }
  .stat-item {
    text-align: right;
    border-right: 2px solid rgba(56, 189, 248, 0.3);
    padding-right: 20px;
  }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--sky);
    line-height: 1;
    background: linear-gradient(135deg, var(--sky-light), var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .stat-label {
    font-size: 0.75rem;
    color: var(--muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SECTION SHARED */
  section { padding: 100px 60px; }
  .section-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--sky);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-label::before {
    content: '';
    display: inline-block;
    width: 30px; height: 1px;
    background: var(--sky);
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--white);
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .section-title span {
    background: linear-gradient(90deg, var(--sky) 0%, var(--sky-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .section-sub {
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.7;
    max-width: 520px;
    margin-bottom: 60px;
  }

  /* SERVICES */
  .services { background: var(--night2); position: relative; overflow: hidden; }
  .services::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(14, 165, 233, 0.05), transparent);
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    position: relative;
  }
  .service-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 36px 32px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: default;
  }
  .service-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .service-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--sky), transparent);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }
  .service-card:hover { transform: translateY(-6px); border-color: rgba(56, 189, 248, 0.3); }
  .service-card:hover::before { opacity: 1; }
  .service-card:hover::after { transform: scaleX(1); }
  .service-icon {
    width: 52px; height: 52px;
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin-bottom: 24px;
    transition: all 0.3s;
  }
  .service-card:hover .service-icon {
    background: rgba(56, 189, 248, 0.15);
    border-color: var(--sky);
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
  }
  .service-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 12px;
  }
  .service-card p {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.7;
  }
  .service-tag {
    display: inline-flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .tag {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    padding: 3px 10px;
    border-radius: 100px;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.15);
    color: var(--sky-light);
  }

  /* WORK */
  .work { position: relative; }
  .work-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    max-width: 680px;
  }
  .work-card {
    border-radius: 12px;
    overflow: hidden;
    background: var(--card);
    border: 1px solid var(--card-border);
    transition: all 0.4s ease;
    cursor: pointer;
    position: relative;
  }
  .work-card:hover { transform: translateY(-6px); border-color: rgba(56, 189, 248, 0.3); }
  .work-preview {
    height: 220px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .work-preview-inner {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem;
    transition: transform 0.4s ease;
  }
  .work-card:hover .work-preview-inner { transform: scale(1.08); }
  .work-overlay {
    position: absolute; inset: 0;
    background: rgba(2, 12, 20, 0.6);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex; align-items: center; justify-content: center;
  }
  .work-card:hover .work-overlay { opacity: 1; }
  .overlay-btn {
    background: rgba(56, 189, 248, 0.9);
    color: var(--night);
    padding: 10px 24px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.85rem;
    border: none;
    cursor: pointer;
  }
  .work-info { padding: 24px 28px; }
  .work-info h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 6px;
  }
  .work-info p {
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 16px;
  }
  .work-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .work-type {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sky);
  }
  .work-year {
    font-size: 0.75rem;
    color: var(--muted);
  }
  .work-featured {
    grid-column: 1 / -1;
  }
  .work-featured .work-preview { height: 320px; }
  .work-tag {
    position: absolute; top: 16px; left: 16px;
    background: var(--sky);
    color: var(--night);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
  }

  /* PROCESS */
  .process { background: var(--night2); }
  .process-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    position: relative;
    margin-top: 60px;
  }
  .process-steps::before {
    content: '';
    position: absolute;
    top: 28px; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--sky-dark), var(--sky), var(--sky-dark), transparent);
  }
  .process-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 20px;
    position: relative;
  }
  .step-num {
    width: 56px; height: 56px;
    background: var(--night);
    border: 1.5px solid var(--sky-dark);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1rem;
    color: var(--sky);
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
    transition: all 0.3s;
  }
  .process-step:hover .step-num {
    background: var(--sky-dark);
    color: var(--night);
    box-shadow: 0 0 30px rgba(14, 165, 233, 0.5);
  }
  .process-step h3 {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 8px;
  }
  .process-step p {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.6;
  }

  /* REVIEWS */
  .reviews { overflow: hidden; }
  .reviews-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 50px;
  }
  .reviews-single {
    display: flex;
    justify-content: flex-start;
  }
  .review-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 28px 28px;
    min-width: 320px;
    max-width: 320px;
    flex-shrink: 0;
    transition: border-color 0.3s;
  }
  .review-card-solo {
    min-width: 0;
    max-width: 480px;
    width: 100%;
  }
  .review-card:hover { border-color: rgba(56, 189, 248, 0.3); }
  .review-top {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 16px;
  }
  .review-avatar {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--sky-deep), var(--sky));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1rem;
    color: var(--night);
    flex-shrink: 0;
  }
  .review-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--white);
    margin-bottom: 2px;
  }
  .review-role { font-size: 0.75rem; color: var(--muted); }
  .review-stars { font-size: 0.85rem; margin-bottom: 10px; }
  .review-text { font-size: 0.875rem; color: var(--muted); line-height: 1.7; margin-bottom: 18px; }
  .review-cta-link {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--sky);
    text-decoration: none;
    transition: color 0.2s;
  }
  .review-cta-link:hover { color: var(--sky-light); }
  .review-quote {
    font-size: 2.5rem;
    color: rgba(56, 189, 248, 0.15);
    font-family: Georgia, serif;
    line-height: 1;
    margin-bottom: -8px;
  }

  /* TECH STACK */
  .stack { background: var(--night2); }
  .stack-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 48px;
  }
  .stack-item {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    cursor: default;
  }
  .stack-item:hover {
    border-color: var(--sky);
    color: var(--sky-light);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.15);
  }
  .stack-icon { font-size: 1.1rem; }

  /* CTA */
  .cta-section {
    padding: 100px 60px;
    position: relative;
    overflow: hidden;
  }
  .cta-inner {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(56, 189, 248, 0.05) 100%);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 20px;
    padding: 80px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-inner::before {
    content: '';
    position: absolute; inset: 0;
    background: 
      radial-gradient(ellipse 50% 80% at 20% 50%, rgba(14, 165, 233, 0.08), transparent),
      radial-gradient(ellipse 50% 80% at 80% 50%, rgba(56, 189, 248, 0.06), transparent);
  }
  .cta-inner h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    color: var(--white);
    margin-bottom: 16px;
    position: relative;
  }
  .cta-inner p {
    color: var(--muted);
    font-size: 1rem;
    margin-bottom: 36px;
    position: relative;
  }
  .cta-actions {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    position: relative;
  }

  /* FOOTER */
  footer {
    background: var(--night2);
    border-top: 1px solid var(--card-border);
    padding: 50px 60px 30px;
  }
  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
  }
  .footer-brand .logo { font-size: 1.4rem; display: block; margin-bottom: 10px; }
  .footer-brand p { font-size: 0.85rem; color: var(--muted); max-width: 280px; line-height: 1.6; }
  .footer-links {
    display: flex;
    gap: 60px;
  }
  .footer-col h4 {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sky);
    margin-bottom: 16px;
  }
  .footer-col ul { list-style: none; }
  .footer-col ul li { margin-bottom: 10px; }
  .footer-col ul li a {
    text-decoration: none;
    font-size: 0.875rem;
    color: var(--muted);
    transition: color 0.2s;
  }
  .footer-col ul li a:hover { color: var(--sky-light); }
  .footer-bottom {
    border-top: 1px solid var(--card-border);
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-bottom p { font-size: 0.8rem; color: var(--muted); }
  .social-links { display: flex; gap: 14px; }
  .social-link {
    width: 36px; height: 36px;
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
    color: var(--muted);
    text-decoration: none;
    transition: all 0.3s;
  }
  .social-link:hover { border-color: var(--sky); color: var(--sky); transform: translateY(-2px); }

  /* REVEAL */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── TABLET (≤1024px) ── */
  @media (max-width: 1024px) {
    nav { padding: 18px 40px; }
    nav.scrolled { padding: 13px 40px; }
    nav ul { gap: 24px; }

    .hero { padding: 110px 40px 80px; }
    .hero-stats { right: 40px; bottom: 60px; gap: 18px; }
    .stat-num { font-size: 1.6rem; }
    .hero-scroll { left: 40px; }

    section { padding: 80px 40px; }
    .cta-section { padding: 80px 40px; }
    footer { padding: 50px 40px 28px; }

    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .work-grid { grid-template-columns: repeat(2, 1fr); }
    .work-featured { grid-column: 1 / -1; }

    .process-steps { gap: 16px; }
    .process-step { padding: 0 10px; }

    .footer-links { gap: 36px; }
  }

  /* ── SMALL TABLET / LARGE MOBILE (≤768px) ── */
  @media (max-width: 768px) {
    /* Hide custom cursor on touch */
    .cursor-dot, .cursor-ring { display: none; }
    *, *::before, *::after { cursor: auto !important; }
    body { cursor: auto; }

    /* Nav → hamburger hidden, just logo */
    nav { padding: 16px 20px; }
    nav.scrolled { padding: 12px 20px; }
    nav ul { display: none; }

    /* Hero */
    .hero { padding: 100px 20px 100px; min-height: 100svh; }
    .hero-content { max-width: 100%; }
    .hero h1 { font-size: clamp(2.4rem, 9vw, 3.8rem); margin-bottom: 18px; }
    .hero p { font-size: 1rem; max-width: 100%; margin-bottom: 32px; }
    .hero-actions { flex-direction: column; align-items: flex-start; gap: 12px; }
    .btn-primary, .btn-ghost { width: 100%; text-align: center; padding: 15px 24px; }
    .hero-stats { display: none; }
    .hero-scroll { bottom: 28px; left: 20px; }
    .orb1 { width: 280px; height: 280px; }
    .orb2 { display: none; }

    /* Sections */
    section { padding: 64px 20px; }
    .section-title { font-size: clamp(1.7rem, 6vw, 2.4rem); }
    .section-sub { font-size: 0.9rem; margin-bottom: 40px; }

    /* Services */
    .services-grid { grid-template-columns: 1fr; gap: 16px; }

    /* Work */
    .work-grid { grid-template-columns: 1fr; gap: 18px; }
    .work-featured { grid-column: auto; }
    .work-featured .work-preview { height: 220px; }
    .work-preview { height: 180px; }

    /* Process */
    .process-steps {
      grid-template-columns: repeat(2, 1fr);
      gap: 36px 20px;
    }
    .process-steps::before { display: none; }
    .process-step { padding: 0; }

    /* Reviews */
    .reviews-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    .review-card-solo { max-width: 100%; padding: 22px 20px; }

    /* Stack */
    .stack-grid { gap: 10px; }
    .stack-item { padding: 10px 14px; font-size: 0.8rem; }

    /* CTA */
    .cta-section { padding: 64px 20px; }
    .cta-inner { padding: 48px 24px; border-radius: 14px; }
    .cta-inner h2 { font-size: clamp(1.6rem, 5vw, 2.2rem); }
    .cta-actions { flex-direction: column; align-items: center; }
    .cta-actions .btn-primary,
    .cta-actions .btn-ghost { width: 100%; max-width: 320px; }

    /* Footer */
    footer { padding: 48px 20px 24px; }
    .footer-top { flex-direction: column; gap: 36px; }
    .footer-brand p { max-width: 100%; }
    .footer-links { flex-wrap: wrap; gap: 32px; }
    .footer-col { min-width: calc(50% - 16px); }
    .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
  }

  /* ── MOBILE (≤480px) ── */
  @media (max-width: 480px) {
    nav { padding: 14px 16px; }
    nav.scrolled { padding: 11px 16px; }
    .logo { font-size: 1.3rem; }

    .hero { padding: 90px 16px 90px; }
    .hero h1 { font-size: clamp(2rem, 10vw, 3rem); line-height: 1.05; }
    .hero-badge { font-size: 0.7rem; padding: 5px 12px; }

    section { padding: 56px 16px; }
    .section-label { font-size: 0.65rem; }
    .section-title { font-size: clamp(1.5rem, 7vw, 2rem); }

    .service-card { padding: 24px 20px; }
    .service-icon { width: 44px; height: 44px; font-size: 1.2rem; margin-bottom: 18px; }

    .work-info { padding: 18px 20px; }
    .work-info h3 { font-size: 0.95rem; }

    .process-steps { grid-template-columns: 1fr; gap: 32px; }
    .step-num { width: 48px; height: 48px; font-size: 0.9rem; }

    .cta-section { padding: 56px 16px; }
    .cta-inner { padding: 40px 18px; }

    footer { padding: 40px 16px 20px; }
    .footer-col { min-width: 100%; }
    .social-links { justify-content: center; }
  }

  /* MOBILE MENU */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    padding: 6px;
    z-index: 600;
  }
  .hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--sky-light);
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .mobile-menu {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(2, 12, 20, 0.97);
    backdrop-filter: blur(20px);
    z-index: 550;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
  }
  .mobile-menu.open { transform: translateX(0); }
  .mobile-menu a {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--muted);
    text-decoration: none;
    letter-spacing: -0.02em;
    padding: 12px 0;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--sky); }
  .mobile-menu-cta {
    margin-top: 20px;
    background: var(--sky-dark);
    color: var(--night) !important;
    padding: 14px 40px;
    border-radius: 8px;
    font-size: 1.2rem !important;
  }

  .mobile-menu-close {
    position: absolute;
    top: 24px; right: 20px;
    background: none;
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 8px;
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    color: var(--sky-light);
    font-size: 1.4rem;
    line-height: 1;
  }
  .mobile-menu-close:hover { border-color: var(--sky); color: var(--sky); }

  @media (max-width: 768px) {
    .hamburger { display: flex; }
  }
`;

const SERVICES = [
    {
        icon: "🌐",
        title: "Frontend Development",
        desc: "Pixel-perfect interfaces for both web and mobile — apps and websites built with modern tools and smooth performance.",
        tags: ["Flutter", "React Native", "React.js", "JavaScript", "CSS"],
    },
    {
        icon: "⚙️",
        title: "Backend Engineering",
        desc: "Scalable APIs, databases, and server architecture. RESTful services built for performance and reliability.",
        tags: ["Node.js", "Express", "PostgreSQL", "REST APIs", "Docker"],
    },
    {
        icon: "🚀",
        title: "Full Stack Solutions",
        desc: "End-to-end web applications from concept to deployment. One partner for your entire product build.",
        tags: ["Full Stack", "CI/CD", "Cloud"],
    },
    {
        icon: "🎨",
        title: "UI/UX Design",
        desc: "User-first design that looks stunning and converts. Wireframes, prototypes, and design systems.",
        tags: ["Figma", "Design Systems", "UX Research"],
    },
    {
        icon: "🛒",
        title: "E-Commerce Builds",
        desc: "Custom storefronts with secure payment integrations built to scale with your business.",
        tags: ["Stripe", "PayPal", "Custom Build"],
    },
    {
        icon: "🔧",
        title: "Maintenance & Support",
        desc: "Ongoing support, performance audits, and feature updates so your product always runs at its best.",
        tags: ["Support", "Audits", "Performance"],
    },
];

const PROJECTS = [
    {
        title: "Passion HealthCare",
        desc: "Full stack web platform for a UK healthcare provider — built for performance, accessibility, and a seamless user experience.",
        type: "Full Stack",
        year: "2026",
        url: "https://passionhealthcare.co.uk",
        bg: "linear-gradient(135deg, #062035 0%, #0c3550 50%, #0a4a6e 100%)",
        emoji: "🏥",
        featured: true,
    },
];

const REVIEWS = [
    { name: "Client Review", role: "Coming Soon", text: "We're just getting started — testimonials will appear here as we grow. Be one of our first clients and share your experience!", stars: 5, init: "★" },
];

const STACK = [
    { icon: "⚛️", name: "React" }, { icon: "📱", name: "React Native" }, { icon: "💙", name: "Flutter" },
    { icon: "🟡", name: "JavaScript" }, { icon: "🎨", name: "CSS" }, { icon: "🟢", name: "Node.js" },
    { icon: "🚂", name: "Express" }, { icon: "🐘", name: "PostgreSQL" }, { icon: "🍃", name: "MongoDB" },
    { icon: "🐳", name: "Docker" }, { icon: "☁️", name: "AWS" }, { icon: "🔥", name: "Firebase" },
    { icon: "💳", name: "Stripe" }, { icon: "💰", name: "PayPal" }, { icon: "🐙", name: "GitHub" },
    { icon: "📐", name: "Figma" },
];

function useScrollReveal() {
    useEffect(() => {
        const els = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
            { threshold: 0.12 }
        );
        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

export default function Leevare() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [cursor, setCursor] = useState({ x: -100, y: -100 });
    const [ring, setRing] = useState({ x: -100, y: -100 });
    const [hovered, setHovered] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(false);
    const ringRef = useRef({ x: -100, y: -100 });
    const rafRef = useRef();

    useScrollReveal();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onMove = (e) => {
            setCursor({ x: e.clientX, y: e.clientY });
            setCursorVisible(true);
            const target = e.target.closest("a, button, .service-card, .work-card, .stack-item");
            setHovered(!!target);
        };
        const onLeave = () => setCursorVisible(false);
        const onEnter = () => setCursorVisible(true);
        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseleave", onLeave);
        document.addEventListener("mouseenter", onEnter);
        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
            document.removeEventListener("mouseenter", onEnter);
        };
    }, []);

    useEffect(() => {
        const animate = () => {
            ringRef.current.x += (cursor.x - ringRef.current.x) * 0.12;
            ringRef.current.y += (cursor.y - ringRef.current.y) * 0.12;
            setRing({ x: ringRef.current.x, y: ringRef.current.y });
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [cursor]);

    return (
        <>
            <style>{styles}</style>
            <div className="noise" />

            {/* CURSOR */}
            <div className={`cursor-dot${cursorVisible ? " active" : ""}`} style={{ left: cursor.x, top: cursor.y }} />
            <div className={`cursor-ring${cursorVisible ? " active" : ""}${hovered ? " hovered" : ""}`} style={{ left: ring.x, top: ring.y }} />

            {/* NAV */}
            <nav className={scrolled ? "scrolled" : ""}>
                <div className="logo">Lee<span>vare</span></div>
                <ul>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#work">Work</a></li>
                    <li><a href="#process">Process</a></li>
                    <li><a href="#reviews">Reviews</a></li>
                    <li><a href="#contact" className="nav-cta">Let's Talk</a></li>
                </ul>
                <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                    <span /><span /><span />
                </button>
            </nav>

            {/* MOBILE MENU */}
            <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
                <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
                {["#services", "#work", "#process", "#reviews"].map((href, i) => (
                    <a key={i} href={href} onClick={() => setMenuOpen(false)}>
                        {["Services", "Work", "Process", "Reviews"][i]}
                    </a>
                ))}
                <a href="#contact" className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>Let's Talk</a>
            </div>

            {/* HERO */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-grid" />
                <div className="hero-orb orb1" />
                <div className="hero-orb orb2" />
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot" />
                        Available for new projects
                    </div>
                    <h1>
                        <span className="line1">Full Stack Websites.</span>
                        <span className="line2">Built to Impress.</span>
                    </h1>
                    <p>
                        Leevare crafts high-performance web applications and portfolio sites — from sleek frontends to robust backends. One team, complete solutions.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
                            <span>View Our Work</span>
                        </button>
                        <button className="btn-ghost" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                            Start a Project
                        </button>
                    </div>
                </div>
                <div className="hero-stats">
                    <div className="stat-item"><div className="stat-num">50+</div><div className="stat-label">Projects Done</div></div>
                    <div className="stat-item"><div className="stat-num">98%</div><div className="stat-label">Satisfaction Rate</div></div>
                    <div className="stat-item"><div className="stat-num">3yr</div><div className="stat-label">Experience</div></div>
                </div>
                <div className="hero-scroll">
                    <span className="scroll-line" />
                    Scroll to explore
                </div>
            </section>

            {/* SERVICES */}
            <section className="services" id="services">
                <div className="reveal">
                    <div className="section-label">What We Do</div>
                    <h2 className="section-title">Services that <span>cover everything</span></h2>
                    <p className="section-sub">From a landing page to a full-scale SaaS platform — we handle the entire build so you can focus on your business.</p>
                </div>
                <div className="services-grid">
                    {SERVICES.map((s, i) => (
                        <div className="service-card reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                            <div className="service-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                            <div className="service-tag">{s.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* WORK */}
            <section className="work" id="work">
                <div className="reveal">
                    <div className="section-label">Portfolio</div>
                    <h2 className="section-title">Recent <span>work</span></h2>
                    <p className="section-sub">A selection of projects that showcase our range — from complex data platforms to polished consumer products.</p>
                </div>
                <div className="work-grid">
                    {PROJECTS.map((p, i) => (
                        <div className={`work-card reveal`} key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                            {p.featured && <span className="work-tag">Featured</span>}
                            <div className="work-preview" style={{ background: p.bg }}>
                                <div className="work-preview-inner" style={{ fontSize: "5rem" }}>{p.emoji}</div>
                                <div className="work-overlay">
                                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                                        <button className="overlay-btn">Visit Site →</button>
                                    </a>
                                </div>
                            </div>
                            <div className="work-info">
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                                <div className="work-meta">
                                    <span className="work-type">{p.type}</span>
                                    <span className="work-year">{p.year}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROCESS */}
            <section className="process" id="process">
                <div className="reveal">
                    <div className="section-label">How It Works</div>
                    <h2 className="section-title">A process built for <span>results</span></h2>
                </div>
                <div className="process-steps">
                    {[
                        { n: "01", title: "Discovery", desc: "We deep-dive into your goals, users, and technical requirements to form a clear plan." },
                        { n: "02", title: "Design", desc: "Interactive wireframes and high-fidelity mockups reviewed and approved by you first." },
                        { n: "03", title: "Build", desc: "Agile development with weekly demos. You stay in the loop at every step." },
                        { n: "04", title: "Launch", desc: "Thorough QA, deployment, and post-launch support to ensure a smooth go-live." },
                    ].map((s, i) => (
                        <div className="process-step reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                            <div className="step-num">{s.n}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* REVIEWS */}
            <section className="reviews" id="reviews">
                <div className="reviews-header reveal">
                    <div>
                        <div className="section-label">Testimonials</div>
                        <h2 className="section-title">What clients <span>say</span></h2>
                    </div>
                </div>
                <div className="reviews-single reveal">
                    <div className="review-card review-card-solo">
                        <div className="review-quote">"</div>
                        <div className="review-top">
                            <div className="review-avatar" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(14,165,233,0.1))", border: "1px solid rgba(56,189,248,0.3)", fontSize: "1.4rem" }}>★</div>
                            <div>
                                <div className="review-name">Be Our First Review</div>
                                <div className="review-role">Your name here</div>
                            </div>
                        </div>
                        <div className="review-stars">⭐⭐⭐⭐⭐</div>
                        <p className="review-text">We're just getting started — testimonials will appear here as we grow. Work with us and be the first to share your experience with Leevare.</p>
                        <a href="#contact" className="review-cta-link">Start a project →</a>
                    </div>
                </div>
                <br />
                <br />
                <div class="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="69e101b7c30fb5ef21eb394a" data-style-height="52px" data-style-width="100%" data-token="b382c954-52e0-4871-af11-7f471e0c1404">
  <a href="https://www.trustpilot.com/review/leevare.co.uk" target="_blank" rel="noopener">Trustpilot</a>
</div>
            </section>

            {/* STACK */}
            <section className="stack">
                <div className="reveal">
                    <div className="section-label">Tech Stack</div>
                    <h2 className="section-title">Tools we <span>master</span></h2>
                    <p className="section-sub">Modern, battle-tested technologies chosen for performance, scalability, and developer experience.</p>
                </div>
                <div className="stack-grid">
                    {STACK.map((s, i) => (
                        <div className="stack-item reveal" key={i} style={{ transitionDelay: `${i * 0.03}s` }}>
                            <span className="stack-icon">{s.icon}</span>
                            {s.name}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section" id="contact">
                <div className="cta-inner reveal">
                    <h2>Ready to build something <span style={{ background: "linear-gradient(90deg,#38bdf8,#7dd3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>remarkable?</span></h2>
                    <p>Let's turn your idea into a product people love. Get a free consultation today.</p>
                    <div className="cta-actions">
                        <a href="mailto:hello@Leevare.dev">
                            <button className="btn-primary"><span>📬 Get in Touch</span></button>
                        </a>
                        <button className="btn-ghost">Book a Call →</button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <div className="footer-top">
                    <div className="footer-brand">
                        <span className="logo">Lee<span style={{ color: "var(--sky)", WebkitTextFillColor: "var(--sky)" }}>ware</span></span>
                        <p>Full stack web development studio. We build websites and applications that drive real results for your business.</p>
                    </div>
                    <div className="footer-links">
                        <div className="footer-col">
                            <h4>Services</h4>
                            <ul>
                                <li><a href="#services">Frontend Dev</a></li>
                                <li><a href="#services">Backend Engineering</a></li>
                                <li><a href="#services">Full Stack</a></li>
                                <li><a href="#services">UI/UX Design</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#work">Portfolio</a></li>
                                <li><a href="#process">Process</a></li>
                                <li><a href="#reviews">Reviews</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Contact</h4>
                            <ul>
                                <li><a href="mailto:hello@Leevare.dev">hello@Leevare.dev</a></li>
                                <li><a href="#">LinkedIn</a></li>
                                <li><a href="#">GitHub</a></li>
                                <li><a href="#">Twitter / X</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Leevare. All rights reserved.</p>
                    <div className="social-links">
                        <a className="social-link" href="#" title="GitHub">⌨</a>
                        <a className="social-link" href="#" title="LinkedIn">in</a>
                        <a className="social-link" href="#" title="Twitter">𝕏</a>
                        <a className="social-link" href="#" title="Email">✉</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Routes, Route } from "react-router-dom";
import ImmobilePage from "./Immobile.jsx";
import ImmobileVenditore from "./ImmobileVenditore.jsx";
import MetodologiaPage from "./Metodologia.jsx";
import ReportFotoPage from "./ReportFoto.jsx";
import AdminPage from "./Admin.jsx";
import VendiForm from "./VendiForm.jsx";
import FaqPage from "./FaqPage.jsx";
import ComeFunziona from "./ComeFunziona.jsx";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";
import AffittiPage from "./AffittiPage.jsx";
import ListingPage from "./Listing.jsx";
import BlogPage from "./BlogPage.jsx";
import BlogArticolo from "./blog/BlogArticolo.jsx";
import HomeEN from "./HomeEN.jsx";
import LoginPage from "./LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AccountPage from "./AccountPage.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; max-width: 100%; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --gold: #c9a84c; --muted: #6b6b6b; --surface: #141414;
    --border: rgba(247,245,240,0.08); --green: #2d6a4f;
  }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }
  body::after { content: ''; position: fixed; inset: 0; z-index: 9999; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); opacity: 0.025; }

  /* NAV */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.9); backdrop-filter: blur(16px); }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .nav-logo span { color: var(--red); }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; align-items: center; margin: 0; padding: 0; flex: 1; }
  .nav-links a { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: var(--white); }
  .nav-cta { background: var(--red) !important; color: var(--white) !important; padding: 0.55rem 1.4rem; border-radius: 2px; font-size: 0.75rem !important; letter-spacing: 0.12em !important; }
  .nav-cta:hover { background: var(--red-dark) !important; }

  /* HERO */
  .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 8rem 3rem 5rem; position: relative; overflow: hidden; }
  .hero-bg-number { position: absolute; right: -2rem; top: 50%; transform: translateY(-50%); font-family: 'Bebas Neue', sans-serif; font-size: clamp(200px, 30vw, 420px); color: rgba(247,245,240,0.025); line-height: 1; user-select: none; pointer-events: none; }
  .hero-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 2rem; display: flex; align-items: center; gap: 0.8rem; }
  .hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .hero-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 7.5rem); line-height: 0.95; letter-spacing: 0.01em; color: var(--white); max-width: 900px; margin-bottom: 1rem; }
  .hero-h1 .strike { position: relative; display: inline-block; color: rgba(247,245,240,0.2); }
  .hero-h1 .strike::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 4px; background: var(--red); transform: rotate(-2deg); }
  .hero-h1 .highlight { color: var(--red); }
 .hero-answer { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 7.5rem); color: var(--red); line-height: 0.95; letter-spacing: 0.01em; margin-bottom: 1.5rem; }
  .hero-challenge { font-family: 'DM Serif Display', serif; font-size: clamp(1.1rem, 2vw, 1.4rem); font-style: italic; color: rgba(247,245,240,0.5); margin-bottom: 2.5rem; max-width: 600px; line-height: 1.5; }
  .hero-challenge strong { color: var(--white); font-style: normal; font-family: 'DM Sans', sans-serif; font-weight: 500; }
  .hero-sub { font-size: 1rem; font-weight: 300; line-height: 1.7; color: rgba(247,245,240,0.45); max-width: 480px; margin-bottom: 2.8rem; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
  .btn-red { background: var(--red); color: var(--white); border: none; padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: background 0.2s, transform 0.15s; text-decoration: none; display: inline-block; }
  .btn-red:hover { background: var(--red-dark); transform: translateY(-2px); }
  .btn-outline { background: transparent; color: rgba(247,245,240,0.6); border: 1px solid rgba(247,245,240,0.15); padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 400; cursor: pointer; border-radius: 2px; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; }
  .btn-outline:hover { border-color: rgba(247,245,240,0.4); color: var(--white); }
  .hero-cost { margin-top: 4rem; padding-top: 2.5rem; border-top: 1px solid var(--border); display: flex; gap: 3rem; align-items: center; flex-wrap: wrap; }
  .cost-row { display: flex; gap: 3rem; align-items: center; flex-wrap: wrap; margin-bottom: 2rem; }
  .cost-num { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; line-height: 1; color: var(--white); }
  .cost-num.red { color: var(--red); }
  .cost-num.green { color: #4ade80; }
  .cost-label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.35); margin-top: 0.25rem; }
  .cost-divider { width: 1px; height: 48px; background: var(--border); }

  /* EXCUSES */
  .excuses { background: var(--white); color: var(--black); padding: 7rem 3rem; }
  .excuses-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .excuses-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .excuses-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; color: var(--black); margin-bottom: 0.8rem; max-width: 700px; }
  .excuses-subtitle { font-size: 0.9rem; color: var(--muted); margin-bottom: 3rem; }
  .excuses-subtitle a { color: var(--red); text-decoration: none; font-weight: 500; }
  .excuses-subtitle a:hover { text-decoration: underline; }
  .excuse-row { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid rgba(10,10,10,0.1); padding: 2rem 0; transition: background 0.2s; }
  .excuse-row:last-child { border-bottom: 1px solid rgba(10,10,10,0.1); }
  .excuse-row:hover { background: rgba(10,10,10,0.02); }
  .excuse-left { display: flex; align-items: flex-start; gap: 1.5rem; padding-right: 3rem; }
  .excuse-num { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: rgba(10,10,10,0.2); flex-shrink: 0; padding-top: 0.2rem; }
  .excuse-text { font-family: 'DM Serif Display', serif; font-size: 1.3rem; line-height: 1.3; color: rgba(10,10,10,0.4); font-style: italic; }
  .excuse-right { display: flex; align-items: flex-start; gap: 1rem; padding-left: 3rem; border-left: 1px solid rgba(10,10,10,0.08); }
  .excuse-arrow { font-size: 1.2rem; color: var(--red); flex-shrink: 0; padding-top: 0.1rem; }
  .excuse-answer { font-size: 0.95rem; line-height: 1.6; color: var(--black); }
  .excuse-answer strong { font-weight: 600; }

  /* SENTENCE */
  .sentence-section { background: var(--red); padding: 6rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .sentence-section::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.03) 41px); }
  .sentence-text { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 5vw, 4.5rem); line-height: 1.05; color: var(--white); max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }
  .sentence-sub { font-size: 1rem; color: rgba(247,245,240,0.65); margin-top: 1.5rem; position: relative; z-index: 1; font-weight: 300; }

  /* HOW */
  .how-section { padding: 7rem 3rem; background: var(--black); }
  .how-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .how-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .how-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; color: var(--white); margin-bottom: 3rem; max-width: 600px; }
  .how-tabs { display: flex; gap: 0; margin-bottom: 3rem; border-bottom: 1px solid var(--border); overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .how-tabs::-webkit-scrollbar { display: none; }
  .how-tab { padding: 0.8rem 1.2rem; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.35); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; font-family: 'DM Sans', sans-serif; text-align: center; flex: 1; min-width: 0; }
  .how-tab.active { color: var(--white); border-bottom-color: var(--red); }
  .how-tab:hover { color: rgba(247,245,240,0.7); }
  .how-step { display: grid; grid-template-columns: 80px 1fr auto; align-items: center; gap: 2rem; padding: 2rem 0; border-bottom: 1px solid var(--border); transition: background 0.2s; }
  .how-step:hover { background: rgba(247,245,240,0.02); }
  .how-step-num { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: rgba(247,245,240,0.08); line-height: 1; }
  .how-step-title { font-size: 1.05rem; font-weight: 600; color: var(--white); margin-bottom: 0.4rem; }
  .how-step-desc { font-size: 0.85rem; line-height: 1.6; color: rgba(247,245,240,0.4); }
  .how-step-tag { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 0.8rem; border-radius: 2px; white-space: nowrap; }
  .tag-ai { background: rgba(201,168,76,0.12); color: var(--gold); }
  .tag-auto { background: rgba(217,48,37,0.1); color: var(--red); }
  .tag-pro { background: rgba(247,245,240,0.06); color: rgba(247,245,240,0.5); }

  /* FOR WHO */
  .forwho-section { padding: 7rem 3rem; background: var(--surface); }
  .forwho-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .forwho-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .forwho-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; color: var(--white); margin-bottom: 3rem; }
  .forwho-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .forwho-card { background: rgba(247,245,240,0.03); padding: 2.5rem; border: 1px solid var(--border); transition: background 0.3s; position: relative; overflow: hidden; }
  .forwho-card:hover { background: rgba(247,245,240,0.06); }
  .forwho-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--red); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
  .forwho-card:hover::before { transform: scaleX(1); }
  .forwho-role { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .forwho-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); margin-bottom: 0.8rem; line-height: 1; }
  .forwho-desc { font-size: 0.85rem; line-height: 1.7; color: rgba(247,245,240,0.4); margin-bottom: 1.5rem; }
  .forwho-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
  .forwho-list li { font-size: 0.8rem; color: rgba(247,245,240,0.5); display: flex; align-items: flex-start; gap: 0.6rem; }
  .forwho-list li::before { content: '→'; color: var(--red); flex-shrink: 0; }

  /* CTA */
  .cta-section { background: var(--white); color: var(--black); padding: 8rem 3rem; text-align: center; }
  .cta-pre { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.8rem; }
  .cta-pre::before, .cta-pre::after { content: ''; width: 24px; height: 1px; background: var(--red); }
  .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 7rem); line-height: 0.95; color: var(--black); margin-bottom: 1.5rem; }
  .cta-title span { color: var(--red); }
  .cta-sub { font-size: 1rem; color: rgba(10,10,10,0.5); max-width: 420px; margin: 0 auto 3rem; line-height: 1.7; font-weight: 300; }
  .cta-form { display: flex; gap: 0; justify-content: center; max-width: 480px; margin: 0 auto; }
  .cta-input { flex: 1; padding: 1rem 1.5rem; border: 2px solid rgba(10,10,10,0.15); border-right: none; background: transparent; color: var(--black); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; border-radius: 2px 0 0 2px; outline: none; transition: border-color 0.2s; }
  .cta-input::placeholder { color: rgba(10,10,10,0.3); }
  .cta-input:focus { border-color: var(--red); }
  .btn-cta-submit { background: var(--red); color: white; border: 2px solid var(--red); padding: 1rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 0 2px 2px 0; transition: background 0.2s; white-space: nowrap; }
  .btn-cta-submit:hover:not(:disabled) { background: var(--red-dark); }
  .btn-cta-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .cta-note { font-size: 0.72rem; color: rgba(10,10,10,0.3); margin-top: 1rem; }
  .cta-success { font-size: 1.1rem; color: var(--green); font-weight: 600; }
  .cta-success-sub { font-size: 0.85rem; color: rgba(10,10,10,0.4); margin-top: 0.5rem; }
  .cta-error { font-size: 0.85rem; color: var(--red); margin-top: 0.5rem; }

  /* SCUSE PAGE */
  .scuse-hero { min-height: 55vh; display: flex; flex-direction: column; justify-content: center; padding: 5.5rem 3rem 2.5rem; position: relative; overflow: hidden; }
  .scuse-hero-bg { position: absolute; right: -2rem; top: 50%; transform: translateY(-50%); font-family: 'Bebas Neue', sans-serif; font-size: clamp(180px, 28vw, 380px); color: rgba(247,245,240,0.025); line-height: 1; user-select: none; pointer-events: none; }
  .scuse-form-section { background: var(--white); padding: 5rem 3rem; }
  .scuse-section-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .scuse-section-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .scuse-form-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1; color: var(--black); margin-bottom: 0.8rem; }
  .scuse-form-sub { font-size: 0.95rem; color: var(--muted); margin-bottom: 2.5rem; max-width: 560px; line-height: 1.6; }
  .scuse-input-wrap { display: flex; gap: 0; max-width: 640px; }
  .scuse-textarea { flex: 1; padding: 1rem 1.5rem; border: 2px solid rgba(10,10,10,0.15); border-right: none; background: transparent; color: var(--black); font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-style: italic; border-radius: 2px 0 0 2px; outline: none; transition: border-color 0.2s; resize: none; height: 64px; }
  .scuse-textarea::placeholder { color: rgba(10,10,10,0.25); font-style: italic; }
  .scuse-textarea:focus { border-color: var(--red); }
  .scuse-submit { background: var(--red); color: white; border: 2px solid var(--red); padding: 0 2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 0 2px 2px 0; transition: background 0.2s; white-space: nowrap; }
  .scuse-submit:hover:not(:disabled) { background: var(--red-dark); }
  .scuse-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .scuse-response { margin-top: 2rem; max-width: 640px; background: var(--black); border-radius: 3px; padding: 2rem; border-left: 3px solid var(--red); animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .scuse-response-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .scuse-response-text { font-size: 1rem; line-height: 1.7; color: var(--white); }
  .scuse-response-text strong { color: var(--gold); }
  .scuse-loading { display: flex; align-items: center; gap: 0.6rem; color: var(--muted); font-size: 0.9rem; margin-top: 2rem; }
  .scuse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: bounce 1.2s infinite; }
  .scuse-dot:nth-child(2) { animation-delay: 0.2s; }
  .scuse-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
  .hall-section { background: var(--surface); padding: 5rem 3rem; }
  .hall-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .hall-label::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
  .hall-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1; color: var(--white); margin-bottom: 3rem; }
  .hall-item { border-top: 1px solid var(--border); padding: 1.8rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; transition: background 0.2s; }
  .hall-item:last-child { border-bottom: 1px solid var(--border); }
  .hall-item:hover { background: rgba(247,245,240,0.02); }
  .hall-scusa { font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-style: italic; color: rgba(247,245,240,0.35); line-height: 1.4; }
  .hall-risposta { font-size: 0.9rem; line-height: 1.6; color: rgba(247,245,240,0.7); padding-left: 2rem; border-left: 1px solid var(--border); }
  .hall-risposta strong { color: var(--white); }

  /* LEGAL */
  .legal-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); }
  .legal-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .legal-nav-logo span { color: var(--red); }
  .legal-nav-back { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .legal-nav-back:hover { color: var(--white); }
  .legal-container { max-width: 760px; margin: 0 auto; padding: 5.5rem 2rem 6rem; }
  .legal-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .legal-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .legal-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; color: var(--white); margin-bottom: 0.5rem; }
  .legal-date { font-size: 0.78rem; color: rgba(247,245,240,0.3); margin-bottom: 4rem; }
  .legal-section { margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border); }
  .legal-section:last-child { border-bottom: none; }
  .legal-section h2 { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--white); margin-bottom: 1rem; }
  .legal-section p { font-size: 0.92rem; line-height: 1.8; color: rgba(247,245,240,0.55); margin-bottom: 1rem; }
  .legal-section p:last-child { margin-bottom: 0; }
  .legal-section ul { list-style: none; margin: 1rem 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .legal-section ul li { font-size: 0.92rem; line-height: 1.7; color: rgba(247,245,240,0.55); display: flex; align-items: flex-start; gap: 0.8rem; }
  .legal-section ul li::before { content: '→'; color: var(--red); flex-shrink: 0; }
  .legal-section a { color: var(--red); text-decoration: none; }
  .legal-highlight { background: rgba(247,245,240,0.04); border-left: 2px solid var(--red); padding: 1.2rem 1.5rem; border-radius: 0 2px 2px 0; margin: 1.5rem 0; }
  .legal-highlight p { color: rgba(247,245,240,0.7) !important; }

  /* FOOTER */

  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .nav-hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .nav-hamburger span { display: block; width: 24px; height: 2px; background: var(--white); border-radius: 2px; transition: all 0.2s; }
  .nav-mobile-menu { position: fixed; top: 57px; left: 0; right: 0; z-index: 99; background: rgba(10,10,10,0.98); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); flex-direction: column; padding: 1.5rem 2rem; gap: 0; display: none; }
  .nav-mobile-menu a { font-size: 1rem; font-weight: 500; color: rgba(247,245,240,0.6); text-decoration: none; padding: 1rem 0; border-bottom: 1px solid var(--border); transition: color 0.2s; letter-spacing: 0.04em; display: block; }
  .nav-mobile-menu a:last-child { border-bottom: none; }
  .nav-mobile-menu a:hover { color: var(--white); }
  .nav-mobile-cta { color: var(--red) !important; font-weight: 600 !important; }

  @media (max-width: 900px) {
    .nav-hamburger { display: flex; }
    .nav-links { display: none; }
    .nav { padding: 1rem 1.5rem; }
    .legal-nav { padding: 1rem 1.5rem; }
    .hero { padding: 6rem 1.5rem 4rem; }
    .scuse-hero { padding: 5.5rem 3rem 2.5rem; }
    .hero-bg-number, .scuse-hero-bg { display: none; }
    .hero-h1 { font-size: clamp(2.5rem, 9vw, 5rem) !important; }
    .hero-answer { font-size: clamp(2.5rem, 9vw, 5rem) !important; }
    .hero-cost { gap: 0; flex-direction: column; align-items: flex-start; }
    .hero-cost > div { width: 100%; }
    .cost-row { gap: 1.2rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .cost-num { font-size: 2rem; }
    .cost-divider { display: none; }
    .excuse-row { grid-template-columns: 1fr; gap: 1rem; }
    .excuse-right { border-left: none; border-top: 1px solid rgba(10,10,10,0.08); padding-left: 0; padding-top: 1rem; }
    .excuse-left { padding-right: 0; }
    .hall-item { grid-template-columns: 1fr; gap: 1rem; }
    .hall-risposta { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 1rem; }
    .how-step { grid-template-columns: 50px 1fr; }
    .how-step-tag { display: none; }
    .forwho-grid { grid-template-columns: 1fr; }
    .excuses, .sentence-section, .how-section, .forwho-section, .cta-section, .scuse-form-section, .hall-section { padding: 4rem 1.5rem; }
    .cta-form, .scuse-input-wrap { flex-direction: column; }
    .cta-input { border-right: 2px solid rgba(10,10,10,0.15); border-bottom: none; border-radius: 2px 2px 0 0; }
    .btn-cta-submit { border-radius: 0 0 2px 2px; }
    .scuse-textarea { border-right: 2px solid rgba(10,10,10,0.15); border-bottom: none; border-radius: 2px 2px 0 0; }
    .scuse-submit { border-radius: 0 0 2px 2px; padding: 1rem; }
      }
`;

function useScrollReveal(dep = null) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (dep !== null) els.forEach(el => el.classList.remove("visible"));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 80);
      }),
      { threshold: 0.05 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [dep]);
}

const excuses = [
  { text: '"Ho bisogno di qualcuno che conosca il mercato."', answer: <><strong>L&apos;AI analizza migliaia di transazioni nella tua zona.</strong> In tempo reale. Senza commissioni.</> },
  { text: '"Non saprei come fare le foto giuste."', answer: <><strong>RealAIstate valuta ogni foto che carichi</strong> e ti dice esattamente cosa migliorare, stanza per stanza.</> },
  { text: '"Per il notaio e i documenti ho bisogno di aiuto."', answer: <><strong>La piattaforma ti connette direttamente</strong> con notai, periti e professionisti certificati. Senza intermediari.</> },
  { text: '"Non riesco a capire se il prezzo è giusto."', answer: <><strong>Il Fair Price Score ti dice in 3 secondi</strong> se stai pagando troppo o se stai vendendo sotto mercato. Con dati, non opinioni.</> },
  { text: '"Ho paura di sbagliare senza qualcuno che mi segue."', answer: <><strong>L&apos;AI è con te in ogni passaggio</strong> — dalla valutazione alla trattativa, fino al rogito.</> },
  { text: '"Non voglio dover negoziare con gli acquirenti."', answer: <><strong>L&apos;AI negozia per te. Senza fretta, senza conflitti.</strong> Non ha commissioni da incassare — ottimizza il tuo prezzo.</> },
  { text: '"Ho bisogno di qualcuno che faccia vedere la casa."', answer: <><strong>Chi conosce casa tua meglio di te? Nessuno.</strong> RealAIstate ti prepara con script e punti di forza. Tu sei il miglior agente di casa tua.</> },
  { text: '"Non ho nessuno a cui lasciare l\'assegno della caparra. Di certo non posso lasciarlo al venditore."', answer: <><strong>L&apos;assegno non lo lasci a nessuno — lo blocchi.</strong> Con RealAIstate usi un escrow digitale: i soldi restano congelati su un conto terzo fino al rogito. Tutela per venditore e compratore.</> },
  { text: '"Non conosco nessun notaio valido di cui fidarmi. Almeno l\'agente può consigliarmene uno."', answer: <><strong>L&apos;agente ti consiglia il notaio con cui lavora abitualmente.</strong> Indovina chi paga le commissioni di riferimento? Su RealAIstate scegli tra notai certificati e indipendenti — sia che tu compri sia che tu venda.</> },
];

const hallOfFame = [
  { scusa: '"Non mi fido a vendere casa senza un esperto."', risposta: <><strong>L&apos;esperto ha un conflitto di interessi.</strong> Vuole chiudere veloce, tu vuoi vendere al prezzo giusto. Non sono la stessa cosa.</> },
  { scusa: '"E se mi chiamano alle 3 di notte per una visita?"', risposta: <><strong>Con RealAIstate gestisci tu gli orari.</strong> Nessuno ti chiama. Tu decidi quando fare vedere casa. Sempre.</> },
  { scusa: '"Non ho tempo per gestire tutto."', risposta: <><strong>Ci vuole meno tempo di quanto pensi.</strong> L&apos;AI genera l&apos;annuncio, risponde alle domande e coordina i professionisti. Tu approvi.</> },
  { scusa: '"E se arriva un acquirente strano?"', risposta: <><strong>Chi porta gli acquirenti oggi? L&apos;agenzia.</strong> Gli stessi che entrano in casa tua. Almeno con RealAIstate sai chi hai di fronte.</> },
  { scusa: '"Non ho nessuno a cui lasciare l\'assegno della caparra. Di certo non posso lasciarlo al venditore."', risposta: <><strong>L&apos;assegno non lo lasci a nessuno — lo blocchi.</strong> Con RealAIstate usi un escrow digitale: i soldi restano congelati su un conto terzo fino al rogito. Il tizio in giacca che ti chiede il 3% non serve più.</> },
  { scusa: '"Non conosco nessun notaio valido di cui fidarmi. Almeno l\'agente può consigliarmene uno."', risposta: <><strong>L&apos;agente ti consiglia il notaio con cui lavora abitualmente.</strong> Indovina chi paga le commissioni di riferimento? Su RealAIstate scegli tra notai certificati e indipendenti — nessun conflitto di interessi.</> },
];

const sellerSteps = [
  { title: "Pubblica il tuo immobile", desc: "L'AI genera titolo, descrizione ottimizzata e ti dice il prezzo di mercato corretto.", tag: "AI", tagClass: "tag-ai" },
  { title: "Valuta le tue foto", desc: "RealAIstate analizza luminosità, angolazione e composizione. Ti dice cosa rifare.", tag: "AI", tagClass: "tag-ai" },
  { title: "Ricevi le proposte", desc: "Gli acquirenti ti contattano direttamente. Nessun intermediario. Nessuna percentuale.", tag: "Automatico", tagClass: "tag-auto" },
  { title: "Chiudi con i professionisti", desc: "Notaio, perito energetico, geometra. Li trovi tutti sulla piattaforma, a prezzo trasparente.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const buyerSteps = [
  { title: "Cerca senza filtri inutili", desc: "Zona, budget, obiettivo. La mappa mostra gli immobili ordinati per Fair Price Score.", tag: "AI", tagClass: "tag-ai" },
  { title: "Analizza ogni scheda", desc: "Valutazione del prezzo, punti di forza, criticità, domande da fare. Tutto in automatico.", tag: "AI", tagClass: "tag-ai" },
  { title: "Fai un'offerta diretta", desc: "Contatta il venditore. RealAIstate ti supporta nella trattativa con dati reali.", tag: "Automatico", tagClass: "tag-auto" },
  { title: "Chiudi in sicurezza", desc: "Perizia, APE, atti notarili. La piattaforma coordina tutto. Tu arrivi al rogito preparato.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const proSteps = [
  { title: "Entra nella rete certificata", desc: "Crea il tuo profilo verificato su RealAIstate. Notaio, perito, geometra, ingegnere — ogni categoria ha il suo spazio dedicato.", tag: "Gratis", tagClass: "tag-auto" },
  { title: "Ricevi lead qualificati", desc: "Gli utenti della piattaforma vengono indirizzati ai professionisti nella loro zona. Nessun intermediario nel mezzo — il cliente arriva direttamente a te.", tag: "AI", tagClass: "tag-ai" },
  { title: "Lavora con clienti preparati", desc: "L'AI prepara il cliente prima che ti contatti — documenti, domande, aspettative chiare. Meno tempo perso, più transazioni concluse.", tag: "AI", tagClass: "tag-ai" },
  { title: "Pagamenti trasparenti", desc: "Fee fissa per ogni incarico completato. Nessuna percentuale nascosta, nessuna agenzia di mezzo che prende la sua parte.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const cards = [
  { role: "Stai vendendo", name: "Pubblica. Incassa. Tutto.", desc: "Smetti di cedere migliaia di euro a chi mette il tuo annuncio su un portale.", items: ["Valutazione AI del prezzo di mercato", "Analisi e miglioramento delle foto", "Annuncio generato dall'AI", "Rete di professionisti certificati", "Gestione trattativa diretta"] },
  { role: "Stai comprando", name: "Cerca. Analizza. Decidi.", desc: "Finisci di dipendere da qualcuno che rappresenta il venditore e si fa pagare anche da te.", items: ["Fair Price Score su ogni immobile", "Analisi AI punti di forza e criticità", "Domande consigliate pre-visita", "Connessione diretta col venditore", "Supporto AI dalla proposta al rogito"] },
  { role: "Sei un investitore", name: "Dati. Score. Pipeline.", desc: "Ogni ora persa a confrontare annunci è denaro. Il workspace investitore centralizza tutto.", items: ["Investment Score con spiegazione", "Classificazione: rendita, flip, affitto", "Pipeline opportunità con stato", "Report decisionale esportabile", "Alert automatici su nuovi immobili"] },
  { role: "Sei un professionista", name: "Entra nella rete.", desc: "RealAIstate ti porta clienti qualificati, già informati, pronti a procedere.", items: ["Profilo verificato sulla piattaforma", "Richieste da utenti qualificati dall'AI", "Nessuna agenzia nel mezzo", "Pagamenti trasparenti e tracciati", "Visibilità su tutto il territorio"] },
];

function Nav() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">Real<span>AI</span>state</a>
        <div style={{width: "1.5rem"}}></div>
        <ul className="nav-links">
          <li><a href="/come-funziona">Come funziona</a></li>
          <li><a href="/scuse">Le scuse</a></li>
          <li style={{flex: 1}}></li>
          <li><a href="/affitti">Affitti</a></li>
          <li><a href="/compra">Compra casa</a></li>
          <li><a href="/vendi">Vendi casa</a></li>
          <li><a href={user ? "/account" : "/login"} className="nav-cta">{user ? "Il mio account" : "Accesso"}</a></li>
          <li><a href="/en" style={{ display:"inline-flex", alignItems:"center", padding:"0.3rem 0.5rem", border:"1px solid rgba(247,245,240,0.1)", borderRadius:"2px" }} title="English" dangerouslySetInnerHTML={{ __html: `<svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="14" fill="#012169"/><path d="M0,0 L20,14 M20,0 L0,14" stroke="#fff" stroke-width="2.8"/><path d="M0,0 L20,14 M20,0 L0,14" stroke="#C8102E" stroke-width="1.8"/><path d="M10,0 V14 M0,7 H20" stroke="#fff" stroke-width="4.5"/><path d="M10,0 V14 M0,7 H20" stroke="#C8102E" stroke-width="2.8"/></svg>` }} /></li>
        </ul>
        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      {open && (
        <div className="nav-mobile-menu" style={{ display: "flex" }}>
          <a href="/" onClick={() => setOpen(false)}>Home</a>
          <a href="/come-funziona" onClick={() => setOpen(false)}>Come funziona</a>
          <a href="/scuse" onClick={() => setOpen(false)}>Le scuse</a>
          <a href="/affitti" onClick={() => setOpen(false)}>Affitti</a>
          <a href="/compra" onClick={() => setOpen(false)}>Compra casa</a>
          <a href="/vendi" onClick={() => setOpen(false)}>Vendi casa</a>
          <a href="/#early" className="nav-mobile-cta" onClick={() => setOpen(false)}>Accesso →</a>
        </div>
      )}
    </>
  );
}



function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) { setStatus("success"); setEmail(""); } else setStatus("error");
    } catch { setStatus("error"); }
  };
  return (
    <section className="cta-section" id="early">
      <div className="cta-pre">Early Access</div>
      <h2 className="cta-title">Basta<br /><span>scuse.</span></h2>
      <p className="cta-sub">Stiamo costruendo RealAIstate. Entra in lista d&apos;attesa e ricevi l&apos;accesso anticipato.</p>
      {status === "success" ? (
        <div><div className="cta-success">✓ Sei dentro.</div><div className="cta-success-sub">Ti contatteremo non appena apriamo.</div></div>
      ) : (
        <>
          <div className="cta-form">
            <input className="cta-input" type="email" placeholder="la-tua@email.it" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} disabled={status === "loading"} />
            <button className="btn-cta-submit" onClick={handleSubmit} disabled={status === "loading"}>{status === "loading" ? "..." : "Voglio l'accesso →"}</button>
          </div>
          {status === "error" && <div className="cta-error">Qualcosa è andato storto. Riprova.</div>}
          <div className="cta-note">Nessuno spam. Solo aggiornamenti rilevanti.</div>
        </>
      )}
    </section>
  );
}

// ── HOME ──
function Home() {
  const [tab, setTab] = useState("venditore");
  useScrollReveal(tab);
  const steps = tab === "venditore" ? sellerSteps : tab === "compratore" ? buyerSteps : proSteps;
  return (
    <>
      <Nav />
      <section className="hero">
        <div className="hero-bg-number">NO.</div>
        <div className="hero-eyebrow">Piattaforma AI · Compra e vendi casa</div>
        <h1 className="hero-h1">
          Hai davvero bisogno<br />
          di un&apos;<span className="strike">agenzia</span>?
        </h1>
        <div className="hero-answer">No.</div>
        <p className="hero-challenge">Che scusa hai per non usare <strong>RealAIstate</strong>?</p>
        <p className="hero-sub">La piattaforma AI per comprare e vendere casa senza agenzia. Valutazione, documenti e professionisti — tutto incluso. Anche il risparmio. In trasparenza.</p>
        <div className="hero-actions">
          <a href="/scuse" className="btn-red">Smonta la tua scusa →</a>
        </div>
        <div className="hero-cost">
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginBottom: "1rem" }}>SE COMPRI</div>
            <div className="cost-row">
              <div><div className="cost-num red">3–6%</div><div className="cost-label">Commissione media agenzia</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num red">€9.000–18.000</div><div className="cost-label">Su una casa da €300k</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num green">90% in meno</div><div className="cost-label">Con RealAIstate</div></div>
            </div>
            <div style={{ width: "100%", height: "1px", background: "var(--border)", marginBottom: "2rem" }} />
            <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginBottom: "1rem" }}>SE VENDI</div>
            <div className="cost-row">
              <div><div className="cost-num red">1%</div><div className="cost-label">Commissione media agenzia</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num red">€3.000</div><div className="cost-label">Su una casa da €300k</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num green">50% in meno</div><div className="cost-label">Con RealAIstate</div></div>
            </div>
            <div style={{ borderLeft: "3px solid var(--red)", paddingLeft: "1rem", marginTop: "0.5rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--white)", marginBottom: "0.3rem" }}>Il prezzo giusto.</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(247,245,240,0.4)", lineHeight: 1.6 }}>L&apos;AI non ha fretta di chiudere. Tu decidi quando vendere.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="excuses" id="perche">
        <div className="excuses-label">Le scuse finiscono qui</div>
        <h2 className="excuses-title">Perché continui<br />a pagare l&apos;agenzia?</h2>
        <p className="excuses-subtitle">Le scuse più comuni — smontate una per una. <a href="/scuse">Hai una scusa diversa? Sfida l&apos;AI →</a></p>
        <div>
          {excuses.map((e, i) => (
            <div className="excuse-row reveal" key={i}>
              <div className="excuse-left"><div className="excuse-num">0{i + 1}</div><div className="excuse-text">{e.text}</div></div>
              <div className="excuse-right"><div className="excuse-arrow">→</div><div className="excuse-answer">{e.answer}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="sentence-section">
        <div className="sentence-text">L&apos;agenzia immobiliare sarà<br />l&apos;ultima cosa che paghi<br />senza capire perché.</div>
        <div className="sentence-sub">Il cambiamento è già iniziato.</div>
      </section>

      <section className="how-section" id="come-funziona">
        <div className="how-label">Come funziona</div>
        <h2 className="how-title">Zero agenzie.<br />Zero commissioni.</h2>
        <div className="how-tabs">
          <button className={`how-tab ${tab === "venditore" ? "active" : ""}`} onClick={() => setTab("venditore")}>Sei un venditore</button>
          <button className={`how-tab ${tab === "compratore" ? "active" : ""}`} onClick={() => setTab("compratore")}>Sei un compratore</button>
          <button className={`how-tab ${tab === "professionista" ? "active" : ""}`} onClick={() => setTab("professionista")}>Sei un professionista</button>
        </div>
        <div key={tab}>
          {steps.map((s, i) => (
            <div className="how-step" key={i}>
              <div className="how-step-num">0{i + 1}</div>
              <div><div className="how-step-title">{s.title}</div><div className="how-step-desc">{s.desc}</div></div>
              <span className={`how-step-tag ${s.tagClass}`}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="forwho-section" id="per-chi">
        <div className="forwho-label">Per chi è</div>
        <h2 className="forwho-title">Chiunque compra<br />o vende casa.</h2>
        <div className="forwho-grid">
          {cards.map((c) => (
            <div className="forwho-card reveal" key={c.role}>
              <div className="forwho-role">{c.role}</div>
              <div className="forwho-name">{c.name}</div>
              <p className="forwho-desc">{c.desc}</p>
              <ul className="forwho-list">{c.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <SiteFooter />
    </>
  );
}

// ── SCUSE PAGE ──
function ScusePage() {
  useScrollReveal();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [scusa, setScusa] = useState("");
  const [status, setStatus] = useState("idle");
  const [risposta, setRisposta] = useState("");

  const handleSubmit = async () => {
    if (!scusa.trim() || status === "loading") return;
    setStatus("loading");
    setRisposta("");
    try {
      const res = await fetch("/api/smonta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scusa })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      setRisposta(data.risposta);
      setStatus("done");
    } catch { setStatus("error"); }
  };

  const formatText = (text) => text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );

  return (
    <>
      <Nav />
      <section className="scuse-hero">
        <div className="scuse-hero-bg">?</div>
        <div className="hero-eyebrow">Il grande libro delle scuse</div>
        <h1 className="hero-h1">
          La tua scusa<br />non regge.
        </h1>
        <p className="hero-sub">Hai una scusa per cui pensi di aver bisogno di un&apos;agenzia? Mandacela. L&apos;AI te la smonta in 3 secondi.</p>
      </section>

      <section className="scuse-form-section">
        <div className="scuse-section-label">Sfida l&apos;AI</div>
        <h2 className="scuse-form-title">Scrivi la tua scusa.</h2>
        <p className="scuse-form-sub">Qual è il motivo per cui pensi di aver bisogno di un&apos;agenzia? Scrivila qui sotto.</p>
        <div className="scuse-input-wrap">
          <textarea
            className="scuse-textarea"
            placeholder='"Ho paura di fare errori senza un esperto..."'
            value={scusa}
            onChange={(e) => setScusa(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          />
          <button className="scuse-submit" onClick={handleSubmit} disabled={status === "loading" || !scusa.trim()}>
            {status === "loading" ? "..." : "Smontala →"}
          </button>
        </div>
        {status === "loading" && (
          <div className="scuse-loading">
            <div className="scuse-dot" /><div className="scuse-dot" /><div className="scuse-dot" />
            <span>L&apos;AI sta analizzando la tua scusa...</span>
          </div>
        )}
        {status === "done" && risposta && (
          <div className="scuse-response">
            <div className="scuse-response-label">● Risposta di RealAIstate</div>
            <div className="scuse-response-text">{formatText(risposta)}</div>
          </div>
        )}
        {status === "error" && (
          <div className="scuse-response">
            <div className="scuse-response-text" style={{ color: "var(--red)" }}>Qualcosa è andato storto. Riprova tra un momento.</div>
          </div>
        )}
      </section>

      <section className="hall-section">
        <div className="hall-label">Hall of Fame</div>
        <h2 className="hall-title">Le scuse più creative.<br />Smontate.</h2>
        <div>
          {hallOfFame.map((item, i) => (
            <div className="hall-item reveal" key={i}>
              <div className="hall-scusa">{item.scusa}</div>
              <div className="hall-risposta">{item.risposta}</div>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <SiteFooter />
    </>
  );
}

// ── PRIVACY PAGE ──
function PrivacyPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <NavBar />
      <div className="legal-container">
        <div className="legal-eyebrow">Documento legale</div>
        <h1 className="legal-title">Privacy Policy</h1>
        <div className="legal-date">Ultimo aggiornamento: aprile 2025</div>
        <div className="legal-section">
          <h2>Chi siamo</h2>
          <p>RealAIstate è una piattaforma web per la compravendita immobiliare assistita da intelligenza artificiale, attualmente in fase di sviluppo e raccolta di early access.</p>
          <div className="legal-highlight">
            <p><strong>Titolare del trattamento:</strong> Fabio Piccoli<br /><strong>Email:</strong> <a href="mailto:privacy@realaistate.ai">privacy@realaistate.ai</a><br /><strong>Sito web:</strong> www.realaistate.ai</p>
          </div>
        </div>
        <div className="legal-section">
          <h2>Dati che raccogliamo</h2>
          <p>Raccogliamo solo i dati strettamente necessari:</p>
          <ul>
            <li><strong>Indirizzo email</strong> — fornito volontariamente tramite il modulo di iscrizione alla lista d&apos;attesa early access</li>
            <li><strong>Dati di navigazione</strong> — raccolti automaticamente tramite Google Analytics (IP anonimizzato, pagine visitate, durata sessione)</li>
          </ul>
        </div>
        <div className="legal-section">
          <h2>Come utilizziamo i tuoi dati</h2>
          <ul>
            <li>Gestire la lista d&apos;attesa early access e comunicare l&apos;apertura della piattaforma</li>
            <li>Inviare aggiornamenti sul progresso del prodotto (solo con consenso)</li>
            <li>Analizzare il traffico sul sito per migliorare l&apos;esperienza utente</li>
          </ul>
          <p>Non vendiamo, affittiamo o cediamo i tuoi dati a terze parti per finalità commerciali.</p>
        </div>
        <div className="legal-section">
          <h2>Servizi di terze parti</h2>
          <ul>
            <li><strong>Brevo</strong> — gestione lista email. <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy policy Brevo</a></li>
            <li><strong>Google Analytics</strong> — analisi traffico con IP anonimizzato. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy policy Google</a></li>
            <li><strong>Vercel</strong> — hosting del sito. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy policy Vercel</a></li>
          </ul>
        </div>
        <div className="legal-section">
          <h2>I tuoi diritti (GDPR)</h2>
          <ul>
            <li>Accedere ai tuoi dati personali in nostro possesso</li>
            <li>Richiedere la rettifica di dati inesatti</li>
            <li>Richiedere la cancellazione dei tuoi dati</li>
            <li>Opporti al trattamento dei tuoi dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
          </ul>
          <p>Per esercitare i tuoi diritti: <a href="mailto:privacy@realaistate.ai">privacy@realaistate.ai</a>. Risponderemo entro 30 giorni.</p>
        </div>
        <div className="legal-section">
          <h2>Contatti</h2>
          <div className="legal-highlight">
            <p><strong>Fabio Piccoli — RealAIstate</strong><br />Email: <a href="mailto:privacy@realaistate.ai">privacy@realaistate.ai</a></p>
          </div>
          <p>Hai il diritto di proporre reclamo al <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">Garante per la Protezione dei Dati Personali</a>.</p>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

// ── TERMINI PAGE ──
function TerminiPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <NavBar />
      <div className="legal-container">
        <div className="legal-eyebrow">Documento legale</div>
        <h1 className="legal-title">Termini di Servizio</h1>
        <div className="legal-date">Ultimo aggiornamento: aprile 2025</div>

        <div className="legal-section">
          <h2>1. Accettazione dei termini</h2>
          <p>Accedendo a RealAIstate (realaistate.ai) accetti i presenti Termini di Servizio. Se non li accetti, ti invitiamo a non utilizzare il sito.</p>
          <div className="legal-highlight">
            <p><strong>RealAIstate è attualmente in fase beta.</strong> Il servizio è in sviluppo attivo. Alcune funzionalità potrebbero non essere disponibili o essere modificate senza preavviso.</p>
          </div>
        </div>

        <div className="legal-section">
          <h2>2. Descrizione del servizio</h2>
          <p>RealAIstate è una piattaforma digitale che fornisce strumenti basati su intelligenza artificiale per supportare la compravendita immobiliare tra privati. Il servizio include:</p>
          <ul>
            <li>Valutazione automatica degli immobili tramite AI (Fair Price Score)</li>
            <li>Analisi delle fotografie degli immobili</li>
            <li>Generazione di descrizioni e annunci ottimizzati</li>
            <li>Connessione con professionisti certificati (notai, periti, geometri)</li>
            <li>Supporto alla negoziazione tramite strumenti AI</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Natura informativa del servizio</h2>
          <p>Le valutazioni, i punteggi e le analisi fornite dall&apos;AI di RealAIstate hanno natura <strong>esclusivamente informativa</strong> e non costituiscono:</p>
          <ul>
            <li>Consulenza professionale immobiliare ai sensi di legge</li>
            <li>Perizia tecnica o stima ufficiale del valore dell&apos;immobile</li>
            <li>Consulenza legale o fiscale</li>
            <li>Garanzia sul prezzo di vendita o acquisto</li>
          </ul>
          <p>RealAIstate non è un&apos;agenzia immobiliare e non svolge attività di intermediazione ai sensi della Legge 39/1989. L&apos;utente è responsabile delle proprie decisioni di acquisto o vendita.</p>
        </div>

        <div className="legal-section">
          <h2>4. Obblighi dell&apos;utente</h2>
          <p>Utilizzando RealAIstate ti impegni a:</p>
          <ul>
            <li>Fornire informazioni veritiere e accurate sugli immobili</li>
            <li>Non utilizzare il servizio per finalità illecite o fraudolente</li>
            <li>Non pubblicare contenuti offensivi, discriminatori o lesivi di diritti di terzi</li>
            <li>Non tentare di aggirare i sistemi di sicurezza della piattaforma</li>
            <li>Rispettare la normativa vigente in materia di compravendita immobiliare</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Limitazione di responsabilità</h2>
          <p>RealAIstate non è responsabile per:</p>
          <ul>
            <li>Decisioni di acquisto o vendita prese sulla base delle analisi AI</li>
            <li>Eventuali discrepanze tra il Fair Price Score e il valore reale di mercato</li>
            <li>Il comportamento di terzi (acquirenti, venditori, professionisti) connessi tramite la piattaforma</li>
            <li>Interruzioni del servizio dovute a manutenzione o cause tecniche</li>
            <li>Perdite economiche derivanti dall&apos;utilizzo del servizio</li>
          </ul>
          <p>Il servizio è fornito "così com&apos;è" (as is), senza garanzie esplicite o implicite di risultato.</p>
        </div>

        <div className="legal-section">
          <h2>6. Proprietà intellettuale</h2>
          <p>Tutti i contenuti di RealAIstate — inclusi testi, grafica, codice, loghi e design — sono di proprietà di Fabio Piccoli / RealAIstate e sono protetti dalle leggi sul diritto d&apos;autore. È vietata la riproduzione senza autorizzazione scritta.</p>
          <p>I contenuti caricati dagli utenti (foto, descrizioni) rimangono di proprietà dell&apos;utente. Caricandoli, l&apos;utente concede a RealAIstate una licenza non esclusiva per utilizzarli ai fini del servizio.</p>
        </div>

        <div className="legal-section">
          <h2>7. Modifiche al servizio</h2>
          <p>RealAIstate si riserva il diritto di modificare, sospendere o interrompere il servizio in qualsiasi momento, con o senza preavviso. In caso di modifiche sostanziali ai presenti Termini, gli utenti registrati saranno informati via email.</p>
        </div>

        <div className="legal-section">
          <h2>8. Legge applicabile</h2>
          <p>I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro di Milano.</p>
        </div>

        <div className="legal-section">
          <h2>9. Contatti</h2>
          <div className="legal-highlight">
            <p><strong>Fabio Piccoli — RealAIstate</strong><br />Email: <a href="mailto:info@realaistate.ai">info@realaistate.ai</a><br />Sito web: www.realaistate.ai</p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/termini" element={<TerminiPage />} />
        <Route path="/scuse" element={<ScusePage />} />
        <Route path="/compra/:id" element={<ImmobilePage />} />
        <Route path="/compra/:id/vendi" element={<ImmobileVenditore />} />
        <Route path="/immobile/:id/report-foto" element={<ReportFotoPage />} />
        <Route path="/metodologia" element={<MetodologiaPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/vendi" element={<VendiForm />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/come-funziona" element={<ComeFunziona />} />
        <Route path="/affitti" element={<AffittiPage />} />
        <Route path="/compra" element={<ListingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticolo />} />
        <Route path="/en" element={<HomeEN />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

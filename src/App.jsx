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
import HomePage from "./HomePage.jsx";
import ScusePage from "./ScusePage.jsx";
import LoginPage from "./LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AccountPage from "./AccountPage.jsx";
import Privacy from "./Privacy.jsx";
import Termini from "./Termini.jsx";
import VenditoreDashboard from "./VenditoreDashboard.jsx";

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
.nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; transition: color 0.2s; }
.nav-logo:hover { color: #7c3aed; }
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

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termini" element={<Termini />} />
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
        <Route path="/venditore" element={<ProtectedRoute><VenditoreDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

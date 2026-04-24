# ScamShield — Internship Scam Detector 🛡️

An AI-powered web app that helps students detect fake 
and fraudulent internship postings instantly.

## Problem it Solves
Thousands of students fall for fake internships that 
charge registration fees or steal personal data. 
ScamShield uses Google Gemini AI to analyze any 
internship offer and detect scams in seconds.

## Features
- 🤖 AI-powered scam analysis using Google Gemini
- 📊 Scam probability score (0-100%) with risk level
- ⚠️ Detailed red flags breakdown
- 🚨 Community scam reporting system
- 📋 Browse all reported scams
- 🔐 User authentication (Sign Up / Sign In)
- ✨ Smooth animations and mobile responsive design

## How it Works
1. User pastes internship description
2. Frontend sends text to Supabase Edge Function
3. Backend calls Google Gemini AI
4. AI returns scam score, risk level and red flags
5. Results displayed beautifully with color coded verdict

## Tech Stack
React | TypeScript | Supabase | Google Gemini AI  
Tailwind CSS | shadcn/ui | Framer Motion | PostgreSQL

## Live Demo
👉 https://safe-internship-finder.lovable.app

## Why I Built This
I was personally searching for government internships 
and found many fake postings asking for money. 
Built ScamShield to help students stay safe.

"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import SplashAnimation from "../components/SplashAnimation";
import { useState } from "react";
import { Target, Trophy, Dribbble } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="flex min-h-screen flex-col text-zinc-900 dark:text-zinc-50 overflow-x-hidden">
      {showSplash && (
        <SplashAnimation onComplete={() => setShowSplash(false)} />
      )}

      {!showSplash && <Navbar />}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          <div className="torch-container">
            <div className="torch-flash-overlay"></div>
            <h1 className="torch-text text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-red-600 to-white bg-clip-text text-transparent">
              Copascore
            </h1>
          </div>
        </div>

        <p className="text-xl text-zinc-900 dark:text-zinc-400 max-w-lg mb-12">
          Advanced football analytics and simulation engine. Predict match outcomes, analyze player stats, and simulate entire leagues.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Link href="/predict" className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-500 transition-all hover:shadow-lg">
            <div className="text-3xl mb-4 flex justify-center text-red-500">
              <Target size={40} />
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">Match Prediction</h2>
            <p className="text-zinc-500 text-sm">Predict match outcomes using advanced machine learning models and SHAP analysis.</p>
          </Link>

          <Link href="/simulate" className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg">
            <div className="text-3xl mb-4 flex justify-center text-blue-500">
              <Trophy size={40} />
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">League Simulation</h2>
            <p className="text-zinc-500 text-sm">Simulate entire seasons and view projected league tables based on team strength.</p>
          </Link>

          <Link href="/players" className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg">
            <div className="text-3xl mb-4 flex justify-center text-green-500">
              <Dribbble size={40} />
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">Player Database</h2>
            <p className="text-zinc-500 text-sm">Search and analyze detailed stats for over 17,000 players from the FIFA database.</p>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} Copascore Analytics
      </footer>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import Navbar from '../../components/Navbar';
import { Trophy, Play, RefreshCw, Loader2, TrendingUp, AlertCircle } from 'lucide-react';

interface TableRow {
    position: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
    goal_diff?: number;
}

export default function SimulatePage() {
    const [table, setTable] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [simulated, setSimulated] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const result = await api.simulateSeason();
            setTable(result);
            setSimulated(true);
        } catch (err) {
            console.error(err);
            alert('Simulation failed. Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                    }}
                />
            </div>

            <Navbar />

            <main className="max-w-5xl mx-auto py-12 px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
                                League Simulation
                            </span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-xl">
                            Simulate an entire Premier League season based on current team strength and AI performance models.
                        </p>
                    </div>

                    <button
                        onClick={handleSimulate}
                        disabled={loading}
                        className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <div className="relative flex items-center gap-3">
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Simulating Season...</span>
                                </>
                            ) : (
                                <>
                                    {simulated ? <RefreshCw className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                                    <span>{simulated ? 'Simulate Again' : 'Start Simulation'}</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>

                {table.length > 0 ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-2 text-yellow-500">
                                    <Trophy className="w-5 h-5" />
                                    <span className="font-semibold">Champion</span>
                                </div>
                                <div className="text-2xl font-bold">{table[0].team}</div>
                                <div className="text-sm text-zinc-400">{table[0].points} Points</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-2 text-green-500">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="font-semibold">Top 4 Finish</span>
                                </div>
                                <div className="text-sm text-zinc-300">
                                    {table.slice(0, 4).map(t => t.team).join(', ')}
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-2 text-red-500">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold">Relegated</span>
                                </div>
                                <div className="text-sm text-zinc-300">
                                    {table.slice(-3).map(t => t.team).join(', ')}
                                </div>
                            </div>
                        </div>

                        {/* Main Table */}
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left min-w-[600px]">
                                    <thead className="bg-white/5 text-zinc-400 uppercase font-medium text-xs tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Pos</th>
                                            <th className="px-6 py-4">Team</th>
                                            <th className="px-6 py-4 text-center">P</th>
                                            <th className="px-6 py-4 text-center">W</th>
                                            <th className="px-6 py-4 text-center">D</th>
                                            <th className="px-6 py-4 text-center">L</th>
                                            <th className="px-6 py-4 text-center font-bold text-white">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {table.map((row, index) => {
                                            let rowClass = "hover:bg-white/5 transition-colors";
                                            let posClass = "font-medium text-zinc-500";

                                            // Champions League spots
                                            if (index < 4) {
                                                rowClass += " bg-blue-500/5 hover:bg-blue-500/10";
                                                posClass = "font-bold text-blue-400";
                                            }
                                            // Relegation spots
                                            if (index >= table.length - 3) {
                                                rowClass += " bg-red-500/5 hover:bg-red-500/10";
                                                posClass = "font-bold text-red-400";
                                            }
                                            // Champion
                                            if (index === 0) {
                                                rowClass = "bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors";
                                                posClass = "font-bold text-yellow-500";
                                            }

                                            return (
                                                <tr key={row.team} className={rowClass}>
                                                    <td className="px-6 py-4">
                                                        <span className={posClass}>{row.position}</span>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-zinc-200 flex items-center gap-3">
                                                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                                                        {row.team}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-zinc-400">{row.played}</td>
                                                    <td className="px-6 py-4 text-center text-green-500 font-medium">{row.won}</td>
                                                    <td className="px-6 py-4 text-center text-zinc-500">{row.drawn}</td>
                                                    <td className="px-6 py-4 text-center text-red-500 font-medium">{row.lost}</td>
                                                    <td className="px-6 py-4 text-center font-bold text-white text-base">{row.points}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-zinc-800 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <Trophy className="w-10 h-10 text-zinc-700" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-200 mb-2">Ready to Simulate</h3>
                        <p className="text-zinc-500 max-w-md">
                            Click the button above to generate a full season simulation based on our advanced AI models.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

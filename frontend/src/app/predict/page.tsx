'use client';

import { useState, useEffect } from 'react';
import { api, League, Team, Odds } from '@/services/api';
import Navbar from '../../components/Navbar';
import AIAnalyst from '../../components/AIAnalyst';
import { Target, TrendingUp, Sparkles } from 'lucide-react';
import type { MatchPrediction } from '@/types';

export default function PredictPage() {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [awayTeam, setAwayTeam] = useState<Team | null>(null);
    const [odds, setOdds] = useState<Odds | null>(null);
    const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingOdds, setLoadingOdds] = useState(false);

    useEffect(() => {
        // Load available leagues
        const loadLeagues = async () => {
            const availableLeagues = await api.getLeagues();
            setLeagues(availableLeagues);
        };
        loadLeagues();
    }, []);

    useEffect(() => {
        // Load teams when league is selected
        if (selectedLeague) {
            const loadTeams = async () => {
                setLoadingTeams(true);
                setHomeTeam(null);
                setAwayTeam(null);
                setPrediction(null);
                setOdds(null);
                try {
                    const leagueTeams = await api.getTeamsByLeague(selectedLeague.id);
                    setTeams(leagueTeams);
                } catch (err) {
                    console.error('Failed to load teams:', err);
                } finally {
                    setLoadingTeams(false);
                }
            };
            loadTeams();
        }
    }, [selectedLeague]);

    useEffect(() => {
        // Try to fetch odds when both teams are selected
        if (homeTeam && awayTeam) {
            const fetchOdds = async () => {
                setLoadingOdds(true);
                setOdds(null);
                try {
                    const matchOdds = await api.getMatchOdds(homeTeam.id, awayTeam.id);
                    if (matchOdds) {
                        setOdds(matchOdds);
                    }
                } catch (err) {
                    console.error('Error fetching odds:', err);
                } finally {
                    setLoadingOdds(false);
                }
            };
            fetchOdds();
        }
    }, [homeTeam, awayTeam]);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLeague || !homeTeam || !awayTeam) {
            alert('Please select league and both teams');
            return;
        }

        if (!odds) {
            alert('No odds available for this match. Prediction usually requires odds data.');
            // Optionally allow proceeding without odds, but for now we'll require them or mock them in backend? 
            // Logic in api.predictMatch sends odds. If null, it might fail.
            // We can check if api.predictMatch handles missing odds.
            // Assuming strict requirement for now.
            return;
        }

        setLoading(true);
        try {
            const result = await api.predictMatch(
                selectedLeague.name,
                homeTeam.name,
                awayTeam.name,
                odds
            );
            setPrediction(result);
        } catch (err) {
            console.error(err);
            alert('Prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />

            {/* Animated Gradient Orbs */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 relative z-10">
                {/* Compact Header */}
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative rounded-2xl p-6 shadow-xl overflow-hidden backdrop-blur-sm border border-zinc-800/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-white/5 to-red-600/10" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

                        <div className="relative flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
                                <Target size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    Match Prediction
                                    <Sparkles size={18} className="text-yellow-400" />
                                </h1>
                                <p className="text-zinc-400 text-xs font-medium">AI-Powered Football Analysis</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form & Info (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Match Details Form */}
                        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-zinc-800/50">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-red-500" />
                                Match Details
                            </h2>

                            <form onSubmit={handlePredict} className="space-y-4">
                                {/* League Selection */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Select League</label>
                                    <select
                                        className="w-full p-3 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                        value={selectedLeague?.id || ''}
                                        onChange={(e) => setSelectedLeague(leagues.find(l => l.id === Number(e.target.value)) || null)}
                                        required
                                    >
                                        <option value="">Choose a league...</option>
                                        {leagues.map(league => (
                                            <option key={league.id} value={league.id}>
                                                {league.name} ({league.country})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Home Team Selection */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Home Team</label>
                                    <select
                                        className="w-full p-3 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all disabled:opacity-50"
                                        value={homeTeam?.id || ''}
                                        onChange={(e) => setHomeTeam(teams.find(t => t.id === Number(e.target.value)) || null)}
                                        disabled={!selectedLeague || loadingTeams}
                                        required
                                    >
                                        <option value="">
                                            {loadingTeams ? 'Loading teams...' : 'Select home team...'}
                                        </option>
                                        {teams.filter(t => t.id !== awayTeam?.id).map(team => (
                                            <option key={team.id} value={team.id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Away Team Selection */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Away Team</label>
                                    <select
                                        className="w-full p-3 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all disabled:opacity-50"
                                        value={awayTeam?.id || ''}
                                        onChange={(e) => setAwayTeam(teams.find(t => t.id === Number(e.target.value)) || null)}
                                        disabled={!selectedLeague || loadingTeams}
                                        required
                                    >
                                        <option value="">
                                            {loadingTeams ? 'Loading teams...' : 'Select away team...'}
                                        </option>
                                        {teams.filter(t => t.id !== homeTeam?.id).map(team => (
                                            <option key={team.id} value={team.id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Odds Section */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center justify-between">
                                        <span>Betting Odds (Auto-fetched)</span>
                                        {loadingOdds && <span className="text-yellow-400 text-[10px] animate-pulse">(Fetching...)</span>}
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">Home</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 rounded-lg border border-zinc-700/50 bg-zinc-800/40 text-white text-sm font-semibold cursor-not-allowed opacity-80"
                                                value={odds ? odds.home.toFixed(2) : ''}
                                                placeholder="N/A"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">Draw</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 rounded-lg border border-zinc-700/50 bg-zinc-800/40 text-white text-sm font-semibold cursor-not-allowed opacity-80"
                                                value={odds ? odds.draw.toFixed(2) : ''}
                                                placeholder="N/A"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">Away</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 rounded-lg border border-zinc-700/50 bg-zinc-800/40 text-white text-sm font-semibold cursor-not-allowed opacity-80"
                                                value={odds ? odds.away.toFixed(2) : ''}
                                                placeholder="N/A"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    {homeTeam && awayTeam && !loadingOdds && odds && (
                                        <p className="text-[10px] text-green-500 mt-1">
                                            Live odds found
                                        </p>
                                    )}
                                    {homeTeam && awayTeam && !loadingOdds && !odds && (
                                        <p className="text-[10px] text-red-500 mt-1">
                                            No upcoming game odds found
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !homeTeam || !awayTeam || !odds}
                                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp size={18} />
                                            Predict Outcome
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* AI Features Card */}
                        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-zinc-800/50">
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-yellow-400" />
                                AI-Powered Features
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp size={14} className="text-red-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-white mb-1">Match Predictions</h4>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed">Advanced ML models analyze team performance and betting odds</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Target size={14} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-white mb-1">Best Bets</h4>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed">Get AI-recommended betting strategies based on probability analysis</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={14} className="text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-white mb-1">Player Analytics</h4>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed">Deep dive into FIFA player stats and team formations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Results (2/3 width) */}
                    <div className="lg:col-span-2">
                        {prediction ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {/* Prediction Result Card */}
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
                                    <div className="text-center mb-6">
                                        <h3 className="text-sm font-semibold text-zinc-400 mb-2">{selectedLeague?.name}</h3>
                                        <div className="text-2xl font-bold text-white">
                                            {homeTeam?.name} <span className="text-red-400">vs</span> {awayTeam?.name}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-6">
                                        <div className="text-center flex-1">
                                            <div className="relative inline-block mb-2">
                                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-500/25">
                                                    {homeTeam?.name.charAt(0)}
                                                </div>
                                                <div className="absolute inset-0 bg-red-500 blur-lg opacity-20 animate-pulse"></div>
                                            </div>
                                            <h3 className="font-bold text-lg">{homeTeam?.name}</h3>
                                            <p className="text-red-400 text-xs font-medium">Home</p>
                                        </div>

                                        <div className="text-center px-6">
                                            <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">VS</div>
                                            <div className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
                                                {prediction.prediction}
                                            </div>
                                        </div>

                                        <div className="text-center flex-1">
                                            <div className="relative inline-block mb-2">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/25">
                                                    {awayTeam?.name.charAt(0)}
                                                </div>
                                                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 animate-pulse"></div>
                                            </div>
                                            <h3 className="font-bold text-lg">{awayTeam?.name}</h3>
                                            <p className="text-blue-400 text-xs font-medium">Away</p>
                                        </div>
                                    </div>

                                    {/* Prediction Bars */}
                                    <div className="space-y-3">
                                        <div className="relative h-12 flex rounded-lg overflow-hidden shadow-lg">
                                            <div
                                                className="bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000 relative"
                                                style={{ width: `${prediction.home_win_probability}%` }}
                                            ></div>
                                            <div
                                                className="bg-zinc-700 transition-all duration-1000 relative"
                                                style={{ width: `${prediction.draw_probability}%` }}
                                            ></div>
                                            <div
                                                className="bg-gradient-to-l from-blue-600 to-blue-500 transition-all duration-1000 relative"
                                                style={{ width: `${prediction.away_win_probability}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between text-xs px-1">
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm shadow-red-600/50"></div>
                                                    <span className="text-zinc-400">Home Win</span>
                                                </div>
                                                <span className="text-white font-bold text-sm">{prediction.home_win_probability.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                                    <span className="text-zinc-400">Draw</span>
                                                </div>
                                                <span className="text-white font-bold text-sm">{prediction.draw_probability.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-600/50"></div>
                                                    <span className="text-zinc-400">Away Win</span>
                                                </div>
                                                <span className="text-white font-bold text-sm">{prediction.away_win_probability.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Analysis */}
                                    <div className="mt-6 p-4 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles size={16} className="text-yellow-400" />
                                            <h4 className="text-sm font-semibold">AI Analysis</h4>
                                        </div>
                                        <p className="text-sm text-zinc-300 leading-relaxed">{prediction.reasoning}</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs text-zinc-400">Confidence:</span>
                                            <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                                                    style={{ width: `${prediction.confidence}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-green-400">{prediction.confidence}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Analyst */}
                                <AIAnalyst
                                    homeTeam={homeTeam?.name || ''}
                                    awayTeam={awayTeam?.name || ''}
                                    prediction={prediction}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                                        <Target size={40} className="text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Ready to Predict</h3>
                                    <p className="text-zinc-400 text-sm max-w-md">
                                        Select a league, choose two teams, and click Predict to get AI-powered match analysis.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

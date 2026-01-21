'use client';

import { useState, useEffect } from 'react';
import { api, League, Team } from '@/services/api';
import Navbar from '../../components/Navbar';
import { Database, Loader2, ChevronDown, ChevronUp, Trophy, Users, TrendingUp, Target } from 'lucide-react';
import type { PlayerCard } from '@/types';

export default function APIDataPage() {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [players, setPlayers] = useState<PlayerCard[]>([]);

    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    const [expandedSections, setExpandedSections] = useState({
        leagues: true,
        teams: true,
        players: true,
        rawData: false,
    });

    useEffect(() => {
        const loadLeagues = async () => {
            const availableLeagues = await api.getLeagues();
            setLeagues(availableLeagues);
            if (availableLeagues.length > 0) {
                setSelectedLeague(availableLeagues[0]);
            }
        };
        loadLeagues();
    }, []);

    useEffect(() => {
        if (selectedLeague) {
            // Load Teams
            const loadTeams = async () => {
                setLoadingTeams(true);
                setTeams([]);
                setSelectedTeam(null);
                setPlayers([]);
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
        if (selectedTeam) {
            const loadPlayers = async () => {
                setLoadingPlayers(true);
                try {
                    const teamPlayers = await api.getTeamPlayers(selectedTeam.id);
                    setPlayers(teamPlayers);
                } catch (err) {
                    console.error('Failed to load players:', err);
                } finally {
                    setLoadingPlayers(false);
                }
            };
            loadPlayers();
        }
    }, [selectedTeam]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            <Navbar />

            <main className="max-w-7xl mx-auto py-8 px-4 relative z-10">
                {/* Header */}
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative rounded-2xl p-6 shadow-xl overflow-hidden backdrop-blur-sm border border-zinc-800/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-blue-600/10" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

                        <div className="relative flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <Database size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">API Data Viewer</h1>
                                <p className="text-zinc-400 text-xs font-medium">Explore real-time data from SportsMonks API</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leagues Section */}
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800/50 overflow-hidden">
                        <button
                            onClick={() => toggleSection('leagues')}
                            className="w-full p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Trophy size={20} className="text-yellow-400" />
                                <h2 className="text-lg font-bold">Available Leagues</h2>
                                <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full font-semibold">
                                    {leagues.length} leagues
                                </span>
                            </div>
                            {expandedSections.leagues ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedSections.leagues && (
                            <div className="p-5 pt-0 space-y-3">
                                {leagues.map((league) => (
                                    <div
                                        key={league.id}
                                        onClick={() => setSelectedLeague(league)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedLeague?.id === league.id
                                                ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                                : 'bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 hover:border-blue-500/30'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white">{league.name}</h3>
                                                <p className="text-xs text-zinc-400 mt-1">{league.country}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-500">League ID</p>
                                                <p className="font-mono text-sm text-blue-400">{league.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Teams Section */}
                {selectedLeague && (
                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800/50 overflow-hidden">
                            <button
                                onClick={() => toggleSection('teams')}
                                className="w-full p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Users size={20} className="text-green-400" />
                                    <h2 className="text-lg font-bold">Teams in {selectedLeague.name}</h2>
                                    {!loadingTeams && (
                                        <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full font-semibold">
                                            {teams.length} teams
                                        </span>
                                    )}
                                </div>
                                {expandedSections.teams ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {expandedSections.teams && (
                                <div className="p-5 pt-0">
                                    {loadingTeams ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 size={32} className="animate-spin text-green-400" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {teams.map((team) => (
                                                <div
                                                    key={team.id}
                                                    onClick={() => setSelectedTeam(team)}
                                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTeam?.id === team.id
                                                            ? 'bg-green-600/20 border-green-500/50 shadow-lg shadow-green-500/10'
                                                            : 'bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 hover:border-green-500/30'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {team.image_path ? (
                                                            <img src={team.image_path} alt={team.name} className="w-10 h-10 rounded-lg object-contain bg-white/5" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold">
                                                                {team.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-white text-sm truncate">{team.name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {team.short_code && (
                                                                    <span className="text-xs bg-zinc-700/50 px-2 py-0.5 rounded text-zinc-300">
                                                                        {team.short_code}
                                                                    </span>
                                                                )}
                                                                <span className="text-xs text-zinc-500 font-mono">ID: {team.id}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Players Section */}
                {selectedTeam && (
                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800/50 overflow-hidden">
                            <button
                                onClick={() => toggleSection('players')}
                                className="w-full p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Target size={20} className="text-purple-400" />
                                    <h2 className="text-lg font-bold">Players in {selectedTeam.name}</h2>
                                    {!loadingPlayers && players.length > 0 && (
                                        <span className="text-xs bg-purple-400/20 text-purple-400 px-2 py-1 rounded-full font-semibold">
                                            {players.length} players
                                        </span>
                                    )}
                                </div>
                                {expandedSections.players ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {expandedSections.players && (
                                <div className="p-5 pt-0">
                                    {loadingPlayers ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 size={32} className="animate-spin text-purple-400" />
                                        </div>
                                    ) : players.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {players.map((player, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 hover:bg-zinc-800/60 transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-white text-sm">{player.name}</h3>
                                                            <p className="text-xs text-zinc-400 mt-1">{player.position}</p>
                                                        </div>
                                                        {player.number > 0 && (
                                                            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                                <span className="text-xs font-bold text-purple-400">{player.number}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div className="bg-zinc-900/50 rounded-lg p-2">
                                                            <p className="text-zinc-500">Age</p>
                                                            <p className="text-white font-semibold">{player.age || 'N/A'}</p>
                                                        </div>
                                                        <div className="bg-zinc-900/50 rounded-lg p-2">
                                                            <p className="text-zinc-500">Nationality</p>
                                                            <p className="text-white font-semibold truncate">{player.nationality || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-zinc-400">No player data available for this team</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Raw JSON Data Section */}
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800/50 overflow-hidden">
                        <button
                            onClick={() => toggleSection('rawData')}
                            className="w-full p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Database size={20} className="text-red-400" />
                                <h2 className="text-lg font-bold">Raw JSON Data</h2>
                            </div>
                            {expandedSections.rawData ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedSections.rawData && (
                            <div className="p-5 pt-0">
                                <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/50 overflow-auto max-h-96">
                                    <pre className="text-xs text-green-400 font-mono">
                                        {JSON.stringify(
                                            {
                                                leagues,
                                                selectedLeague,
                                                teams,
                                                selectedTeam,
                                                players
                                            },
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

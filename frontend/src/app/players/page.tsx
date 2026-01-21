'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import Navbar from '../../components/Navbar';
import PlayerCard from '../../components/PlayerCard';
import Link from 'next/link';
import { Search, Loader2, Users, Filter } from 'lucide-react';

interface Player {
    short_name: string;
    overall: number;
    club_name?: string;
    nationality_name?: string;
    player_positions?: string;
    pace?: number;
    shooting?: number;
    passing?: number;
    dribbling?: number;
    defending?: number;
    physic?: number;
    age?: number;
    height_cm?: number;
    weight_kgs?: number;
    // Added for compatibility with API response
    name?: string;
    nationality?: string;
    number?: number;
    position?: string;
    radar?: Record<string, number>;
    detailed?: Record<string, number>;
}

export default function PlayersPage() {
    const [query, setQuery] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<'overall' | 'age' | 'pace'>('overall');

    useEffect(() => {
        // Load default players on mount - will use SportsMonk API
        const fetchDefaultPlayers = async () => {
            setLoading(true);
            try {
                // Get teams from default league
                const teams = await api.getTeams();
                const allPlayers: Player[] = [];

                // Fetch players from first 3 teams to avoid heavy initial load
                // (reduced from 5 to avoid potential rate limits or long wait)
                for (let i = 0; i < Math.min(3, teams.length); i++) {
                    const teamPlayers = await api.getTeamPlayers(teams[i].id);
                    // Add team name to player object for context if needed
                    const playersWithClub = teamPlayers.map(p => ({
                        ...p,
                        club_name: teams[i].name,
                        // Map missing required fields
                        short_name: p.name,
                        overall: 70, // Placeholder
                        // Optional fields mapping
                        nationality_name: p.nationality,
                        player_positions: p.position
                    }));
                    allPlayers.push(...playersWithClub);
                }

                setPlayers(allPlayers);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDefaultPlayers();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Since API search is limited on free plan, we might just filter current players
        // OR try to find a team with that name from our list (if we had all teams loaded).
        // For now, let's just filter the currently loaded players.
        // A better implementation would be to search through all available teams first.

        // Ensure we have some players
        if (players.length === 0) return;

        // This is a client-side filter for now
        // In a real app with full API access, we would call the search endpoint
        console.log("Filtering locally for:", query);
    };

    // Filter players based on search query
    const filteredPlayers = players.filter(p =>
        p.short_name?.toLowerCase().includes(query.toLowerCase()) ||
        p.club_name?.toLowerCase().includes(query.toLowerCase())
    );

    // Sort players based on selection
    const sortedPlayers = [...filteredPlayers].sort((a, b) => {
        if (sortBy === 'overall') return (b.overall || 0) - (a.overall || 0); // Handle missing overall
        if (sortBy === 'age') return (a.age || 0) - (b.age || 0);
        if (sortBy === 'pace') return (b.pace || 0) - (a.pace || 0);
        return 0;
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
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

            <main className="max-w-7xl mx-auto py-12 px-4 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
                                Player Database
                            </span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-xl">
                            Search and analyze detailed stats for over 17,000 players from the official FIFA database.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full md:w-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-xl w-full md:min-w-[320px]">
                            <Search className="w-5 h-5 text-zinc-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Search players..."
                                className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 focus:outline-none outline-none px-4 py-2 w-full"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-zinc-500">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Users className="w-4 h-4" />
                        <span>{players.length} Players Found</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Filter className="w-4 h-4" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'overall' | 'age' | 'pace')}
                            className="bg-transparent border-none focus:ring-0 text-zinc-300 cursor-pointer outline-none appearance-none pr-8"
                            style={{ backgroundImage: 'none' }}
                        >
                            <option value="overall" className="bg-zinc-900">Sorted by Overall</option>
                            <option value="age" className="bg-zinc-900">Sorted by Age</option>
                            <option value="pace" className="bg-zinc-900">Sorted by Pace</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                )}

                {/* Players Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {sortedPlayers.map((player, index) => {
                            // Cycle through color variants
                            const variants: Array<'red' | 'blue' | 'dark'> = ['red', 'blue', 'dark'];
                            const variant = variants[index % 3];

                            return (
                                <Link
                                    href={`/players/${encodeURIComponent(player.short_name)}`}
                                    key={player.short_name + index}
                                    className="block transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    <PlayerCard player={player} variant={variant} />
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && players.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-zinc-800 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <Search className="w-10 h-10 text-zinc-700" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-200 mb-2">No players found</h3>
                        <p className="text-zinc-500 max-w-md">
                            We couldn&apos;t find any players matching &quot;{query}&quot;. Try searching for a different name.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

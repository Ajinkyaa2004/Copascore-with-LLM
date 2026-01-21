'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface Player {
    short_name: string;
    long_name: string;
    overall: number;
    club_name: string;
    nationality_name: string;
    player_positions: string;
    age: number;
    dob: string;
    height_cm: number;
    weight_kg: number;
    league_name: string;
    club_position: string;
    club_jersey_number: number;
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physic: number;
    player_face_url: string;
}

export default function PlayerDetailsPage({ params }: { params: Promise<{ name: string }> }) {
    const resolvedParams = use(params);
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                // Decode the URL encoded name
                const decodedName = decodeURIComponent(resolvedParams.name);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/fifa/player/${decodedName}`);
                setPlayer(res.data);
            } catch (err) {
                console.error(err);
                setError('Player not found');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [resolvedParams.name]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <div className="text-xl">Loading player details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
                    <div className="text-xl text-red-400">{error || 'Player not found'}</div>
                    <Link href="/players" className="text-blue-400 hover:text-blue-300 hover:underline">
                        Back to Players
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
            <Navbar />
            <main className="max-w-4xl mx-auto py-12 px-4">
                <Link href="/players" className="inline-block mb-8 text-zinc-400 hover:text-zinc-100 transition-colors">
                    ← Back to Players
                </Link>

                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-zinc-800/50 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{player.long_name || player.short_name}</h1>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 font-medium">
                                        {player.club_name}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
                                        {player.nationality_name}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
                                        {player.player_positions}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center bg-zinc-50 text-zinc-900 rounded-xl p-4 min-w-[100px]">
                                <span className="text-xs uppercase font-bold tracking-wider opacity-80">Overall</span>
                                <span className="text-4xl font-bold">{player.overall}</span>
                            </div>
                        </div>
                    </div>

                    {/* Radar Chart Section - PERFORMANCE */}
                    <div className="p-8 border-b border-zinc-800/50 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                        <h2 className="text-xl font-bold mb-6 text-center tracking-wider">PERFORMANCE</h2>
                        <div className="max-w-md mx-auto">
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={[
                                    { stat: 'PAC', value: player.pace || 0, fullMark: 100 },
                                    { stat: 'SHO', value: player.shooting || 0, fullMark: 100 },
                                    { stat: 'PAS', value: player.passing || 0, fullMark: 100 },
                                    { stat: 'DRI', value: player.dribbling || 0, fullMark: 100 },
                                    { stat: 'DEF', value: player.defending || 0, fullMark: 100 },
                                    { stat: 'PHY', value: player.physic || 0, fullMark: 100 },
                                ]}>
                                    <PolarGrid strokeWidth={1} stroke="#555" />
                                    <PolarAngleAxis
                                        dataKey="stat"
                                        tick={{ fill: '#999', fontSize: 13, fontWeight: 'bold' }}
                                    />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Stats"
                                        dataKey="value"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.7}
                                        strokeWidth={2}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Player Attributes */}
                    <div className="p-8">
                        <h2 className="text-xl font-bold mb-6">Player Attributes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Pace</span>
                                    <span className="font-bold">{player.pace}</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${player.pace}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Shooting</span>
                                    <span className="font-bold">{player.shooting}</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${player.shooting}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Passing</span>
                                    <span className="font-bold">{player.passing}</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${player.passing}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Dribbling</span>
                                    <span className="font-bold">{player.dribbling}</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${player.dribbling}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Defending</span>
                                    <span className="font-bold">{player.defending}</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${player.defending}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Physical</span>
                                    <span className="font-bold">{player.physic}</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${player.physic}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Bio & Details */}
                        <div className="mt-10 pt-8 border-t border-zinc-800">
                            <h2 className="text-xl font-bold mb-6">Bio & Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                <div>
                                    <div className="text-zinc-400 mb-1">Age</div>
                                    <div className="font-medium">{player.age} years</div>
                                </div>
                                <div>
                                    <div className="text-zinc-400 mb-1">Height</div>
                                    <div className="font-medium">{player.height_cm} cm</div>
                                </div>
                                <div>
                                    <div className="text-zinc-400 mb-1">Weight</div>
                                    <div className="font-medium">{player.weight_kg} kg</div>
                                </div>
                                <div>
                                    <div className="text-zinc-400 mb-1">Jersey Number</div>
                                    <div className="font-medium">#{player.club_jersey_number}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface PlayerCardProps {
    player: {
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
    };
    variant?: 'red' | 'blue' | 'dark';
}

export default function PlayerCard({ player, variant = 'red' }: PlayerCardProps) {
    // Prepare radar chart data
    const radarData = [
        { stat: 'PAC', value: player.pace || 0, fullMark: 100 },
        { stat: 'SHO', value: player.shooting || 0, fullMark: 100 },
        { stat: 'PAS', value: player.passing || 0, fullMark: 100 },
        { stat: 'DRI', value: player.dribbling || 0, fullMark: 100 },
        { stat: 'DEF', value: player.defending || 0, fullMark: 100 },
        { stat: 'PHY', value: player.physic || 0, fullMark: 100 },
    ];

    // Color schemes
    const colorSchemes = {
        red: {
            bg: 'from-red-600 to-red-800',
            accent: 'bg-red-500',
            text: 'text-red-100',
            border: 'border-red-400',
            radarFill: '#fca5a5', // Lighter red for better contrast
            radarStroke: '#ffffff' // White stroke for definition
        },
        blue: {
            bg: 'from-blue-600 to-blue-800',
            accent: 'bg-blue-500',
            text: 'text-blue-100',
            border: 'border-blue-400',
            radarFill: '#93c5fd', // Lighter blue
            radarStroke: '#ffffff'
        },
        dark: {
            bg: 'from-zinc-800 to-zinc-950',
            accent: 'bg-purple-500',
            text: 'text-zinc-100',
            border: 'border-purple-400',
            radarFill: '#d8b4fe', // Lighter purple
            radarStroke: '#ffffff'
        }
    };

    const colors = colorSchemes[variant];

    return (
        <div className={`relative w-full max-w-sm h-[600px] bg-gradient-to-b ${colors.bg} rounded-3xl p-6 text-white shadow-2xl overflow-hidden`}>
            {/* Header with player name */}
            <div className="relative z-10 mb-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                        <h2 className="text-2xl font-bold tracking-tight truncate" title={player.short_name}>{player.short_name}</h2>
                        <p className={`text-sm ${colors.text} mt-1`}>{player.club_name || 'Free Agent'}</p>
                    </div>
                    <div className={`${colors.accent} px-4 py-2 rounded-xl text-2xl font-bold shadow-lg`}>
                        {player.overall}
                    </div>
                </div>
            </div>

            {/* Player Image Placeholder */}
            <div className="relative z-10 flex justify-center items-center h-48 mb-4">
                <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center">
                    <div className="text-6xl font-bold text-white/50">{player.short_name.charAt(0)}</div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className={`relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border ${colors.border}/20`}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 opacity-70">Overview</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                        <div className="text-2xl font-bold">{player.age || 'N/A'}</div>
                        <div className="text-xs opacity-70">Age</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{player.height_cm ? `${player.height_cm}cm` : 'N/A'}</div>
                        <div className="text-xs opacity-70">Height</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{player.nationality_name?.substring(0, 3).toUpperCase() || 'N/A'}</div>
                        <div className="text-xs opacity-70">Nation</div>
                    </div>
                </div>
            </div>

            {/* Performance Radar */}
            <div className="relative z-10 mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70 text-center">Performance</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="45%" outerRadius="60%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.4)" />
                            <PolarAngleAxis
                                dataKey="stat"
                                tick={{ fill: 'white', fontSize: 10, fontWeight: 'bold' }}
                            />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                            <Radar
                                name="Stats"
                                dataKey="value"
                                stroke={colors.radarStroke}
                                fill={colors.radarFill}
                                fillOpacity={0.7}
                                strokeWidth={3}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Position Badge */}
            {player.player_positions && (
                <div className="absolute top-6 right-6 z-0 opacity-10">
                    <div className="text-8xl font-black">{player.player_positions.split(',')[0]}</div>
                </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, Trophy, Database, Sparkles } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/predict', label: 'Predict', icon: Target },
        { href: '/simulate', label: 'Simulate', icon: Trophy },
        { href: '/api-data', label: 'API Data', icon: Database },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />

            {/* Logo */}
            <Link href="/" className="relative group flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform">
                    <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
                    Copascore
                </span>
            </Link>

            {/* Navigation Links */}
            <div className="relative flex gap-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2
                                ${active
                                    ? 'bg-red-600/20 text-red-400 shadow-lg shadow-red-600/10'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }
                            `}
                        >
                            <Icon size={16} className={active ? 'animate-pulse' : ''} />
                            <span className="hidden md:inline">{item.label}</span>

                            {/* Active Indicator */}
                            {active && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

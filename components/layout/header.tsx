'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface PortfolioItem {
    name: string;
    href: string;
}

interface NavigationItem {
    name: string;
    href: string;
    hasDropdown?: boolean;
    submenu?: PortfolioItem[];
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isPortfoliosOpen, setIsPortfoliosOpen] = useState(false);

    const pathname = usePathname();

    // Portfolios
    const portfolios: PortfolioItem[] = [
        { name: 'Mariage', href: '/portfolio/mariage' },
        { name: 'Portrait', href: '/portfolio/portrait' },
        { name: 'Événementiel', href: '/portfolio/evenementiel' },
        { name: 'PUB', href: '/portfolio/pub' },
    ];

    // Navigation principale
    const navigation: NavigationItem[] = [
        { name: 'Accueil', href: '/' },
        { name: 'Services', href: '/services' },
        {
            name: 'Portfolio',
            href: '/portfolio',
            hasDropdown: true,
            submenu: portfolios
        },
        { name: 'À propos', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    // --- LOGIQUE DE FERMETURE ---

    // Fermer tout quand on change de page
    useEffect(() => {
        setIsMenuOpen(false);
        setIsPortfoliosOpen(false);
    }, [pathname]);

    const closeMenus = () => {
        setIsMenuOpen(false);
        setIsPortfoliosOpen(false);
    };

    // --- EFFETS SECONDAIRES ---

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
                }`}
            role="banner"
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" onClick={closeMenus} className="flex items-center gap-2 group">
                            <Image
                                src="/logo.png"
                                alt="FlexServe Logo"
                                width={180}
                                height={60}
                                priority
                                className="h-auto w-auto transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <div className="hidden lg:flex lg:items-center lg:gap-8">
                        <ul className="flex items-center gap-1" role="menubar">
                            {navigation.map((item) => (
                                <li key={item.name} role="none">
                                    {item.hasDropdown ? (
                                        <div
                                            className="relative group"
                                            onMouseEnter={() => setIsPortfoliosOpen(true)}
                                            onMouseLeave={() => setIsPortfoliosOpen(false)}
                                        >
                                            <button
                                                className={`flex items-center gap-1 px-4 py-2 font-medium transition-all rounded-lg hover:bg-gray-50 ${isActive(item.href) ? 'text-[#2d4a6a] font-bold' : 'text-gray-600'
                                                    }`}
                                                aria-expanded={isPortfoliosOpen}
                                                role="menuitem"
                                            >
                                                {item.name}
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isPortfoliosOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            <div className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 ${isPortfoliosOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                                                }`}>
                                                {item.submenu?.map((portfolio) => (
                                                    <Link
                                                        key={portfolio.name}
                                                        href={portfolio.href}
                                                        onClick={closeMenus}
                                                        className={`block px-4 py-3 transition-colors ${pathname === portfolio.href
                                                                ? 'bg-[#3d5a7a] text-white font-semibold'
                                                                : 'text-gray-700 hover:bg-[#3d5a7a] hover:text-white'
                                                            }`}
                                                    >
                                                        {portfolio.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={closeMenus}
                                            className={`block px-4 py-2 font-medium transition-all rounded-lg hover:bg-gray-50 ${isActive(item.href) ? 'text-[#2d4a6a] font-bold' : 'text-gray-600'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/reservation"
                            onClick={closeMenus}
                            className="px-6 py-2 bg-[#3d5a7a] text-white font-semibold rounded-lg hover:bg-[#2d4a6a] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Réserver
                        </Link>
                    </div>

                    {/* Menu Mobile Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Menu Mobile Overlay */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="px-2 pt-2 pb-6 space-y-1">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.hasDropdown ? (
                                    <>
                                        <button
                                            className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg ${isActive(item.href) ? 'text-[#2d4a6a] font-bold' : 'text-gray-600'
                                                }`}
                                            onClick={() => setIsPortfoliosOpen(!isPortfoliosOpen)}
                                        >
                                            {item.name}
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isPortfoliosOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${isPortfoliosOpen ? 'max-h-96' : 'max-h-0'}`}>
                                            {item.submenu?.map((portfolio) => (
                                                <Link
                                                    key={portfolio.name}
                                                    href={portfolio.href}
                                                    onClick={closeMenus}
                                                    className={`block pl-8 pr-4 py-2.5 text-sm rounded-lg ${pathname === portfolio.href
                                                            ? 'bg-[#3d5a7a] text-white font-semibold'
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {portfolio.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={closeMenus}
                                        className={`block px-4 py-3 font-medium rounded-lg ${isActive(item.href) ? 'text-[#2d4a6a] font-bold' : 'text-gray-600'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <Link
                            href="/reservation"
                            onClick={closeMenus}
                            className="block w-full mt-4 px-6 py-2 bg-[#3d5a7a] text-white text-center font-semibold rounded-lg"
                        >
                            Réserver
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
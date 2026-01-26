'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ← Ajouter cet import
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface ServiceItem {
    name: string;
    href: string;
}

interface NavigationItem {
    name: string;
    href: string;
    hasDropdown?: boolean;
    submenu?: ServiceItem[];
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    // Récupérer le chemin actuel
    const pathname = usePathname();

    // Services dynamiques
    const services: ServiceItem[] = [
        { name: 'Portrait', href: '/services/portrait' },
        { name: 'Événementiel', href: '/services/evenementiel' },
        { name: 'Mariage', href: '/services/mariage' },
        { name: 'PUB', href: '/services/videographie' },
    ];

    // Navigation principale
    const navigation: NavigationItem[] = [
        { name: 'Accueil', href: '/' },
        { name: 'Portfolio', href: '/portfolio' },
        {
            name: 'Services',
            href: '/services',
            hasDropdown: true,
            submenu: services
        },
        { name: 'À propos', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    // Fonction pour vérifier si un lien est actif
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    // Détection du scroll pour effet d'ombre
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fermer le menu mobile lors du redimensionnement
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Empêcher le scroll quand le menu mobile est ouvert
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white shadow-md'
                : 'bg-white/95 backdrop-blur-sm'
                }`}
            role="banner"
        >
            <nav
                className="container mx-auto pr-6 sm:px-6 lg:px-8"
                aria-label="Navigation principale"
            >
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                            aria-label="FlexServe - Retour à l'accueil"
                        >
                            <div className="relative">
                                <Image
                                    src="/logo.png"
                                    alt="FlexServe Logo"
                                    width={180}
                                    height={200}
                                    priority
                                    className="h-auto w-auto transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <div className="hidden lg:flex lg:items-center lg:gap-8">
                        <ul className="flex items-center gap-1" role="menubar">
                            {navigation.map((item) => (
                                <li key={item.name} role="none">
                                    {item.hasDropdown ? (
                                        <div className="relative group">
                                            <button
                                                className={`flex items-center gap-1 px-4 py-2 font-medium transition-all rounded-lg hover:bg-gray-50 ${isActive(item.href)
                                                    ? 'text-[#2d4a6a] font-bold'
                                                    : 'text-gray-600 hover:text-[#3d5a7a]'
                                                    }`}
                                                aria-expanded={isServicesOpen}
                                                aria-haspopup="true"
                                                onMouseEnter={() => setIsServicesOpen(true)}
                                                onMouseLeave={() => setIsServicesOpen(false)}
                                                role="menuitem"
                                                aria-current={isActive(item.href) ? 'page' : undefined}
                                            >
                                                {item.name}
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div
                                                className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 ${isServicesOpen
                                                    ? 'opacity-100 visible translate-y-0'
                                                    : 'opacity-0 invisible -translate-y-2'
                                                    }`}
                                                onMouseEnter={() => setIsServicesOpen(true)}
                                                onMouseLeave={() => setIsServicesOpen(false)}
                                                role="menu"
                                                aria-label="Sous-menu Services"
                                            >
                                                {item.submenu?.map((service) => (
                                                    <Link
                                                        key={service.name}
                                                        href={service.href}
                                                        className={`block px-4 py-3 transition-colors ${pathname === service.href
                                                            ? 'bg-[#3d5a7a] text-white font-semibold'
                                                            : 'text-gray-700 hover:bg-[#3d5a7a] hover:text-white'
                                                            }`}
                                                        role="menuitem"
                                                        aria-current={pathname === service.href ? 'page' : undefined}
                                                    >
                                                        {service.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`block px-4 py-2 font-medium transition-all rounded-lg hover:bg-gray-50 ${isActive(item.href)
                                                ? 'text-[#2d4a6a] font-bold'
                                                : 'text-gray-600 hover:text-[#3d5a7a]'
                                                }`}
                                            role="menuitem"
                                            aria-current={isActive(item.href) ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <Link
                            href="/reservation"
                            className="px-6 py-2 bg-[#3d5a7a] text-white font-semibold rounded-lg hover:bg-[#2d4a6a] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            aria-label="Réserver une séance photo"
                        >
                            Réserver
                        </Link>
                    </div>

                    {/* Menu Mobile Button */}
                    <button
                        type="button"
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" aria-hidden="true" />
                        ) : (
                            <Menu className="w-6 h-6" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {/* Menu Mobile */}
                <div
                    id="mobile-menu"
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen
                        ? 'max-h-screen opacity-100'
                        : 'max-h-0 opacity-0'
                        }`}
                    role="menu"
                    aria-label="Menu de navigation mobile"
                >
                    <div className="px-2 pt-2 pb-6 space-y-1">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.hasDropdown ? (
                                    <div>
                                        <button
                                            className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg transition-colors hover:bg-gray-50 ${isActive(item.href)
                                                ? 'text-[#2d4a6a] font-bold'
                                                : 'text-gray-600 hover:text-[#3d5a7a]'
                                                }`}
                                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                                            aria-expanded={isServicesOpen}
                                            role="menuitem"
                                            aria-current={isActive(item.href) ? 'page' : undefined}
                                        >
                                            {item.name}
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>

                                        {/* Submenu Mobile */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${isServicesOpen ? 'max-h-96' : 'max-h-0'
                                                }`}
                                        >
                                            {item.submenu?.map((service) => (
                                                <Link
                                                    key={service.name}
                                                    href={service.href}
                                                    className={`block pl-8 pr-4 py-2.5 text-sm rounded-lg transition-colors ${pathname === service.href
                                                        ? 'bg-[#3d5a7a] text-white font-semibold'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#3d5a7a]'
                                                        }`}
                                                    role="menuitem"
                                                    aria-current={pathname === service.href ? 'page' : undefined}
                                                >
                                                    {service.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`block px-4 py-3 font-medium rounded-lg transition-colors hover:bg-gray-50 ${isActive(item.href)
                                            ? 'text-[#2d4a6a] font-bold'
                                            : 'text-gray-600 hover:text-[#3d5a7a]'
                                            }`}
                                        role="menuitem"
                                        aria-current={isActive(item.href) ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* CTA Button Mobile */}
                        <Link
                            href="/reservation"
                            className="block w-full mt-4 px-6 py-2 bg-[#3d5a7a] text-white text-center font-semibold rounded-lg hover:bg-[#2d4a6a] transition-colors shadow-md"
                            role="menuitem"
                        >
                            Réserver
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
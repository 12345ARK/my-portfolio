import React, { useState, useEffect } from 'react';
import { Menu, X, Send, RotateCcw } from 'lucide-react';
import { PERSONAL_INFO } from '../data';
import { Toggle3DButton } from './Toggle3DButton';
import { useBlackHoleWarp } from './BlackHoleTransition';

interface NavbarProps {
  activeSection: string;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onReplayIntro }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { warpTo } = useBlackHoleWarp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    warpTo(href);
  };

  return (
    <nav
      id="navbar"
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0c10]/90 backdrop-blur-md border-b border-[#ff2a2a]/20 shadow-lg shadow-black/40 py-3'
          : 'bg-[#08080b]/70 backdrop-blur-sm border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          id="nav-logo"
          className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1 group"
        >
          <span className="text-[#ff2a2a] group-hover:scale-110 transition-transform inline-block">&lt;</span>
          <span>Aryan</span>
          <span className="text-[#ff2a2a] group-hover:scale-110 transition-transform inline-block">/&gt;</span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  id={`nav-link-${item.label.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#ff2a2a] bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 shadow-sm shadow-[#ff2a2a]/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Action Button & 3D Toggle & Intro Replay */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Toggle3DButton variant="compact" idPrefix="nav-desktop" />

          {onReplayIntro && (
            <button
              type="button"
              id="nav-replay-intro-btn"
              onClick={onReplayIntro}
              title="Reboot / Replay Loading Screen"
              className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-[#ff2a2a]/40 text-zinc-400 hover:text-white transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#ff4d4d]" />
            </button>
          )}

          <a
            href="#contact"
            id="nav-hire-btn"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#ff2a2a] bg-transparent border border-[#ff2a2a] rounded-lg hover:bg-[#ff2a2a] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-[#ff2a2a]/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-1.5">
          <Toggle3DButton variant="compact" idPrefix="nav-mobile-top" />
          <button
            type="button"
            id="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-[#0c0c10]/98 border-b border-[#ff2a2a]/20 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? 'text-[#ff2a2a] bg-[#ff2a2a]/10 border border-[#ff2a2a]/30'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <span className="text-xs font-mono text-zinc-400">3D Animations</span>
              <Toggle3DButton variant="pill" idPrefix="nav-drawer" />
            </div>

            {onReplayIntro && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReplayIntro();
                }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-[#ff2a2a]/40 text-left transition-colors"
              >
                <span className="text-xs font-mono text-zinc-400">Replay Intro Screen</span>
                <RotateCcw className="w-3.5 h-3.5 text-[#ff4d4d]" />
              </button>
            )}

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#ff2a2a] rounded-lg shadow-md shadow-[#ff2a2a]/30 hover:bg-[#ff4545] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Get In Touch</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

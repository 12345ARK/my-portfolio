import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Code2, ArrowDownCircle, Phone, MessageSquare, Sparkles, CheckCircle2, Laptop } from 'lucide-react';
import { PERSONAL_INFO } from '../data';
import { Toggle3DButton } from './Toggle3DButton';
import { useBlackHoleWarp } from './BlackHoleTransition';
import { CyberComputer3D } from './CyberComputer3D';

export const Hero: React.FC = () => {
  const { warpTo } = useBlackHoleWarp();
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const roles = PERSONAL_INFO.typewriterRoles;
    const fullText = roles[roleIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex]);

  const scrollToSection = (id: string) => {
    warpTo(id);
  };

  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Two-Column Grid: Left (Name & Info) | Right (3D Style Showcase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Name, Title, Bio, CTAs & Socials */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 shadow-sm shadow-emerald-500/10"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-status-dot shadow-sm shadow-emerald-400" />
              <span>Available for Freelance & Internships</span>
            </motion.div>

            {/* Main Headline (3D Styled Name Section) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_8px_20px_rgba(255,42,42,0.22)]"
            >
              Hi, I'm{' '}
              <span className="relative inline-block group cursor-default">
                <span className="highlight-text relative z-10 transition-transform duration-300 group-hover:scale-105 inline-block drop-shadow-[0_4px_16px_rgba(255,42,42,0.4)]">
                  {PERSONAL_INFO.name}
                </span>
                <span className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-[#ff2a2a]/20 via-transparent to-[#ff2a2a]/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </span>
            </motion.h1>

            {/* Typewriter Dynamic Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-3 flex items-center h-10 sm:h-12 text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-200"
            >
              <span>I build as a </span>
              <span className="ml-2 text-[#ff2a2a] font-mono drop-shadow-[0_0_12px_rgba(255,42,42,0.5)]">{currentText}</span>
              <span className="inline-block w-0.5 sm:w-1 h-6 sm:h-8 bg-[#ff2a2a] ml-1 cursor-blink shadow-[0_0_8px_#ff2a2a]" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-5 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed"
            >
              {PERSONAL_INFO.bio}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
            >
              <button
                type="button"
                id="hero-hire-btn"
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#ff2a2a] hover:bg-[#ff4545] shadow-lg shadow-[#ff2a2a]/30 hover:shadow-xl hover:shadow-[#ff2a2a]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Hire Me</span>
              </button>

              <button
                type="button"
                id="hero-projects-btn"
                onClick={() => scrollToSection('projects')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-zinc-200 bg-zinc-900/80 hover:text-[#ff2a2a] border border-zinc-800 hover:border-[#ff2a2a]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Code2 className="w-4 h-4 text-[#ff2a2a]" />
                <span>View Projects</span>
              </button>

              <a
                href={`https://wa.me/${PERSONAL_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </motion.div>

            {/* Quick Contact & Socials Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-zinc-400"
            >
              <span className="font-medium text-zinc-500">Connect:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  id="hero-phone-link"
                  className="w-9 h-9 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#ff2a2a] hover:border-[#ff2a2a]/40 hover:-translate-y-0.5 transition-all"
                  title="Call Aryan"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${PERSONAL_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-whatsapp-icon"
                  className="w-9 h-9 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all"
                  title="WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp text-base" />
                </a>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  id="hero-email-icon"
                  className="w-9 h-9 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-rose-400 hover:border-rose-500/40 hover:-translate-y-0.5 transition-all"
                  title="Email Aryan"
                >
                  <i className="fa-solid fa-envelope text-base" />
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-linkedin-icon"
                  className="w-9 h-9 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-blue-400 hover:border-blue-500/40 hover:-translate-y-0.5 transition-all"
                  title="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin-in text-base" />
                </a>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-github-icon"
                  className="w-9 h-9 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-500 hover:-translate-y-0.5 transition-all"
                  title="GitHub"
                >
                  <i className="fa-brands fa-github text-base" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Computer-Related 3D Animation Showcase */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center justify-center relative w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <CyberComputer3D />
          </motion.div>

        </div>
      </div>
    </section>
  );
};


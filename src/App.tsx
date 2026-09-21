import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ScrollReveal } from './components/ScrollReveal';
import { FullScreenBackground3D } from './components/FullScreenBackground3D';
import { Cursor3D } from './components/Cursor3D';
import { SectionDivider } from './components/SectionDivider';
import { BlackHoleTransitionProvider } from './components/BlackHoleTransition';
import { Animation3DProvider } from './context/Animation3DContext';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollPercent, setScrollPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor scroll for top progress bar and active nav section
  useEffect(() => {
    let currentActive = 'home';

    const handleScroll = () => {
      // 1. Scroll percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent((window.scrollY / totalHeight) * 100);
      }

      // 2. Section spy
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (currentActive !== section) {
              currentActive = section;
              setActiveSection(section);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <Animation3DProvider>
      <BlackHoleTransitionProvider>
        <div className="min-h-screen bg-[#08080b] text-[#f5f5f7] relative selection:bg-[#ff2a2a] selection:text-white font-['Outfit',sans-serif]">
          {/* Scroll Progress Bar */}
          <div
            id="scroll-progress"
            style={{ width: `${scrollPercent}%` }}
            className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#ff2a2a] via-[#ff5252] to-[#ff8080] z-50 shadow-md shadow-[#ff2a2a]/60 pointer-events-none transition-all duration-75"
          />

          {/* Full-Screen 3D Interactive Cyber Background Canvas & Controls */}
          <FullScreenBackground3D />

          {/* 3D Interactive Cyber Cursor with Gimbal Reticle & Particle Trail */}
          <Cursor3D />

          {/* Ambient Glowing Background Orbs */}
          <div className="glow-orb orb-1" aria-hidden="true" />
          <div className="glow-orb orb-2" aria-hidden="true" />

          {/* Interactive Preloader / System Initialization Loading Page */}
          {isLoading && (
            <LoadingScreen onComplete={() => setIsLoading(false)} />
          )}

          {/* Navigation */}
          <Navbar activeSection={activeSection} onReplayIntro={() => setIsLoading(true)} />

          {/* Main Content with IntersectionObserver 3D Scroll Reveal */}
          <main className="relative z-10">
            <ScrollReveal variant="zoom-3d" duration={750} threshold={0.05} once={false}>
              <Hero />
            </ScrollReveal>

            <ScrollReveal variant="flip-3d" duration={650} threshold={0.1} once={false}>
              <Stats />
            </ScrollReveal>

            {/* Decorative 3D Section Divider between Hero/Stats and About */}
            <SectionDivider id="divider-about" variant="cyber" badgeText="PROFILE" />

            <ScrollReveal variant="tilt-3d-left" duration={700} threshold={0.08} once={false}>
              <About />
            </ScrollReveal>

            {/* Decorative 3D Section Divider between About and Skills */}
            <SectionDivider id="divider-skills" variant="diamonds" badgeText="CAPABILITIES" />

            <ScrollReveal variant="tilt-3d-up" duration={700} threshold={0.08} once={false}>
              <Skills />
            </ScrollReveal>

            {/* Decorative 3D Section Divider between Skills and Projects */}
            <SectionDivider id="divider-projects" variant="portal" badgeText="PORTFOLIO" />

            <ScrollReveal variant="tilt-3d-right" duration={700} threshold={0.06} once={false}>
              <Projects />
            </ScrollReveal>

            {/* Decorative 3D Section Divider between Projects and Contact */}
            <SectionDivider id="divider-contact" variant="cyber" badgeText="GET IN TOUCH" />

            <ScrollReveal variant="flip-3d" duration={700} threshold={0.06} once={false}>
              <Contact onShowToast={showToast} />
            </ScrollReveal>
          </main>

          {/* Footer */}
          <ScrollReveal variant="fade-up" duration={500} threshold={0.1} once={false}>
            <Footer onReplayIntro={() => setIsLoading(true)} />
          </ScrollReveal>

          {/* Notification Toast */}
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      </BlackHoleTransitionProvider>
    </Animation3DProvider>
  );
}


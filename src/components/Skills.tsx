import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SKILLS } from '../data';
import { ThreeDTilt } from './ThreeDTilt';

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend & DB', 'Languages', 'Tools & DevOps'];

  const filteredSkills = selectedCategory === 'All'
    ? SKILLS
    : SKILLS.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 lg:py-28 relative bg-zinc-950/40 border-y border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-[#ff2a2a] bg-[#ff2a2a]/10 border border-[#ff2a2a]/20 mb-3">
            Core Competencies
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical <span className="text-[#ff2a2a]">Skills</span>
          </h2>
          <div className="w-12 h-1 bg-[#ff2a2a] rounded-full mx-auto mt-3 mb-4 shadow-sm shadow-[#ff2a2a]/50" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Languages, frameworks, databases, and tooling in my active development stack.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              id={`skill-filter-${cat.toLowerCase().replace(/[\s&]+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#ff2a2a] text-white shadow-lg shadow-[#ff2a2a]/30 scale-105'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.45, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ThreeDTilt
                maxTilt={16}
                perspective={850}
                scale={1.04}
                glare={true}
                glareOpacity={0.22}
                className="h-full rounded-2xl"
              >
                <div className="h-full p-5 sm:p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-[#ff2a2a]/60 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-[#ff2a2a]/15 group text-center flex flex-col items-center justify-between min-h-[160px]">
                  {/* Icon Popped out in 3D */}
                  <div
                    style={{ transform: 'translateZ(35px)' }}
                    className="w-14 h-14 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:border-[#ff2a2a]/50 transition-all duration-300 shadow-inner"
                  >
                    <i className={skill.iconClass} />
                  </div>

                  {/* Title & Level */}
                  <div style={{ transform: 'translateZ(20px)' }} className="mt-4">
                    <h4 className="text-base font-bold text-white group-hover:text-[#ff2a2a] transition-colors">
                      {skill.name}
                    </h4>
                    <div className="mt-1 flex items-center justify-center gap-1.5">
                      <span className="text-[11px] font-medium text-zinc-400">
                        {skill.category}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {skill.level}
                      </span>
                    </div>
                  </div>

                  {/* Subtle visual proficiency indicator */}
                  <div
                    style={{ transform: 'translateZ(15px)' }}
                    className="w-full bg-zinc-800/80 h-1.5 rounded-full mt-3 overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        skill.level === 'Advanced'
                          ? 'w-[90%] bg-gradient-to-r from-[#ff2a2a] to-rose-500'
                          : skill.level === 'Proficient'
                          ? 'w-[75%] bg-gradient-to-r from-cyan-500 to-blue-500'
                          : 'w-[60%] bg-gradient-to-r from-amber-500 to-yellow-500'
                      }`}
                    />
                  </div>
                </div>
              </ThreeDTilt>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};


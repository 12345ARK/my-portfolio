import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, School, MapPin, Award, BookOpen, Calendar } from 'lucide-react';
import { EDUCATION_LIST } from '../data';
import { ThreeDTilt } from './ThreeDTilt';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-[#ff2a2a] bg-[#ff2a2a]/10 border border-[#ff2a2a]/20 mb-3">
            Profile & Academics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="text-[#ff2a2a]">Me</span>
          </h2>
          <div className="w-12 h-1 bg-[#ff2a2a] rounded-full mx-auto mt-3 mb-4 shadow-sm shadow-[#ff2a2a]/50" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Bridging technical precision with design elegance to build responsive digital experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Personal Narrative */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Engineering Functional & Scalable Solutions
              </h3>
              
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                I am a passionate software engineer currently pursuing my Computer Science & Engineering diploma. I thrive at the intersection of aesthetic user interface engineering and structured database architecture.
              </p>

              <p className="text-zinc-400 leading-relaxed text-sm sm:text-base mt-4">
                Whether creating reactive web applications in React, building robust APIs in Node.js and Python, or fine-tuning database queries in PostgreSQL, I continuously push myself to write clean, modular, and maintainable code.
              </p>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-zinc-800">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-[#ff2a2a]/40 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-[#ff2a2a] shrink-0" />
                  <div>
                    <span className="text-[11px] text-zinc-500 block">Origin & College</span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">Patna & Ambedkar Nagar</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-400/40 transition-colors"
                >
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-zinc-500 block">Matriculation Result</span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">82.6% Distinction</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-blue-400/40 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-zinc-500 block">Primary Major</span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">Computer Science (CSE)</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-emerald-400/40 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-zinc-500 block">Diploma Graduation</span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">Class of 2027</span>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Education Timeline */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-6 h-6 text-[#ff2a2a]" />
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Academic Background
              </h3>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#ff2a2a]/30 space-y-8">
              {EDUCATION_LIST.map((edu, index) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, x: 30, y: 15 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group"
                >
                  
                  {/* Timeline Dot */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#ff2a2a] border-4 border-[#08080b] shadow-md shadow-[#ff2a2a]" />

                  <ThreeDTilt
                    maxTilt={8}
                    perspective={900}
                    scale={1.015}
                    glare={true}
                    glareOpacity={0.12}
                    className="rounded-2xl"
                  >
                    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 group-hover:border-[#ff2a2a]/50 transition-all duration-300 shadow-lg">
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold text-[#ff2a2a] bg-[#ff2a2a]/10 border border-[#ff2a2a]/20">
                          {edu.year}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {edu.grade}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-[#ff2a2a] transition-colors mt-2">
                        {edu.degree}
                      </h4>

                      <p className="text-sm font-medium text-zinc-400 mt-1 flex items-start gap-1.5">
                        <School className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                        <span>{edu.institution}</span>
                      </p>

                      <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400 space-y-1.5">
                        {edu.details.map((detail, dIdx) => (
                          <p key={dIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] mt-1.5 shrink-0" />
                            <span>{detail}</span>
                          </p>
                        ))}
                      </div>

                    </div>
                  </ThreeDTilt>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};


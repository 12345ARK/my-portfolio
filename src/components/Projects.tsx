import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { ThreeDTilt } from './ThreeDTilt';

interface ProjectsProps {
  onSelectProject?: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = () => {
  const [filter, setFilter] = useState<'all' | 'fullstack' | 'frontend' | 'backend' | 'game'>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const filterTabs: { id: 'all' | 'fullstack' | 'frontend' | 'backend' | 'game'; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'game', label: 'Game Hub & Showcase' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend & Data' },
  ];

  const filteredProjects = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-20 lg:py-28 relative overflow-hidden">
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
            Featured Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Recent <span className="text-[#ff2a2a]">Projects</span>
          </h2>
          <div className="w-12 h-1 bg-[#ff2a2a] rounded-full mx-auto mt-3 mb-4 shadow-sm shadow-[#ff2a2a]/50" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Web applications, backend systems, and interactive experiences crafted with clean code.
          </p>
        </motion.div>

        {/* Filter Navigation */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`project-filter-${tab.id}`}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                filter === tab.id
                  ? 'bg-[#ff2a2a] text-white shadow-lg shadow-[#ff2a2a]/30 scale-105'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, delay: (index % 2) * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ThreeDTilt
                maxTilt={8}
                perspective={1000}
                scale={1.015}
                glare={true}
                glareOpacity={0.18}
                className="h-full rounded-2xl"
              >
                <div className="h-full rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-[#ff2a2a]/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#ff2a2a]/15 transition-all duration-300 flex flex-col group">
                  {/* Project Image Box */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                          target.src = 'https://picsum.photos/seed/project/800/450';
                        }
                      }}
                    />

                    {/* Top Badge */}
                    {project.highlightText && (
                      <div
                        style={{ transform: 'translateZ(30px)' }}
                        className="absolute top-3 right-3 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0c0c10]/90 backdrop-blur-md text-[#ff2a2a] border border-[#ff2a2a]/30 shadow-md"
                      >
                        {project.highlightText}
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(project)}
                        style={{ transform: 'translateZ(40px)' }}
                        className="px-4 py-2 rounded-lg bg-zinc-900/90 text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 hover:border-[#ff2a2a] hover:text-[#ff2a2a] transition-all shadow-xl"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick Preview</span>
                      </button>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#ff2a2a] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technology Tags */}
                    <div
                      style={{ transform: 'translateZ(20px)' }}
                      className="flex flex-wrap gap-1.5 mt-4 pt-2"
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#ff2a2a]/10 text-[#ff2a2a] border border-[#ff2a2a]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div
                      style={{ transform: 'translateZ(25px)' }}
                      className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-800/80"
                    >
                      <a
                        href={project.liveUrl}
                        onClick={(e) => {
                          if (project.liveUrl === '#') {
                            e.preventDefault();
                            setActiveModalProject(project);
                          }
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#ff2a2a] hover:bg-[#ff4545] shadow-md shadow-[#ff2a2a]/20 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-zinc-300 bg-zinc-800/80 hover:text-white hover:bg-zinc-700 border border-zinc-700 transition-all"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    </div>

                  </div>
                </div>
              </ThreeDTilt>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Quick Details Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-zinc-900 border border-zinc-700 max-w-xl w-full rounded-2xl p-6 relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>

              <img
                src={activeModalProject.image}
                alt={activeModalProject.title}
                className="w-full aspect-[16/9] object-cover rounded-xl border border-zinc-800 mb-4"
              />

              <h3 className="text-2xl font-bold text-white">{activeModalProject.title}</h3>
              <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
                {activeModalProject.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {activeModalProject.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded bg-[#ff2a2a]/10 border border-[#ff2a2a]/20 text-[#ff2a2a] text-xs font-mono">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-semibold"
                >
                  Close
                </button>
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-[#ff2a2a] text-white hover:bg-[#ff4545] text-sm font-semibold flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>Visit Repository</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


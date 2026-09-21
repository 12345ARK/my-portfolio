import React from 'react';
import { motion } from 'motion/react';
import { STATS } from '../data';
import { ThreeDTilt } from './ThreeDTilt';

export const Stats: React.FC = () => {
  return (
    <section id="stats" className="py-8 border-y border-zinc-800/80 bg-zinc-950/40 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {STATS.map((item, index) => (
            <motion.div
              key={item.label}
              variants={{
                hidden: { opacity: 0, y: 25, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 },
                },
              }}
              className="h-full"
            >
              <ThreeDTilt
                maxTilt={12}
                perspective={800}
                scale={1.03}
                glare={true}
                glareOpacity={0.15}
                className="h-full rounded-2xl"
              >
                <div className="h-full flex flex-col items-center justify-center text-center py-4 px-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-[#ff2a2a]/30 transition-all">
                  <div
                    style={{ transform: 'translateZ(25px)' }}
                    className="flex items-baseline justify-center"
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                      {item.value}
                    </span>
                    {item.suffix && (
                      <span className="text-2xl sm:text-3xl font-bold text-[#ff2a2a] ml-0.5">
                        {item.suffix}
                      </span>
                    )}
                  </div>
                  <p
                    style={{ transform: 'translateZ(15px)' }}
                    className="mt-1 text-xs sm:text-sm font-medium text-zinc-400"
                  >
                    {item.label}
                  </p>
                </div>
              </ThreeDTilt>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};


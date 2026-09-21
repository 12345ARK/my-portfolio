import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, Copy, Check, Send } from 'lucide-react';
import { PERSONAL_INFO } from '../data';
import { ContactFormData } from '../types';

interface ContactProps {
  onShowToast: (message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onShowToast(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      onShowToast('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast('Thank you! Your message has been prepared.');

      // Also construct WhatsApp prefilled message or mailto
      const encodedMsg = encodeURIComponent(
        `Hi Aryan,\nMy name is ${formData.name} (${formData.email}).\nRegarding: ${formData.subject || 'Portfolio Inquiry'}\n\n${formData.message}`
      );
      
      const whatsappUrl = `https://wa.me/${PERSONAL_INFO.whatsapp}?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative bg-zinc-950/50 border-t border-zinc-900 overflow-hidden">
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
            Let's Collaborate
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get In <span className="text-[#ff2a2a]">Touch</span>
          </h2>
          <div className="w-12 h-1 bg-[#ff2a2a] rounded-full mx-auto mt-3 mb-4 shadow-sm shadow-[#ff2a2a]/50" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Have a project in mind, an internship opportunity, or want to discuss technology? Reach out anytime!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Cards */}
          <motion.div
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            
            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-[#ff2a2a]/50 transition-all duration-300 flex items-center justify-between group shadow-lg"
            >
              <a href={`tel:${PERSONAL_INFO.phone}`} className="flex items-center gap-4 flex-grow">
                <div className="w-12 h-12 rounded-xl bg-[#ff2a2a]/10 border border-[#ff2a2a]/20 text-[#ff2a2a] flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 font-medium block">Phone Call</span>
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#ff2a2a] transition-colors">
                    {PERSONAL_INFO.phoneDisplay}
                  </span>
                </div>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(PERSONAL_INFO.phone, 'Phone number')}
                title="Copy phone number"
                className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                {copiedField === 'Phone number' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </motion.div>

            {/* WhatsApp Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-emerald-500/50 transition-all duration-300 flex items-center justify-between group shadow-lg"
            >
              <a
                href={`https://wa.me/${PERSONAL_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 flex-grow"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  <i className="fa-brands fa-whatsapp" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 font-medium block">WhatsApp Chat</span>
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    +91 {PERSONAL_INFO.whatsapp.substring(2)}
                  </span>
                </div>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(`+${PERSONAL_INFO.whatsapp}`, 'WhatsApp number')}
                title="Copy WhatsApp"
                className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                {copiedField === 'WhatsApp number' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-rose-500/50 transition-all duration-300 flex items-center justify-between group shadow-lg"
            >
              <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-4 flex-grow truncate">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-xs text-zinc-500 font-medium block">Email Address</span>
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-rose-400 transition-colors truncate block">
                    {PERSONAL_INFO.email}
                  </span>
                </div>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(PERSONAL_INFO.email, 'Email address')}
                title="Copy Email"
                className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
              >
                {copiedField === 'Email address' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </motion.div>

            {/* Social Network Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 mt-6"
            >
              <h4 className="text-sm font-semibold text-zinc-300 mb-3">
                Social Profiles & Repositories
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${PERSONAL_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:-translate-y-1 transition-all"
                  title="WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp text-lg" />
                </a>

                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 hover:-translate-y-1 transition-all"
                  title="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin-in text-lg" />
                </a>

                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 hover:-translate-y-1 transition-all"
                  title="GitHub"
                >
                  <i className="fa-brands fa-github text-lg" />
                </a>

                <a
                  href={PERSONAL_INFO.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-sky-400 hover:border-sky-500/40 hover:-translate-y-1 transition-all"
                  title="Twitter / X"
                >
                  <i className="fa-brands fa-twitter text-lg" />
                </a>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md shadow-2xl space-y-4"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                Fill in the details below to launch a direct communication via WhatsApp and email.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-zinc-300">
                    Your Name <span className="text-[#ff2a2a]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Aryan Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-[#ff2a2a] focus:ring-1 focus:ring-[#ff2a2a] text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-zinc-300">
                    Email Address <span className="text-[#ff2a2a]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-[#ff2a2a] focus:ring-1 focus:ring-[#ff2a2a] text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-zinc-300">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Internship opportunity / Web development project"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-[#ff2a2a] focus:ring-1 focus:ring-[#ff2a2a] text-sm text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-zinc-300">
                  Message <span className="text-[#ff2a2a]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Hi Aryan, I would love to connect regarding..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-[#ff2a2a] focus:ring-1 focus:ring-[#ff2a2a] text-sm text-white placeholder-zinc-600 outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="contact-submit-btn"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-[#ff2a2a] hover:bg-[#ff4545] disabled:opacity-60 shadow-lg shadow-[#ff2a2a]/30 hover:shadow-xl hover:shadow-[#ff2a2a]/40 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Preparing Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message (via WhatsApp / Mail)</span>
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
};


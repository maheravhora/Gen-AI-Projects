import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt } from 'react-icons/hi2';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const footerLinks = {
  Product: [
    { label: 'Translate', to: '/translate' },
    { label: 'Voice', to: '/voice' },
    { label: 'OCR', to: '/ocr' },
    { label: 'PDF', to: '/pdf' },
  ],
  Resources: [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'History', to: '/history' },
    { label: 'Favorites', to: '/favorites' },
    { label: 'Settings', to: '/settings' },
  ],
  Company: [
    { label: 'About', to: '#' },
    { label: 'Blog', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Contact', to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Cookie Policy', to: '#' },
    { label: 'GDPR', to: '#' },
  ],
};

const socialLinks = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:hello@linguasense.ai', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0F172A] border-t border-white/8 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] p-8 sm:p-12 mb-16 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/80 to-[#06B6D4]/80" />
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to Break Language Barriers?
            </h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Start translating with AI-powered context awareness today.
            </p>
            <Link
              to="/translate"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 text-base font-semibold text-[#2563EB] shadow-lg transition-all hover:shadow-xl hover:scale-105 no-underline"
            >
              Start Translating Free
            </Link>
          </div>
        </motion.div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#06B6D4]">
                <HiOutlineGlobeAlt className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#F8FAFC]">LinguaSense</span>
            </div>
            <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
              AI-powered multilingual communication. Open source, free forever.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#94A3B8] transition-all hover:bg-white/10 hover:text-[#F8FAFC]"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[#F8FAFC] mb-4">{category}</h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#94A3B8]">
            &copy; {new Date().getFullYear()} LinguaSense AI. All rights reserved.
          </p>
          <p className="text-sm text-[#94A3B8]">
            Built with ❤️ using React &amp; FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}

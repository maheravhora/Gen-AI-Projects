import { motion } from 'framer-motion';

const contextOptions = [
  { id: 'general', label: 'General', icon: '🌐' },
  { id: 'business', label: 'Business', icon: '📊' },
  { id: 'medical', label: 'Medical', icon: '🏥' },
  { id: 'legal', label: 'Legal', icon: '⚖️' },
  { id: 'it', label: 'IT / Tech', icon: '💻' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'education', label: 'Education', icon: '📚' },
];

export default function ContextSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#94A3B8] mb-2">Context</label>
      <div className="flex flex-wrap gap-2">
        {contextOptions.map((ctx) => (
          <motion.button
            key={ctx.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(ctx.id)}
            type="button"
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer border ${
              value === ctx.id
                ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30 shadow-md shadow-[#06B6D4]/10'
                : 'bg-white/5 text-[#94A3B8] border-white/8 hover:bg-white/10 hover:text-[#F8FAFC]'
            }`}
          >
            <span>{ctx.icon}</span>
            {ctx.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';

const toneOptions = [
  { id: 'formal', label: 'Formal', icon: '🎩' },
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'friendly', label: 'Friendly', icon: '😊' },
  { id: 'academic', label: 'Academic', icon: '🎓' },
  { id: 'simple', label: 'Simple', icon: '✨' },
];

export default function ToneSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#94A3B8] mb-2">Tone</label>
      <div className="flex flex-wrap gap-2">
        {toneOptions.map((tone) => (
          <motion.button
            key={tone.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(tone.id)}
            type="button"
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer border ${
              value === tone.id
                ? 'bg-[#2563EB]/15 text-[#3B82F6] border-[#2563EB]/30 shadow-md shadow-[#2563EB]/10'
                : 'bg-white/5 text-[#94A3B8] border-white/8 hover:bg-white/10 hover:text-[#F8FAFC]'
            }`}
          >
            <span>{tone.icon}</span>
            {tone.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

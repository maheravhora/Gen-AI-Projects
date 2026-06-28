import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLanguage,
  HiOutlineMicrophone,
  HiOutlineCamera,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const actions = [
  {
    label: 'Text Translate',
    description: 'Translate text with AI context',
    icon: HiOutlineLanguage,
    path: '/translate',
    color: 'from-[#2563EB] to-[#3B82F6]',
    shadow: 'shadow-[#2563EB]/20',
  },
  {
    label: 'Voice Translate',
    description: 'Speak and translate instantly',
    icon: HiOutlineMicrophone,
    path: '/voice',
    color: 'from-[#06B6D4] to-[#22D3EE]',
    shadow: 'shadow-[#06B6D4]/20',
  },
  {
    label: 'OCR Translate',
    description: 'Extract text from images',
    icon: HiOutlineCamera,
    path: '/ocr',
    color: 'from-[#10B981] to-[#34D399]',
    shadow: 'shadow-[#10B981]/20',
  },
  {
    label: 'PDF Translate',
    description: 'Translate PDF documents',
    icon: HiOutlineDocumentText,
    path: '/pdf',
    color: 'from-[#F59E0B] to-[#FBBF24]',
    shadow: 'shadow-[#F59E0B]/20',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Link
              to={action.path}
              className={`group flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-[#1E293B]/60 backdrop-blur-sm p-6 text-center no-underline transition-all hover:border-white/15 hover:shadow-xl hover:${action.shadow} hover:-translate-y-1`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} shadow-lg ${action.shadow} transition-transform group-hover:scale-110`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC]">{action.label}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

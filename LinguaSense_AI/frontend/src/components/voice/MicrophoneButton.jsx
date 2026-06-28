import { motion } from 'framer-motion';
import { HiOutlineMicrophone, HiOutlineStop } from 'react-icons/hi2';

export default function MicrophoneButton({ isRecording, onClick }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings when recording */}
      {isRecording && (
        <>
          <motion.div
            className="absolute rounded-full border-2 border-[#EF4444]/30"
            initial={{ width: 120, height: 120, opacity: 0.6 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-[#EF4444]/30"
            initial={{ width: 120, height: 120, opacity: 0.6 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-[#EF4444]/30"
            initial={{ width: 120, height: 120, opacity: 0.6 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1.2 }}
          />
        </>
      )}

      {/* Main button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        type="button"
        className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-none cursor-pointer shadow-2xl transition-all duration-300 ${
          isRecording
            ? 'bg-gradient-to-br from-[#EF4444] to-[#DC2626] shadow-[#EF4444]/30'
            : 'bg-gradient-to-br from-[#2563EB] to-[#3B82F6] shadow-[#2563EB]/30 hover:shadow-[#2563EB]/50'
        }`}
      >
        {isRecording ? (
          <HiOutlineStop className="h-10 w-10 text-white" />
        ) : (
          <HiOutlineMicrophone className="h-10 w-10 text-white" />
        )}
      </motion.button>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -bottom-10 text-sm text-[#94A3B8] whitespace-nowrap"
      >
        {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
      </motion.p>
    </div>
  );
}

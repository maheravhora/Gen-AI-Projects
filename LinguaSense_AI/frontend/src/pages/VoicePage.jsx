import { motion } from 'framer-motion'
import { HiMicrophone, HiStop, HiArrowPath } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useVoice } from '../hooks/useVoice'

export default function VoicePage() {
  const {
    isRecording, audioBlob, transcribedText,
    error, duration, isTranscribing, startRecording, stopRecording, resetRecording,
  } = useVoice()

  const formatDuration = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">Voice Studio</h2>
        <p className="mt-1 text-text-secondary">Record audio and convert speech to text with AI.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card padding="lg" className="flex flex-col items-center text-center">
          {/* Recording indicator */}
          <div className={`mb-6 flex h-28 w-28 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            isRecording
              ? 'border-danger bg-danger/10 animate-pulse'
              : 'border-white/20 bg-white/5'
          }`}>
            <HiMicrophone className={`h-10 w-10 ${isRecording ? 'text-danger' : 'text-text-secondary'}`} />
          </div>

          {isRecording && (
            <p className="mb-4 text-lg font-mono font-semibold text-danger">{formatDuration(duration)}</p>
          )}

          <div className="flex gap-3">
            {!isRecording ? (
              <Button variant="primary" size="lg" onClick={startRecording} leftIcon={<HiMicrophone className="h-5 w-5" />}>
                Start Recording
              </Button>
            ) : (
              <Button variant="danger" size="lg" onClick={stopRecording} leftIcon={<HiStop className="h-5 w-5" />}>
                Stop Recording
              </Button>
            )}
            {audioBlob && (
              <Button variant="ghost" size="lg" onClick={resetRecording} leftIcon={<HiArrowPath className="h-5 w-5" />}>
                Reset
              </Button>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          {audioBlob && (
            <div className="mt-6 w-full max-w-md">
              <audio controls className="w-full" src={URL.createObjectURL(audioBlob)} />
            </div>
          )}

          {isTranscribing && (
            <div className="mt-6 flex flex-col items-center gap-2 text-text-secondary">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Transcribing audio...</span>
            </div>
          )}

          {transcribedText && (
            <div className="mt-6 w-full max-w-md rounded-xl border border-white/8 bg-white/5 p-4 text-left">
              <p className="text-xs font-semibold text-text-secondary mb-2">Transcription</p>
              <p className="text-sm text-text-primary">{transcribedText}</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}

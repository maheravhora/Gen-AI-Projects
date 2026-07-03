import { motion } from 'framer-motion'
import { HiArrowPath } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import MicrophoneButton from '../components/voice/MicrophoneButton'
import WaveAnimation from '../components/voice/WaveAnimation'
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
        <p className="mt-1 text-text-secondary">Record audio and convert speech to text with real-time AI.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card padding="lg" className="flex flex-col items-center text-center">
          {/* Microphone button with animated rings */}
          <div className="py-8">
            <MicrophoneButton
              isRecording={isRecording}
              onClick={isRecording ? stopRecording : startRecording}
            />
          </div>

          {/* Timer and Wave Animation */}
          {isRecording && (
            <div className="my-4 w-full">
              <p className="mb-2 text-lg font-mono font-semibold text-danger animate-pulse">{formatDuration(duration)}</p>
              <WaveAnimation isActive={isRecording} />
            </div>
          )}

          <div className="flex gap-3 mt-4">
            {audioBlob && (
              <Button variant="ghost" size="md" onClick={resetRecording} leftIcon={<HiArrowPath className="h-5 w-5" />}>
                Reset Recording
              </Button>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          {audioBlob && (
            <div className="mt-6 w-full max-w-md">
              <audio controls className="w-full rounded-xl bg-white/5 p-2" src={URL.createObjectURL(audioBlob)} />
            </div>
          )}

          {isTranscribing && (
            <div className="mt-6 flex flex-col items-center gap-3 text-text-secondary">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium animate-pulse">Transcribing audio with Whisper AI...</span>
            </div>
          )}

          {transcribedText && (
            <div className="mt-6 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-md shadow-black/20 overflow-hidden">
              <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-2">Transcription Result</p>
              <p className="text-base text-text-primary leading-relaxed break-words">{transcribedText}</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}

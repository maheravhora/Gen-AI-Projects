import { useState, useRef, useCallback } from 'react'
import { speechToText } from '../services/api'

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [transcribedText, setTranscribedText] = useState('')
  const [error, setError] = useState(null)
  const [duration, setDuration] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  const startRecording = useCallback(async () => {
    setError(null)
    setAudioBlob(null)
    setTranscribedText('')
    setDuration(0)
    setIsTranscribing(false)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        chunksRef.current = []

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }

        // Trigger transcription automatically
        setIsTranscribing(true)
        try {
          const formData = new FormData()
          // Append the file with a proper extension based on mimeType
          const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
          formData.append('file', blob, `voice_recording.${ext}`)
          const response = await speechToText(formData)
          setTranscribedText(response.data.text || '')
        } catch (err) {
          setError(err.message || 'Speech-to-text transcription failed')
        } finally {
          setIsTranscribing(false)
        }
      }

      recorder.onerror = (e) => {
        setError(`Recording error: ${e.error?.message || 'Unknown error'}`)
        setIsRecording(false)
      }

      recorder.start(250) // collect data every 250ms
      setIsRecording(true)

      // Duration timer
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions.')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.')
      } else {
        setError(`Failed to start recording: ${err.message}`)
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRecording(false)
  }, [])

  const resetRecording = useCallback(() => {
    stopRecording()
    setAudioBlob(null)
    setTranscribedText('')
    setError(null)
    setDuration(0)
    setIsTranscribing(false)
  }, [stopRecording])

  return {
    isRecording,
    audioBlob,
    transcribedText,
    setTranscribedText,
    error,
    duration,
    isTranscribing,
    startRecording,
    stopRecording,
    resetRecording,
  }
}

export default useVoice

// ── API Base URL ───────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// ── Color Palette ──────────────────────────────────────
export const COLORS = {
  primary: '#2563EB',
  secondary: '#3B82F6',
  accent: '#06B6D4',
  success: '#10B981',
  bgDark: '#0F172A',
  card: '#1E293B',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  danger: '#EF4444',
  warning: '#F59E0B',
}

// ── Tones ──────────────────────────────────────────────
export const TONES = ['Formal', 'Professional', 'Friendly', 'Academic', 'Simple']

// ── Contexts ───────────────────────────────────────────
export const CONTEXTS = ['General', 'Business', 'Medical', 'Legal', 'IT', 'Travel', 'Education']

// ── Languages (50+) ───────────────────────────────────
export const LANGUAGES = [
  { name: 'English', code: 'en', nllbCode: 'eng_Latn' },
  { name: 'Hindi', code: 'hi', nllbCode: 'hin_Deva' },
  { name: 'Spanish', code: 'es', nllbCode: 'spa_Latn' },
  { name: 'French', code: 'fr', nllbCode: 'fra_Latn' },
  { name: 'German', code: 'de', nllbCode: 'deu_Latn' },
  { name: 'Chinese (Simplified)', code: 'zh', nllbCode: 'zho_Hans' },
  { name: 'Chinese (Traditional)', code: 'zh-TW', nllbCode: 'zho_Hant' },
  { name: 'Japanese', code: 'ja', nllbCode: 'jpn_Jpan' },
  { name: 'Korean', code: 'ko', nllbCode: 'kor_Hang' },
  { name: 'Arabic', code: 'ar', nllbCode: 'arb_Arab' },
  { name: 'Portuguese', code: 'pt', nllbCode: 'por_Latn' },
  { name: 'Russian', code: 'ru', nllbCode: 'rus_Cyrl' },
  { name: 'Italian', code: 'it', nllbCode: 'ita_Latn' },
  { name: 'Dutch', code: 'nl', nllbCode: 'nld_Latn' },
  { name: 'Turkish', code: 'tr', nllbCode: 'tur_Latn' },
  { name: 'Polish', code: 'pl', nllbCode: 'pol_Latn' },
  { name: 'Swedish', code: 'sv', nllbCode: 'swe_Latn' },
  { name: 'Danish', code: 'da', nllbCode: 'dan_Latn' },
  { name: 'Norwegian', code: 'no', nllbCode: 'nob_Latn' },
  { name: 'Finnish', code: 'fi', nllbCode: 'fin_Latn' },
  { name: 'Czech', code: 'cs', nllbCode: 'ces_Latn' },
  { name: 'Romanian', code: 'ro', nllbCode: 'ron_Latn' },
  { name: 'Hungarian', code: 'hu', nllbCode: 'hun_Latn' },
  { name: 'Greek', code: 'el', nllbCode: 'ell_Grek' },
  { name: 'Bulgarian', code: 'bg', nllbCode: 'bul_Cyrl' },
  { name: 'Croatian', code: 'hr', nllbCode: 'hrv_Latn' },
  { name: 'Slovak', code: 'sk', nllbCode: 'slk_Latn' },
  { name: 'Lithuanian', code: 'lt', nllbCode: 'lit_Latn' },
  { name: 'Latvian', code: 'lv', nllbCode: 'lvs_Latn' },
  { name: 'Estonian', code: 'et', nllbCode: 'est_Latn' },
  { name: 'Ukrainian', code: 'uk', nllbCode: 'ukr_Cyrl' },
  { name: 'Vietnamese', code: 'vi', nllbCode: 'vie_Latn' },
  { name: 'Thai', code: 'th', nllbCode: 'tha_Thai' },
  { name: 'Indonesian', code: 'id', nllbCode: 'ind_Latn' },
  { name: 'Malay', code: 'ms', nllbCode: 'zsm_Latn' },
  { name: 'Filipino', code: 'tl', nllbCode: 'tgl_Latn' },
  { name: 'Bengali', code: 'bn', nllbCode: 'ben_Beng' },
  { name: 'Tamil', code: 'ta', nllbCode: 'tam_Taml' },
  { name: 'Telugu', code: 'te', nllbCode: 'tel_Telu' },
  { name: 'Marathi', code: 'mr', nllbCode: 'mar_Deva' },
  { name: 'Gujarati', code: 'gu', nllbCode: 'guj_Gujr' },
  { name: 'Kannada', code: 'kn', nllbCode: 'kan_Knda' },
  { name: 'Malayalam', code: 'ml', nllbCode: 'mal_Mlym' },
  { name: 'Punjabi', code: 'pa', nllbCode: 'pan_Guru' },
  { name: 'Urdu', code: 'ur', nllbCode: 'urd_Arab' },
  { name: 'Persian', code: 'fa', nllbCode: 'pes_Arab' },
  { name: 'Hebrew', code: 'he', nllbCode: 'heb_Hebr' },
  { name: 'Swahili', code: 'sw', nllbCode: 'swh_Latn' },
  { name: 'Amharic', code: 'am', nllbCode: 'amh_Ethi' },
  { name: 'Nepali', code: 'ne', nllbCode: 'npi_Deva' },
  { name: 'Sinhala', code: 'si', nllbCode: 'sin_Sinh' },
  { name: 'Burmese', code: 'my', nllbCode: 'mya_Mymr' },
  { name: 'Khmer', code: 'km', nllbCode: 'khm_Khmr' },
  { name: 'Lao', code: 'lo', nllbCode: 'lao_Laoo' },
  { name: 'Georgian', code: 'ka', nllbCode: 'kat_Geor' },
  { name: 'Armenian', code: 'hy', nllbCode: 'hye_Armn' },
  { name: 'Mongolian', code: 'mn', nllbCode: 'khk_Cyrl' },
  { name: 'Kazakh', code: 'kk', nllbCode: 'kaz_Cyrl' },
  { name: 'Uzbek', code: 'uz', nllbCode: 'uzn_Latn' },
  { name: 'Catalan', code: 'ca', nllbCode: 'cat_Latn' },
]

// ── Navigation Items ───────────────────────────────────
export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'HiSquares2X2' },
  { name: 'Translate', path: '/translate', icon: 'HiLanguage' },
  { name: 'Voice', path: '/voice', icon: 'HiMicrophone' },
  { name: 'OCR', path: '/ocr', icon: 'HiCamera' },
  { name: 'PDF', path: '/pdf', icon: 'HiDocumentText' },
  { name: 'History', path: '/history', icon: 'HiClock' },
  { name: 'Favorites', path: '/favorites', icon: 'HiStar' },
  { name: 'Settings', path: '/settings', icon: 'HiCog6Tooth' },
  { name: 'Profile', path: '/profile', icon: 'HiUserCircle' },
]

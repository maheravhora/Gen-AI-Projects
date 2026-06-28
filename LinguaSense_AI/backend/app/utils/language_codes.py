"""
LinguaSense AI — NLLB-200 Language Code Mapping.

Complete mapping of 100+ languages to their NLLB-200 BCP-47-style
flores codes used by facebook/nllb-200-distilled-600M.
"""

from __future__ import annotations

from typing import Dict, Optional

# ──────────────────────────────────────────────────────────────────────────────
# Mapping: lowercase language name  →  NLLB flores-200 code
# ──────────────────────────────────────────────────────────────────────────────
LANGUAGE_TO_NLLB: Dict[str, str] = {
    "acehnese": "ace_Latn",
    "afrikaans": "afr_Latn",
    "akan": "aka_Latn",
    "amharic": "amh_Ethi",
    "arabic": "arb_Arab",
    "armenian": "hye_Armn",
    "assamese": "asm_Beng",
    "asturian": "ast_Latn",
    "aymara": "ayr_Latn",
    "azerbaijani": "azj_Latn",
    "bambara": "bam_Latn",
    "balinese": "ban_Latn",
    "bashkir": "bak_Cyrl",
    "basque": "eus_Latn",
    "belarusian": "bel_Cyrl",
    "bengali": "ben_Beng",
    "bhojpuri": "bho_Deva",
    "bosnian": "bos_Latn",
    "bulgarian": "bul_Cyrl",
    "burmese": "mya_Mymr",
    "catalan": "cat_Latn",
    "cebuano": "ceb_Latn",
    "central kurdish": "ckb_Arab",
    "chinese": "zho_Hans",
    "chinese simplified": "zho_Hans",
    "chinese traditional": "zho_Hant",
    "croatian": "hrv_Latn",
    "czech": "ces_Latn",
    "danish": "dan_Latn",
    "dutch": "nld_Latn",
    "english": "eng_Latn",
    "esperanto": "epo_Latn",
    "estonian": "est_Latn",
    "ewe": "ewe_Latn",
    "filipino": "tgl_Latn",
    "finnish": "fin_Latn",
    "french": "fra_Latn",
    "galician": "glg_Latn",
    "ganda": "lug_Latn",
    "georgian": "kat_Geor",
    "german": "deu_Latn",
    "greek": "ell_Grek",
    "guarani": "grn_Latn",
    "gujarati": "guj_Gujr",
    "haitian creole": "hat_Latn",
    "hausa": "hau_Latn",
    "hebrew": "heb_Hebr",
    "hindi": "hin_Deva",
    "hungarian": "hun_Latn",
    "icelandic": "isl_Latn",
    "igbo": "ibo_Latn",
    "ilocano": "ilo_Latn",
    "indonesian": "ind_Latn",
    "irish": "gle_Latn",
    "italian": "ita_Latn",
    "japanese": "jpn_Jpan",
    "javanese": "jav_Latn",
    "kannada": "kan_Knda",
    "kashmiri": "kas_Arab",
    "kazakh": "kaz_Cyrl",
    "khmer": "khm_Khmr",
    "kinyarwanda": "kin_Latn",
    "korean": "kor_Hang",
    "kyrgyz": "kir_Cyrl",
    "lao": "lao_Laoo",
    "latvian": "lvs_Latn",
    "lingala": "lin_Latn",
    "lithuanian": "lit_Latn",
    "luxembourgish": "ltz_Latn",
    "macedonian": "mkd_Cyrl",
    "malagasy": "plt_Latn",
    "malay": "zsm_Latn",
    "malayalam": "mal_Mlym",
    "maltese": "mlt_Latn",
    "maori": "mri_Latn",
    "marathi": "mar_Deva",
    "mongolian": "khk_Cyrl",
    "nepali": "npi_Deva",
    "northern sotho": "nso_Latn",
    "norwegian": "nob_Latn",
    "norwegian bokmål": "nob_Latn",
    "norwegian nynorsk": "nno_Latn",
    "nyanja": "nya_Latn",
    "occitan": "oci_Latn",
    "odia": "ory_Orya",
    "oromo": "gaz_Latn",
    "pashto": "pbt_Arab",
    "persian": "pes_Arab",
    "polish": "pol_Latn",
    "portuguese": "por_Latn",
    "punjabi": "pan_Guru",
    "quechua": "quy_Latn",
    "romanian": "ron_Latn",
    "russian": "rus_Cyrl",
    "samoan": "smo_Latn",
    "sanskrit": "san_Deva",
    "scottish gaelic": "gla_Latn",
    "serbian": "srp_Cyrl",
    "shona": "sna_Latn",
    "sindhi": "snd_Arab",
    "sinhala": "sin_Sinh",
    "slovak": "slk_Latn",
    "slovenian": "slv_Latn",
    "somali": "som_Latn",
    "sotho": "sot_Latn",
    "southern sotho": "sot_Latn",
    "spanish": "spa_Latn",
    "sundanese": "sun_Latn",
    "swahili": "swh_Latn",
    "swedish": "swe_Latn",
    "tagalog": "tgl_Latn",
    "tajik": "tgk_Cyrl",
    "tamil": "tam_Taml",
    "tatar": "tat_Cyrl",
    "telugu": "tel_Telu",
    "thai": "tha_Thai",
    "tibetan": "bod_Tibt",
    "tigrinya": "tir_Ethi",
    "tsonga": "tso_Latn",
    "tswana": "tsn_Latn",
    "turkish": "tur_Latn",
    "turkmen": "tuk_Latn",
    "ukrainian": "ukr_Cyrl",
    "urdu": "urd_Arab",
    "uyghur": "uig_Arab",
    "uzbek": "uzn_Latn",
    "vietnamese": "vie_Latn",
    "welsh": "cym_Latn",
    "wolof": "wol_Latn",
    "xhosa": "xho_Latn",
    "yiddish": "ydd_Hebr",
    "yoruba": "yor_Latn",
    "zulu": "zul_Latn",
}

# Reverse mapping: NLLB code  →  human-readable name
NLLB_TO_LANGUAGE: Dict[str, str] = {v: k for k, v in LANGUAGE_TO_NLLB.items()}

# langdetect ISO-639-1  →  NLLB code  (for auto-detection bridge)
ISO_639_TO_NLLB: Dict[str, str] = {
    "af": "afr_Latn",
    "am": "amh_Ethi",
    "ar": "arb_Arab",
    "az": "azj_Latn",
    "be": "bel_Cyrl",
    "bg": "bul_Cyrl",
    "bn": "ben_Beng",
    "bs": "bos_Latn",
    "ca": "cat_Latn",
    "cs": "ces_Latn",
    "cy": "cym_Latn",
    "da": "dan_Latn",
    "de": "deu_Latn",
    "el": "ell_Grek",
    "en": "eng_Latn",
    "eo": "epo_Latn",
    "es": "spa_Latn",
    "et": "est_Latn",
    "eu": "eus_Latn",
    "fa": "pes_Arab",
    "fi": "fin_Latn",
    "fr": "fra_Latn",
    "ga": "gle_Latn",
    "gl": "glg_Latn",
    "gu": "guj_Gujr",
    "ha": "hau_Latn",
    "he": "heb_Hebr",
    "hi": "hin_Deva",
    "hr": "hrv_Latn",
    "hu": "hun_Latn",
    "hy": "hye_Armn",
    "id": "ind_Latn",
    "ig": "ibo_Latn",
    "is": "isl_Latn",
    "it": "ita_Latn",
    "ja": "jpn_Jpan",
    "jv": "jav_Latn",
    "ka": "kat_Geor",
    "kk": "kaz_Cyrl",
    "km": "khm_Khmr",
    "kn": "kan_Knda",
    "ko": "kor_Hang",
    "ku": "ckb_Arab",
    "ky": "kir_Cyrl",
    "la": "san_Deva",
    "lo": "lao_Laoo",
    "lt": "lit_Latn",
    "lv": "lvs_Latn",
    "mk": "mkd_Cyrl",
    "ml": "mal_Mlym",
    "mn": "khk_Cyrl",
    "mr": "mar_Deva",
    "ms": "zsm_Latn",
    "mt": "mlt_Latn",
    "my": "mya_Mymr",
    "ne": "npi_Deva",
    "nl": "nld_Latn",
    "no": "nob_Latn",
    "ny": "nya_Latn",
    "or": "ory_Orya",
    "pa": "pan_Guru",
    "pl": "pol_Latn",
    "ps": "pbt_Arab",
    "pt": "por_Latn",
    "ro": "ron_Latn",
    "ru": "rus_Cyrl",
    "rw": "kin_Latn",
    "sd": "snd_Arab",
    "si": "sin_Sinh",
    "sk": "slk_Latn",
    "sl": "slv_Latn",
    "sm": "smo_Latn",
    "sn": "sna_Latn",
    "so": "som_Latn",
    "sq": "sot_Latn",
    "sr": "srp_Cyrl",
    "st": "sot_Latn",
    "su": "sun_Latn",
    "sv": "swe_Latn",
    "sw": "swh_Latn",
    "ta": "tam_Taml",
    "te": "tel_Telu",
    "tg": "tgk_Cyrl",
    "th": "tha_Thai",
    "ti": "tir_Ethi",
    "tl": "tgl_Latn",
    "tr": "tur_Latn",
    "uk": "ukr_Cyrl",
    "ur": "urd_Arab",
    "uz": "uzn_Latn",
    "vi": "vie_Latn",
    "xh": "xho_Latn",
    "yi": "ydd_Hebr",
    "yo": "yor_Latn",
    "zh-cn": "zho_Hans",
    "zh-tw": "zho_Hant",
    "zh": "zho_Hans",
    "zu": "zul_Latn",
}


def get_nllb_code(language: str) -> Optional[str]:
    """
    Resolve a language identifier to an NLLB-200 flores code.

    Accepts:
      - Full language name (e.g. "English", "french")
      - ISO 639-1 code   (e.g. "en", "fr")
      - Raw NLLB code     (e.g. "eng_Latn")

    Returns the NLLB flores code or ``None`` if unresolvable.
    """
    if not language:
        return None

    lang_lower = language.strip().lower()

    # Direct match by name
    if lang_lower in LANGUAGE_TO_NLLB:
        return LANGUAGE_TO_NLLB[lang_lower]

    # Match by ISO 639-1
    if lang_lower in ISO_639_TO_NLLB:
        return ISO_639_TO_NLLB[lang_lower]

    # Already a valid NLLB code
    if lang_lower in NLLB_TO_LANGUAGE:
        return lang_lower
    # Case-insensitive check for NLLB code
    for code in NLLB_TO_LANGUAGE:
        if code.lower() == lang_lower:
            return code

    return None


def get_language_name(code: str) -> str:
    """
    Return the human-readable language name for an NLLB code.

    Falls back to the code itself when no mapping exists.
    """
    if not code:
        return "unknown"
    return NLLB_TO_LANGUAGE.get(code, code).title()


def get_all_languages() -> Dict[str, str]:
    """Return all supported languages as {name: nllb_code}."""
    return dict(LANGUAGE_TO_NLLB)

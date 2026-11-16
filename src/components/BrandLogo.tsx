import { useState } from 'react'

/**
 * Candidate logo filenames in `public/`.
 * Checked in order so the site works seamlessly whether the user drops in
 * `logo.jpeg.jpeg`, `logo.png`, `logo.jpeg`, `logo.jpg`, `logo.webp`, or `logo.svg`.
 */
const LOGO_CANDIDATES = [
  'logo.jpeg.jpeg',
  'logo.png',
  'logo.jpeg',
  'logo.jpg',
  'logo.webp',
  'logo.svg',
] as const

/**
 * BrandLogo (`src/components/BrandLogo.tsx`)
 * ----------------------------------------------------------------------------
 * Renders the Customize137 brand emblem in the navigation bar and footer.
 * Automatically cycles through `LOGO_CANDIDATES` in `public/` if an asset
 * fails to load, and gracefully falls back to an inline vector C137 emblem.
 */
export default function BrandLogo() {
  const [candidateIndex, setCandidateIndex] = useState(0)

  // Ensure asset path respects Vite's configured base URL (e.g., './' or '/')
  const baseUrl = import.meta.env.BASE_URL || '/'
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

  const currentLogo =
    candidateIndex < LOGO_CANDIDATES.length
      ? `${normalizedBase}${LOGO_CANDIDATES[candidateIndex]}`
      : null

  return (
    <div className="brand-logo">
      {currentLogo ? (
        <img
          src={currentLogo}
          alt="Customize137 Systems Limited Logo"
          onError={() => setCandidateIndex((index) => index + 1)}
        />
      ) : (
        /* Inline SVG fallback emblem if no image file is present in public/ */
        <svg viewBox="0 0 42 42" aria-label="Customize137 emblem">
          <circle
            cx="21"
            cy="21"
            r="15"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <path d="M12 17h4v-4h10v4h4v10h-4v4H16v-4h-4z" fill="#f97316" />
          <path d="M17 18h8v7h-8z" fill="#071018" />
          <text x="18" y="23.5" fill="#fff" fontSize="6" fontWeight="700">
            137
          </text>
          <path
            d="M28 12c4 2 5 5 5 9s-1 7-5 9"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  )
}

'use client'

import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'

type ResultValue = '1-0' | '0.5-0.5' | '0-1' | 'bye-white' | 'bye-black' | null

interface GameResultInputProps {
  value: ResultValue
  onChange: (result: ResultValue) => void
  disabled?: boolean
}

export function GameResultInput({ value, onChange, disabled }: GameResultInputProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange((e.target.value || null) as ResultValue)}
      disabled={disabled}
      className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="">{t.training.notPlayed}</option>
      <option value="1-0">1-0</option>
      <option value="0.5-0.5">&frac12;-&frac12;</option>
      <option value="0-1">0-1</option>
      <option value="bye-white">{t.training.bye} (1-0)</option>
      <option value="bye-black">{t.training.bye} (0-1)</option>
    </select>
  )
}

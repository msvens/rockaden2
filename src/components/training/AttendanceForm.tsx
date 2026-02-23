'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { updateAttendance } from '@/app/(frontend)/training/actions'

interface Participant {
  id?: string | null
  name: string
  active?: boolean | null
}

interface AttendanceRecord {
  participantId: string
  present: boolean
}

interface AttendanceFormProps {
  sessionId: number
  participants: Participant[]
  initialAttendance: AttendanceRecord[]
  onSaved?: () => void
}

export function AttendanceForm({
  sessionId,
  participants,
  initialAttendance,
  onSaved,
}: AttendanceFormProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const activeParticipants = participants.filter((p) => p.active !== false)

  const [attendance, setAttendance] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>()
    for (const p of activeParticipants) {
      if (p.id) map.set(p.id, false)
    }
    for (const a of initialAttendance) {
      map.set(a.participantId, a.present)
    }
    return map
  })

  const [saving, setSaving] = useState(false)

  function togglePresent(id: string) {
    setAttendance((prev) => {
      const next = new Map(prev)
      next.set(id, !next.get(id))
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    const records = Array.from(attendance.entries()).map(([participantId, present]) => ({
      participantId,
      present,
    }))
    await updateAttendance(sessionId, records)
    setSaving(false)
    onSaved?.()
  }

  const presentCount = Array.from(attendance.values()).filter(Boolean).length

  return (
    <div>
      <div className="space-y-1 mb-4">
        {activeParticipants.map((p) => {
          if (!p.id) return null
          const isPresent = attendance.get(p.id) ?? false
          return (
            <label
              key={p.id}
              className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isPresent}
                onChange={() => togglePresent(p.id!)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${isPresent ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                {p.name}
              </span>
            </label>
          )
        })}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {presentCount}/{activeParticipants.length} {t.training.present.toLowerCase()}
        </span>
        <Button onClick={handleSave} variant="contained" color="primary" compact disabled={saving}>
          {t.training.saveAttendance}
        </Button>
      </div>
    </div>
  )
}

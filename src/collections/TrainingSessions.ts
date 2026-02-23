import type { CollectionConfig } from 'payload'

export const TrainingSessions: CollectionConfig = {
  slug: 'training-sessions',
  labels: {
    singular: { en: 'Training Session', sv: 'Träningstillfälle' },
    plural: { en: 'Training Sessions', sv: 'Träningstillfällen' },
  },
  admin: {
    defaultColumns: ['group', 'sessionDate'],
  },
  fields: [
    {
      name: 'group',
      label: { en: 'Training Group', sv: 'Träningsgrupp' },
      type: 'relationship',
      relationTo: 'training-groups',
      required: true,
    },
    {
      name: 'sessionDate',
      label: { en: 'Session Date', sv: 'Datum' },
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'notes',
      label: { en: 'Notes', sv: 'Anteckningar' },
      type: 'textarea',
    },
    {
      name: 'attendance',
      label: { en: 'Attendance', sv: 'Närvaro' },
      type: 'array',
      labels: {
        singular: { en: 'Attendance Record', sv: 'Närvaropost' },
        plural: { en: 'Attendance Records', sv: 'Närvaroposter' },
      },
      fields: [
        {
          name: 'participantId',
          label: { en: 'Participant ID', sv: 'Deltagar-ID' },
          type: 'text',
          required: true,
        },
        {
          name: 'present',
          label: { en: 'Present', sv: 'Närvarande' },
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'games',
      label: { en: 'Games', sv: 'Partier' },
      type: 'array',
      labels: {
        singular: { en: 'Game', sv: 'Parti' },
        plural: { en: 'Games', sv: 'Partier' },
      },
      fields: [
        {
          name: 'round',
          label: { en: 'Round', sv: 'Rond' },
          type: 'number',
          required: true,
        },
        {
          name: 'whiteId',
          label: { en: 'White', sv: 'Vit' },
          type: 'text',
          required: true,
        },
        {
          name: 'blackId',
          label: { en: 'Black', sv: 'Svart' },
          type: 'text',
          required: true,
        },
        {
          name: 'result',
          label: { en: 'Result', sv: 'Resultat' },
          type: 'select',
          options: [
            { label: '1-0', value: '1-0' },
            { label: '\u00BD-\u00BD', value: '0.5-0.5' },
            { label: '0-1', value: '0-1' },
            { label: { en: 'Bye (White)', sv: 'Bye (Vit)' }, value: 'bye-white' },
            { label: { en: 'Bye (Black)', sv: 'Bye (Svart)' }, value: 'bye-black' },
          ],
        },
      ],
    },
  ],
}

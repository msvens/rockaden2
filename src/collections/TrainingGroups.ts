import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

export const TrainingGroups: CollectionConfig = {
  slug: 'training-groups',
  labels: {
    singular: { en: 'Training Group', sv: 'Träningsgrupp' },
    plural: { en: 'Training Groups', sv: 'Träningsgrupper' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'semester', 'status', 'hasTournament'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data.slug) {
          data.slug = slugify(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: { en: 'Name', sv: 'Namn' },
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name. Edit to override.',
      },
    },
    {
      name: 'status',
      label: { en: 'Status', sv: 'Status' },
      type: 'select',
      options: [
        { label: { en: 'Draft', sv: 'Utkast' }, value: 'draft' },
        { label: { en: 'Active', sv: 'Aktiv' }, value: 'active' },
        { label: { en: 'Archived', sv: 'Arkiverad' }, value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'event',
      label: { en: 'Event', sv: 'Händelse' },
      type: 'relationship',
      relationTo: 'events',
      admin: {
        description: {
          en: 'Link to the recurring training event for session scheduling.',
          sv: 'Länk till den återkommande träningshändelsen för schemaläggning.',
        },
      },
    },
    {
      name: 'description',
      label: { en: 'Description', sv: 'Beskrivning' },
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'semester',
      label: { en: 'Semester', sv: 'Termin' },
      type: 'text',
      admin: {
        description: { en: 'e.g. VT2026', sv: 't.ex. VT2026' },
      },
    },
    {
      name: 'hasTournament',
      label: { en: 'Round-Robin Tournament', sv: 'Rundturnerning' },
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: {
          en: 'Enable to track round-robin pairings and standings.',
          sv: 'Aktivera för att spåra lottning och ställning i rundturnerning.',
        },
      },
    },
    {
      name: 'participants',
      label: { en: 'Participants', sv: 'Deltagare' },
      type: 'array',
      labels: {
        singular: { en: 'Participant', sv: 'Deltagare' },
        plural: { en: 'Participants', sv: 'Deltagare' },
      },
      fields: [
        {
          name: 'name',
          label: { en: 'Name', sv: 'Namn' },
          type: 'text',
          required: true,
        },
        {
          name: 'ssfId',
          label: { en: 'SSF ID', sv: 'SSF-ID' },
          type: 'number',
          required: true,
        },
        {
          name: 'active',
          label: { en: 'Active', sv: 'Aktiv' },
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'createdBy',
      label: { en: 'Created By', sv: 'Skapad av' },
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

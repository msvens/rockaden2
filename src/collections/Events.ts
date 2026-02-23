import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: { en: 'Event', sv: 'Händelse' },
    plural: { en: 'Events', sv: 'Händelser' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'startDate', 'status'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data.slug) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: { en: 'Title', sv: 'Titel' },
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
        description: 'Auto-generated from title. Edit to override.',
      },
    },
    {
      name: 'status',
      label: { en: 'Status', sv: 'Status' },
      type: 'select',
      options: [
        { label: { en: 'Draft', sv: 'Utkast' }, value: 'draft' },
        { label: { en: 'Published', sv: 'Publicerad' }, value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      label: { en: 'Description', sv: 'Beskrivning' },
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'link',
      label: { en: 'Link', sv: 'Länk' },
      type: 'text',
      admin: {
        description: {
          en: 'URL for more information. Internal (e.g. /training/1) or external (https://...).',
          sv: 'URL till mer information. Intern (t.ex. /training/1) eller extern (https://...).',
        },
      },
    },
    {
      name: 'linkLabel',
      label: { en: 'Link Label', sv: 'Länktext' },
      type: 'text',
      admin: {
        description: {
          en: 'Text shown for the link, e.g. "More info" or "Go to training".',
          sv: 'Text som visas för länken, t.ex. "Mer info" eller "Gå till träning".',
        },
        condition: (data) => !!data?.link,
      },
    },
    {
      name: 'startDate',
      label: { en: 'Starts', sv: 'Börjar' },
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeFormat: 'HH:mm',
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'endDate',
      label: { en: 'Ends', sv: 'Slutar' },
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeFormat: 'HH:mm',
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'location',
      label: { en: 'Location', sv: 'Plats' },
      type: 'text',
    },
    {
      name: 'category',
      label: { en: 'Category', sv: 'Kategori' },
      type: 'select',
      options: [
        { label: { en: 'Training', sv: 'Träning' }, value: 'training' },
        { label: { en: 'Tournament', sv: 'Turnering' }, value: 'tournament' },
        { label: { en: 'Junior', sv: 'Junior' }, value: 'junior' },
        { label: { en: 'Allsvenskan', sv: 'Allsvenskan' }, value: 'allsvenskan' },
        { label: { en: 'School Chess', sv: 'Skolschack' }, value: 'skolschack' },
        { label: { en: 'Other', sv: 'Övrigt' }, value: 'other' },
      ],
      defaultValue: 'other',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isRecurring',
      label: { en: 'Recurring', sv: 'Återkommande' },
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: { en: 'Enable to repeat this event on a weekly or biweekly schedule.', sv: 'Aktivera för att upprepa händelsen veckovis eller varannan vecka.' },
      },
    },
    {
      name: 'recurrenceType',
      label: { en: 'Recurrence', sv: 'Upprepning' },
      type: 'select',
      options: [
        { label: { en: 'Weekly', sv: 'Varje vecka' }, value: 'weekly' },
        { label: { en: 'Biweekly', sv: 'Varannan vecka' }, value: 'biweekly' },
      ],
      admin: {
        condition: (data) => data?.isRecurring,
      },
    },
    {
      name: 'recurrenceEndDate',
      label: { en: 'Recurrence Ends', sv: 'Upprepning slutar' },
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        condition: (data) => data?.isRecurring,
        description: { en: 'The date when the recurring series stops.', sv: 'Datumet då den återkommande serien upphör.' },
      },
    },
    {
      name: 'excludedDates',
      label: { en: 'Excluded Dates', sv: 'Undantagna datum' },
      type: 'json',
      admin: {
        condition: (data) => data?.isRecurring,
        description: { en: 'Array of ISO date strings to skip, e.g. ["2026-03-11", "2026-04-01"]', sv: 'Lista med ISO-datumsträngar att hoppa över, t.ex. ["2026-03-11", "2026-04-01"]' },
      },
    },
  ],
}

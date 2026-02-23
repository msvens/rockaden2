import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: { en: 'News Article', sv: 'Nyhetsartikel' },
    plural: { en: 'News', sv: 'Nyheter' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
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
      name: 'publishedAt',
      label: { en: 'Published At', sv: 'Publicerad' },
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          timeFormat: 'HH:mm',
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'excerpt',
      label: { en: 'Excerpt', sv: 'Sammanfattning' },
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'content',
      label: { en: 'Content', sv: 'Innehåll' },
      type: 'richText',
    },
    {
      name: 'featuredImage',
      label: { en: 'Featured Image', sv: 'Utvald bild' },
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      label: { en: 'Author', sv: 'Författare' },
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      label: { en: 'Category', sv: 'Kategori' },
      type: 'select',
      options: [
        { label: { en: 'News', sv: 'Nyheter' }, value: 'nyheter' },
        { label: { en: 'Tournaments', sv: 'Turneringar' }, value: 'turneringar' },
        { label: { en: 'Training', sv: 'Träning' }, value: 'training' },
        { label: { en: 'School Chess', sv: 'Skolschack' }, value: 'skolschack' },
        { label: { en: 'Allsvenskan', sv: 'Allsvenskan' }, value: 'allsvenskan' },
      ],
      defaultValue: 'nyheter',
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
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
      name: 'content',
      type: 'richText',
    },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'Svenska', value: 'sv' },
        { label: 'English', value: 'en' },
      ],
      defaultValue: 'sv',
    },
  ],
}

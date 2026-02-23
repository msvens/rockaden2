import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', sv: 'Användare' },
    plural: { en: 'Users', sv: 'Användare' },
  },
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: { en: 'Name', sv: 'Namn' },
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: { en: 'Role', sv: 'Roll' },
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: { en: 'Editor', sv: 'Redaktör' }, value: 'editor' },
        { label: { en: 'Trainer', sv: 'Tränare' }, value: 'trainer' },
      ],
      defaultValue: 'editor',
      required: true,
    },
  ],
}

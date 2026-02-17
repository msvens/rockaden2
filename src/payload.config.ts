import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// SSL configuration for PostgreSQL
// If DB_CA_CERT_PATH env var is set, use that cert for SSL verification
const caCertPath = process.env.DB_CA_CERT_PATH
const sslConfig = caCertPath && fs.existsSync(caCertPath)
  ? {
      ca: fs.readFileSync(caCertPath).toString(),
      rejectUnauthorized: true,
    }
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, News, Pages, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      ssl: sslConfig,
    },
  }),
  sharp,
  async onInit(payload) {
    const adminEmail = process.env.SEED_ADMIN_EMAIL
    const adminPassword = process.env.SEED_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) return

    const existing = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          password: adminPassword,
          name: 'Admin',
          role: 'admin',
        },
      })
      payload.logger.info(`Created initial admin user: ${adminEmail}`)
    }
  },
})

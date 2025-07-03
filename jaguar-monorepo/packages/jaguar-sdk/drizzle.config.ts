import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
  path: '.env',
});

export default defineConfig({
  schema: './lib/db/schema-sqlite.ts',
  out: './lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    // biome-ignore lint: Forbidden non-null assertion.
    url: process.env.POSTGRES_URL!,
  },
});

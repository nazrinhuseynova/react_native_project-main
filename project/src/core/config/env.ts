import { z } from 'zod';

const envSchema = z.object({
  tmdbToken: z.string().min(1),
  omdbKey: z.string().default(''),
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse({
  tmdbToken: process.env.EXPO_PUBLIC_TMDB_TOKEN,
  omdbKey: process.env.EXPO_PUBLIC_OMDB_KEY,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
  throw new Error(`Missing or invalid environment variables: ${missing}`);
}

export const env: Env = parsed.data;
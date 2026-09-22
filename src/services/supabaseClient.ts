import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. All dynamic content will use fallback data.');
} else if (!supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_')) {
  console.error(
    '[Supabase] VITE_SUPABASE_ANON_KEY looks invalid.\n' +
    'Go to your Supabase project → Settings → API and copy the "anon public" key.\n' +
    'Current value starts with: ' + supabaseAnonKey.slice(0, 20)
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

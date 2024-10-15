import { createClient } from '@/utils/supabase/client';
import { Game } from '@/utils/dataHelpers';
export async function getCurrentGame(): Promise<Game | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching current game:', error);
    return null;
  }

  return data as Game;
}

import { createClient } from "./supabase/client";

export async function getCurrentUser() {
  const supabase = createClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return null;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', user.user_metadata?.email)
    .single();
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return { data, user };
}

export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

export async function getFollowCounts(userId: string) {
  const supabase = createClient()

  const { count: followers } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)

  const { count: following } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)

  const { count: friends } = await supabase
    .rpc('mutual_friends_count', { uid: userId }) // See below for SQL

  return { followers, following, friends }
}
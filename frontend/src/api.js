import { supabase } from "@/lib/supabaseClient";

export function apiErr(error) {
  return error?.message || "Request failed";
}

export const authApi = {
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
  register: (email, password, username) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim().slice(0, 18) },
        emailRedirectTo: window.location.origin,
      },
    }),
  login: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),
  logout: () => supabase.auth.signOut(),
};

export const gameApi = {
  getState: async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Not authenticated");

    const { data, error } = await supabase
      .from("game_states")
      .select("state")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (error) throw error;
    return { data: data ? { state: data.state } : { state: null } };
  },

  saveState: async (state) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Not authenticated");

    const nextState = {
      ...state,
      lastSeen: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("game_states")
      .upsert(
        {
          user_id: userData.user.id,
          state: nextState,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) throw error;
    return { data: { ok: true } };
  },

  reward: async (reward_type, provider = "mock_admob", context = {}) => ({
    data: {
      granted: true,
      provider,
      reward_type,
      context,
      mock: true,
      message: `[MOCK ${provider}] reward '${reward_type}' granted.`,
    },
  }),
};

export default supabase;

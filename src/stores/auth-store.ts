// import { User } from "@supabase/supabase-js";
// import { create } from "zustand";
// import { Profile } from "@/types/auth";
// import { INITIAL_STATE_PROFILE } from "@/constants/auth-constant";

// type AuthState = {
//   user: User | null;
//   profile: Profile;
//   isLoaded: boolean;
//   setUser: (user: User | null) => void;
//   setProfile: (profile: Profile) => void;
//   resetAuth: () => void;
// };

// export const useAuthStore = create<AuthState>((set, get) => ({
//   user: null,
//   profile: INITIAL_STATE_PROFILE,
//   isLoaded: false, // 👈 untuk deteksi apakah sudah diinisialisasi

//   setUser: (user) => set({ user }),
//   setProfile: (profile) =>
//     set((state) => ({
//       profile: { ...state.profile, ...profile },
//       isLoaded: true, // setelah set profile, tandai sudah siap
//     })),

//   resetAuth: () =>
//     set({
//       user: null,
//       profile: INITIAL_STATE_PROFILE,
//       isLoaded: false,
//     }),
// }));

import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { Profile } from "@/types/auth";
import { INITIAL_STATE_PROFILE } from "@/constants/auth-constant";

type AuthState = {
  user: User | null;
  profile: Profile;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: INITIAL_STATE_PROFILE,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}));

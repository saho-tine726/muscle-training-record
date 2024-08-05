import { atom } from "recoil";
import { Session } from "@supabase/supabase-js";
import { UserType } from "@/types/user";

export const sessionState = atom<Session | null>({
  key: "sessionState",
  default: null,
});

export const userState = atom<UserType | null>({
  key: "userState",
  default: null,
});


export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false
})
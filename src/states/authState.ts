import { atom } from "recoil";
import { Session } from "@supabase/supabase-js";
import { UserType } from "@/types/user";

// ローカルストレージからセッション情報を読み込む
const savedSession = typeof window !== "undefined" ? localStorage.getItem("session") : null;
const initialSession = savedSession ? JSON.parse(savedSession) : null;

export const sessionState = atom<Session | null>({
  key: "sessionState",
  default: initialSession,
});

export const userState = atom<UserType | null>({
  key: "userState",
  default: null,
});

export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false, // 初期状態をfalseに設定
});
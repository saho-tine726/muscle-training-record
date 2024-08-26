import { atom, useRecoilState } from "recoil";
import { Session } from "@supabase/supabase-js";
import { UserType } from "@/types/user";
import { useEffect } from "react";

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
  default: false,
});

// TODO hooksディレクトリに入れた方が良いかと！
// クライアントサイドでセッション情報を読み込むカスタムフック
export function useSession() {
  const [session, setSession] = useRecoilState(sessionState);

  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, [setSession]);

  return session;
}
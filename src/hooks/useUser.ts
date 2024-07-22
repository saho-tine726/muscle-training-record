import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { UserType } from "@/types/user";
import { useRouter } from "next/navigation";

export default function useUser() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // 認証状態の監視
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ユーザー情報の取得
  useEffect(() => {
    const setupUser = async () => {
      if (session?.user.id) {
        const response = await fetch(`/api/user/${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user data");
        }
      }
    };
    setupUser();
  }, [session]);

  // ユーザーのサインアップ（新規登録）
  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signUp({ email, password });

    return error;
  };

  // ユーザーのサインイン（ログイン）
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error;
  };

  // ユーザーのサインアウト（ログアウト）
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
    }
  };

  return { session, user, signUp, signIn, signOut, loading };
}

// ログインしていない時にログインページに戻るフック
export const useRequireAuth = () => {
  const { session, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/user/login");
    }
  }, [loading, session]);
};

// 日付をYYYY/MM/DDに変換
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

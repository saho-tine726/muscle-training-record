import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { supabase } from "@/utils/supabase";
import { UserType } from "@/types/user";
import { sessionState, userState } from "@/states/authState";

export default function useUser() {
  const [session, setSession] = useRecoilState(sessionState);
  const [user, setUser] = useRecoilState(userState);
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

  // ユーザー情報の更新
  const updateUser = (updatedUser: UserType) => {
    setUser(updatedUser);
  };

  // ユーザーのサインアップ（新規登録）
  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (!error && data.user) {
      // Supabaseでの登録が成功した場合、Prismaにユーザーを作成
      await fetch(`/api/user/${user?.auth_id}`, {
        method: "POST",
        body: JSON.stringify({
          auth_id: data.user.id,
          email: data.user.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

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

  return { session, user, signUp, signIn, signOut, loading, updateUser };
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

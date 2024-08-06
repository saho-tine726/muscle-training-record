import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { supabase } from "@/utils/supabase";
import { UserType } from "@/types/user";
import { loadingState, sessionState, userState } from "@/states/authState";

export default function useUser() {
  const [session, setSession] = useRecoilState(sessionState);
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);

  // 認証状態の監視
  useEffect(() => {
    const getSession = async () => {
      const savedSession = localStorage.getItem("session");
      if (savedSession) {
        setSession(JSON.parse(savedSession));
        setLoading(false);
      } else {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setLoading(false);
        // セッション情報をローカルストレージに保存
        if (data.session) {
          localStorage.setItem("session", JSON.stringify(data.session));
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);

        // セッション情報をローカルストレージに保存
        if (session) {
          localStorage.setItem("session", JSON.stringify(session));
        } else {
          localStorage.removeItem("session");
        }
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
          console.error("ユーザーデータの取得に失敗しました");
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

    if (error) {
      console.error("Sign up error:", error.message);
    } else if (data.user) {
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
    } else {
      localStorage.removeItem("session");
    }
  };

  return { session, user, signUp, signIn, signOut, loading, updateUser };
}

// ログインしていない時にログインページに戻るフック
export const useRequireAuth = () => {
  const session = useRecoilValue(sessionState);
  const loading = useRecoilValue(loadingState);
  const router = useRouter();

  console.log('useRequireAuthです');

  useEffect(() => {
    if (!loading && !session) {
      router.push("/user/login");
    }
  }, [loading, session]);
};

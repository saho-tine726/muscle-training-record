"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import useUser from "@/hooks/useUser";

const Login = () => {
  const { signIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const doLogin: SubmitHandler<{ email: string; password: string }> = async (formData) => {
    setLoading(true);
    const error = await signIn({ email: formData.email, password: formData.password });
    setLoading(false);

    if (error) {
      setSignInError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <title>ログイン</title>
      <main className="max-w-[1200px] mx-auto pt-2 md:pt-6 pb-10 px-4 md:px-10">
        <div className="px-3 md:px-6 py-5 md:py-10 bg-gray-100 rounded-lg shadow-lg">
          <h1 className="text-xl md:text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">ログイン</h1>
          <form onSubmit={handleSubmit(doLogin)} className="w-full max-w-md mx-auto">
            <div className="mb-4">
              <p className="mb-2 font-medium">メールアドレス</p>
              <input
                id="email"
                placeholder="メールアドレス"
                {...register("email", {
                  required: {
                    value: true,
                    message: "メールアドレスを入力してください",
                  },
                  pattern: {
                    value:
                      /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/,
                    message: "有効なメールアドレスを入力してください",
                  },
                })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
              />
              {errors.email && (
                <div className="text-red-500 text-sm">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-4">
              <p className="mb-2 font-medium">パスワード</p>
              <input
                id="password"
                type="password"
                placeholder="パスワード"
                {...register("password", {
                  required: {
                    value: true,
                    message: "パスワードを入力してください",
                  },
                  minLength: {
                    value: 6,
                    message: "パスワードは6文字以上にしてください",
                  },
                })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
              />
              {errors.password && (
                <div className="text-red-500 text-sm">
                  {errors.password.message}
                </div>
              )}
            </div>

            {signInError && (
              <div className="text-red-500 text-sm mb-4">無効なログイン認証情報です。</div>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
              disabled={loading}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link href="/user/register" className="text-center text-blue-500 transition duration-500 hover:text-blue-700">新規会員登録はこちら</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import useUser, { useRequireAuth } from "@/hooks/useUser";

type UpdateUserType = {
  email: string;
  name: string;
  password?: string;
};

const MyPage = () => {
  const { session, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserType>({
    defaultValues: {
      email: "",
      name: "",
      password: ""
    },
  });

  useRequireAuth();

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setValue("name", user.name);
    }
  }, [user, setValue]);

  const updateUser = async (data: UpdateUserType) => {
    setLoading(true);

    try {
      const updateUserData: any = {
        email: data.email,
        name: data.name,
      };

      if (data.password) {
        updateUserData['password'] = data.password;
      }

      const res = await fetch(`/api/user/${user?.auth_id}`, {
        method: "PUT",
        body: JSON.stringify(updateUserData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました。");
      }

      if (data.password) {
        const { error } = await supabase.auth.updateUser({
          password: data.password,
        });

        if (error) {
          throw new Error("パスワードの更新に失敗しました。");
        }
      }

      setLoading(false);
      router.push("/");
    } catch (error) {
      console.error("更新エラー:", error);
      setLoading(false);
    }
  };


  const onSubmit: SubmitHandler<UpdateUserType> = (data) => {
    updateUser(data);
  };

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">マイページ</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
          <div className="mb-4">
            <p className="mb-2 font-medium">ニックネーム</p>
            <input
              id="name"
              placeholder="ニックネーム"
              {...register("name", {
                required: {
                  value: true,
                  message: "変更するニックネームを入力してください",
                },
              })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-4">
            <p className="mb-2 font-medium">メールアドレス</p>
            <input
              id="email"
              placeholder="メールアドレス"
              {...register("email", {
                required: {
                  value: true,
                  message: "変更するメールアドレスを入力してください",
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
              placeholder="パスワードに変更がない場合は空としてください"
              {...register("password", {
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

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
            disabled={loading}
          >
            {loading ? "更新中..." : "更新"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default MyPage;

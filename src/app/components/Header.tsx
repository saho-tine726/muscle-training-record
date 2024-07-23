"use client";
import Link from "next/link";
import useUser from "@/hooks/useUser";

const Header = () => {
  const { session, signOut, user } = useUser();

  return (
    <header className="py-4 sm:py-6 px-3 sm:px-10 z-50">
      <div className="mx-auto max-w-screen-xl flex justify-between items-center gap-10">
        <div className="grow-0 shrink-0">
          <div className="text-2xl font-extrabold text-lg sm:text-3xl text-white">
            <Link href="/">筋トレ記録アプリ</Link>
          </div>
        </div>
        {session ? (
          // ログイン中
          <div className="flex align-center gap-3">
            <div className="flex align-center gap-3">
              <p className="text-white flex items-center">{user?.name} さん</p>
              <div className="text-white flex items-center grow-0 shrink-0 transition duration-500 hover:opacity-35">
                <Link href="/mypage" className="bg-teal-600 px-2 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-teal700">マイページ</Link>
              </div>
            </div>
            <nav className="grow-0 shrink-0">
              <button
                onClick={() => signOut()}
                className="bg-gray-500 px-3 sm:px-5 py-2 sm:py-3 rounded-md text-white text-sm sm:text-lg font-medium transition duration-500 hover:bg-gray-600"
              >
                ログアウト
              </button>
            </nav>
          </div>
        ) : (
          // ログアウト中
          <div>
            <nav>
              <Link
                href="/user/login"
                className="bg-blue-500 px-3 sm:px-5 py-2 sm:py-3 rounded-md text-white text-sm sm:text-lg font-medium transition duration-500 hover:bg-blue-700"
              >
                ログイン
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

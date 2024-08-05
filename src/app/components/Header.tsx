"use client";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { sessionState, userState } from "@/states/authState";

const Header = () => {
  const { signOut } = useUser();
  const user = useRecoilValue(userState);
  const session = useRecoilValue(sessionState);
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };

  const handleSignOut = () => {
    signOut();
    setOpenMenu(false);
  };

  const handleLinkClick = () => {
    setOpenMenu(false);
  };

  return (
    <header className="py-4 sm:py-6 px-3 sm:px-10 z-50">
      <div className="mx-auto max-w-screen-xl flex justify-between items-center gap-10">
        <div className="grow-0 shrink-0">
          <Link className="text-2xl font-extrabold text-lg sm:text-3xl text-white flex gap-2 transition duration-500 hover:opacity-75" href="/">
            <Image src="/images/logo.png" alt="筋トレ記録アプリ" width={51} height={31} objectFit="contain" />
            筋トレ記録アプリ
          </Link>
        </div>
        <div className="hidden md:block">
          {session ? (
            // ログイン中
            <div className="flex align-center gap-3">
              <div className="flex align-center gap-3">
                <p className="text-white flex items-center flex-wrap break-all">{user?.name} さん</p>
                <div className="text-white flex items-center grow-0 shrink-0 transition duration-500 hover:opacity-35">
                  <Link onClick={handleLinkClick} href="/mypage" className="bg-teal-600 px-2 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-teal700">マイページ</Link>
                </div>
              </div>
              <nav className="grow-0 shrink-0 flex align-center">
                <button
                  onClick={handleSignOut}
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
                  onClick={handleLinkClick}
                  href="/user/login"
                  className="bg-blue-500 px-3 sm:px-5 py-2 sm:py-3 rounded-md text-white text-sm sm:text-lg font-medium transition duration-500 hover:bg-blue-700"
                >
                  ログイン
                </Link>
              </nav>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={handleMenuOpen} type="button" className="relative z-50 space-y-2">
            <div className={openMenu ? 'w-8 h-0.5 bg-white translate-y-0.5 rotate-45 transition duration-500 ease-in-out' : 'w-8 h-0.5 bg-white transition duration-500 ease-in-out'} />
            <div className={openMenu ? 'opacity-0 transition duration-500 ease-in-out' : 'w-8 h-0.5 bg-white transition duration-500 ease-in-out'} />
            <div className={openMenu ? 'w-8 h-0.5 bg-white -translate-y-2 -rotate-45 transition duration-500 ease-in-out' : 'w-8 h-0.5 bg-white transition duration-500 ease-in-out'} />
          </button>

          <div className={
            openMenu
              ? "h-svh bg-gray-900 absolute top-0 right-0 bottom-0 z-40 w-64 pt-20 px-4 transition duration-200 ease-in-out"
              : "opacity-0 invisible transition duration-200 ease-in-out"
          }
          >
            <div className={openMenu ? 'block' : 'hidden'}>
              {session ? (
                // ログイン中
                <div className="flex flex-col md:flex-row align-center gap-3">
                  <div className="flex flex-col md:flex-row align-center gap-3">
                    <p className="text-white flex items-center flex-wrap break-all">{user?.name} さん</p>
                    <div className="text-white flex items-center grow-0 shrink-0 transition duration-500 hover:opacity-35">
                      <Link onClick={handleLinkClick} href="/mypage" className="bg-teal-600 px-2 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-teal700">マイページ</Link>
                    </div>
                  </div>
                  <nav className="grow-0 shrink-0 flex align-center">
                    <button
                      onClick={handleSignOut}
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
                      onClick={handleLinkClick}
                      href="/user/login"
                      className="bg-blue-500 px-3 sm:px-5 py-2 sm:py-3 rounded-md text-white text-sm sm:text-lg font-medium transition duration-500 hover:bg-blue-700"
                    >
                      ログイン
                    </Link>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

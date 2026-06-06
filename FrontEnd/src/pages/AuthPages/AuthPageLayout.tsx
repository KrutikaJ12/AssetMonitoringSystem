import React from "react";
// import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-row w-full h-screen  dark:bg-gray-900 sm:p-0 ">
           <div
          className="items-center hidden w-[65%] h-full  bg-brand-950 dark:bg-white/5 lg:grid bg-cover"
          style={{
            backgroundImage: `url('/images/logo/backgroundImage.jpeg')`,
          }}
        >
          <div className="relative flex items-center justify-center z-1 ">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            {/* <GridShape /> */}
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/algo-logo.png"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-black/60">
               Track, Monitor & Manage Assets Efficiently
              </p>
            </div>
          </div>
        </div>
        {children}
     
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}

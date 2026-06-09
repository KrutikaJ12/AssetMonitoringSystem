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
          className="hidden md:flex items-center justify-center 
                w-[65%] lg:w-[55%] xl:w-[60%] 2xl:w-[65%] 
                min-h-screen flex-shrink-0 bg-brand-950 dark:bg-white/5 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/logo/backgroundImage.jpeg')`,
          }}
        >
          <div className="flex flex-col items-center justify-center 
                  w-full md:w-[55%] lg:w-[45%] xl:w-[40%] 2xl:w-[35%] 
                  min-h-screen px-4 sm:px-6 lg:px-8 flex-shrink-0">
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

import Logo from "@/components/form/Logo";
import ThemeSwitcher from "@/components/form/ThemeSwitcher";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />
        <ThemeSwitcher />
        
      
      </nav>
      <main className="flex w-full flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 justify-center items-center p-4 overflow-y-auto">{children}</main>
      </div>
  );
}

export default layout;

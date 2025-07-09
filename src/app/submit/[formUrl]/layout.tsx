import Logo from "@/components/form/Logo";
import ThemeSwitcher from "@/components/form/ThemeSwitcher";
import React, { ReactNode } from "react";


// ① Fuerza SSR dinámico (ya no intenta SSG)
export const dynamic = 'force-dynamic';
function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />
        <ThemeSwitcher />
        
      
      </nav>
      <main className="flex w-full flex-grow"> {children}</main>
    </div>
  );
}

export default layout;

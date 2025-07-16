import Logo from "@/components/form/Logo"
import ThemeSwitcher from "@/components/form/ThemeSwitcher"
import { UserButton } from "@clerk/nextjs"
import type { ReactNode } from "react"

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <main className="flex w-full flex-grow"> {children}</main>
    </div>
  )
}

export default layout

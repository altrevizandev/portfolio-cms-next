"use client"

import { useEffect, useState } from "react"
import {
  BriefcaseBusiness,
  ChevronDown,
  Code2,
  FileText,
  Home,
  LogIn,
  LogOut,
  Menu,
  Moon,
  MessageSquareQuote,
  Sun,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { SignedAccount } from "../../../store/signedAccount"
import { useSignedAccount } from "../../../store/signedAccount"
import { Button } from "./button"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

type NavbarProps = {
  initialAccount: SignedAccount | null
  avatarUrl: string | null
}

export function Navbar({ initialAccount, avatarUrl }: NavbarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const signedAccount = useSignedAccount((state) => state.account)
  const logout = useSignedAccount((state) => state.logout)
  const account = signedAccount ?? initialAccount
  const pathname = usePathname()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("inicio")

  useEffect(() => {
    if (pathname !== "/") return

    const sectionIds = [ "inicio", "sobre", "trajetoria", "depoimentos", "contato" ]
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    function updateActiveSection() {
      const readingLine = window.scrollY + 80 + window.innerHeight * 0.28
      const current = sections.reduce((active, section) => {
        return section.offsetTop <= readingLine ? section : active
      }, sections[0])

      if (current) setActiveSection(current.id)
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [pathname])

  const onLogout = async () => {
    setIsLoggingOut(true)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`, {
        method: "DELETE",
        credentials: "include",
      })
    } finally {
      logout()
      setIsLoggingOut(false)
      router.replace("/")
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-2xl bg-foreground font-heading text-sm font-bold tracking-[-0.06em] text-background transition group-hover:rotate-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="André Lucas Trevizan"
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : "AT"}
          </span>
          <span className="hidden font-heading text-sm leading-tight font-semibold sm:block">
            André Lucas Trevizan
            <span className="block font-sans text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Software developer
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink href="/" active={pathname === "/" && activeSection === "inicio"}>Início</NavLink>
          <NavLink href="/#sobre" active={pathname === "/" && activeSection === "sobre"}>Sobre</NavLink>
          <NavLink href="/#trajetoria" active={pathname === "/" && activeSection === "trajetoria"}>Trajetória</NavLink>
          <NavLink href="/#depoimentos" active={pathname === "/" && activeSection === "depoimentos"}>Depoimentos</NavLink>
          <NavLink href="/projetos" active={pathname.startsWith("/projetos")}>Projetos</NavLink>

          {account?.role === "admin" && (
            <CmsMenu pathname={pathname} />
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeButton />

          {account ? (
            <Button
              variant="outline"
              className="hidden rounded-full sm:inline-flex"
              disabled={isLoggingOut}
              onClick={onLogout}
            >
              <LogOut />
              {isLoggingOut ? "Saindo..." : "Sair"}
            </Button>
          ) : (
            <Button asChild className="hidden rounded-full sm:inline-flex">
              <Link href="/sign-in">
                <LogIn />
                Área administrativa
              </Link>
            </Button>
          )}

          <MobileMenu account={account} activeSection={activeSection} pathname={pathname} isLoggingOut={isLoggingOut} onLogout={onLogout} />
        </div>
      </div>
    </header>
  )
}

function NavLink({
  href,
  active = false,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  )
}

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

function MobileMenu({
  account,
  activeSection,
  pathname,
  isLoggingOut,
  onLogout,
}: {
  account: SignedAccount | null
  activeSection: string
  pathname: string
  isLoggingOut: boolean
  onLogout: () => Promise<void>
}) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full lg:hidden">
          <Menu />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-5">
        <DrawerTitle className="mb-6">Navegação</DrawerTitle>
        <nav className="flex flex-col gap-2">
          <MobileLink href="/" icon={<Home />} active={pathname === "/" && activeSection === "inicio"}>Início</MobileLink>
          <MobileLink href="/#sobre" icon={<FileText />} active={pathname === "/" && activeSection === "sobre"}>Sobre</MobileLink>
          <MobileLink href="/#trajetoria" icon={<BriefcaseBusiness />} active={pathname === "/" && activeSection === "trajetoria"}>Trajetória</MobileLink>
          <MobileLink href="/#depoimentos" icon={<MessageSquareQuote />} active={pathname === "/" && activeSection === "depoimentos"}>Depoimentos</MobileLink>
          <MobileLink href="/projetos" icon={<FileText />} active={pathname.startsWith("/projetos")}>Projetos</MobileLink>

          {account?.role === "admin" && (
            <>
              <div className="my-3 h-px bg-border" />
              <MobileLink href="/sobre" icon={<Home />}>Editar homepage</MobileLink>
              <MobileLink href="/stacks" icon={<Code2 />}>Stacks</MobileLink>
              <MobileLink href="/admin/projetos" icon={<FileText />}>Gerenciar projetos</MobileLink>
              <MobileLink href="/admin/carreira" icon={<FileText />}>Carreira e formação</MobileLink>
              <MobileLink href="/admin/depoimentos" icon={<MessageSquareQuote />}>Moderar depoimentos</MobileLink>
            </>
          )}
        </nav>

        <div className="mt-auto pt-8">
          {account ? (
            <Button
              variant="outline"
              className="w-full"
              disabled={isLoggingOut}
              onClick={onLogout}
            >
              <LogOut />
              {isLoggingOut ? "Saindo..." : "Sair"}
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href="/sign-in">
                <LogIn />
                Área administrativa
              </Link>
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function CmsMenu({ pathname }: { pathname: string }) {
  const items = [
    { href: "/sobre", label: "Editar homepage", icon: Home },
    { href: "/stacks", label: "Tecnologias", icon: Code2 },
    { href: "/admin/projetos", label: "Projetos", icon: FileText },
    { href: "/admin/carreira", label: "Carreira e formação", icon: BriefcaseBusiness },
    { href: "/admin/depoimentos", label: "Moderar depoimentos", icon: MessageSquareQuote },
  ]
  const active = items.some(({ href }) =>
    href === "/sobre" ? pathname === href : pathname.startsWith(href),
  )

  return (
    <>
      <span className="mx-2 h-5 w-px bg-border" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={active ? "secondary" : "ghost"}
            className="rounded-full px-4 text-sm font-semibold"
          >
            CMS
            <ChevronDown className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-2xl p-2">
          <DropdownMenuLabel className="px-3 py-2 text-[0.65rem] tracking-[0.18em] uppercase">
            Gerenciar conteúdo
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map(({ href, label, icon: Icon }) => {
            const itemActive = href === "/sobre"
              ? pathname === href
              : pathname.startsWith(href)
            return (
              <DropdownMenuItem key={href} asChild className="rounded-xl p-0">
                <Link
                  href={href}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 ${
                    itemActive ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function MobileLink({
  href,
  icon,
  active = false,
  children,
}: {
  href: string
  icon: React.ReactNode
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-accent text-accent-foreground"
          : "hover:bg-muted"
      }`}
    >
      <span className="[&>svg]:size-4">{icon}</span>
      {children}
    </Link>
  )
}

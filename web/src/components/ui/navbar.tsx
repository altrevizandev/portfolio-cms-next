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
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { SignedAccount } from "../../../store/signedAccount"
import { useSignedAccount } from "../../../store/signedAccount"
import { Button } from "./button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"
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
}

export function Navbar({ initialAccount }: NavbarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const signedAccount = useSignedAccount((state) => state.account)
  const logout = useSignedAccount((state) => state.logout)
  const account = signedAccount ?? initialAccount
  const pathname = usePathname()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("inicio")

  useEffect(() => {
    if (pathname !== "/") return

    const sectionIds = [
      "inicio",
      "projetos",
      "sobre",
      "trajetoria",
      "depoimentos",
      "contato",
    ]
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
    <header className="portfolio-header">
      <div className="portfolio-container portfolio-header-inner">
        <Link
          href="/"
          className="portfolio-brand"
          aria-label="André Lucas Trevizan — início"
        >
          <span aria-hidden="true">at/</span>
          <span>André Trevizan</span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 lg:flex"
        >
          <NavLink
            href="/projetos"
            active={
              pathname.startsWith("/projetos") ||
              (pathname === "/" && activeSection === "projetos")
            }
          >
            Projetos
          </NavLink>
          <NavLink
            href="/#sobre"
            active={pathname === "/" && activeSection === "sobre"}
          >
            Sobre
          </NavLink>
          <NavLink
            href="/#trajetoria"
            active={pathname === "/" && activeSection === "trajetoria"}
          >
            Trajetória
          </NavLink>
          <NavLink
            href="/#contato"
            active={pathname === "/" && activeSection === "contato"}
          >
            Contato
          </NavLink>

          {account?.role === "admin" && <CmsMenu pathname={pathname} />}
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
            <Link
              href="/#contato"
              className="hidden border-l border-border pl-4 text-xs text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Fale comigo ↗
            </Link>
          )}

          <MobileMenu
            account={account}
            activeSection={activeSection}
            pathname={pathname}
            isLoggingOut={isLoggingOut}
            onLogout={onLogout}
          />
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
      className="portfolio-nav-link"
      aria-current={
        active ? (href.includes("#") ? "location" : "page") : undefined
      }
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
        <Button
          variant="outline"
          size="icon"
          className="rounded-full lg:hidden"
        >
          <Menu />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-5">
        <DrawerTitle className="mb-6">Navegação</DrawerTitle>
        <nav aria-label="Navegação móvel" className="flex flex-col gap-2">
          <MobileLink
            href="/"
            icon={<Home />}
            active={pathname === "/" && activeSection === "inicio"}
          >
            Início
          </MobileLink>
          <MobileLink
            href="/#sobre"
            icon={<FileText />}
            active={pathname === "/" && activeSection === "sobre"}
          >
            Sobre
          </MobileLink>
          <MobileLink
            href="/#trajetoria"
            icon={<BriefcaseBusiness />}
            active={pathname === "/" && activeSection === "trajetoria"}
          >
            Trajetória
          </MobileLink>
          <MobileLink
            href="/#depoimentos"
            icon={<MessageSquareQuote />}
            active={pathname === "/" && activeSection === "depoimentos"}
          >
            Depoimentos
          </MobileLink>
          <MobileLink
            href="/projetos"
            icon={<FileText />}
            active={pathname.startsWith("/projetos")}
          >
            Projetos
          </MobileLink>

          <MobileLink
            href="/#contato"
            icon={<MessageSquareQuote />}
            active={pathname === "/" && activeSection === "contato"}
          >
            Contato
          </MobileLink>

          {account?.role === "admin" && (
            <>
              <div className="my-3 h-px bg-border" />
              <MobileLink href="/sobre" icon={<Home />}>
                Editar homepage
              </MobileLink>
              <MobileLink href="/stacks" icon={<Code2 />}>
                Stacks
              </MobileLink>
              <MobileLink href="/admin/projetos" icon={<FileText />}>
                Gerenciar projetos
              </MobileLink>
              <MobileLink href="/admin/carreira" icon={<FileText />}>
                Carreira e formação
              </MobileLink>
              <MobileLink
                href="/admin/depoimentos"
                icon={<MessageSquareQuote />}
              >
                Moderar depoimentos
              </MobileLink>
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
    {
      href: "/admin/carreira",
      label: "Carreira e formação",
      icon: BriefcaseBusiness,
    },
    {
      href: "/admin/depoimentos",
      label: "Moderar depoimentos",
      icon: MessageSquareQuote,
    },
  ]
  const active = items.some(({ href }) =>
    href === "/sobre" ? pathname === href : pathname.startsWith(href)
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
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="w-64 rounded-2xl p-2"
        >
          <DropdownMenuLabel className="px-3 py-2 text-[0.65rem] tracking-[0.18em] uppercase">
            Gerenciar conteúdo
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map(({ href, label, icon: Icon }) => {
            const itemActive =
              href === "/sobre" ? pathname === href : pathname.startsWith(href)
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
    <DrawerClose asChild>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
          active ? "bg-accent text-accent-foreground" : "hover:bg-muted"
        }`}
      >
        <span className="[&>svg]:size-4">{icon}</span>
        {children}
      </Link>
    </DrawerClose>
  )
}

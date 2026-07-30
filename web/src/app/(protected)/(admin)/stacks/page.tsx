import { StackManager } from "@/components/stacks/StackManager"
import { BreadLinks } from "@/components/navigations/bread-links"
import { getStacks } from "@/lib/stacks"

export default async function StacksPage() {
  const stacks = await getStacks()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-6 sm:px-4">
      <BreadLinks
        links={[
          { actual: false, address: "/", name: "Home" },
          { actual: true, address: "/stacks", name: "Stacks" },
        ]}
      />

      <div>
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          CMS
        </span>
        <h1 className="mt-2 text-3xl font-bold">Stacks</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Organize as tecnologias exibidas nos projetos e defina seus ícones e cores.
        </p>
      </div>

      <StackManager initialStacks={stacks} />
    </div>
  )
}

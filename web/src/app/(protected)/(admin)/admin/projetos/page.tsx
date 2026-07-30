import { ProjectManager } from "@/components/projects/ProjectManager"
import { BreadLinks } from "@/components/navigations/bread-links"
import { getAdminProjects } from "@/lib/projects"
import { getStacks } from "@/lib/stacks"

export default async function ProjectsAdminPage() {
  const [ projects, stacks ] = await Promise.all([
    getAdminProjects(),
    getStacks(),
  ])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-6 sm:px-4">
      <BreadLinks
        links={[
          { actual: false, address: "/", name: "Home" },
          { actual: true, address: "/admin/projetos", name: "Projetos" },
        ]}
      />

      <div>
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          CMS
        </span>
        <h1 className="mt-2 text-3xl font-bold">Projetos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Publique seus trabalhos, organize a galeria e conecte cada projeto às tecnologias utilizadas.
        </p>
      </div>

      <ProjectManager initialProjects={projects} stacks={stacks} />
    </div>
  )
}

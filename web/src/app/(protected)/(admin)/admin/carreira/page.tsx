import { CareerManager } from "@/components/career/CareerManager"
import { BreadLinks } from "@/components/navigations/bread-links"
import { getAdminEducation, getAdminExperiences } from "@/lib/career"

export default async function CareerAdminPage() {
  const [ experiences, education ] = await Promise.all([
    getAdminExperiences(),
    getAdminEducation(),
  ])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-6 sm:px-4">
      <BreadLinks
        links={[
          { actual: false, address: "/", name: "Home" },
          { actual: true, address: "/admin/carreira", name: "Carreira" },
        ]}
      />
      <div>
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          CMS
        </span>
        <h1 className="mt-2 text-3xl font-bold">Carreira e formação</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Organize sua trajetória profissional e acadêmica exibida na homepage.
        </p>
      </div>
      <CareerManager initialExperiences={experiences} initialEducation={education} />
    </div>
  )
}

import { AboutPortal } from "@/components/about/AboutPortal";
import { BreadLinks } from "@/components/navigations/bread-links";
import { getHomepage } from "@/lib/homepage";

export default async function SobrePage() {
  const homepage = await getHomepage();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-8 px-1 py-6 sm:px-4">
      <BreadLinks
        links={[
          {
            actual: false,
            address: '/',
            name: 'Home'
          },
          {
            actual: true,
            address: '/sobre',
            name: 'Homepage'
          }
        ]}
      />

      <div>
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          CMS
        </span>
        <h1 className="mt-2 text-3xl font-bold">Editar homepage</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Gerencie sua apresentação, fotos e links exibidos na página inicial do portfólio.
        </p>
      </div>

      <AboutPortal initialHomepage={homepage} />
    </div>
  );
}

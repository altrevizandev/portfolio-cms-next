import { BreadLinks } from "@/components/navigations/bread-links"
import { TestimonialManager } from "@/components/testimonials/TestimonialManager"
import { getAdminTestimonials } from "@/lib/testimonials"

export default async function TestimonialsAdminPage() {
  const testimonials = await getAdminTestimonials()
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-6 sm:px-4">
      <BreadLinks links={[
        { actual: false, address: "/", name: "Home" },
        { actual: true, address: "/admin/depoimentos", name: "Depoimentos" },
      ]} />
      <div>
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">CMS</span>
        <h1 className="mt-2 text-3xl font-bold">Moderação de depoimentos</h1>
        <p className="mt-2 text-muted-foreground">Aprove somente os relatos que devem aparecer publicamente.</p>
      </div>
      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  )
}

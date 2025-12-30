import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NuevoDesarrolloDialog } from "@/components/desarrollos/nuevo-desarrollo-dialog"
import { DesarrolloCard } from "@/components/desarrollos/desarrollo-card"
import { Building, LayoutGrid } from "lucide-react"

export default async function DesarrollosPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const { data: desarrollos } = await supabase
        .from('desarrollos')
        .select(`
            *,
            propiedades:propiedades(count)
        `)
        .order('creado_en', { ascending: false })

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Building className="h-8 w-8 text-primary" /> Desarrollos
                    </h2>
                    <p className="text-muted-foreground">
                        Gestiona tus Parques Industriales, Torres y Fraccionamientos.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <NuevoDesarrolloDialog />
                </div>
            </div>

            <div className="h-px bg-border my-4" />

            {desarrollos && desarrollos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {desarrollos.map((desarrollo) => (
                        <DesarrolloCard
                            key={desarrollo.id}
                            id={desarrollo.id}
                            nombre={desarrollo.nombre}
                            tipo={desarrollo.tipo}
                            ubicacion={desarrollo.ubicacion}
                            imagenUrl={desarrollo.master_plan_url}
                            unidades={desarrollo.propiedades?.[0]?.count || 0}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                        <LayoutGrid className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium">No hay desarrollos creados</h3>
                    <p className="text-sm text-muted-foreground max-w-sm text-center mt-2 mb-6">
                        Comienza creando tu primer desarrollo maestro para agrupar tus propiedades.
                    </p>
                    <NuevoDesarrolloDialog />
                </div>
            )}
        </div>
    )
}

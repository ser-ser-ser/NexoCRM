import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { KanbanBoard } from "@/components/dashboard/crm/kanban-board"
import { NuevaOportunidadDialog } from "@/components/dashboard/crm/nueva-oportunidad-dialog"

export default async function CRMPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Fetch real deals with relations
    const { data: oportunidades, error } = await supabase
        .from('oportunidades')
        .select(`
            *,
            clientes ( nombre_completo, empresa ),
            propiedades ( titulo, operacion )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching opportunities:", error)
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4 p-6 md:p-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Pipeline Comercial</h1>
                    <p className="text-muted-foreground">Gestiona tus oportunidades y cierres.</p>
                </div>
                <NuevaOportunidadDialog />
            </div>

            {/* Kanban Container - Takes remaining height */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/50 rounded-xl border border-slate-200 p-4">
                <KanbanBoard initialDeals={oportunidades || []} />
            </div>
        </div>
    )
}

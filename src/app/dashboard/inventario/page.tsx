import { createClient } from "@/utils/supabase/server"
import { InventoryClient } from "@/components/inventory/inventory-client"

export default async function InventoryPage() {
    const supabase = await createClient()

    const { data: propiedades, error } = await supabase
        .from("propiedades")
        .select("*")
        .order("creado_en", { ascending: false })

    if (error) {
        console.error("Error fetching properties:", error)
        return <div>Error al cargar el inventario.</div>
    }

    return (
        <div className="container mx-auto py-8">
            <InventoryClient initialData={propiedades || []} />
        </div>
    )
}

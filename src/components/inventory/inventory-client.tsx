"use client"

import { useState } from "react"
import { InventoryFilters } from "./inventory-filters"
import { InventoryTable } from "./inventory-table"
import { Database } from "@/types/database.types"

type Propiedad = Database["public"]["Tables"]["propiedades"]["Row"]

interface InventoryClientProps {
    initialData: Propiedad[]
}

export function InventoryClient({ initialData }: InventoryClientProps) {
    const [data, setData] = useState<Propiedad[]>(initialData)
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("todos")
    const [operationFilter, setOperationFilter] = useState<string>("todos")

    // Client-side filtering for immediate feedback (can be moved to server if data set is huge)
    const filteredData = data.filter((item) => {
        const matchSearch =
            (item.titulo?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (item.ciudad?.toLowerCase().includes(search.toLowerCase()) ?? false)

        const matchType = typeFilter === "todos" || item.tipo === typeFilter
        const matchOperation = operationFilter === "todos" || item.operacion === operationFilter

        return matchSearch && matchType && matchOperation
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventario de Propiedades</h1>
                <p className="text-muted-foreground">
                    Gestiona tu portafolio industrial, comercial y residencial desde una vista unificada.
                </p>
            </div>

            <InventoryFilters
                onSearchChange={setSearch}
                onTypeChange={setTypeFilter}
                onOperationChange={setOperationFilter}
            />

            <InventoryTable data={filteredData} />
        </div>
    )
}

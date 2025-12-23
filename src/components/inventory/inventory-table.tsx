"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types/database.types"
import { cn } from "@/lib/utils"

type Propiedad = Database["public"]["Tables"]["propiedades"]["Row"]

interface InventoryTableProps {
    data: Propiedad[]
}

export function InventoryTable({ data }: InventoryTableProps) {
    const getBadgeColor = (tipo: string | null) => {
        switch (tipo) {
            case "industrial":
                return "bg-blue-600 hover:bg-blue-700" // Acero/Industrial
            case "comercial":
                return "bg-orange-500 hover:bg-orange-600" // Retail
            case "residencial":
                return "bg-green-600 hover:bg-green-700" // Vida
            case "desarrollo":
                return "bg-purple-600 hover:bg-purple-700" // Proyecto
            default:
                return "bg-slate-500 hover:bg-slate-600"
        }
    }

    const formatCurrency = (amount: number | null, currency: string | null) => {
        if (!amount) return "-"
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: currency || "MXN",
        }).format(amount)
    }

    const renderPolymorphicDetails = (propiedad: Propiedad) => {
        const features = propiedad.caracteristicas as any
        if (!features) return <span className="text-muted-foreground text-sm">-</span>

        switch (propiedad.tipo) {
            case "industrial":
                return (
                    <div className="flex flex-col text-xs space-y-1">
                        {features.andenes && <span>🏭 Andenes: {features.andenes}</span>}
                        {features.altura_libre && <span>📏 Altura: {features.altura_libre}m</span>}
                        {features.kvas && <span>⚡ KVAs: {features.kvas}</span>}
                    </div>
                )
            case "comercial":
                return (
                    <div className="flex flex-col text-xs space-y-1">
                        {features.flujo_peatonal && <span>🚶 Flujo: {features.flujo_peatonal}</span>}
                        {features.anclas_cercanas && (
                            <span className="truncate max-w-[150px]" title={features.anclas_cercanas.join(", ")}>
                                🛍️ {features.anclas_cercanas.join(", ")}
                            </span>
                        )}
                    </div>
                )
            case "residencial":
                return (
                    <div className="flex flex-col text-xs space-y-1">
                        {features.recamaras && <span>🛏️ Recs: {features.recamaras}</span>}
                        {features.amenidades && <span>🏊 Amenidades: {features.amenidades.length}</span>}
                    </div>
                )
            default:
                return <span className="text-muted-foreground text-xs">Ver detalles</span>
        }
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Propiedad</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Operación</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Detalles Clave</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No se encontraron propiedades.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((propiedad) => (
                            <TableRow key={propiedad.id} className="hover:bg-muted/50 cursor-pointer">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-base">{propiedad.titulo || "Sin Título"}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {propiedad.direccion || propiedad.ciudad || "Ubicación no especificada"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn("capitalize", getBadgeColor(propiedad.tipo))}>
                                        {propiedad.tipo}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="capitalize text-sm font-medium text-muted-foreground">
                                        {propiedad.operacion}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono font-medium">
                                        {formatCurrency(propiedad.precio, propiedad.moneda)}
                                    </span>
                                </TableCell>
                                <TableCell>{renderPolymorphicDetails(propiedad)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {propiedad.estado}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

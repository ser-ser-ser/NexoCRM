import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Warehouse, Home } from "lucide-react"
import Link from "next/link"

interface DesarrolloCardProps {
    id: string
    nombre: string
    tipo: "industrial" | "residencial" | "mixto" | null
    ubicacion?: string
    imagenUrl?: string
    unidades?: number
}

export function DesarrolloCard({ id, nombre, tipo, ubicacion, imagenUrl, unidades = 0 }: DesarrolloCardProps) {
    const getIcon = () => {
        switch (tipo) {
            case "industrial": return <Warehouse className="h-4 w-4" />
            case "residencial": return <Home className="h-4 w-4" />
            default: return <Building2 className="h-4 w-4" />
        }
    }

    const getColor = () => {
        switch (tipo) {
            case "industrial": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "residencial": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 relative">
                {imagenUrl ? (
                    <img
                        src={imagenUrl}
                        alt={nombre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Building2 className="h-12 w-12 opacity-20" />
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge className={getColor() + " flex items-center gap-1"}>
                        {getIcon()}
                        <span className="capitalize">{tipo || "Desarrollo"}</span>
                    </Badge>
                </div>
            </div>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{nombre}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs truncate">
                    <MapPin className="h-3 w-3" />
                    {ubicacion || "Ubicación no especificada"}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mt-2">
                    {unidades} Propiedades disponibles
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/desarrollos/${id}`}>
                        Gestionar
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

import { createClient } from "@/utils/supabase/server"
import { NuevoClienteDialog } from "@/components/clientes/nuevo-cliente-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Phone, Mail } from "lucide-react"

export default async function ClientsPage() {
    const supabase = await createClient()

    const { data: clients, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cartera de Clientes</h1>
                    <p className="text-muted-foreground">Administra tus contactos B2B y seguimientos.</p>
                </div>
                <NuevoClienteDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clients?.map((client) => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {client.nombre_completo?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-base">{client.nombre_completo}</CardTitle>
                                {client.empresa && (
                                    <CardDescription className="flex items-center gap-1 text-xs font-medium text-slate-600">
                                        <Building2 className="h-3 w-3" /> {client.empresa}
                                    </CardDescription>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="capitalize text-xs px-1.5 py-0 h-5">
                                    {client.tipo_cliente || 'Sin Clasificar'}
                                </Badge>
                                {client.cargo && <span className="text-xs text-muted-foreground">• {client.cargo}</span>}
                            </div>

                            {(client.telefono || client.email) && (
                                <div className="mt-2 space-y-1">
                                    {client.email && (
                                        <div className="flex items-center gap-2 text-xs truncate">
                                            <Mail className="h-3 w-3 text-slate-400" /> {client.email}
                                        </div>
                                    )}
                                    {client.telefono && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <Phone className="h-3 w-3 text-slate-400" /> {client.telefono}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {(!clients || clients.length === 0) && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
                        <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No hay clientes registrados.</p>
                        <p className="text-sm">¡Agrega tu primer lead cualificado!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

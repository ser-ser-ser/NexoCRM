"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, DollarSign, Building2, User } from "lucide-react"
import { NumericFormat } from "react-number-format"

export function NuevaOportunidadDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Data fetching state
    const [clientes, setClientes] = useState<any[]>([])
    const [propiedades, setPropiedades] = useState<any[]>([])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Form State
    const [nombre, setNombre] = useState("")
    const [clienteId, setClienteId] = useState("")
    const [propiedadId, setPropiedadId] = useState("")
    const [valorEstimado, setValorEstimado] = useState("")
    const [probabilidad, setProbabilidad] = useState("20") // Default 20%

    // Load Clients and Properties on Open
    useEffect(() => {
        if (open) {
            const loadData = async () => {
                const { data: clientsData } = await supabase.from('clientes').select('id, nombre_completo, empresa')
                const { data: propsData } = await supabase.from('propiedades').select('id, titulo, operacion').eq('estado', 'publicada')

                if (clientsData) setClientes(clientsData)
                if (propsData) setPropiedades(propsData)
            }
            loadData()
        }
    }, [open])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert("Debes iniciar sesión")
                return
            }

            const num = (val: string) => val ? Number(val.replace(/[^0-9.]/g, '')) : 0

            const { error } = await supabase
                .from('oportunidades')
                .insert({
                    created_at: new Date().toISOString(),
                    // Basic info
                    // We need to check the schema if 'nombre' or 'titulo' exists for opportunity name. 
                    // Based on previous chats, 'titulo' is likely. If not, we'll store it in metadata or check schema.
                    // Checking user prompt schema: 'oportunidades' has 'estado', 'valor_estimado', 'origen', 'propiedad_id', 'cliente_id', 'id', 'probabilidad', 'etapa', 'id_agencia', 'notas'.
                    // It DOES NOT seem to have a 'titulo' or 'nombre' column in the user's provided schema dump!
                    // Wait, looking at schema provided in prompt:
                    // "Tabla": "oportunidades", "Columnas": "asignado_a, estado, valor_estimado, origen, propiedad_id, cliente_id, id, probabilidad, etapa, id_agencia, updated_at, created_at, metadata, notas"
                    // It really doesn't have a name/title column. I should put it in `metadata->titulo` or `notas`.
                    // Or maybe it's supposed to be inferred from Property + Client.
                    // For now, I'll store it in logic as Property Name - Client Name if I can't store it, OR I'll assume metadata is the place.
                    // Let's assume metadata for title for now to avoid breaking schema.
                    metadata: { titulo: nombre },

                    cliente_id: clienteId,
                    propiedad_id: propiedadId,
                    valor_estimado: num(valorEstimado),
                    probabilidad: Number(probabilidad),
                    etapa: 'nuevo', // Initial stage
                    estado: 'abierto',
                    asignado_a: user.id
                })

            if (error) throw error

            setOpen(false)
            router.refresh()

            // Reset
            setNombre("")
            setClienteId("")
            setPropiedadId("")
            setValorEstimado("")

        } catch (error) {
            console.error(error)
            alert("Error al crear oportunidad")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-primary font-bold text-white shadow-lg">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Trato
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nueva Oportunidad Comercial</DialogTitle>
                    <DialogDescription>
                        Registra un posible cierre. Asigna cliente y propiedad.
                    </DialogDescription>
                </DialogHeader>

                <form id="oportunidad-form" onSubmit={onSubmit} className="space-y-4 py-4">

                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre del Trato</Label>
                        <Input
                            id="nombre" placeholder="Ej. Venta Nave Industrial - DHL" required
                            value={nombre} onChange={e => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Cliente</Label>
                        <Select value={clienteId} onValueChange={setClienteId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar Cliente..." />
                            </SelectTrigger>
                            <SelectContent>
                                {clientes.map(c => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.nombre_completo} {c.empresa ? `(${c.empresa})` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Propiedad de Interés</Label>
                        <Select value={propiedadId} onValueChange={setPropiedadId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar Propiedad..." />
                            </SelectTrigger>
                            <SelectContent>
                                {propiedades.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.titulo} - <span className="uppercase">{p.operacion}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Valor Estimado</Label>
                            <NumericFormat
                                customInput={Input} placeholder="$0.00" thousandSeparator prefix="$ "
                                value={valorEstimado} onValueChange={v => setValorEstimado(v.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Probabilidad (%)</Label>
                            <Select value={probabilidad} onValueChange={setProbabilidad}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10% - Interés Inicial</SelectItem>
                                    <SelectItem value="20">20% - Visita Realizada</SelectItem>
                                    <SelectItem value="50">50% - Negociación</SelectItem>
                                    <SelectItem value="80">80% - Cierre Inminente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </form>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button type="submit" form="oportunidad-form" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Crear Trato
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, UserPlus, Building2, Briefcase, Mail, Phone, Target, Wallet } from "lucide-react"
import { NumericFormat } from "react-number-format"

export function NuevoClienteDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Form State
    const [nombre, setNombre] = useState("")
    const [empresa, setEmpresa] = useState("")
    const [cargo, setCargo] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [tipoCliente, setTipoCliente] = useState("final")
    const [origenLead, setOrigenLead] = useState("")
    const [presupuestoMin, setPresupuestoMin] = useState("")
    const [presupuestoMax, setPresupuestoMax] = useState("")
    const [notas, setNotas] = useState("")

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert("Debes iniciar sesión")
                return
            }

            const num = (val: string) => val ? Number(val.replace(/[^0-9.]/g, '')) : null

            const { error } = await supabase
                .from('clientes')
                .insert({
                    creado_por: user.id,
                    nombre_completo: nombre,
                    email: email || null,
                    telefono: telefono || null,
                    empresa: empresa || null,
                    cargo: cargo || null,
                    tipo_cliente: tipoCliente,
                    origen_lead: origenLead || null,
                    presupuesto_min: num(presupuestoMin),
                    presupuesto_max: num(presupuestoMax),
                    notas_perfil: notas || null
                })

            if (error) throw error

            setOpen(false)
            router.refresh()

            // Reset
            setNombre("")
            setEmpresa("")
            setEmail("")

        } catch (error) {
            console.error(error)
            alert("Error al registrar cliente")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Nuevo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                    <DialogDescription>
                        Crea un perfil completo para seguimiento B2B o B2C.
                    </DialogDescription>
                </DialogHeader>

                <form id="cliente-form" onSubmit={onSubmit} className="space-y-6 py-4">

                    {/* 1. Identidad */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> Identidad Profesional
                        </h3>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre Completo</Label>
                                <Input
                                    id="nombre" placeholder="Ej. Roberto Martínez" required
                                    value={nombre} onChange={e => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="empresa">Empresa</Label>
                                    <Input
                                        id="empresa" placeholder="Tech Logistics SA"
                                        value={empresa} onChange={e => setEmpresa(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="cargo">Cargo / Puesto</Label>
                                    <Input
                                        id="cargo" placeholder="Director de Expansión"
                                        value={cargo} onChange={e => setCargo(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Contacto */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Contacto Directo
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email" type="email" placeholder="roberto@empresa.com"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
                                <Input
                                    id="telefono" placeholder="55 1234 5678"
                                    value={telefono} onChange={e => setTelefono(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Perfil y Negocio */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4" /> Perfil de Negocio
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Tipo de Cliente</Label>
                                <Select value={tipoCliente} onValueChange={setTipoCliente}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="final">Usuario Final</SelectItem>
                                        <SelectItem value="inversionista">Inversionista</SelectItem>
                                        <SelectItem value="broker">Broker / Aliado</SelectItem>
                                        <SelectItem value="desarrollador">Desarrollador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Origen del Lead</Label>
                                <Select value={origenLead} onValueChange={setOrigenLead}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="redes">Redes Sociales</SelectItem>
                                        <SelectItem value="lona">Lona / Rótulo</SelectItem>
                                        <SelectItem value="referido">Referido</SelectItem>
                                        <SelectItem value="portal">Portal Inmobiliario</SelectItem>
                                        <SelectItem value="networking">Networking</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-1"><Wallet className="w-3 h-3" /> Presupuesto Min</Label>
                                <NumericFormat
                                    customInput={Input} placeholder="$0.00" thousandSeparator prefix="$ "
                                    value={presupuestoMin} onValueChange={v => setPresupuestoMin(v.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-1"><Wallet className="w-3 h-3" /> Presupuesto Max</Label>
                                <NumericFormat
                                    customInput={Input} placeholder="$0.00" thousandSeparator prefix="$ "
                                    value={presupuestoMax} onValueChange={v => setPresupuestoMax(v.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Notas del Perfil</Label>
                            <Textarea
                                placeholder="Busca nave de 2,000m2 para almacenamiento, entrada inmediata..."
                                value={notas} onChange={e => setNotas(e.target.value)}
                            />
                        </div>
                    </div>

                </form>

                <DialogFooter className="pt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button type="submit" form="cliente-form" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Cliente
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

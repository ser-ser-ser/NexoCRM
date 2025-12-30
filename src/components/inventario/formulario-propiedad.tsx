"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

import dynamic from "next/dynamic"
import { NumericFormat } from "react-number-format"
import { LayoutGrid, MapPin, ImagePlus, DollarSign, Building2, Globe, Video, Car, Network, Briefcase, Percent, ShieldCheck } from "lucide-react"

// Import polymorphic fields
import { IndustrialFields } from "./fields/industrial-fields"
import { CommercialFields } from "./fields/commercial-fields"
import { ResidentialFields } from "./fields/residential-fields"

// Dynamic import for Map to avoid SSR issues
const MapPicker = dynamic(() => import("@/components/ui/map-picker"), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-md flex items-center justify-center">Cargando Mapa...</div>
})

export default function FormularioPropiedad() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [categoria, setCategoria] = useState<string>("industrial")

    // New State for UX upgrades
    const [lat, setLat] = useState<number>(25.6866) // Default Monterrey
    const [lng, setLng] = useState<number>(-100.3161)
    const [moneda, setMoneda] = useState<"MXN" | "USD">("MXN")
    const [multimedia, setMultimedia] = useState<File[]>([])

    // V3: New State Fields
    const [vocacion, setVocacion] = useState<string>("")

    // Commissions
    const [comisionTotal, setComisionTotal] = useState<string>("")
    const [comparteComision, setComparteComision] = useState(false)
    const [porcentajeCompartir, setPorcentajeCompartir] = useState<string>("")

    // General Amenities (Synced with Development)
    const [amenidadesList, setAmenidadesList] = useState<string[]>([])

    const availableAmenities = [
        "Seguridad 24/7", "Control de Acceso", "CCTV", "Barda Perimetral",
        "Andenes Comunes", "Comedor", "Guarderia", "Centro de Negocios",
        "Espuela de Ferrocarril", "Canchas Deportivas", "Ciclovía", "Est. Visitas"
    ]

    const toggleAmenidad = (amenidad: string) => {
        setAmenidadesList(prev =>
            prev.includes(amenidad)
                ? prev.filter(a => a !== amenidad)
                : [...prev, amenidad]
        )
    }

    // Helpers
    const handleLocationSelect = (newLat: number, newLng: number) => {
        setLat(newLat)
        setLng(newLng)
    }

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        // 1. Critical Fix: Prevent Default & Capture Form immediately
        event.preventDefault()
        const form = event.currentTarget

        console.log("Form target captured:", form)

        setIsLoading(true)

        // Verify profile existence prevents FK error 23503
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            alert("No estás logueado")
            setIsLoading(false)
            return
        }

        const { data: profile, error: profileError } = await supabase
            .from('perfiles')
            .select('id')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            console.error('Profile missing:', profileError)
            alert("Error crítico: Tu usuario no tiene un perfil asociado. Por favor contacta soporte o relogueate.")
            setIsLoading(false)
            return
        }

        const formData = new FormData(form)
        const data = Object.fromEntries(formData)

        // 2. Construct Address String
        const calle = data.calle as string || ''
        const numExt = data.num_exterior as string || ''
        const numInt = data.num_interior as string ? ` Int. ${data.num_interior}` : ''
        const colonia = data.colonia as string ? `, Col. ${data.colonia}` : ''
        const cp = data.cp as string ? `, CP ${data.cp}` : ''
        const ciudad = data.ciudad as string ? `, ${data.ciudad}` : ''
        const estado = data.estado as string ? `, ${data.estado}` : ''
        const pais = data.pais as string ? `, ${data.pais}` : ''

        const fullAddress = `${calle} ${numExt}${numInt}${colonia}${cp}${ciudad}${estado}${pais}`.trim()

        // 3. Extract Financials
        const rawPrice = data.price ? Number(String(data.price).replace(/[^0-9.]/g, '')) : 0
        const rawMantenimiento = data.costo_mantenimiento ? Number(String(data.costo_mantenimiento).replace(/[^0-9.]/g, '')) : 0

        // 4. Base Fields
        const camposBase = {
            titulo: data.title as string,
            descripcion: data.description as string,
            precio: rawPrice,
            moneda: moneda, // USD or MXN
            operacion: data.operation as any,
            tipo: categoria,
            estado: "disponible", // Status, not GeoState
            direccion: fullAddress,
            ubicacion: `POINT(${lng} ${lat})`, // PostGIS format
            ciudad: data.ciudad as string || null
        }

        // Extract features to process (exclude base keys)
        const { title, description, price, address, operation, costo_mantenimiento, video_url, conectividad, numero_cajones, ...caracteristicas } = data

        // Helper to process numeric values (empty -> null)
        const num = (val: any) => (val && !isNaN(Number(val)) ? Number(val) : null)
        const bool = (val: any) => val === "on"

        let processedCaracteristicas: Record<string, any> = {
            ...caracteristicas,
            costo_mantenimiento: rawMantenimiento,
            video_url: data.video_url as string || null,
            // V3 New Fields
            vocacion: vocacion || null,
            conectividad: data.conectividad as string || null,
            numero_cajones: num(data.numero_cajones),

            // Amenities List
            amenidades_generales: amenidadesList,

            ubicacion_detallada: {
                calle, num_exterior: numExt, num_interior: numInt,
                colonia, cp, ciudad,
                estado: data.estado, pais: data.pais
            },

            // Internal Data (Commissions)
            datos_internos: {
                comision: {
                    total: num(comisionTotal),
                    comparte: comparteComision,
                    porcentaje_compartir: comparteComision ? num(porcentajeCompartir) : 0
                }
            }
        }

        if (categoria === "industrial") {
            processedCaracteristicas = {
                ...processedCaracteristicas,
                tipo_nave: "Nave Industrial",
                altura_libre: num(data.altura_libre),
                kv_as: num(data.kvas),
                ano_construccion: num(data.ano_construccion),
                m2_oficinas: num(data.m2_oficinas),
                numero_banos: num(data.numero_banos),

                andenes: {
                    con_rampa: num(data.andenes_con_rampa),
                    secos: num(data.andenes_secos)
                },
                piso: {
                    resistencia_ton_m2: num(data.piso_resistencia),
                    espesor_cm: num(data.piso_espesor)
                },

                // New Patio Logic
                patio_maniobras: bool(data.patio_maniobras) ? {
                    tiene: true,
                    m2: num(data.m2_patio)
                } : null,

                espuela_ferrocarril: bool(data.via_ferrocarril),
                sistema_contra_incendio: bool(data.sistema_contra_incendio) ? "Disponible" : null,
                documentacion: data.documentacion as string
            }
        }

        try {
            const { error } = await supabase
                .from('propiedades')
                .insert({
                    ...camposBase,
                    propietario_id: user.id,
                    caracteristicas: processedCaracteristicas
                })

            if (error) throw error

            router.push('/dashboard/inventario')
            router.refresh()

        } catch (error) {
            console.error('Error creating property:', JSON.stringify(error, null, 2))
            alert(`Error al crear la propiedad: ${(error as any)?.message || 'Desconocido'}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <Card className="w-full max-w-4xl mx-auto border-none shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">Nueva Propiedad</CardTitle>
                    <CardDescription>
                        Ingresa los detalles con precisión para destacar en el marketplace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* 1. Categoría y Título */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Categoría del Activo</Label>
                            <Select
                                value={categoria}
                                onValueChange={(val) => setCategoria(val)}
                            >
                                <SelectTrigger className="w-full h-12 text-lg font-medium">
                                    <SelectValue placeholder="Selecciona categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="industrial">Industrial</SelectItem>
                                    <SelectItem value="comercial">Comercial / Retail</SelectItem>
                                    <SelectItem value="residencial">Residencial</SelectItem>
                                    <SelectItem value="terreno">Terreno</SelectItem>
                                    <SelectItem value="oficina">Oficina</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="operation">Tipo de Operación</Label>
                            <Select name="operation" defaultValue="venta">
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="venta">Venta</SelectItem>
                                    <SelectItem value="renta">Renta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg">Título del Anuncio</Label>
                        <Input id="title" name="title" className="text-lg h-12" placeholder="Ej. Nave Industrial AAA en Parque Finsa" required />
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* 2. Ubicación de Alta Precisión */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-700 dark:text-slate-300">
                            <MapPin className="h-5 w-5" /> Ubicación y Conectividad
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 md:col-span-3 space-y-2">
                                <Label htmlFor="calle">Calle / Avenida</Label>
                                <Input id="calle" name="calle" placeholder="Av. Principal" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="num_exterior">No. Ext</Label>
                                <Input id="num_exterior" name="num_exterior" placeholder="123" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="num_interior">No. Int (Op)</Label>
                                <Input id="num_interior" name="num_interior" placeholder="Bodega 4" />
                            </div>
                            <div className="col-span-2 md:col-span-2 space-y-2">
                                <Label htmlFor="colonia">Colonia / Parque</Label>
                                <Input id="colonia" name="colonia" placeholder="Parque Industrial..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cp">C.P.</Label>
                                <Input id="cp" name="cp" placeholder="66200" />
                            </div>
                            <div className="col-span-2 md:col-span-2 space-y-2">
                                <Label htmlFor="ciudad">Ciudad / Municipio</Label>
                                <Input id="ciudad" name="ciudad" placeholder="Apodaca" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="estado">Estado</Label>
                                <Input id="estado" name="estado" placeholder="Nuevo León" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pais">País</Label>
                                <Input id="pais" name="pais" placeholder="México" defaultValue="México" />
                            </div>
                        </div>

                        {/* V3: Conectividad */}
                        <div className="space-y-2">
                            <Label htmlFor="conectividad" className="flex items-center gap-2">
                                <Network className="h-4 w-4" /> Conectividad y Vías (Opcional)
                            </Label>
                            <Textarea
                                id="conectividad"
                                name="conectividad"
                                placeholder="Describe accesos clave: Cerca de Carretera a Laredo, acceso a vía férrea, a 10min de Aeropuerto..."
                                className="h-20"
                            />
                        </div>

                        <div className="pt-2">
                            <Label className="mb-2 block">Pin en Mapa (Arrastra o haz click)</Label>
                            <MapPicker lat={lat} lng={lng} onLocationSelect={handleLocationSelect} />
                            <p className="text-xs text-muted-foreground mt-1 text-right">
                                Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* 3. Precio, Comisión y Detalles */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-700 dark:text-slate-300">
                            <DollarSign className="h-5 w-5" /> Precio y Negocio
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="price">Precio de Lista</Label>
                                <div className="relative">
                                    <NumericFormat
                                        id="price"
                                        name="price"
                                        className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                        placeholder="0.00"
                                        thousandSeparator={true}
                                        prefix={moneda === 'MXN' ? '$ ' : '$ '}
                                        required
                                    />
                                    <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded p-1">
                                            <button
                                                type="button"
                                                onClick={() => setMoneda("MXN")}
                                                className={`px-2 py-1 text-xs font-bold rounded ${moneda === 'MXN' ? 'bg-white shadow text-black' : 'text-slate-500'}`}
                                            >MXN</button>
                                            <button
                                                type="button"
                                                onClick={() => setMoneda("USD")}
                                                className={`px-2 py-1 text-xs font-bold rounded ${moneda === 'USD' ? 'bg-white shadow text-black' : 'text-slate-500'}`}
                                            >USD</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="costo_mantenimiento">Mantenimiento Mensual (Opcional)</Label>
                                <NumericFormat
                                    id="costo_mantenimiento"
                                    name="costo_mantenimiento"
                                    className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                                    placeholder="0.00"
                                    thousandSeparator={true}
                                    prefix={moneda === 'MXN' ? '$ ' : '$ '}
                                />
                            </div>
                        </div>

                        {/* V3: Comisiones */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 p-4 rounded-lg mt-4">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
                                <Percent className="h-4 w-4" /> Esquema de Comisiones (Dato Interno)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div className="space-y-2">
                                    <Label>Comisión Total (%)</Label>
                                    <div className="relative">
                                        <NumericFormat
                                            value={comisionTotal}
                                            onValueChange={(v) => setComisionTotal(v.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="5.0"
                                            suffix="%"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border bg-background p-3 rounded-md">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">¿Comparte Comisión?</span>
                                        <span className="text-xs text-muted-foreground">Habilitar para otros brokers</span>
                                    </div>
                                    <Switch checked={comparteComision} onCheckedChange={setComparteComision} />
                                </div>

                                {comparteComision && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                                        <Label>Porcentaje a Compartir</Label>
                                        <NumericFormat
                                            value={porcentajeCompartir}
                                            onValueChange={(v) => setPorcentajeCompartir(v.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="2.5"
                                            suffix="%"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* V3: Vocación y Extras */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Vocación Ideal
                                </Label>
                                <Select value={vocacion} onValueChange={setVocacion}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona uso ideal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Logística / Distribución">Logística / Distribución</SelectItem>
                                        <SelectItem value="Manufactura Ligera">Manufactura Ligera</SelectItem>
                                        <SelectItem value="CEDIS">CEDIS (Centro de Distribución)</SelectItem>
                                        <SelectItem value="Almacenaje">Almacenaje</SelectItem>
                                        <SelectItem value="Showroom">Showroom / Comercial</SelectItem>
                                        <SelectItem value="Mixto">Uso Mixto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2" htmlFor="numero_cajones">
                                    <Car className="h-4 w-4" /> Número de Cajones
                                </Label>
                                <Input id="numero_cajones" name="numero_cajones" type="number" placeholder="Ej. 12" />
                            </div>
                        </div>
                    </div>


                    {/* 4. Descripción, Amenidades y Multimedia */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción Comercial</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Destaca los puntos fuertes de la propiedad..."
                                className="min-h-[120px] text-base"
                            />
                        </div>

                        {/* V3: Amenidades Generales */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Amenidades y Servicios
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50">
                                {availableAmenities.map((am) => (
                                    <div key={am} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`am-${am}`}
                                            checked={amenidadesList.includes(am)}
                                            onCheckedChange={() => toggleAmenidad(am)}
                                        />
                                        <Label htmlFor={`am-${am}`} className="text-xs cursor-pointer">{am}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <ImagePlus className="h-4 w-4" /> Multimedia (Fotos)
                                </Label>
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 transition-colors cursor-pointer text-center">
                                    <ImagePlus className="h-10 w-10 text-slate-400 mb-2" />
                                    <p className="text-sm font-medium text-slate-600">Arrastra tus fotos aquí</p>
                                    <p className="text-xs text-slate-400">JPG, PNG, WEBP (Max 50MB)</p>
                                    <Button variant="outline" size="sm" className="mt-4" type="button">
                                        Seleccionar Archivos
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="video_url" className="flex items-center gap-2">
                                    <Video className="h-4 w-4" /> Video Recorrido
                                </Label>
                                <div className="h-full bg-slate-50 dark:bg-slate-900/40 rounded-lg p-4 flex flex-col justify-center">
                                    <Input
                                        id="video_url"
                                        name="video_url"
                                        placeholder="Pega el link de YouTube, Vimeo o Matterport"
                                        className="bg-white dark:bg-slate-950"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Pega la URL para mostrar el reproductor en la ficha.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 5. Especificaciones Técnicas (Polimórfico) */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        {categoria === 'industrial' && <IndustrialFields />}
                        {categoria === 'comercial' && <CommercialFields />}
                        {categoria === 'residencial' && <ResidentialFields />}
                        {/* Fallback for others */}
                        {(categoria === 'terreno' || categoria === 'oficina') && (
                            <p className="text-center text-muted-foreground italic">
                                Configuración específica para {categoria} pendiente de definir.
                                Se guardarán solo datos básicos.
                            </p>
                        )}
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end gap-4 sticky bottom-0 bg-background/80 backdrop-blur-sm p-6 border-t z-10">
                    <Button variant="ghost" type="button" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading} className="min-w-[150px] bg-primary text-primary-foreground hover:bg-primary/90">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publicar Propiedad
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

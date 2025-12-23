"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const formSchema = z.object({
    title: z.string().min(5, {
        message: "El título debe tener al menos 5 caracteres.",
    }),
    description: z.string().min(10, {
        message: "La descripción debe tener al menos 10 caracteres.",
    }),
    price: z.number().min(0, {
        message: "El precio debe ser un número positivo.",
    }),
    currency: z.enum(["MXN", "USD"]),
    property_type: z.enum(["Nave Industrial", "Terreno", "Bodega", "Oficinas"]),
    operation_type: z.enum(["Venta", "Renta"]),
    land_area: z.number().min(0),
    construction_area: z.number().min(0),
    ceiling_height: z.number().optional(),
    loading_docks: z.number().optional(),
    commission_shared: z.boolean().optional(),
    commission_percentage: z.string().optional(),
    link_mercadolibre: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
    link_instagram: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
    link_linkedin: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
})

export default function NewPropertyPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            currency: "MXN",
            property_type: "Nave Industrial",
            operation_type: "Venta",
            land_area: 0,
            construction_area: 0,
            ceiling_height: 0,
            loading_docks: 0,
            commission_shared: false,
            commission_percentage: "",
            link_mercadolibre: "",
            link_instagram: "",
            link_linkedin: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error("No hay usuario autenticado")
            }

            const { error } = await supabase.from("properties").insert({
                owner_id: user.id,
                title: values.title,
                description: values.description,
                price: values.price,
                currency: values.currency,
                property_type: values.property_type,
                operation_type: values.operation_type,
                land_area: values.land_area,
                construction_area: values.construction_area,
                ceiling_height: values.ceiling_height || null,
                loading_docks: values.loading_docks || null,
                commission_shared: values.commission_shared,
                commission_percentage: values.commission_percentage,
                link_mercadolibre: values.link_mercadolibre || null,
                link_instagram: values.link_instagram || null,
                link_linkedin: values.link_linkedin || null,
            })

            if (error) {
                throw error
            }

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            console.error("Error al guardar propiedad:", error)
            alert("Hubo un error al guardar la propiedad. Revisa la consola.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Nueva Propiedad</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Sección Básica */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej. Nave Industrial en Apodaca" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Detalles de la propiedad..." className="h-32" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Sección Negocio */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Negocio</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Precio</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} // Explicit number handling
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Moneda</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona moneda" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MXN">MXN</SelectItem>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="operation_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Operación</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona operación" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Venta">Venta</SelectItem>
                                                        <SelectItem value="Renta">Renta</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Sección Industrial */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Detalles Industriales</h3>
                                <FormField
                                    control={form.control}
                                    name="property_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Propiedad</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Nave Industrial">Nave Industrial</SelectItem>
                                                    <SelectItem value="Terreno">Terreno</SelectItem>
                                                    <SelectItem value="Bodega">Bodega</SelectItem>
                                                    <SelectItem value="Oficinas">Oficinas</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="land_area"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>M2 Terreno</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="construction_area"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>M2 Construcción</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ceiling_height"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Altura Libre (m)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                    />
                                                </FormControl>
                                                <FormDescription>Opcional</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="loading_docks"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Andenes de Carga</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                    />
                                                </FormControl>
                                                <FormDescription>Opcional</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Sección Networking */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Networking</h3>
                                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormField
                                        control={form.control}
                                        name="commission_shared"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        ¿Compartes Comisión?
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {form.watch("commission_shared") && (
                                    <FormField
                                        control={form.control}
                                        name="commission_percentage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Porcentaje / Monto</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej. 50% o $10,000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            {/* Enlaces Externos */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Enlaces Externos</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="link_mercadolibre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Link MercadoLibre</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="link_instagram"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Link Instagram</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="link_linkedin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Link LinkedIn</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Guardando..." : "Crear Propiedad"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

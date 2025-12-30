"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function IndustrialFields() {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wider">
                Especificaciones Industriales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="altura_libre">Altura Libre (m)</Label>
                    <Input id="altura_libre" name="altura_libre" type="number" step="0.1" placeholder="Ej. 9.5" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="kvas">Capacidad Eléctrica (KVAs)</Label>
                    <Input id="kvas" name="kvas" type="number" placeholder="Ej. 150 (Dejar vacío si no aplica)" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="andenes_con_rampa">Andenes con Rampa</Label>
                    <Input id="andenes_con_rampa" name="andenes_con_rampa" type="number" placeholder="Ej. 2" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="andenes_secos">Andenes Secos (Directos)</Label>
                    <Input id="andenes_secos" name="andenes_secos" type="number" placeholder="Ej. 1" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resistencia_piso">Resistencia de Piso (Ton/m²)</Label>
                    <Input id="resistencia_piso" name="piso_resistencia" type="number" step="0.5" placeholder="Ej. 5.0" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="espesor_piso">Espesor de Piso (cm)</Label>
                    <Input id="espesor_piso" name="piso_espesor" type="number" placeholder="Ej. 15" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="m2_oficinas">M² de Oficinas</Label>
                    <Input id="m2_oficinas" name="m2_oficinas" type="number" placeholder="Ej. 200" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="numero_banos">Número de Baños</Label>
                    <Input id="numero_banos" name="numero_banos" type="number" placeholder="Ej. 4" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="documentacion">Documentación y Estatus Legal</Label>
                <textarea
                    id="documentacion"
                    name="documentacion"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Escribe libremente: Escritura en regla, falta terminación de obra, etc."
                />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col space-y-2 col-span-2 md:col-span-1 border rounded-md p-3 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="patio_maniobras" name="patio_maniobras" />
                        <Label htmlFor="patio_maniobras" className="font-semibold">Patio de Maniobras</Label>
                    </div>
                    <Input
                        id="m2_patio"
                        name="m2_patio"
                        type="number"
                        placeholder="M² de Patio (Opcional)"
                        className="h-8 text-sm mt-2"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="via_ferrocarril" name="via_ferrocarril" />
                    <Label htmlFor="via_ferrocarril">Espuela de Ferrocarril</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="sistema_contra_incendio" name="sistema_contra_incendio" />
                    <Label htmlFor="sistema_contra_incendio">Sistema Contra Incendio</Label>
                </div>
            </div>
        </div>
    )
}

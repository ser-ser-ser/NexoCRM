"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trees, Fence, Factory, CheckSquare } from "lucide-react"
import { NumericFormat } from "react-number-format"

export function LandFields() {
    const [enParque, setEnParque] = useState(false)
    const [enFraccionamiento, setEnFraccionamiento] = useState(false)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold border-b border-slate-100 dark:border-slate-700 pb-2">
                <Trees className="h-5 w-5 text-emerald-500" />
                <h2>Especificaciones de Terreno</h2>
            </div>

            <div className="space-y-2">
                <Label>Uso de Suelo</Label>
                <Select name="uso_suelo">
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="habitacional">Habitacional</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="mixto">Mixto</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="rustico">Rústico / Agrícola</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-4" />

            {/* Parque Industrial Toggle */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex flex-col">
                        <Label htmlFor="en_parque_industrial" className="cursor-pointer font-medium mb-1 flex items-center gap-2">
                            <Factory className="h-4 w-4 text-slate-500" /> En Parque Industrial
                        </Label>
                        <span className="text-xs text-muted-foreground">Habilita opciones de cuotas y reglamento</span>
                    </div>
                    <Switch id="en_parque_industrial" name="en_parque_industrial" checked={enParque} onCheckedChange={setEnParque} />
                </div>

                {enParque && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-emerald-100 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label>Cuota de Mantenimiento (Parque)</Label>
                            <NumericFormat name="cuota_mantenimiento_parque" className="flex h-10 w-full rounded-md border border-input px-3 py-2" placeholder="$ 0.00" thousandSeparator={true} prefix="$ " />
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800 mt-8">
                            <CheckSquare className="h-4 w-4 text-emerald-500" />
                            <Checkbox id="tiene_reglamento" name="tiene_reglamento" />
                            <Label htmlFor="tiene_reglamento" className="cursor-pointer text-sm">Tiene Reglamento Constructivo</Label>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Detalles Reglamento / Restricciones</Label>
                            <Input name="reglamento_constructivo" placeholder="Ej. Altura máx 10m, Coeficiente ocupación 70%" />
                        </div>
                    </div>
                )}
            </div>

            {/* Fraccionamiento Toggle */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex flex-col">
                        <Label htmlFor="en_fraccionamiento" className="cursor-pointer font-medium mb-1 flex items-center gap-2">
                            <Fence className="h-4 w-4 text-slate-500" /> En Fraccionamiento Privado
                        </Label>
                        <span className="text-xs text-muted-foreground">Amenidades y Seguridad</span>
                    </div>
                    <Switch id="en_fraccionamiento" name="en_fraccionamiento" checked={enFraccionamiento} onCheckedChange={setEnFraccionamiento} />
                </div>

                {enFraccionamiento && (
                    <div className="space-y-2 pl-4 border-l-2 border-indigo-100 animate-in slide-in-from-top-2">
                        <Label>Amenidades del Fraccionamiento</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['Casa Club', 'Alberca Común', 'Campo de Golf', 'Seguridad Privada', 'Áreas Verdes'].map(am => (
                                <div key={am} className="flex items-center space-x-2">
                                    <Checkbox id={`amenidad_${am}`} name={`amenidad_fracc_${am}`} />
                                    <Label htmlFor={`amenidad_${am}`} className="text-sm cursor-pointer font-normal">{am}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

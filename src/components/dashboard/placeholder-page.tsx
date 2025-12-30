import { Construction } from "lucide-react"

export default function PlaceholderPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in">
            <div className="p-4 rounded-full bg-slate-100 mb-2">
                <Construction className="h-10 w-10 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Módulo en Construcción</h1>
            <p className="text-muted-foreground max-w-md">
                Estamos trabajando en esta funcionalidad. Pronto estará disponible en el siguiente Sprint.
            </p>
        </div>
    )
}

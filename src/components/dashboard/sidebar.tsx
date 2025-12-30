"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Building2,
    PlusCircle,
    Users,
    LogOut,
    Menu,
    KanbanSquare,
    Map,
    Key,
    Calendar,
    Settings
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Grouped Sidebar Configuration
const sidebarGroups = [
    {
        name: "Principal",
        items: [
            {
                title: "Tablero",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Pipeline CRM",
                href: "/dashboard/crm",
                icon: KanbanSquare,
            },
        ]
    },
    {
        name: "Propiedades",
        items: [
            {
                title: "Inventario",
                href: "/dashboard/inventario",
                icon: Building2,
            },
            {
                title: "Mapa (Beta)",
                href: "/dashboard/map",
                icon: Map,
            },
            {
                title: "Desarrollos",
                href: "/dashboard/desarrollos",
                icon: Building2,
            },
            {
                title: "Rentas",
                href: "/dashboard/rentas",
                icon: Key,
            },
        ]
    },
    {
        name: "Gestión",
        items: [
            {
                title: "Calendario",
                href: "/dashboard/calendar",
                icon: Calendar,
            },
            {
                title: "Clientes",
                href: "/dashboard/clients",
                icon: Users,
            },
        ]
    },
    {
        name: "Config",
        items: [
            {
                title: "Nueva Propiedad",
                href: "/dashboard/new",
                icon: PlusCircle,
            },
            {
                title: "Ajustes",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ]
    }
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userProfile?: {
        full_name: string | null
        role: string | null,
        email?: string
    }
}

export function Sidebar({ className, userProfile }: SidebarProps) {
    const pathname = usePathname()
    const supabase = createClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogout() {
        setIsLoading(true)
        try {
            await supabase.auth.signOut()
            router.push("/login")
            router.refresh()
        } catch (error) {
            console.error("Error logging out:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("pb-12 h-full clay-card m-4 flex flex-col overflow-y-auto", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <h2 className="mb-6 px-4 text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        NexoCRM
                    </h2>

                    <div className="space-y-6">
                        {sidebarGroups.map((group) => (
                            <div key={group.name} className="px-3 pb-2">
                                <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {group.name}
                                </h3>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <Button
                                            key={item.href}
                                            variant={pathname === item.href ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start mb-1 font-medium h-9",
                                                pathname === item.href
                                                    ? "bg-secondary text-white hover:bg-secondary/80 shadow-md"
                                                    : "text-slate-600 hover:text-primary hover:bg-primary/10"
                                            )}
                                            asChild
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="mr-3 h-4 w-4" strokeWidth={userProfile ? 1.5 : 2} />
                                                {item.title}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="mt-auto px-4 pb-4">
                <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {userProfile?.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate dark:text-slate-100">
                                {userProfile?.full_name || "Usuario"}
                            </p>
                            <p className="text-xs text-slate-500 truncate dark:text-slate-400 capitalize">
                                {userProfile?.role || "Agente"}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    <LogOut className="mr-3 h-4 w-4" strokeWidth={1.5} />
                    {isLoading ? "Cerrando..." : "Cerrar Sesión"}
                </Button>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <Sidebar className="border-none" />
            </SheetContent>
        </Sheet>
    )
}

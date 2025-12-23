"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Building2,
    PlusCircle,
    Users,
    LogOut,
    Menu
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const sidebarItems = [
    {
        title: "Tablero",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Propiedades",
        href: "/dashboard/properties",
        icon: Building2,
    },
    {
        title: "Nueva Propiedad",
        href: "/dashboard/new",
        icon: PlusCircle,
    },
    {
        title: "Clientes",
        href: "/dashboard/clients",
        icon: Users,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
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
        <div className={cn("pb-12 h-full clay-card m-4", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
                        NexoCRM
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start mb-1",
                                    pathname === item.href
                                        ? "bg-secondary text-white hover:bg-secondary/80 shadow-md"
                                        : "text-text-main hover:text-primary hover:bg-primary/10"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {isLoading ? "Cerrando..." : "Cerrar Sesión"}
                        </Button>
                    </div>
                </div>
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

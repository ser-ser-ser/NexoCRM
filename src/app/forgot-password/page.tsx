"use client"

import { useState } from "react"
import Link from "next/link"
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, KeyRound, Mail, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            })

            if (error) {
                throw error
            }

            setIsSuccess(true)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Ocurrió un error al enviar el correo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-body font-sans text-text-main p-4">
            {/* Animated Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary/40 rounded-full blur-3xl opacity-70 animate-float" />
                <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-primary/30 rounded-full blur-3xl opacity-70 animate-float-delayed" />
            </div>

            <div className="w-full max-w-[480px] bg-[#fcfaf8] rounded-[2.5rem] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] p-8 md:p-12 border border-white/40 relative overflow-hidden transition-all duration-500">

                {/* Back Link */}
                <div className="flex justify-start mb-8">
                    <Link href="/login" className="group flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al Login
                    </Link>
                </div>

                {isSuccess ? (
                    <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-black text-text-main mb-2">¡Correo Enviado!</h2>
                        <p className="text-text-muted mb-8">
                            Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada (y spam).
                        </p>
                        <Link href="/login" className="w-full">
                            <Button className="w-full h-14 rounded-full bg-secondary text-white font-bold text-lg shadow-[8px_8px_16px_rgba(102,205,170,0.4),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:scale-[1.02] transition-all">
                                Entendido
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Header Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl flex items-center justify-center shadow-sm rotate-3 border border-secondary/10">
                                <KeyRound className="w-10 h-10 text-secondary" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-black text-text-main mb-2">Recuperar Contraseña</h1>
                            <p className="text-text-muted text-sm">Ingresa tu correo y te enviaremos un enlace mágico.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 transition-colors group-focus-within:text-primary" />
                                <Input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full h-14 pl-14 pr-6 bg-[#f0f0f3] rounded-full border-none text-text-main shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 text-center font-medium animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold text-lg shadow-[8px_8px_16px_rgba(233,122,12,0.4),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Enviar Enlace"}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Home, LayoutDashboard, LineChart, Shield, Smartphone, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-body font-sans text-text-main overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcfaf8]/80 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-white shadow-lg font-black text-xl tracking-tighter">
              N
            </div>
            <span className="text-xl font-black tracking-tight text-text-main">Nexo CRM</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-text-muted">
            <a href="#features" className="hover:text-primary transition-colors">Características</a>
            <a href="#about" className="hover:text-primary transition-colors">Nosotros</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-full">
                Ingresar
              </Button>
            </Link>
            <Link href="/login?mode=signup">
              <Button className="rounded-full bg-primary text-white font-bold shadow-lg hover:bg-primary-hover hover:scale-105 transition-all">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-20 right-0 w-[40rem] h-[40rem] bg-secondary/10 rounded-full blur-3xl -z-10 animate-float-delayed" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />

        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-secondary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">v2.0 Beta Disponible</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-text-main leading-tight mb-6">
              El CRM Inmobiliario <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Más Amigable</span>
            </h1>
            <p className="text-xl text-text-muted mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Gestiona propiedades, clientes y cierres con una interfaz tan suave como la arcilla. Diseñado para agentes que aman la simplicidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login?mode=signup">
                <Button className="h-14 px-8 rounded-full bg-primary text-white text-lg font-bold shadow-[8px_8px_16px_rgba(233,122,12,0.3),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:scale-105 transition-transform flex items-center gap-2">
                  Empezar Ahora <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" className="h-14 px-8 rounded-full border-2 border-text-muted/20 text-text-main text-lg font-bold hover:bg-white hover:border-primary/50 transition-all">
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            {/* Testimonials Stack - Reviews */}
            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-6">
              {[
                { name: "Sofia R.", role: "Top Agent", text: "¡Simplemente lo amo! Mis ventas subieron 30%.", img: "/images/avatar-sofia.png" },
                { name: "Carlos M.", role: "Inmobiliaria MX", text: "El diseño es increíble, mis clientes lo notan.", img: "/images/avatar-carlos.png" },
                { name: "Ana P.", role: "Freelance", text: "Adiós Excel, hola Nexo. Todo es más fácil.", img: null }
              ].map((review, i) => (
                <div key={i} className={`clay-card p-6 flex items-start gap-4 bg-white/70 backdrop-blur-md transform transition-all hover:scale-105 duration-300 ${i === 1 ? 'ml-8' : ''} ${i === 2 ? 'ml-4' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-lg shadow-inner overflow-hidden relative">
                    {review.img ? (
                      <Image src={review.img} alt={review.name} fill className="object-cover" />
                    ) : (
                      review.name[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-text-main">{review.name}</h4>
                      <div className="flex text-yellow-400 text-xs">★★★★★</div>
                    </div>
                    <p className="text-sm text-text-muted leading-snug">"{review.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-text-main mb-4">Todo lo que necesitas</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">Herramientas potentes con una interfaz que te enamorará.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: LayoutDashboard, title: "Tablero Intuitivo", desc: "Vista general de tu rendimiento al instante." },
              { icon: Smartphone, title: "100% Móvil", desc: "Lleva tu inmobiliaria en el bolsillo." },
              { icon: Shield, title: "Seguridad Total", desc: "Tus datos protegidos con encriptación bancaria." },
              { icon: Zap, title: "Rápido y Fluido", desc: "Sin tiempos de carga molestos." },
              { icon: LineChart, title: "Reportes Auto", desc: "Genera PDFs de tus ventas en un click." },
              { icon: Home, title: "Gestión Fácil", desc: "Sube propiedades en menos de 2 minutos." },
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-[#fcfaf8] clay-card hover:bg-white transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">{feature.title}</h3>
                <p className="text-text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Call to Action */}
      <section id="pricing" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[3rem] bg-primary p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 relative z-10">¿Listo para modernizarte?</h2>
            <p className="text-white/80 text-lg lg:text-xl mb-10 max-w-2xl mx-auto relative z-10">
              Únete a los agentes que ya están cerrando más tratos con Nexo CRM.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login?mode=signup">
                <Button className="h-16 px-10 rounded-full bg-white text-primary text-xl font-bold shadow-xl hover:bg-gray-50 hover:scale-105 transition-all">
                  Crear Cuenta Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#e6e0da]/50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-black">
              N
            </div>
            <span className="font-bold text-text-main">Nexo CRM</span>
          </div>
          <p className="text-text-muted text-sm">© 2024 Nexo CRM. Hecho con ❤️ para inmobiliarias.</p>
        </div>
      </footer>
    </div>
  )
}

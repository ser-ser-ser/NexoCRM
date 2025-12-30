"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_DASHBOARD } from "@/lib/mock-data"
import { Building2, DollarSign, TrendingUp, Users, Wallet } from "lucide-react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'

export function CommandCenter() {
    const { financial, marketing, inventory } = MOCK_DASHBOARD

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-6">

            {/* 1. FINANCIAL SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Inventory Value */}
                <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Valor de Inventario
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatCurrency(financial.totalValue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">+{financial.monthlyGrowth}%</span>
                            <span className="ml-1">vs mes anterior</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Estimated Commission */}
                <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Comisiones Estimadas (5%)
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {formatCurrency(financial.estimatedCommission)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Potencial en pipeline activo
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. MARKETING & INVENTORY SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Marketing Widget (Tabs) - Takes up 2 columns */}
                <Card className="md:col-span-2 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Tráfico y Adquisición</CardTitle>
                        <CardDescription>Rendimiento de campañas digitales y web</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="web" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="web">Analytics (Web)</TabsTrigger>
                                <TabsTrigger value="leads">Meta Ads (Leads)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="web" className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={marketing.web}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="visitas" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Visitas" />
                                        <Bar dataKey="usuarios" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Usuarios Unicos" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </TabsContent>

                            <TabsContent value="leads" className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={marketing.leads} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="google" fill="#ea4335" radius={[0, 4, 4, 0]} name="Google Ads" stackId="stack" />
                                        <Bar dataKey="meta" fill="#1877f2" radius={[0, 4, 4, 0]} name="Meta (Facebook)" stackId="stack" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Inventory Distribution (Donut) - Takes up 1 column */}
                <Card className="shadow-sm border-slate-200 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Inventario</CardTitle>
                        <CardDescription>Distribución por tipo</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventory.distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {inventory.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

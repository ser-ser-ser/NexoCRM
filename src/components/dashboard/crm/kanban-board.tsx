"use client"

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, MoreVertical, DollarSign, UserPlus, Phone, Handshake, CheckCircle2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COLUMNS = [
    { id: 'nuevo', title: 'Nuevos Leads', color: 'bg-blue-50' },
    { id: 'visita', title: 'Visitas / Interesados', color: 'bg-yellow-50' },
    { id: 'negociacion', title: 'Negociación', color: 'bg-purple-50' },
    { id: 'cierre', title: 'Cierre / Contrato', color: 'bg-green-50' }
]

const COLUMN_ICONS: Record<string, React.ElementType> = {
    nuevo: UserPlus,
    visita: Phone,
    negociacion: Handshake,
    cierre: CheckCircle2
}

interface KanbanBoardProps {
    initialDeals: any[]
}

export function KanbanBoard({ initialDeals = [] }: KanbanBoardProps) {
    const [deals, setDeals] = useState(initialDeals)
    const [columns] = useState(COLUMNS)

    useEffect(() => {
        setDeals(initialDeals)
    }, [initialDeals])

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        // Optimistic UI Update
        const newDeals = deals.map(d => {
            if (d.id === draggableId) {
                return { ...d, etapa: destination.droppableId }
            }
            return d
        })

        setDeals(newDeals)

        // TODO: Call Server Action to update DB
        console.log("Moved deal", draggableId, "to", destination.droppableId)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
            notation: "compact"
        }).format(amount || 0)
    }

    // Helper to filter deals by column ID
    const getDealsForColumn = (columnId: string) => {
        return deals.filter(deal => (deal.etapa || 'nuevo') === columnId)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 pb-4 min-w-[1000px]">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className="flex flex-col w-80 shrink-0"
                    >
                        {/* Column Header */}
                        <div className={`flex items-center justify-between p-3 mb-3 rounded-lg ${column.color} border border-slate-200/50 shadow-sm`}>
                            <h3 className="font-bold text-slate-700 text-sm truncate flex items-center gap-2">
                                {(() => {
                                    const Icon = COLUMN_ICONS[column.id]
                                    return Icon ? <Icon className="w-4 h-4 text-slate-500" /> : null
                                })()}
                                {column.title}
                            </h3>
                            <Badge variant="secondary" className="bg-white/50 text-slate-600 font-mono text-xs">
                                {getDealsForColumn(column.id).length}
                            </Badge>
                        </div>

                        {/* Droppable Area */}
                        <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`
                                        flex-1 rounded-xl p-2 transition-colors min-h-[150px]
                                        ${snapshot.isDraggingOver ? 'bg-slate-100/50 ring-2 ring-primary/20' : ''}
                                    `}
                                >
                                    {getDealsForColumn(column.id).map((deal, index) => (
                                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{ ...provided.draggableProps.style }}
                                                    className="mb-3 group"
                                                >
                                                    <Card className={`
                                                        border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing
                                                        ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-primary' : ''}
                                                    `}>
                                                        <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start space-y-0">
                                                            <div className="space-y-1">
                                                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-slate-500 border-slate-200">
                                                                    ID: {deal.id.split('-')[0].substring(0, 4)}...
                                                                </Badge>
                                                                <h4 className="font-bold text-slate-800 text-sm leading-tight">
                                                                    {deal.metadata?.titulo || "Oportunidad Sin Título"}
                                                                </h4>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1 text-slate-400 opacity-0 group-hover:opacity-100">
                                                                <MoreVertical className="h-3 w-3" />
                                                            </Button>
                                                        </CardHeader>
                                                        <CardContent className="p-3 pt-3">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="h-6 w-6 border border-slate-100">
                                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                                                            {(deal.clientes?.nombre_completo || "?").substring(0, 2).toUpperCase()}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-xs text-slate-600 font-medium truncate max-w-[100px]" title={deal.clientes?.nombre_completo}>
                                                                        {deal.clientes?.nombre_completo || "Cliente N/A"}
                                                                    </span>
                                                                </div>
                                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 font-bold px-1.5 py-0 h-5">
                                                                    <DollarSign className="w-3 h-3 mr-0.5" />
                                                                    {formatCurrency(deal.valor_estimado)}
                                                                </Badge>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1">
                                                                    <span>Probabilidad</span>
                                                                    <span>{deal.probabilidad || 0}%</span>
                                                                </div>
                                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all ${deal.probabilidad > 75 ? 'bg-emerald-500' :
                                                                            deal.probabilidad > 40 ? 'bg-yellow-500' : 'bg-slate-400'
                                                                            }`}
                                                                        style={{ width: `${deal.probabilidad || 0}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {deal.propiedades?.titulo && (
                                                                <div className="mt-2 pt-2 border-t border-slate-100">
                                                                    <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                                                                        <Building2 className="w-3 h-3" />
                                                                        {deal.propiedades.titulo}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    )
}

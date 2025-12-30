
export const MOCK_DASHBOARD = {
    financial: {
        totalValue: 45250000, // $45.25M
        currency: 'MXN',
        monthlyGrowth: 12.5, // %
        estimatedCommission: 2262500, // 5%
        commissionCurrency: 'MXN'
    },
    marketing: {
        web: [
            { name: 'Lun', visitas: 120, usuarios: 80 },
            { name: 'Mar', visitas: 150, usuarios: 95 },
            { name: 'Mie', visitas: 180, usuarios: 110 },
            { name: 'Jue', visitas: 220, usuarios: 140 },
            { name: 'Vie', visitas: 280, usuarios: 190 },
            { name: 'Sab', visitas: 140, usuarios: 90 },
            { name: 'Dom', visitas: 90, usuarios: 50 },
        ],
        leads: [
            { name: 'Lun', google: 2, meta: 4 },
            { name: 'Mar', google: 3, meta: 6 },
            { name: 'Mie', google: 5, meta: 8 },
            { name: 'Jue', google: 4, meta: 10 },
            { name: 'Vie', google: 6, meta: 12 },
            { name: 'Sab', google: 3, meta: 5 },
            { name: 'Dom', google: 1, meta: 2 },
        ]
    },
    inventory: {
        distribution: [
            { name: 'Industrial', value: 12, fill: '#64748b' }, // slate-500
            { name: 'Comercial', value: 8, fill: '#6366f1' },  // indigo-500
            { name: 'Residencial', value: 15, fill: '#10b981' }, // emerald-500
        ]
    }
}

export const MOCK_CRM_BOARD = {
    columns: [
        { id: 'nuevo', title: 'Nuevo / Prospecto', color: 'bg-slate-100' },
        { id: 'visita', title: 'Contactado / Visita', color: 'bg-blue-50' },
        { id: 'negociacion', title: 'Negociación', color: 'bg-yellow-50' },
        { id: 'cierre', title: 'Cierre / Vendido', color: 'bg-green-50' },
    ],
    deals: [
        {
            id: 'deal-1',
            title: 'Nave Industrial Norte',
            client: 'Logística Express',
            value: 12500000,
            stage: 'visita',
            probability: 60,
            updatedAt: 'Hace 2 días'
        },
        {
            id: 'deal-2',
            title: 'Local Plaza Central',
            client: 'Cafetería Aroma',
            value: 3200000,
            stage: 'nuevo',
            probability: 20,
            updatedAt: 'Hace 4 horas'
        },
        {
            id: 'deal-3',
            title: 'Penthouse Lomas',
            client: 'Roberto G.',
            value: 8900000,
            stage: 'negociacion',
            probability: 85,
            updatedAt: 'Ayer'
        }
    ]
}

export const MOCK_BOOKINGS = [
    {
        id: 'bk-1',
        propertyTitle: 'Departamento Roma Norte',
        clientName: 'Sarah Connor',
        startDate: new Date(2025, 4, 12), // May 12
        endDate: new Date(2025, 4, 15),   // May 15
        status: 'confirmed',
        total: 8500
    },
    {
        id: 'bk-2',
        propertyTitle: 'Oficina Coworking Centro',
        clientName: 'Tech Startups Inc.',
        startDate: new Date(2025, 4, 20),
        endDate: new Date(2025, 4, 25),
        status: 'pending',
        total: 12000
    },
    {
        id: 'bk-3',
        propertyTitle: 'Casa de Campo Valle',
        clientName: 'Familia Pérez',
        startDate: new Date(2025, 5, 1),
        endDate: new Date(2025, 5, 7),
        status: 'confirmed',
        total: 45000
    }
]

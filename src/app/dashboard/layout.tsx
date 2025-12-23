import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar - Now floating */}
            <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="md:pl-72 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden flex h-14 items-center gap-4 border-b bg-background px-6">
                    <MobileSidebar />
                    <span className="font-semibold text-lg">NexoCRM</span>
                </header>

                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

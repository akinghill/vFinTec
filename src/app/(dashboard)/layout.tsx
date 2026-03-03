import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen">
            <Sidebar />
            <div className="flex w-full flex-col sm:ml-64">
                <Header />
                <main className="flex-1 p-6">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

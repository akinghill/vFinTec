import Link from "next/link";
import { LayoutDashboard, ReceiptText, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-card px-4 py-6 text-card-foreground">
            <div className="flex items-center gap-2 px-2 pb-8">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <span className="text-xl font-bold tracking-tight">vFinTec</span>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground transition-colors bg-muted/50"
                >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                </Link>
                <Link
                    href="/transactions"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <ReceiptText className="size-4" />
                    Transactions
                </Link>
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <Settings className="size-4" />
                    Settings
                </Link>
            </nav>

            <div className="mt-auto pt-6 border-t">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">U</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">User</span>
                        <span className="text-xs text-muted-foreground mt-1">user@example.com</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 flex-1">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-5" />
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </div>
        </header>
    );
}

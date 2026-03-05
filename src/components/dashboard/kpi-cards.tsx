import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Users, CreditCard } from "lucide-react";
import { getDashboardKPIs } from "@/app/(dashboard)/actions";

export async function KPICards() {
    const kpis = await getDashboardKPIs();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Revenue (30d)</CardTitle>
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{formatCurrency(kpis.revenue30d)}</div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                        + {formatCurrency(kpis.revenue90d)} <span className="text-muted-foreground font-normal">in the last 90d</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Expenses</CardTitle>
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full">
                        <CreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{formatCurrency(kpis.totalExpenses)}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Across all categories in history
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Net Profit</CardTitle>
                    <div className={`p-2 rounded-full ${kpis.netProfit >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                        {kpis.netProfit >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold tracking-tight ${kpis.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {formatCurrency(kpis.netProfit)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Overall historical profitability
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Active Members</CardTitle>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{kpis.activeMembers}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {kpis.pendingInvites} pending invites
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

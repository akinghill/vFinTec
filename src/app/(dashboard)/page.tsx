import { Suspense } from "react";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { getTransactions } from "@/server/actions/transactions";

export default async function DashboardPage() {
    const transactions = await getTransactions();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to vFinTec. Overview of your financial activity.
                </p>
            </div>

            <Suspense fallback={<div className="h-32 rounded-xl bg-muted/50 animate-pulse" />}>
                <KPICards />
            </Suspense>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <DashboardChart />
                <div className="col-span-full xl:col-span-3">
                    <TransactionsTable initialData={transactions} />
                </div>
            </div>
        </div>
    );
}

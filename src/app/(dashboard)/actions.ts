"use server";

import { prisma } from "@/server/db";
import { resolveOrgContext } from "@/lib/auth";
import { subDays, format, eachDayOfInterval } from "date-fns";

export async function getDashboardKPIs() {
    const orgId = await resolveOrgContext();

    // Total Revenue 30d
    const thirtyDaysAgo = subDays(new Date(), 30);
    const ninetyDaysAgo = subDays(new Date(), 90);

    const transactions = await prisma.transaction.findMany({
        where: {
            organizationId: orgId,
        },
        select: {
            amount: true,
            createdAt: true,
        }
    });

    let revenue30d = 0;
    let revenue90d = 0;
    let totalExpenses = 0;
    let totalRevenue = 0;

    for (const t of transactions) {
        if (t.amount > 0) {
            totalRevenue += t.amount;
            if (t.createdAt >= thirtyDaysAgo) {
                revenue30d += t.amount;
            }
            if (t.createdAt >= ninetyDaysAgo) {
                revenue90d += t.amount;
            }
        } else if (t.amount < 0) {
            totalExpenses += Math.abs(t.amount);
        }
    }

    const netProfit = totalRevenue - totalExpenses;

    const activeMembers = await prisma.membership.count({
        where: {
            organizationId: orgId,
        }
    });

    return {
        revenue30d,
        revenue90d,
        totalExpenses,
        netProfit,
        activeMembers,
        pendingInvites: 0,
    };
}

export async function getChartData(startDateStr: string, endDateStr: string) {
    const orgId = await resolveOrgContext();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const transactions = await prisma.transaction.findMany({
        where: {
            organizationId: orgId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            amount: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    const dataMap = new Map<string, { date: string, revenue: number, expenses: number }>();

    try {
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        for (const d of days) {
            const key = format(d, "MMM dd");
            dataMap.set(key, { date: key, revenue: 0, expenses: 0 });
        }
    } catch {
        // Fallback if interval is invalid
    }

    for (const t of transactions) {
        const key = format(t.createdAt, "MMM dd");
        const entry = dataMap.get(key);
        if (entry) {
            if (t.amount > 0) {
                entry.revenue += t.amount;
            } else {
                entry.expenses += Math.abs(t.amount);
            }
        } else {
            // Include outliers from DB just in case interval logic misses it
            if (t.amount > 0) {
                dataMap.set(key, { date: key, revenue: t.amount, expenses: 0 });
            } else {
                dataMap.set(key, { date: key, revenue: 0, expenses: Math.abs(t.amount) });
            }
        }
    }

    return Array.from(dataMap.values());
}

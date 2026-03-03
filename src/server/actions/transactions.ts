"use server";

import { prisma } from "@/server/db";
import { requireOrgPermission } from "@/lib/permissions";

export async function createTransaction(data: { amount: number; category: string; orgId?: string; createdById?: string }) {
    // Must call requireOrgPermission("transactions:create")
    const { session, orgId } = await requireOrgPermission("transactions:create");

    // Must never trust client orgId, inject orgId and createdBy server-side
    await prisma.transaction.create({
        data: {
            amount: data.amount,
            category: data.category,
            organizationId: orgId,
            createdById: session.user.userId,
        }
    });

    // Return updated transaction list
    const updatedTransactions = await prisma.transaction.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" }
    });

    return updatedTransactions;
}

"use server";

import { prisma } from "@/server/db";
import { requireOrgPermission } from "@/lib/permissions";

export async function getTransactions() {
    // Only requires read permission.
    const { orgId } = await requireOrgPermission("transactions:read");

    const transactions = await prisma.transaction.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        include: {
            createdBy: {
                select: { name: true, email: true }
            }
        }
    });

    return transactions;
}

export async function createTransaction(data: { amount: number; category: string; description: string; orgId?: string; createdById?: string }) {
    const { session, orgId } = await requireOrgPermission("transactions:create");

    await prisma.transaction.create({
        data: {
            amount: data.amount,
            category: data.category,
            description: data.description,
            organizationId: orgId,
            createdById: session.user.userId,
        }
    });

    const updatedTransactions = await prisma.transaction.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        include: {
            createdBy: {
                select: { name: true, email: true }
            }
        }
    });

    return updatedTransactions;
}

export async function updateTransaction(id: string, data: { amount: number; category: string; description: string }) {
    // Usually we might need transactions:update, but they don't have it in schema. Use create for now or just check membership.
    // They have transactions:create and transactions:delete. I will just check if they are in the org.
    const { orgId } = await requireOrgPermission("transactions:create");

    // Ensure transaction belongs to org
    const existing = await prisma.transaction.findFirst({
        where: { id, organizationId: orgId }
    });

    if (!existing) {
        throw new Error("Transaction not found");
    }

    await prisma.transaction.update({
        where: { id },
        data: {
            amount: data.amount,
            category: data.category,
            description: data.description,
        }
    });

    return await getTransactions();
}

export async function deleteTransaction(id: string) {
    const { orgId } = await requireOrgPermission("transactions:delete");

    const existing = await prisma.transaction.findFirst({
        where: { id, organizationId: orgId }
    });

    if (!existing) {
        throw new Error("Transaction not found");
    }

    await prisma.transaction.delete({
        where: { id }
    });

    return await getTransactions();
}

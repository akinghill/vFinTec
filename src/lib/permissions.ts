import { Role } from "@prisma/client";
import { prisma } from "@/server/db";
import { requireAuth, resolveOrgContext } from "./auth";

export type Permission =
    | "transactions:read"
    | "transactions:create"
    | "transactions:delete"
    | "members:read"
    | "members:invite"
    | "members:remove"
    | "settings:manage";

export const rolePermissions: Record<Role, Permission[]> = {
    ADMIN: [
        "transactions:read",
        "transactions:create",
        "transactions:delete",
        "members:read",
        "members:invite",
        "members:remove",
        "settings:manage",
    ],
    FINANCIAL_MANAGER: [
        "transactions:read",
        "transactions:create",
        "members:read",
    ],
    VIEWER: [
        "transactions:read",
    ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) ?? false;
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export async function requireOrgPermission(permission: Permission) {
    const session = await requireAuth();
    const orgId = await resolveOrgContext();

    const membership = await prisma.membership.findUnique({
        where: {
            userId_organizationId: {
                userId: session.user.userId,
                organizationId: orgId,
            },
        },
    });

    if (!membership) {
        throw new UnauthorizedError("User is not a member of this organization");
    }

    if (!hasPermission(membership.role, permission)) {
        throw new UnauthorizedError(`Missing required permission: ${permission}`);
    }

    return { session, orgId, membership };
}

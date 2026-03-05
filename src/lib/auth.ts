import { cookies } from "next/headers";
import { prisma } from "@/server/db";

export type Role = "ADMIN" | "FINANCIAL_MANAGER" | "VIEWER";

export interface AuthSession {
    user: {
        userId: string;
        role: Role;
    };
    orgId: string;
}

/**
 * Server-side utility to require an authenticated session.
 * Reads the mocked role from cookies, falling back to ADMIN.
 * Dynamically queries the database for seeded users to ensure valid IDs.
 * 
 * TODO: Implement actual JWT/session validation
 */
export async function requireAuth(): Promise<AuthSession> {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get("mock_role")?.value as Role | undefined;
    const role: Role = roleCookie && ["ADMIN", "FINANCIAL_MANAGER", "VIEWER"].includes(roleCookie) ? roleCookie : "ADMIN";

    // Map mocked role to seeded test user email
    const emailMap: Record<Role, string> = {
        ADMIN: "admin@vector.com",
        FINANCIAL_MANAGER: "manager@vector.com",
        VIEWER: "viewer@vector.com"
    };

    const email = emailMap[role];

    const membership = await prisma.membership.findFirst({
        where: { user: { email } },
        include: { user: true }
    });

    if (!membership) {
        throw new Error(`Mock user ${email} not found. Did you run 'npx prisma db seed'?`);
    }

    return {
        user: {
            userId: membership.userId,
            role,
        },
        orgId: membership.organizationId,
    };
}

/**
 * Resolves the currently active organization context for the authenticated user.
 * Server-side implementation.
 */
export async function resolveOrgContext(): Promise<string> {
    const session = await requireAuth();
    return session.orgId;
}

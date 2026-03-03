import { cookies } from "next/headers";

export type Role = "ADMIN" | "FINANCE_MANAGER" | "VIEWER";

// Mock session data for development
export const MOCK_USER = {
    userId: "user_mock_123",
    role: "ADMIN" as Role,
};

export const MOCK_ORG_ID = "org_mock_456";

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
 * 
 * TODO: Implement actual JWT/session validation
 */
export async function requireAuth(): Promise<AuthSession> {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get("mock_role")?.value as Role | undefined;
    const role: Role = roleCookie && ["ADMIN", "FINANCE_MANAGER", "VIEWER"].includes(roleCookie) ? roleCookie : "ADMIN";

    return {
        user: {
            ...MOCK_USER,
            role,
        },
        orgId: MOCK_ORG_ID,
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

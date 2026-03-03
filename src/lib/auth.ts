// Mock session data for development
export const MOCK_USER = {
    userId: "user_mock_123",
    role: "ADMIN",
} as const;

export const MOCK_ORG_ID = "org_mock_456";

export interface AuthSession {
    user: typeof MOCK_USER;
    orgId: string;
}

/**
 * Server-side utility to require an authenticated session.
 * Currently hardcoded to return a mock admin user for development.
 * 
 * TODO: Implement actual JWT/session validation
 */
export async function requireAuth(): Promise<AuthSession> {
    // Simulating database/network delay
    // await new Promise(resolve => setTimeout(resolve, 50));

    return {
        user: MOCK_USER,
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

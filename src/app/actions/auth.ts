"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Role } from "@/lib/auth";

export async function setRole(role: Role) {
    const cookieStore = await cookies();
    cookieStore.set("mock_role", role, { path: "/" });
    revalidatePath("/", "layout");
}

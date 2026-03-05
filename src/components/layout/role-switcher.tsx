"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setRole } from "@/app/actions/auth";
import { Role } from "@/lib/auth";

const roles: { value: Role; label: string }[] = [
    { value: "ADMIN", label: "Admin" },
    { value: "FINANCIAL_MANAGER", label: "Finance Manager" },
    { value: "VIEWER", label: "Viewer" },
];

interface RoleSwitcherProps {
    currentRole: Role;
}

export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
    const [isPending, startTransition] = React.useTransition();

    const handleRoleChange = (role: Role) => {
        startTransition(() => {
            setRole(role);
        });
    };

    const currentRoleLabel = roles.find((r) => r.value === currentRole)?.label || "Select Role";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div role="button" aria-disabled={isPending} className={cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer", isPending && "opacity-50 cursor-not-allowed")}>
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium">U</span>
                    </div>
                    <div className="flex flex-col flex-1 text-left">
                        <span className="text-sm font-medium leading-none">Mock User</span>
                        <span className="text-xs text-muted-foreground mt-1">{currentRoleLabel}</span>
                    </div>
                    <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {roles.map((role) => (
                    <DropdownMenuItem
                        key={role.value}
                        className="flex items-center justify-between"
                        onClick={() => handleRoleChange(role.value)}
                        disabled={isPending}
                    >
                        {role.label}
                        {currentRole === role.value && <Check className="size-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

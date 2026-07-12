"use client";

import {
  ChevronDownIcon,
  CreditCardIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarHeaderDropdownProps {
  name: string;
  plan: string;
  initials: string;
}

export function SidebarHeaderDropdown({
  name,
  plan,
  initials,
}: SidebarHeaderDropdownProps) {
  const { state } = useSidebar();

  const collapsed = state === "collapsed";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">{name}</p>

                  <p className="truncate text-xs text-muted-foreground">
                    {plan} plan
                  </p>
                </div>

                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </>
            )}
          </button>
        }
      />

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="size-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem>
            <CreditCardIcon className="size-4" />
            Billing
          </DropdownMenuItem>

          <DropdownMenuItem>
            <SettingsIcon className="size-4" />
            Workspace Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>Switch Workspace</DropdownMenuItem>
          <DropdownMenuItem>Create Workspace</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

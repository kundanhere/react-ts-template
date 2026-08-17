"use client";

import {
  Bug02Icon,
  Github01Icon,
  HelpCircleIcon,
  Logout01Icon,
  NotificationOff01Icon,
  PaintBoardIcon,
  Settings01Icon,
  UserIcon,
  UserStoryIcon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function User({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-lg" className="rounded-full">
            <Avatar size="sm">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=a04"
                alt="Kundan Gupta"
              />
              <AvatarFallback>KG</AvatarFallback>
            </Avatar>
          </Button>
        }
      />

      <DropdownMenuContent className="w-50" align="start">
        {/* Profile, Status & Notifications */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>KG</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          {/* Status */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <HugeiconsIcon icon={UserStoryIcon} strokeWidth={2} />
              Update status
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled>Icons will come</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Notifications */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <HugeiconsIcon icon={NotificationOff01Icon} strokeWidth={2} />
              Mute notifications
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>Mute notifications</DropdownMenuLabel>
                <DropdownMenuItem>For 30 minutes</DropdownMenuItem>
                <DropdownMenuItem>For 1 hour</DropdownMenuItem>
                <DropdownMenuItem>For 8 hours</DropdownMenuItem>
                <DropdownMenuItem>Until tomorrow</DropdownMenuItem>
                <DropdownMenuItem>Until next week</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Custom date and time</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* My Account */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
            Your Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={2} />
            Appearance
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Support */}
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <HugeiconsIcon icon={Github01Icon} strokeWidth={2} />
            GitHub
          </DropdownMenuItem>

          <DropdownMenuItem>
            <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
            Help
            <DropdownMenuShortcut>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <HugeiconsIcon icon={Bug02Icon} strokeWidth={2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" align="start">
                  Report a bug
                </TooltipContent>
              </Tooltip>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Accounts and actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <HugeiconsIcon icon={UserSwitchIcon} strokeWidth={2} />
            Switch account
            <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

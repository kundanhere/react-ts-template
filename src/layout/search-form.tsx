"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Activity01Icon,
  Add01Icon,
  Analytics01Icon,
  Audit02Icon,
  BellPlusIcon,
  Copy01Icon,
  CpuIcon,
  DashboardSquare01Icon,
  FileCodeIcon,
  GridIcon,
  Home03Icon,
  InboxIcon,
  LaptopPhoneSyncIcon,
  Logout01Icon,
  Moon02Icon,
  PackageIcon,
  Quiz05Icon,
  Search01Icon,
  SentIcon,
  Settings01Icon,
  Shield01Icon,
  ShieldKeyIcon,
  Sun01Icon,
  Tick02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useTheme } from "@/hooks/use-theme";

export interface ISearchFormProps extends React.ComponentProps<"form"> {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
}

export function SearchForm({
  open: propOpen,
  setOpen: propSetOpen,
  onOpenChange,
  ...props
}: ISearchFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = propOpen !== undefined ? propOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const nextValue = typeof value === "function" ? value(open) : value;
      if (propOpen === undefined) {
        setInternalOpen(nextValue);
      }
      if (propSetOpen) {
        propSetOpen(nextValue);
      }
      onOpenChange?.(nextValue);
    },
    [open, propOpen, propSetOpen, onOpenChange]
  );

  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [mountKey, setMountKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fresh data / clean state on every modal open & close, plus auto-focus
  useEffect(() => {
    setInputValue("");
    setCopied(false);

    if (open) {
      const raf = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    setMountKey((prev) => prev + 1);
  }, [open]);

  const isCurrentRoute = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Global shortcut to open command menu (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "K" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const handleCopyUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <div className="relative">
          <InputGroup
            className="max-w-sm cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <InputGroupInput
              placeholder="Search or jump to..."
              readOnly
              onClick={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
              className="cursor-pointer select-none"
            />
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>⌘ K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </form>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogHeader className="sr-only">
          <DialogTitle>Command Menu</DialogTitle>
          <DialogDescription>
            Search and navigate pages, actions, and settings across Sentry IAM.
          </DialogDescription>
        </DialogHeader>
        <DialogContent
          className="border-border/50 w-[calc(100%-1.5rem)] max-w-3xl! gap-0 overflow-hidden rounded-xl p-0 shadow-2xl data-[size=default]:max-w-3xl sm:w-full sm:max-w-3xl!"
          showCloseButton={false}
          initialFocus={inputRef}
        >
          <Command key={mountKey} className="p-0" loop>
            <div className="border-border/50 border-b p-2.5 sm:p-3">
              <CommandInput
                ref={inputRef}
                autoFocus
                className="h-8 text-xs sm:text-sm"
                onValueChange={setInputValue}
                placeholder="Search commands, pages, settings..."
                value={inputValue}
                kbd={
                  <KbdGroup className="hidden sm:inline-flex">
                    <Kbd>Esc</Kbd>
                  </KbdGroup>
                }
                onEscape={() => setOpen(false)}
              />
            </div>

            <CommandList className="max-h-[60vh] py-2 sm:max-h-100">
              <CommandEmpty className="py-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Search01Icon} size={18} />
                  </div>
                  <p className="text-foreground text-xs font-medium">
                    No matching commands or pages found.
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Try searching for &quot;users&quot;, &quot;policies&quot;,
                    &quot;audit&quot;, or &quot;theme&quot;.
                  </p>
                </div>
              </CommandEmpty>

              {/* QUICK CREATE - DISTINCT COLOR-CODED COMPACT RESPONSIVE SECTION */}
              <CommandGroup
                heading="Quick Create"
                className="**:[[cmdk-group-items]]:grid **:[[cmdk-group-items]]:grid-cols-2 **:[[cmdk-group-items]]:gap-1.5 **:[[cmdk-group-items]]:px-2 **:[[cmdk-group-items]]:py-1 sm:**:[[cmdk-group-items]]:gap-2 sm:**:[[cmdk-group-items]]:px-2.5 md:**:[[cmdk-group-items]]:grid-cols-4"
              >
                {/* 1. New User - Blue */}
                <CommandItem
                  value="create new user member add account register /iam/users"
                  onSelect={() => runCommand(() => navigate("/iam/users"))}
                  className="border-border/70 bg-muted/25 data-[selected=true]:ring-border/80 flex min-w-0 cursor-pointer items-center gap-1.5 rounded-lg border p-1.5 text-left transition-colors duration-75 hover:border-blue-500/60 hover:bg-blue-500/10 data-[selected=true]:ring-1 sm:gap-2 sm:px-2.5 sm:py-1.5 hover:[&_.qc-add]:text-blue-500 hover:[&_.qc-icon]:bg-blue-500 hover:[&_.qc-icon_svg]:text-white! hover:[&_.qc-title]:text-blue-600 dark:hover:[&_.qc-title]:text-blue-400 [&>svg:last-child]:hidden"
                >
                  <div className="qc-icon flex size-6 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-500 transition-colors duration-75">
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      size={13}
                      strokeWidth={2}
                      className="text-blue-500! transition-colors duration-75"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="qc-title text-foreground truncate text-xs leading-tight font-semibold transition-colors duration-75">
                      New User
                    </div>
                    <div className="text-muted-foreground truncate text-[10px] leading-tight">
                      Account & access
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={11}
                    strokeWidth={2.5}
                    className="qc-add text-muted-foreground/50 xs:block hidden shrink-0 transition-colors duration-75 sm:block"
                  />
                </CommandItem>

                {/* 2. New Role - Amber */}
                <CommandItem
                  value="create new role permission rbac grant /iam/roles"
                  onSelect={() => runCommand(() => navigate("/iam/roles"))}
                  className="border-border/70 bg-muted/25 data-[selected=true]:ring-border/80 flex min-w-0 cursor-pointer items-center gap-1.5 rounded-lg border p-1.5 text-left transition-colors duration-75 hover:border-amber-500/60 hover:bg-amber-500/10 data-[selected=true]:ring-1 sm:gap-2 sm:px-2.5 sm:py-1.5 hover:[&_.qc-add]:text-amber-500 hover:[&_.qc-icon]:bg-amber-500 hover:[&_.qc-icon_svg]:text-white! hover:[&_.qc-title]:text-amber-600 dark:hover:[&_.qc-title]:text-amber-400 [&>svg:last-child]:hidden"
                >
                  <div className="qc-icon flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-500 transition-colors duration-75">
                    <HugeiconsIcon
                      icon={Shield01Icon}
                      size={13}
                      strokeWidth={2}
                      className="text-amber-500! transition-colors duration-75"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="qc-title text-foreground truncate text-xs leading-tight font-semibold transition-colors duration-75">
                      New Role
                    </div>
                    <div className="text-muted-foreground truncate text-[10px] leading-tight">
                      RBAC permissions
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={11}
                    strokeWidth={2.5}
                    className="qc-add text-muted-foreground/50 xs:block hidden shrink-0 transition-colors duration-75 sm:block"
                  />
                </CommandItem>

                {/* 3. New Policy - Emerald */}
                <CommandItem
                  value="create new policy json rule condition abac /iam/policies"
                  onSelect={() => runCommand(() => navigate("/iam/policies"))}
                  className="border-border/70 bg-muted/25 data-[selected=true]:ring-border/80 flex min-w-0 cursor-pointer items-center gap-1.5 rounded-lg border p-1.5 text-left transition-colors duration-75 hover:border-emerald-500/60 hover:bg-emerald-500/10 data-[selected=true]:ring-1 sm:gap-2 sm:px-2.5 sm:py-1.5 hover:[&_.qc-add]:text-emerald-500 hover:[&_.qc-icon]:bg-emerald-500 hover:[&_.qc-icon_svg]:text-white! hover:[&_.qc-title]:text-emerald-600 dark:hover:[&_.qc-title]:text-emerald-400 [&>svg:last-child]:hidden"
                >
                  <div className="qc-icon flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500 transition-colors duration-75">
                    <HugeiconsIcon
                      icon={FileCodeIcon}
                      size={13}
                      strokeWidth={2}
                      className="text-emerald-500! transition-colors duration-75"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="qc-title text-foreground truncate text-xs leading-tight font-semibold transition-colors duration-75">
                      New Policy
                    </div>
                    <div className="text-muted-foreground truncate text-[10px] leading-tight">
                      JSON access rules
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={11}
                    strokeWidth={2.5}
                    className="qc-add text-muted-foreground/50 xs:block hidden shrink-0 transition-colors duration-75 sm:block"
                  />
                </CommandItem>

                {/* 4. New Module - Purple */}
                <CommandItem
                  value="create new module service endpoint component /iam/modules"
                  onSelect={() => runCommand(() => navigate("/iam/modules"))}
                  className="border-border/70 bg-muted/25 data-[selected=true]:ring-border/80 flex min-w-0 cursor-pointer items-center gap-1.5 rounded-lg border p-1.5 text-left transition-colors duration-75 hover:border-purple-500/60 hover:bg-purple-500/10 data-[selected=true]:ring-1 sm:gap-2 sm:px-2.5 sm:py-1.5 hover:[&_.qc-add]:text-purple-500 hover:[&_.qc-icon]:bg-purple-500 hover:[&_.qc-icon_svg]:text-white! hover:[&_.qc-title]:text-purple-600 dark:hover:[&_.qc-title]:text-purple-400 [&>svg:last-child]:hidden"
                >
                  <div className="qc-icon flex size-6 shrink-0 items-center justify-center rounded-md bg-purple-500/15 text-purple-500 transition-colors duration-75">
                    <HugeiconsIcon
                      icon={PackageIcon}
                      size={13}
                      strokeWidth={2}
                      className="text-purple-500! transition-colors duration-75"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="qc-title text-foreground truncate text-xs leading-tight font-semibold transition-colors duration-75">
                      New Module
                    </div>
                    <div className="text-muted-foreground truncate text-[10px] leading-tight">
                      Service capability
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={11}
                    strokeWidth={2.5}
                    className="qc-add text-muted-foreground/50 xs:block hidden shrink-0 transition-colors duration-75 sm:block"
                  />
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* QUICK ACTIONS */}
              <CommandGroup heading="Quick Actions">
                <CommandItem
                  value="toggle switch appearance theme dark light mode"
                  onSelect={() => runCommand(handleToggleTheme)}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={resolvedTheme === "dark" ? Sun01Icon : Moon02Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <span className="truncate font-medium">
                      {resolvedTheme === "dark"
                        ? "Switch to Light Mode"
                        : "Switch to Dark Mode"}
                    </span>
                    <span className="text-muted-foreground/70 xs:inline-block ml-2 hidden shrink-0 text-[11px] sm:inline-block">
                      Appearance
                    </span>
                  </div>
                  <CommandShortcut className="hidden sm:inline-flex">
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>T</Kbd>
                    </KbdGroup>
                  </CommandShortcut>
                </CommandItem>

                <CommandItem
                  value="copy current url share link page address"
                  onSelect={handleCopyUrl}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={copied ? Tick02Icon : Copy01Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <span className="truncate font-medium">
                      {copied ? "Copied URL to Clipboard!" : "Copy Page URL"}
                    </span>
                    <span className="text-muted-foreground/70 xs:inline-block ml-2 hidden shrink-0 text-[11px] sm:inline-block">
                      Share
                    </span>
                  </div>
                  <CommandShortcut className="hidden sm:inline-flex">
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>⇧</Kbd>
                      <Kbd>C</Kbd>
                    </KbdGroup>
                  </CommandShortcut>
                </CommandItem>

                <CommandItem
                  value="simulate test policy evaluate access decision engine dry run"
                  onSelect={() =>
                    runCommand(() => navigate("/iam/access/simulate"))
                  }
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={CpuIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate font-medium">
                        Test Policy Simulator
                      </span>
                      {isCurrentRoute("/iam/access/simulate") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/access/simulate
                    </span>
                  </div>
                  <CommandShortcut className="hidden sm:inline-flex">
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>P</Kbd>
                    </KbdGroup>
                  </CommandShortcut>
                </CommandItem>

                <CommandItem
                  value="audit log trail events activity compliance records"
                  onSelect={() => runCommand(() => navigate("/iam/audit/logs"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Audit02Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate font-medium">
                        View System Audit Logs
                      </span>
                      {isCurrentRoute("/iam/audit/logs") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/audit/logs
                    </span>
                  </div>
                  <CommandShortcut className="hidden sm:inline-flex">
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>L</Kbd>
                    </KbdGroup>
                  </CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* IDENTITY & ACCESS */}
              <CommandGroup heading="Identity & Access Management">
                <CommandItem
                  value="users directory members accounts profiles credentials people /iam/users"
                  onSelect={() => runCommand(() => navigate("/iam/users"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Users</span>
                      {isCurrentRoute("/iam/users") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Directory & credentials
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/users
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="roles permissions rbac privileges grants admin access /iam/roles"
                  onSelect={() => runCommand(() => navigate("/iam/roles"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Shield01Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Roles & Permissions</span>
                      {isCurrentRoute("/iam/roles") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        RBAC configurations
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/roles
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="policies json rules security conditions abac registry /iam/policies"
                  onSelect={() => runCommand(() => navigate("/iam/policies"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={FileCodeIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Policies Registry</span>
                      {isCurrentRoute("/iam/policies") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        JSON access rules
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/policies
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="access matrix grid table capabilities coverage /iam/access-matrix"
                  onSelect={() =>
                    runCommand(() => navigate("/iam/access-matrix"))
                  }
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={GridIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Access Matrix</span>
                      {isCurrentRoute("/iam/access-matrix") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Role × Module grid
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/access-matrix
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="modules services apps endpoints components /iam/modules"
                  onSelect={() => runCommand(() => navigate("/iam/modules"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={PackageIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Modules</span>
                      {isCurrentRoute("/iam/modules") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Service capabilities
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/modules
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="iam analytics metrics security traffic graphs /iam/dashboard"
                  onSelect={() => runCommand(() => navigate("/iam/dashboard"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Analytics01Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">IAM Analytics</span>
                      {isCurrentRoute("/iam/dashboard") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Access graphs & metrics
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/dashboard
                    </span>
                  </div>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* SECURITY & GOVERNANCE */}
              <CommandGroup heading="Security & Governance">
                <CommandItem
                  value="sessions active devices tokens logins ip /iam/sessions"
                  onSelect={() => runCommand(() => navigate("/iam/sessions"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={LaptopPhoneSyncIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Active Sessions</span>
                      {isCurrentRoute("/iam/sessions") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Devices & tokens
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/sessions
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="security mfa 2fa authentication passwords protection /iam/security/settings"
                  onSelect={() =>
                    runCommand(() => navigate("/iam/security/settings"))
                  }
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={ShieldKeyIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Security & MFA</span>
                      {isCurrentRoute("/iam/security/settings") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Auth & credentials
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/security/settings
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="activity me personal my actions log recent /iam/audit/me"
                  onSelect={() => runCommand(() => navigate("/iam/audit/me"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Activity01Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">My Activity</span>
                      {isCurrentRoute("/iam/audit/me") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Personal action history
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /iam/audit/me
                    </span>
                  </div>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* NAVIGATION & MAIN */}
              <CommandGroup heading="Platform Navigation">
                <CommandItem
                  value="home welcome landing start portal /"
                  onSelect={() => runCommand(() => navigate("/"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Home03Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Home</span>
                      {isCurrentRoute("/") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Welcome portal
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="overview dashboard kpi stats charts health /dashboard"
                  onSelect={() => runCommand(() => navigate("/dashboard"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={DashboardSquare01Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Overview Dashboard</span>
                      {isCurrentRoute("/dashboard") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        High-level KPI metrics
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /dashboard
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="inbox notifications alerts messages requests /inbox"
                  onSelect={() => runCommand(() => navigate("/inbox"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={InboxIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Inbox & Alerts</span>
                      {isCurrentRoute("/inbox") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Notifications & alerts
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /inbox
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="updates releases changelog notes news versions /updates"
                  onSelect={() => runCommand(() => navigate("/updates"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={BellPlusIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium">Updates & Releases</span>
                      {isCurrentRoute("/updates") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-muted-foreground truncate text-[11px]">
                        Product changelog
                      </span>
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /updates
                    </span>
                  </div>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* SYSTEM & SUPPORT */}
              <CommandGroup heading="Preferences & Support">
                <CommandItem
                  value="settings preferences configuration appearance system /settings"
                  onSelect={() => runCommand(() => navigate("/settings"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Settings01Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate font-medium">
                        System Settings
                      </span>
                      {isCurrentRoute("/settings") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /settings
                    </span>
                  </div>
                  <CommandShortcut className="hidden sm:inline-flex">
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>,</Kbd>
                    </KbdGroup>
                  </CommandShortcut>
                </CommandItem>

                <CommandItem
                  value="support help docs center faq tickets documentation /support"
                  onSelect={() => runCommand(() => navigate("/support"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Quiz05Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate font-medium">
                        Support Center
                      </span>
                      {isCurrentRoute("/support") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /support
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="feedback bug suggestion report idea feature request /feedback"
                  onSelect={() => runCommand(() => navigate("/feedback"))}
                  className="mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={SentIcon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate font-medium">
                        Send Feedback
                      </span>
                      {isCurrentRoute("/feedback") && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground/70 ml-2 hidden shrink-0 font-mono text-[10px] sm:inline-block">
                      /feedback
                    </span>
                  </div>
                </CommandItem>

                <CommandItem
                  value="logout sign out exit quit account /login"
                  onSelect={() => runCommand(() => navigate("/login"))}
                  className="text-destructive data-selected:bg-destructive/10 data-selected:text-destructive mx-1.5 gap-2 rounded-lg py-2 sm:mx-2 sm:gap-2.5"
                >
                  <div className="bg-destructive/10 text-destructive flex size-6 shrink-0 items-center justify-center rounded-md">
                    <HugeiconsIcon
                      icon={Logout01Icon}
                      size={14}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <span className="truncate font-medium">Log Out</span>
                    <span className="text-muted-foreground/70 xs:inline-block ml-2 hidden shrink-0 text-[11px] sm:inline-block">
                      End session
                    </span>
                  </div>
                  <CommandShortcut className="hidden sm:inline-flex">
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>Q</Kbd>
                    </KbdGroup>
                  </CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>

            {/* MODERN FOOTER */}
            <div className="border-border/50 bg-muted/40 text-muted-foreground flex items-center justify-between border-t px-3 py-2 text-[11px]">
              <div className="hidden items-center gap-3 sm:flex">
                <span className="flex items-center gap-1">
                  <Kbd className="text-[10px]">↑</Kbd>
                  <Kbd className="text-[10px]">↓</Kbd>
                  <span className="text-muted-foreground/80">navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <Kbd className="text-[10px]">↵</Kbd>
                  <span className="text-muted-foreground/80">select</span>
                </span>
                <span className="flex items-center gap-1">
                  <Kbd className="text-[10px]">esc</Kbd>
                  <span className="text-muted-foreground/80">close</span>
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] sm:hidden">
                <span>Tap any item to select</span>
              </div>
              <div className="text-muted-foreground/70 flex items-center gap-2 text-[10px] font-medium">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-xs font-medium underline underline-offset-2 sm:hidden"
                >
                  Close
                </button>
                <span className="hidden sm:inline">
                  Sentry IAM Command Menu
                </span>
              </div>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchForm;

import { useState } from "react";

import {
  Add01Icon,
  AlertCircleIcon,
  Bookmark01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CodeIcon,
  Copy01Icon,
  DatabaseIcon,
  FlashIcon,
  Folder01Icon,
  GlobeIcon,
  HelpCircleIcon,
  InformationCircleIcon,
  Layers01Icon,
  PlayIcon,
  RefreshIcon,
  SecurityValidationIcon,
  Settings02Icon,
  Tick02Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

// Types for Simulator Context
type EntityType = "user" | "role";
type SimulationResult = "Allowed" | "Denied" | "Limited";

type PolicySet = {
  id: string;
  name: string;
  code: string;
  active: boolean;
  type: "system" | "custom";
};

type MatrixCell = {
  service: string;
  action: string;
  status: "Allowed" | "Denied" | "Limited" | "Not Applicable";
};

// Result Lookups to avoid nested ternaries
const RESULT_BANNER_STYLES: Record<SimulationResult, string> = {
  Allowed:
    "border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-500/25 dark:bg-emerald-950/20",
  Denied:
    "border-rose-200/80 bg-rose-50/40 dark:border-rose-500/25 dark:bg-rose-950/20",
  Limited:
    "border-amber-200 bg-amber-50/40 dark:border-amber-500/25 dark:bg-amber-950/20",
};

const RESULT_TEXT_STYLES: Record<SimulationResult, string> = {
  Allowed: "text-emerald-800 dark:text-emerald-400",
  Denied: "text-rose-800 dark:text-rose-400",
  Limited: "text-amber-800 dark:text-amber-400",
};

const RESULT_SUBTEXT_STYLES: Record<SimulationResult, string> = {
  Allowed: "text-emerald-700/90 dark:text-emerald-400/80",
  Denied: "text-rose-700/90 dark:text-rose-400/80",
  Limited: "text-amber-700/90 dark:text-amber-400/80",
};

const RESULT_ICON_COLORS: Record<SimulationResult, string> = {
  Allowed: "text-emerald-600 dark:text-emerald-400",
  Denied: "text-rose-600 dark:text-rose-400",
  Limited: "text-amber-600 dark:text-amber-400",
};

const RESULT_VERDICT_COLORS: Record<SimulationResult, string> = {
  Allowed: "text-emerald-700 dark:text-emerald-400",
  Denied: "text-rose-700 dark:text-rose-400",
  Limited: "text-amber-700 dark:text-amber-400",
};

const RESULT_TRACE_BADGES: Record<
  SimulationResult,
  "default" | "destructive" | "secondary"
> = {
  Allowed: "default",
  Denied: "destructive",
  Limited: "secondary",
};

const getResultDescription = (
  result: SimulationResult,
  action: string,
  service: string
): string => {
  if (result === "Allowed") {
    return `The operation "${action}" on "${service}" is explicitly allowed by an active policy.`;
  }
  if (result === "Denied") {
    return `The operation "${action}" is explicitly denied by the active security boundary rules.`;
  }
  return `This operation has conditional access limits applied under field-level restrictions.`;
};

// Preset Data Definitions matching reference
const ROLES = [
  {
    id: "developer",
    name: "Developer",
    description: "Standard engineering access to dev resources",
  },
  {
    id: "admin",
    name: "System Administrator",
    description: "Full root administrative control",
  },
  {
    id: "auditor",
    name: "Security Auditor",
    description: "Read-only access across all compliance modules",
  },
  {
    id: "analyst",
    name: "Data Analyst",
    description: "Access to DB and Reporting tools",
  },
  {
    id: "guest",
    name: "Guest User",
    description: "Minimal zero-trust viewing access",
  },
];

const USERS = [
  { id: "usr_42", name: "Kundan Gupta (ID: 42)", role: "Developer" },
  {
    id: "usr_108",
    name: "Alice Smith (ID: 108)",
    role: "System Administrator",
  },
  { id: "usr_204", name: "Bob Johnson (ID: 204)", role: "Security Auditor" },
];

const SERVICES = [
  "Dashboard",
  "User Management",
  "Content Management",
  "API Management",
  "Database",
  "Reports & Analytics",
  "System Settings",
];

const ACTIONS = [
  "View / Read",
  "Create",
  "Update",
  "Delete",
  "Export",
  "Manage Permissions",
];

const RESOURCES = [
  {
    label: "Customer Data",
    value: "Customer Data",
    arn: "arn:iam:db:customer_data",
  },
  { label: "User Profiles", value: "User Profiles", arn: "arn:iam:users:*" },
  { label: "Audit Logs", value: "Audit Logs", arn: "arn:iam:audit:logs" },
  { label: "Billing Data", value: "Billing Data", arn: "arn:iam:billing:*" },
  {
    label: "System Config",
    value: "System Config",
    arn: "arn:iam:system:config",
  },
];

const ALL_AVAILABLE_POLICIES: PolicySet[] = [
  {
    id: "p1",
    name: "Development Base Policy",
    code: "POL-DEV-BASE",
    active: true,
    type: "system",
  },
  {
    id: "p2",
    name: "API Access Policy",
    code: "POL-API-ACC",
    active: true,
    type: "custom",
  },
  {
    id: "p3",
    name: "Database Read Policy",
    code: "POL-DB-READ",
    active: true,
    type: "custom",
  },
  {
    id: "p4",
    name: "SuperAdmin Full Policy",
    code: "POL-SYS-ADMIN",
    active: false,
    type: "system",
  },
  {
    id: "p5",
    name: "Audit Trail View Policy",
    code: "POL-AUDIT-VIEW",
    active: false,
    type: "system",
  },
  {
    id: "p6",
    name: "Deny Production Export Policy",
    code: "POL-DENY-EXP",
    active: false,
    type: "custom",
  },
];

export default function PolicySimulatorPage() {
  // State management
  const [entityType, setEntityType] = useState<EntityType>("role");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("developer");
  const [selectedEnv, setSelectedEnv] = useState<string>("Development");
  const [selectedAction, setSelectedAction] = useState<string>("View / Read");
  const [selectedService, setSelectedService] = useState<string>("Database");
  const [selectedResource, setSelectedResource] =
    useState<string>("Customer Data");

  // Context parameters
  const [resourceId, setResourceId] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("192.168.1.10");
  const [simulationTime, setSimulationTime] =
    useState<string>("2025-05-20T10:30");
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  // Active Policy Sets
  const [activePolicies, setActivePolicies] = useState<PolicySet[]>(
    ALL_AVAILABLE_POLICIES.filter((p) => ["p1", "p2", "p3"].includes(p.id))
  );

  // Results & UI Active Tab
  const [activeTab, setActiveTab] = useState<
    "matrix" | "trace" | "policies" | "effective" | "deny"
  >("matrix");
  const [simulationId, setSimulationId] = useState<string>("sim_78f4a2d90c1b");
  const [evaluatedAt, setEvaluatedAt] = useState<string>(
    "May 20, 2025 10:30 AM"
  );

  // Modals state
  const [jsonModalOpen, setJsonModalOpen] = useState<boolean>(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
  const [saveScenarioOpen, setSaveScenarioOpen] = useState<boolean>(false);
  const [scenarioName, setScenarioName] = useState<string>("");
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Handle re-running simulation
  const handleRunSimulation = () => {
    const randomHash = Math.random().toString(36).substring(2, 10);
    setSimulationId(`sim_${randomHash}`);
    const now = new Date();
    setEvaluatedAt(
      `${now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} ${now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
    toast.success("Policy simulation re-evaluated successfully.");
  };

  // Reset parameters
  const handleReset = () => {
    setEntityType("role");
    setSelectedEntityId("developer");
    setSelectedEnv("Development");
    setSelectedAction("View / Read");
    setSelectedService("Database");
    setSelectedResource("Customer Data");
    setResourceId("");
    setIpAddress("192.168.1.10");
    setSimulationTime("2025-05-20T10:30");
    setActivePolicies(
      ALL_AVAILABLE_POLICIES.filter((p) => ["p1", "p2", "p3"].includes(p.id))
    );
    handleRunSimulation();
  };

  // Toggle Policy attachment
  const togglePolicy = (policy: PolicySet) => {
    if (activePolicies.some((p) => p.id === policy.id)) {
      setActivePolicies(activePolicies.filter((p) => p.id !== policy.id));
    } else {
      setActivePolicies([...activePolicies, { ...policy, active: true }]);
    }
  };

  // Compute simulation decision for currently selected action/service/role
  const computeDecision = (): SimulationResult => {
    if (selectedEntityId === "admin") return "Allowed";
    if (selectedEntityId === "guest") return "Denied";
    if (selectedAction === "Delete" || selectedService === "System Settings")
      return "Denied";
    if (selectedAction === "Create" || selectedAction === "Update") {
      if (
        selectedService === "Content Management" ||
        selectedService === "API Management"
      ) {
        return "Limited";
      }
      return "Denied";
    }
    return "Allowed";
  };

  const currentResult = computeDecision();

  // Matrix generation dynamic evaluation matching screenshot
  const getMatrixStatus = (
    service: string,
    action: string
  ): MatrixCell["status"] => {
    if (selectedEntityId === "admin") return "Allowed";
    if (selectedEntityId === "guest") return "Not Applicable";

    if (service === "Dashboard") {
      return action === "View / Read" ? "Allowed" : "Denied";
    }

    if (service === "User Management") {
      return "Denied";
    }

    if (service === "Content Management" || service === "API Management") {
      if (action === "View / Read" || action === "Export") return "Allowed";
      if (action === "Create" || action === "Update") return "Limited";
      return "Denied";
    }

    if (service === "Database") {
      if (action === "View / Read" || action === "Export") return "Allowed";
      if (action === "Update") return "Limited";
      return "Denied";
    }

    if (service === "Reports & Analytics") {
      if (action === "View / Read" || action === "Export") return "Allowed";
      return "Denied";
    }

    if (service === "System Settings") {
      return "Denied";
    }

    return "Denied";
  };

  // JSON payload structure for export/viewing
  const jsonPayload = {
    simulationId,
    timestamp: evaluatedAt,
    context: {
      entityType,
      entityId: selectedEntityId,
      entityName:
        entityType === "role"
          ? ROLES.find((r) => r.id === selectedEntityId)?.name
          : USERS.find((u) => u.id === selectedEntityId)?.name,
      environment: selectedEnv,
      ipAddress,
      resourceId: resourceId || undefined,
    },
    target: {
      service: selectedService,
      action: selectedAction,
      resource: selectedResource,
      resourceArn:
        RESOURCES.find((r) => r.value === selectedResource)?.arn ||
        "arn:iam:resource:*",
    },
    activePolicySets: activePolicies.map((p) => ({
      code: p.code,
      name: p.name,
    })),
    evaluationResult: {
      decision: currentResult,
      matchedPolicy: "Development Base Policy",
      statementId: "AllowViewDatabase",
      evalTimeMs: 3.8,
      denyOverridesMatched: 0,
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2));
    setCopiedJson(true);
    toast.success("Simulation JSON payload copied to clipboard.");
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Scenario "${scenarioName || "Simulation Preset"}" saved successfully.`
    );
    setSaveScenarioOpen(false);
    setScenarioName("");
  };

  return (
    <PageWrapper
      title="IAM - Policy Simulator"
      subtitle="Test and validate access decisions before deploying policies"
      rightElement={
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-muted/50 border-border/80 text-foreground flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium sm:gap-2.5 sm:px-3.5">
            <div className="bg-primary/10 text-primary rounded-md p-1">
              <HugeiconsIcon icon={SecurityValidationIcon} size={14} />
            </div>
            <div className="flex flex-wrap items-center">
              <span className="font-semibold">Simulator Mode</span>
              <span className="text-muted-foreground hidden text-[0.6875rem] sm:ml-1 sm:inline">
                — Results are simulated. No real changes are made.
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHowItWorksOpen(true)}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <HugeiconsIcon icon={HelpCircleIcon} size={14} />
            <span className="xs:inline hidden">How it works</span>
            <span className="xs:hidden">Help</span>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Top Grid: Step 1 (Left 4 cols), Step 2 & Summary (Right 8 cols) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Step 1: Configure Simulation Card */}
          <Card className="flex flex-col justify-between lg:col-span-4">
            <div>
              <CardHeader className="border-b/60 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                      1
                    </span>
                    <CardTitle className="text-base font-semibold">
                      Configure Simulation
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-4 text-xs">
                {/* Select Entity Type Segmented Toggle */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-muted-foreground text-xs font-medium">
                    Select Entity Type
                  </Label>
                  <Tabs
                    value={entityType}
                    onValueChange={(val) => {
                      if (val === "user" || val === "role") {
                        setEntityType(val);
                        setSelectedEntityId(
                          val === "user" ? "usr_42" : "developer"
                        );
                      }
                    }}
                    className="w-full gap-0"
                  >
                    <TabsList className="bg-muted/50 border-border/60 grid h-10 w-full grid-cols-2 rounded-lg border p-1">
                      <TabsTrigger
                        value="user"
                        className="h-full gap-1.5 text-xs"
                      >
                        <HugeiconsIcon
                          icon={UserIcon}
                          size={14}
                          className="shrink-0"
                        />
                        <span>User</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="role"
                        className="h-full gap-1.5 text-xs"
                      >
                        <HugeiconsIcon
                          icon={UserGroupIcon}
                          size={14}
                          className="shrink-0"
                        />
                        <span>Role</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Select Role / User */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-muted-foreground text-xs font-medium">
                    {entityType === "user" ? "Select User" : "Select Role"}
                  </Label>
                  <Select
                    value={selectedEntityId}
                    onValueChange={(val) => val && setSelectedEntityId(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {entityType === "role"
                        ? ROLES.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))
                        : USERS.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Environment */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-muted-foreground text-xs font-medium">
                    Select Environment (Optional)
                  </Label>
                  <Select
                    value={selectedEnv}
                    onValueChange={(val) => val && setSelectedEnv(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Staging">Staging</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Policy Sets (3) */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-xs font-medium">
                      Active Policy Sets ({activePolicies.length})
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                        >
                          <HugeiconsIcon icon={Add01Icon} size={12} />
                          Add Policy Set
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" align="end">
                        <h4 className="mb-2 text-xs font-semibold">
                          Toggle Active Policies
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {ALL_AVAILABLE_POLICIES.map((p) => {
                            const isAttached = activePolicies.some(
                              (ap) => ap.id === p.id
                            );
                            return (
                              <button
                                type="button"
                                key={p.id}
                                onClick={() => togglePolicy(p)}
                                className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors ${
                                  isAttached
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted text-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <HugeiconsIcon
                                    icon={Layers01Icon}
                                    size={12}
                                  />
                                  <span className="truncate">{p.name}</span>
                                </div>
                                {isAttached && (
                                  <HugeiconsIcon icon={Tick02Icon} size={12} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {activePolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <HugeiconsIcon
                            icon={Layers01Icon}
                            size={14}
                            className="text-primary/70 shrink-0"
                          />
                          <span className="text-foreground truncate font-medium">
                            {policy.name}
                          </span>
                        </div>
                        <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Context (Optional) Expandable */}
                <div className="border-border/60 border-t pt-3">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen(!advancedOpen)}
                    className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-xs font-medium"
                  >
                    <span>Context (Optional)</span>
                    <HugeiconsIcon
                      icon={Settings02Icon}
                      size={14}
                      className={`transition-transform ${advancedOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  {advancedOpen && (
                    <div className="mt-3 flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <Label className="text-muted-foreground text-[0.6875rem]">
                          Resource ID (Optional)
                        </Label>
                        <Input
                          value={resourceId}
                          onChange={(e) => setResourceId(e.target.value)}
                          placeholder="Enter resource ID"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-muted-foreground text-[0.6875rem]">
                          IP Address (Optional)
                        </Label>
                        <Input
                          value={ipAddress}
                          onChange={(e) => setIpAddress(e.target.value)}
                          placeholder="192.168.1.10"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-muted-foreground text-[0.6875rem]">
                          Time (Optional)
                        </Label>
                        <Input
                          type="datetime-local"
                          value={simulationTime}
                          onChange={(e) => setSimulationTime(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>

            {/* Action Buttons Footer */}
            <div className="border-border/60 flex items-center gap-2 border-t p-4">
              <Button
                onClick={handleRunSimulation}
                className="flex-1 gap-1.5 text-xs font-semibold"
                size="default"
              >
                <HugeiconsIcon icon={PlayIcon} size={14} />
                Run Simulation
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="default"
                className="gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={RefreshIcon} size={14} />
                Reset
              </Button>
            </div>
          </Card>

          {/* Right Section: Step 2 Select Action & Resource + Simulation Summary */}
          <div className="flex h-full flex-col gap-6 lg:col-span-8">
            <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-12">
              {/* Step 2: Select Action & Resource Card */}
              <Card className="flex h-full flex-col justify-between md:col-span-7">
                <CardHeader className="border-b/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                      2
                    </span>
                    <CardTitle className="text-base font-semibold">
                      Select Action & Resource
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-muted-foreground text-xs font-medium">
                      Action
                    </Label>
                    <Select
                      value={selectedAction}
                      onValueChange={(v) => v && setSelectedAction(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIONS.map((act) => (
                          <SelectItem key={act} value={act}>
                            {act}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-[0.6875rem]">
                      The operations you want to test
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-muted-foreground text-xs font-medium">
                      Service / Module
                    </Label>
                    <Select
                      value={selectedService}
                      onValueChange={(v) => v && setSelectedService(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((srv) => (
                          <SelectItem key={srv} value={srv}>
                            {srv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-muted-foreground text-xs font-medium">
                      Resource
                    </Label>
                    <Select
                      value={selectedResource}
                      onValueChange={(v) => v && setSelectedResource(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOURCES.map((res) => (
                          <SelectItem key={res.value} value={res.value}>
                            {res.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-[0.6875rem]">
                      The specific resource to test
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Simulation Summary Card */}
              <Card className="flex h-full flex-col justify-between md:col-span-5">
                <div>
                  <CardHeader className="border-border/60 border-b pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        Simulation Summary
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="font-mono text-[0.625rem]"
                      >
                        Context Ready
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pt-4 text-xs">
                    <div className="border-border/80 bg-muted/20 divide-border/60 divide-y overflow-hidden rounded-lg border">
                      {/* Entity */}
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem] font-medium">
                          <HugeiconsIcon
                            icon={
                              entityType === "role" ? UserGroupIcon : UserIcon
                            }
                            size={14}
                            className="text-muted-foreground/70"
                          />
                          {entityType === "role" ? "Role:" : "User:"}
                        </span>
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[0.6875rem] font-semibold"
                        >
                          {entityType === "role"
                            ? ROLES.find((r) => r.id === selectedEntityId)?.name
                            : USERS.find((u) => u.id === selectedEntityId)
                                ?.name}
                        </Badge>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem] font-medium">
                          <HugeiconsIcon
                            icon={FlashIcon}
                            size={14}
                            className="text-muted-foreground/70"
                          />
                          Action:
                        </span>
                        <span className="text-foreground font-mono text-[0.6875rem] font-semibold">
                          {selectedAction}
                        </span>
                      </div>

                      {/* Service & Resource */}
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem] font-medium">
                          <HugeiconsIcon
                            icon={Folder01Icon}
                            size={14}
                            className="text-muted-foreground/70"
                          />
                          Target:
                        </span>
                        <div className="text-right">
                          <span className="text-foreground block text-[0.6875rem] font-semibold">
                            {selectedService}
                          </span>
                          <span className="text-muted-foreground block font-mono text-[0.625rem]">
                            {selectedResource}
                          </span>
                        </div>
                      </div>

                      {/* Environment */}
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem] font-medium">
                          <HugeiconsIcon
                            icon={GlobeIcon}
                            size={14}
                            className="text-muted-foreground/70"
                          />
                          Environment:
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[0.625rem] font-medium"
                        >
                          {selectedEnv}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJsonModalOpen(true)}
                    className="h-8 w-full gap-1.5 text-xs font-medium"
                  >
                    <HugeiconsIcon icon={CodeIcon} size={14} />
                    View Payload JSON
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 3: Upgraded Simulation Results Section */}
          <Card className="border-border/80 col-span-full overflow-hidden shadow-sm">
            <CardHeader className="border-border/60 bg-muted/20 border-b pb-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-xs font-bold shadow-xs">
                    3
                  </span>
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight">
                      Simulation Results
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">
                      Authorization decision breakdown and policy evaluation
                      trace matrix.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="bg-muted/40 border-border/60 text-muted-foreground flex items-center gap-2.5 rounded-md border px-2.5 py-1 text-[0.6875rem] font-medium">
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={13}
                        className="text-muted-foreground/70"
                      />
                      3.8ms
                    </span>
                    <span className="bg-border/80 h-3 w-px" />
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Deterministic
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJsonModalOpen(true)}
                    className="h-8 gap-1.5 text-xs font-medium"
                  >
                    <HugeiconsIcon icon={CodeIcon} size={14} />
                    <span>Export Payload</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 pt-5">
              {/* Decision Banner — matches settings-page border/bg pattern (security-tab.tsx) */}
              <div
                className={`flex flex-wrap items-start justify-between gap-4 rounded-lg border p-4 sm:flex-nowrap ${RESULT_BANNER_STYLES[currentResult]}`}
              >
                <div className="flex items-start gap-2.5">
                  <HugeiconsIcon
                    icon={
                      currentResult === "Allowed"
                        ? CheckmarkCircle02Icon
                        : AlertCircleIcon
                    }
                    className={`mt-0.5 size-4.5 shrink-0 ${RESULT_ICON_COLORS[currentResult]}`}
                  />
                  <div className="space-y-0.5">
                    <p
                      className={`text-xs font-semibold ${RESULT_TEXT_STYLES[currentResult]}`}
                    >
                      Access is {currentResult}
                    </p>
                    <p
                      className={`text-[0.6875rem] leading-relaxed ${RESULT_SUBTEXT_STYLES[currentResult]}`}
                    >
                      {getResultDescription(
                        currentResult,
                        selectedAction,
                        selectedService
                      )}
                    </p>
                    <div
                      className={`flex flex-wrap items-center gap-3 pt-1 text-[0.6875rem] font-medium opacity-80 ${RESULT_SUBTEXT_STYLES[currentResult]}`}
                    >
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Layers01Icon} size={13} />
                        Policy: Development Base Policy
                      </span>
                      <span className="opacity-40">•</span>
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={CodeIcon} size={13} />
                        Statement: AllowViewDatabase
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decision Metadata — integrated divider section */}
                <div className="border-border/60 flex w-full shrink-0 flex-col gap-1.5 border-t pt-3 text-xs sm:w-auto sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                  <span className="text-muted-foreground text-[0.625rem] font-semibold tracking-wider uppercase">
                    Decision Metadata
                  </span>
                  <div className="flex items-center justify-between gap-3 sm:justify-start">
                    <span className="text-muted-foreground text-[0.6875rem] sm:w-24 sm:shrink-0">
                      Evaluated:
                    </span>
                    <span className="text-foreground font-mono text-[0.6875rem] font-medium">
                      {evaluatedAt}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-start">
                    <span className="text-muted-foreground text-[0.6875rem] sm:w-24 sm:shrink-0">
                      Simulation ID:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="text-foreground hover:text-primary flex items-center gap-1 font-mono text-[0.6875rem] font-medium transition-colors"
                      title="Click to copy payload"
                    >
                      <span>{simulationId}</span>
                      <HugeiconsIcon
                        icon={copiedJson ? Tick02Icon : Copy01Icon}
                        size={12}
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-start">
                    <span className="text-muted-foreground text-[0.6875rem] sm:w-24 sm:shrink-0">
                      Verdict:
                    </span>
                    <span
                      className={`text-[0.6875rem] font-bold uppercase ${RESULT_VERDICT_COLORS[currentResult]}`}
                    >
                      {currentResult}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Header */}
              <div className="border-border/60 border-b pb-0">
                <div className="no-scrollbar -mb-px flex gap-1 overflow-x-auto sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("matrix")}
                    className={`flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all sm:px-4 ${
                      activeTab === "matrix"
                        ? "border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground border-transparent"
                    }`}
                  >
                    <HugeiconsIcon icon={DatabaseIcon} size={14} />
                    Access Result
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("trace")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === "trace"
                        ? "border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground border-transparent"
                    }`}
                  >
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    Evaluation Trace
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("policies")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === "policies"
                        ? "border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground border-transparent"
                    }`}
                  >
                    <HugeiconsIcon icon={Layers01Icon} size={14} />
                    Applied Policies ({activePolicies.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("effective")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === "effective"
                        ? "border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground border-transparent"
                    }`}
                  >
                    <HugeiconsIcon icon={SecurityValidationIcon} size={14} />
                    Permissions (Effective)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("deny")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === "deny"
                        ? "border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground border-transparent"
                    }`}
                  >
                    <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                    Deny Overrides
                  </button>
                </div>
              </div>

              {/* Tab 1: Access Result View */}
              {activeTab === "matrix" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Access Matrix Capability Table */}
                  <div className="flex flex-col gap-4 lg:col-span-8">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">Access Matrix</h4>
                        <Badge variant="outline" className="text-[0.625rem]">
                          7 Modules × 6 Actions
                        </Badge>
                      </div>

                      {/* Legend Bar */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs sm:gap-3.5">
                        <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          Allowed
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-rose-600">
                          <span className="size-2 rounded-full bg-rose-500" />
                          Denied
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-amber-600">
                          <span className="size-2 rounded-full bg-amber-500" />
                          Limited
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <span className="bg-muted-foreground/40 size-2 rounded-full" />
                          N/A
                        </span>
                      </div>
                    </div>

                    <div className="border-border/80 bg-card overflow-hidden rounded-lg border">
                      <div className="no-scrollbar overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead className="bg-muted/50 text-muted-foreground border-border/80 border-b text-[0.6875rem] font-semibold tracking-wider uppercase">
                            <tr>
                              <th className="border-border/60 border-r px-4 py-3 font-semibold whitespace-nowrap">
                                Module / Resource
                              </th>
                              {ACTIONS.map((act, i) => (
                                <th
                                  key={act}
                                  className={`border-border/60 px-3.5 py-3 text-center font-semibold whitespace-nowrap ${i < ACTIONS.length - 1 ? "border-r" : ""}`}
                                >
                                  {act}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-border/60 divide-y">
                            {SERVICES.map((srv) => (
                              <tr
                                key={srv}
                                className="hover:bg-muted/30 transition-colors"
                              >
                                <td className="border-border/60 text-foreground border-r px-4 py-2.5 font-semibold whitespace-nowrap">
                                  {srv}
                                </td>
                                {ACTIONS.map((act, i) => {
                                  const status = getMatrixStatus(srv, act);
                                  const isTargetCell =
                                    srv === selectedService &&
                                    act === selectedAction;

                                  return (
                                    <td
                                      key={act}
                                      className={`border-border/60 px-3.5 py-2.5 text-center transition-colors ${i < ACTIONS.length - 1 ? "border-r" : ""} ${
                                        isTargetCell
                                          ? "bg-primary/5 ring-primary/60 dark:bg-primary/10 font-bold ring-2 ring-inset"
                                          : ""
                                      }`}
                                    >
                                      {status === "Allowed" && (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200/80 bg-emerald-50/70 px-2 py-0.5 text-[0.6875rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400">
                                          <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={12}
                                          />
                                          Allowed
                                        </span>
                                      )}
                                      {status === "Denied" && (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-rose-200/80 bg-rose-50/70 px-2 py-0.5 text-[0.6875rem] font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400">
                                          <HugeiconsIcon
                                            icon={AlertCircleIcon}
                                            size={12}
                                          />
                                          Denied
                                        </span>
                                      )}
                                      {status === "Limited" && (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200/80 bg-amber-50/70 px-2 py-0.5 text-[0.6875rem] font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400">
                                          Limited
                                        </span>
                                      )}
                                      {status === "Not Applicable" && (
                                        <span className="text-muted-foreground/60 font-mono text-xs">
                                          —
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-lg border border-sky-200/80 bg-sky-50/60 p-3.5 text-xs text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300">
                      <HugeiconsIcon
                        icon={InformationCircleIcon}
                        size={16}
                        className="shrink-0 text-sky-600 dark:text-sky-400"
                      />
                      <span className="leading-relaxed">
                        Results are based on the combined effect of all attached
                        policies, role permissions and deny overrides for{" "}
                        <strong>{selectedEnv}</strong> environment.
                      </span>
                    </div>
                  </div>

                  {/* Right Side Column Cards */}
                  <div className="flex flex-col gap-4 lg:col-span-4">
                    {/* Why is this allowed? — settings-page list card */}
                    <div className="border-border/80 bg-card overflow-hidden rounded-lg border">
                      <div className="border-border/60 flex flex-wrap items-start justify-between gap-2 border-b p-4 pb-3">
                        <div className="space-y-0.5">
                          <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                            <HugeiconsIcon
                              icon={CheckmarkCircle02Icon}
                              className="text-muted-foreground size-4"
                            />
                            Why is this allowed?
                          </span>
                          <p className="text-muted-foreground text-[0.6875rem]">
                            Policy evaluation chain summary
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="font-mono text-[0.625rem]"
                        >
                          3 Checks
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-3.5 p-4 text-xs">
                        <div className="flex items-start gap-2.5">
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          />
                          <div className="space-y-0.5">
                            <span className="text-foreground font-semibold">
                              Allowed by Policy
                            </span>
                            <p className="text-muted-foreground text-[0.6875rem] leading-relaxed">
                              Development Base Policy
                              <br />
                              <span className="text-primary font-mono text-[0.625rem]">
                                Statement: AllowViewDatabase
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          />
                          <div className="space-y-0.5">
                            <span className="text-foreground font-semibold">
                              No Deny Override
                            </span>
                            <p className="text-muted-foreground text-[0.6875rem] leading-relaxed">
                              No explicit deny found in any policy or permission
                              boundary.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          />
                          <div className="space-y-0.5">
                            <span className="text-foreground font-semibold">
                              Role Permission
                            </span>
                            <p className="text-muted-foreground text-[0.6875rem] leading-relaxed">
                              Developer role has View permission on Database
                              module.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What if? — settings-page list card */}
                    <div className="border-border/80 bg-card overflow-hidden rounded-lg border">
                      <div className="border-border/60 space-y-0.5 border-b p-4 pb-3">
                        <span className="text-foreground text-xs font-semibold">
                          What if?
                        </span>
                        <p className="text-muted-foreground text-[0.6875rem]">
                          Test different scenarios quickly
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEntityType("role");
                            setSelectedEntityId("admin");
                            handleRunSimulation();
                          }}
                          className="h-8 justify-start gap-2 text-xs font-medium"
                        >
                          <HugeiconsIcon
                            icon={FlashIcon}
                            size={14}
                            className="text-yellow-400 drop-shadow-[0_0_0.5rem_rgba(250,204,21,0.7)]"
                          />
                          Test as Different Role
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAction("Delete");
                            handleRunSimulation();
                          }}
                          className="h-8 justify-start gap-2 text-xs font-medium"
                        >
                          <HugeiconsIcon
                            icon={FlashIcon}
                            size={14}
                            className="text-yellow-400 drop-shadow-[0_0_0.5rem_rgba(250,204,21,0.7)]"
                          />
                          Test Different Action
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedService("System Settings");
                            handleRunSimulation();
                          }}
                          className="h-8 justify-start gap-2 text-xs font-medium"
                        >
                          <HugeiconsIcon
                            icon={FlashIcon}
                            size={14}
                            className="text-yellow-400 drop-shadow-[0_0_0.5rem_rgba(250,204,21,0.7)]"
                          />
                          Test Different Resource
                        </Button>
                      </div>
                    </div>

                    {/* Save Scenario */}
                    <div className="border-border/80 bg-card overflow-hidden rounded-lg border p-4">
                      <div className="space-y-0.5 pb-3">
                        <span className="text-foreground text-xs font-semibold">
                          Save Scenario
                        </span>
                        <p className="text-muted-foreground text-[0.6875rem]">
                          Save this simulation for later use
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSaveScenarioOpen(true)}
                        className="h-8 w-full gap-2 text-xs font-medium"
                      >
                        <HugeiconsIcon icon={Bookmark01Icon} size={14} />
                        Save Scenario
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Evaluation Trace — settings-page divide-y list */}
              {activeTab === "trace" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">
                      Evaluation Step Trace
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      Step-by-step policy evaluation order for this access
                      decision.
                    </p>
                  </div>
                  <div className="border-border/80 bg-card divide-border/60 divide-y overflow-hidden rounded-lg border">
                    <div className="hover:bg-muted/20 flex items-center justify-between p-4 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <Badge variant="outline" className="shrink-0 font-mono">
                          Step 1
                        </Badge>
                        <div className="space-y-0.5">
                          <span className="text-foreground text-xs font-semibold">
                            Direct User Overrides Evaluation
                          </span>
                          <p className="text-muted-foreground text-[0.6875rem]">
                            Checked user-level DENY statements
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                      >
                        PASSED
                      </Badge>
                    </div>

                    <div className="hover:bg-muted/20 flex items-center justify-between p-4 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <Badge variant="outline" className="shrink-0 font-mono">
                          Step 2
                        </Badge>
                        <div className="space-y-0.5">
                          <span className="text-foreground text-xs font-semibold">
                            Service Control Policy (SCP) Boundaries
                          </span>
                          <p className="text-muted-foreground text-[0.6875rem]">
                            Evaluated Organization boundary rules on{" "}
                            {selectedEnv}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                      >
                        PASSED
                      </Badge>
                    </div>

                    <div className="hover:bg-muted/20 flex items-center justify-between p-4 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <Badge variant="outline" className="shrink-0 font-mono">
                          Step 3
                        </Badge>
                        <div className="space-y-0.5">
                          <span className="text-foreground text-xs font-semibold">
                            Role Policy Evaluation ({selectedEntityId})
                          </span>
                          <p className="text-muted-foreground text-[0.6875rem]">
                            Matched Statement: "AllowViewDatabase" in
                            Development Base Policy
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                      >
                        MATCHED
                      </Badge>
                    </div>

                    <div className="hover:bg-muted/20 flex items-center justify-between p-4 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <Badge variant="outline" className="shrink-0 font-mono">
                          Step 4
                        </Badge>
                        <div className="space-y-0.5">
                          <span className="text-foreground text-xs font-semibold">
                            Environment &amp; Context Checks
                          </span>
                          <p className="text-muted-foreground text-[0.6875rem]">
                            Verified IP {ipAddress} and evaluation timestamp
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                      >
                        PASSED
                      </Badge>
                    </div>

                    <div className="bg-muted/20 flex items-center justify-between p-4">
                      <div className="flex items-center gap-3.5">
                        <Badge className="shrink-0">Final</Badge>
                        <div className="space-y-0.5">
                          <span className="text-foreground text-xs font-bold">
                            Access Decision Output
                          </span>
                          <p className="text-muted-foreground text-[0.6875rem]">
                            Action {selectedAction} on {selectedService} (
                            {selectedResource}) is {currentResult.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={RESULT_TRACE_BADGES[currentResult]}
                        className="shrink-0"
                      >
                        {currentResult.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Applied Policies */}
              {activeTab === "policies" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">
                      Active &amp; Attached Policy Statements
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      Policy sets evaluated in this simulation run.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {activePolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className="border-border/80 bg-card overflow-hidden rounded-lg border"
                      >
                        <div className="border-border/60 flex items-center justify-between border-b p-4 pb-3">
                          <Badge
                            variant="outline"
                            className="font-mono text-[0.625rem]"
                          >
                            {policy.code}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[0.5625rem] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                          >
                            ACTIVE
                          </Badge>
                        </div>
                        <div className="p-4 pt-3">
                          <p className="text-foreground mb-3 text-xs font-semibold">
                            {policy.name}
                          </p>
                          <p className="text-muted-foreground mb-2 font-mono text-[0.6875rem]">
                            Effect:{" "}
                            <strong className="text-emerald-600">ALLOW</strong>
                          </p>
                          <pre className="bg-muted/60 border-border/60 overflow-x-auto rounded-md border p-2.5 font-mono text-[0.625rem]">
                            {JSON.stringify(
                              {
                                Sid: `Stmt_${policy.code}`,
                                Effect: "ALLOW",
                                Action: [
                                  `iam:${selectedAction.split(" ")[0].toLowerCase()}`,
                                ],
                                Resource: "arn:iam:module:*",
                              },
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Effective Permissions — exact access-matrix/page.tsx table pattern */}
              {activeTab === "effective" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">
                      Effective Permissions List
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      Resolved permission set for the selected entity and
                      environment.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
                        <tr>
                          <th className="border-r px-4 py-3 font-semibold whitespace-nowrap">
                            Action
                          </th>
                          <th className="border-r px-4 py-3 font-semibold whitespace-nowrap">
                            Resource
                          </th>
                          <th className="border-r px-4 py-3 font-semibold whitespace-nowrap">
                            Condition
                          </th>
                          <th className="px-4 py-3 font-semibold whitespace-nowrap">
                            Source Policy
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {ACTIONS.map((act) => (
                          <tr
                            key={act}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="text-primary border-r px-4 py-3 font-mono text-xs font-medium whitespace-nowrap">
                              iam:{act.replace(/\s+/g, "").toLowerCase()}
                            </td>
                            <td className="text-muted-foreground border-r px-4 py-3 font-mono text-xs whitespace-nowrap">
                              arn:iam:module:{selectedService.toLowerCase()}/"*"
                            </td>
                            <td className="border-r px-4 py-3 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className="text-[0.625rem]"
                              >
                                Env: {selectedEnv}
                              </Badge>
                            </td>
                            <td className="text-foreground px-4 py-3 text-xs font-medium whitespace-nowrap">
                              Development Base Policy
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 5: Deny Overrides — settings passkeys empty state pattern */}
              {activeTab === "deny" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">
                      Explicit Deny &amp; Boundary Overrides
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      Active deny statements that override any allow rules.
                    </p>
                  </div>
                  <div className="bg-card border-border/80 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                    <div className="bg-muted mb-2 flex size-9 items-center justify-center rounded-full">
                      <HugeiconsIcon
                        icon={SecurityValidationIcon}
                        className="text-muted-foreground size-4.5"
                      />
                    </div>
                    <p className="text-muted-foreground text-xs font-medium">
                      No active deny overrides found
                    </p>
                    <p className="text-muted-foreground mt-0.5 max-w-md text-[0.625rem]">
                      No explicit DENY statements are currently overriding
                      access for role{" "}
                      <strong>
                        {ROLES.find((r) => r.id === selectedEntityId)?.name}
                      </strong>{" "}
                      in environment <strong>{selectedEnv}</strong>.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* JSON Viewer Dialog */}
      <Dialog open={jsonModalOpen} onOpenChange={setJsonModalOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Simulation Payload JSON</DialogTitle>
            <DialogDescription>
              Raw JSON simulation request context and evaluation decision
              result.
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="border-border/80 bg-muted/30 relative overflow-hidden rounded-lg border">
              <div className="border-border/60 bg-muted/50 flex items-center justify-between border-b px-3.5 py-2 text-xs">
                <div className="text-muted-foreground flex items-center gap-2 font-mono text-[0.6875rem]">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  payload.json
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyJson}
                  className="h-7 gap-1.5 px-2.5 text-[0.6875rem] font-medium"
                >
                  <HugeiconsIcon
                    icon={copiedJson ? Tick02Icon : Copy01Icon}
                    size={13}
                  />
                  {copiedJson ? "Copied!" : "Copy JSON"}
                </Button>
              </div>
              <pre className="text-foreground h-80 overflow-auto p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(jsonPayload, null, 2)}
              </pre>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* How It Works Dialog */}
      <Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>How the IAM Policy Simulator Works</DialogTitle>
            <DialogDescription>
              Understanding the evaluation algorithm and execution order.
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="border-border/80 bg-card divide-border/60 divide-y overflow-hidden rounded-lg border">
              <div className="flex items-start gap-3.5 p-3.5">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  1
                </span>
                <div className="space-y-0.5">
                  <h5 className="text-foreground text-xs font-semibold">
                    Default Deny Principle
                  </h5>
                  <p className="text-muted-foreground text-[0.6875rem] leading-relaxed">
                    By default, all access requests start with an implicit DENY
                    verdict until an explicit ALLOW rule is evaluated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  2
                </span>
                <div className="space-y-0.5">
                  <h5 className="text-foreground text-xs font-semibold">
                    Explicit Deny Overrides
                  </h5>
                  <p className="text-muted-foreground text-[0.6875rem] leading-relaxed">
                    If any matched policy contains an explicit DENY statement,
                    it immediately overrides all ALLOW statements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  3
                </span>
                <div className="space-y-0.5">
                  <h5 className="text-foreground text-xs font-semibold">
                    Context &amp; Boundary Constraints
                  </h5>
                  <p className="text-muted-foreground text-[0.6875rem] leading-relaxed">
                    Time window, IP CIDR restrictions, and MFA state are
                    evaluated against request parameters before final decision
                    output.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button>Got it</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Scenario Dialog */}
      <Dialog open={saveScenarioOpen} onOpenChange={setSaveScenarioOpen}>
        <DialogContent size="sm">
          <form onSubmit={handleSaveScenario}>
            <DialogHeader>
              <DialogTitle>Save Simulation Scenario</DialogTitle>
              <DialogDescription>
                Save current parameters to easily rerun or benchmark in test
                suites.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 px-4 pb-4 text-xs sm:px-5 sm:pb-5">
              {/* Context preview box */}
              <div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[0.625rem] font-semibold uppercase">
                    Current Context
                  </span>
                  <p className="text-foreground text-xs font-semibold">
                    {entityType === "role"
                      ? ROLES.find((r) => r.id === selectedEntityId)?.name
                      : USERS.find((u) => u.id === selectedEntityId)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className="font-mono text-[0.625rem]"
                  >
                    {selectedAction}
                  </Badge>
                  <span className="text-muted-foreground mt-0.5 block text-[0.625rem]">
                    {selectedService}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">Scenario Name</Label>
                <Input
                  required
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g. Developer Database View Test"
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">
                  Notes / Description (Optional)
                </Label>
                <Textarea
                  placeholder="Verification test for developer database read access"
                  className="h-20 text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Scenario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

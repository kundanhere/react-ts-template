import type { ISystemUpdate } from "@/types/updates";

export const INITIAL_UPDATES: ISystemUpdate[] = [
  {
    id: "upd-240",
    version: "v2.4.0",
    title: "Enhanced Policy Simulator & Dynamic Breadcrumb Navigation",
    summary:
      "Real-time evaluation traces, visual hierarchy pathing, and dark mode contrast optimizations across all IAM consoles.",
    description:
      "This milestone release introduces our 2nd generation Policy Simulator with dry-run assertions, context payload synthesis, and sub-millisecond RBAC/ABAC verification. In addition, deep breadcrumb state hydration enables seamless navigation across multi-tenant policy structures.",
    type: "major",
    channel: "stable",
    status: "deployed",
    impact: "high",
    isUnread: true,
    publishedAt: new Date("2026-08-18T14:30:00Z"),
    author: {
      name: "Alex Morgan",
      role: "Platform Architect",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    highlights: [
      "Real-time policy evaluation traces with detailed decision trees",
      "Dynamic multi-segment breadcrumbs with URL state persistence",
      "Tailwind v4 theme variables upgrade for WCAG AAA contrast ratio",
      "Bulk simulation export in signed JSON format",
    ],
    affectedModules: [
      "Policy Engine",
      "Access Matrix",
      "Navigation Shell",
      "Audit Console",
    ],
    breakingChanges: [
      "Deprecated legacy query param ?policy_eval_v1; all clients must migrate to context-based POST payload.",
    ],
    commitHash: "7f9c2d1",
    docsUrl: "/iam/policies",
  },
  {
    id: "upd-232",
    version: "v2.3.2",
    title: "Security Advisory: FIDO2/WebAuthn Hardware Token Enforcement",
    summary:
      "Mandatory Hardware Security Keys (YubiKey/Titan) support and session hijacking mitigation in OAuth2 token handoff.",
    description:
      "Security patch addressing advisory SEC-2026-0419. Administrators can now mandate phishing-resistant WebAuthn credentials for root tenant roles and privileged service account assume-role sequences.",
    type: "security",
    channel: "security",
    status: "deployed",
    impact: "critical",
    isUnread: true,
    publishedAt: new Date("2026-08-14T09:15:00Z"),
    author: {
      name: "Marcus Vance",
      role: "Principal Security Engineer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    highlights: [
      "FIDO2 Level 3 authenticator attestation verification",
      "Strict binding of refresh tokens to hardware client cert fingerprints",
      "Immediate revocation hook on device fingerprint anomaly detection",
    ],
    affectedModules: ["MFA Authenticator", "Session Inspector", "Auth Core"],
    securityNotice:
      "Critical vulnerability CVE-2026-3829 mitigated. All active sessions without hardware key verification will be prompted for re-authentication upon next token refresh.",
    commitHash: "3b8e4a9",
  },
  {
    id: "upd-231",
    version: "v2.3.1",
    title: "Access Matrix Virtual Scrolling & High-Volume Query Optimization",
    summary:
      "4x faster render times on enterprise tables with 10,000+ role entitlements and reduced memory consumption.",
    description:
      "Optimized DOM reconciliation and viewport virtualization within the Access Matrix component. Queries for nested role permissions now utilize composite index hints on PostgreSQL, decreasing query latency from 320ms to 42ms.",
    type: "hotfix",
    channel: "stable",
    status: "deployed",
    impact: "medium",
    isUnread: false,
    publishedAt: new Date("2026-08-10T11:45:00Z"),
    author: {
      name: "Sarah Chen",
      role: "Senior Frontend Engineer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    highlights: [
      "Virtualized row and column layout rendering for matrix grids",
      "TanStack table state synchronization without redundant re-renders",
      "Redis caching layer for frequent role-to-action lookup trees",
    ],
    affectedModules: ["Access Matrix", "Roles & Permissions", "Caching"],
    commitHash: "9a2f1c8",
  },
  {
    id: "upd-230",
    version: "v2.3.0",
    title: "Granular OAuth2 Scope Delegations & Service Account Impersonation",
    summary:
      "Time-bounded role assumption pipelines, automated audit trails, and multi-tenant boundary isolation.",
    description:
      "Empowers DevOps and automation pipelines to assume scoped tenant permissions with cryptographically verified time windows (up to 4 hours max). Every assumed API call is cryptographically signed and routed to the immutable audit ledger.",
    type: "minor",
    channel: "stable",
    status: "deployed",
    impact: "high",
    isUnread: false,
    publishedAt: new Date("2026-07-28T16:20:00Z"),
    author: {
      name: "Dwight Schrute",
      role: "Lead Platform Engineer",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    highlights: [
      "Ephemeral token generation with custom TTL down to 60 seconds",
      "Strict caller-context verification via mTLS header validation",
      "Enhanced UI modal for reviewing active delegated sessions",
    ],
    affectedModules: ["OAuth Provider", "Service Accounts", "Audit Logging"],
    commitHash: "5e1d904",
    docsUrl: "/iam/users",
  },
  {
    id: "upd-224",
    version: "v2.2.4",
    title: "Database Partitioning & Cold Audit Log Parquet Compression",
    summary:
      "Automated S3 Glacier archival pipeline for compliance records older than 90 days, preserving instant search on hot records.",
    description:
      "Routine infrastructure maintenance addressing database disk IOPS saturation during high-concurrency compliance scans. Tables for audit logs now utilize monthly interval range partitioning with background zstandard compression.",
    type: "maintenance",
    channel: "lts",
    status: "deployed",
    impact: "low",
    isUnread: false,
    publishedAt: new Date("2026-07-15T08:00:00Z"),
    author: {
      name: "Kundan Gupta",
      role: "Site Reliability Engineer",
    },
    highlights: [
      "Zero-downtime table migration to native partitioned tables",
      "45% storage footprint reduction on historic compliance records",
      "Background vacuuming worker scheduler with automatic throttle",
    ],
    affectedModules: ["Database", "Audit Console", "Backup & Archival"],
    commitHash: "11c6e44",
  },
  {
    id: "upd-250-rc1",
    version: "v2.5.0-rc.1",
    title:
      "Upcoming Preview: AI-Powered Anomaly Detection & Adaptive Zero-Trust",
    summary:
      "Heuristic behavioral scoring for credential stuffing detection and contextual step-up authentication challenges.",
    description:
      "Early preview release deployed to the Canary cluster. Evaluates client IP velocity, geo-velocity hops, and typing cadence to flag potential compromised tokens before unauthorized data exfiltration occurs.",
    type: "major",
    channel: "beta",
    status: "rolling_out",
    impact: "high",
    isUnread: true,
    publishedAt: new Date("2026-08-25T18:00:00Z"),
    author: {
      name: "Elena Rostova",
      role: "AI Research Lead",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    highlights: [
      "Real-time risk scoring engine (0-100 scale) per API request",
      "Automatic step-up WebAuthn challenge trigger on high risk scores",
      "Interactive risk vector breakdown in the Security Operations dashboard",
    ],
    affectedModules: ["Adaptive Engine", "Risk Dashboard", "Auth Core"],
    commitHash: "8c3b019",
  },
  {
    id: "upd-220",
    version: "v2.2.0",
    title: "Sentry IAM Core 2.0 Engine & Real-Time SIEM Webhook Dispatcher",
    summary:
      "Sub-5ms decision evaluation engine rewrite in Rust, alongside outbound webhooks for Splunk, Datadog, and CrowdStrike.",
    description:
      "A complete modernization of the core authorization runtime. Replaced interpreted JSON AST evaluator with compiled WebAssembly bytecode filters, achieving sub-millisecond evaluation at 50,000 requests per second.",
    type: "major",
    channel: "lts",
    status: "deployed",
    impact: "critical",
    isUnread: false,
    publishedAt: new Date("2026-06-30T12:00:00Z"),
    author: {
      name: "Alex Morgan",
      role: "Platform Architect",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    highlights: [
      "Wasm-powered policy runtime with 10x throughput improvement",
      "HMAC-SHA256 signed webhook events dispatched in <15ms",
      "Native OpenTelemetry distributed trace context propagation",
    ],
    affectedModules: ["Policy Engine", "Webhooks", "Telemetry", "Audit Core"],
    commitHash: "44e21a0",
    docsUrl: "/iam/policies",
  },
];

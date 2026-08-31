# Admin CMS Frontend Sidebar & Permission UI Architecture Guide

This document defines the production-ready frontend layout tree, dynamic sidebar rendering rules, user persona views, and UI workflows for managing Roles, Policies, and User Assignments in the Admin CMS.

---

## 1. Complete CMS Sidebar Tree Structure

The sidebar dynamically renders based on the user's authorized modules returned by `GET /v1/iam/modules/my-modules` and evaluated by the Policy Engine.

```text
Admin CMS Layout
├── 📊 Dashboard
│   ├── Overview (`/dashboard`)
│   └── Analytics & Metrics (`/iam/dashboard`)
│
├── 🛡️ Identity & Access (IAM)
│   ├── 👥 Users (`/iam/users`)
│   │   ├── User Directory
│   │   ├── Create / Edit User
│   │   ├── User Detail & Assigned Roles (`/iam/users/:id`)
│   │   ├── User Policy Overrides (`/iam/users/:id/policies`)
│   │   └── Effective Access Matrix (`/iam/users/:id/access`)
│   │
│   ├── 🎭 Roles (`/iam/roles`)
│   │   ├── Role Hierarchy Tree (`/iam/roles`)
│   │   ├── Role Detail & Attached Policies (`/iam/roles/:id`)
│   │   ├── Role Users List (`/iam/roles/:id/users`)
│   │   └── Role Capabilities Grid (`/iam/roles/:id/access`)
│   │
│   ├── 📜 Policies (`/iam/policies`)
│   │   ├── Policy Registry (`/iam/policies`)
│   │   ├── Policy Builder (`/iam/policies/new`)
│   │   └── Policy JSON Inspector (`/iam/policies/:id`)
│   │
│   └── 🧩 Modules (`/iam/modules`)
│       ├── Module Tree Structure (`/iam/modules`)
│       └── Add / Edit Module (`/iam/modules/:id`)
│
├── ⚙️ Security & System
│   ├── 🔐 Security Settings (`/iam/security/settings`)
│   │   ├── Login & Password Policies
│   │   └── Token TTL & MFA Configuration
│   │
│   ├── 💻 Active Sessions (`/iam/sessions`)
│   │   └── System Session Revocation
│   │
│   └── 📜 Audit Trail (`/iam/audit`)
│       ├── Activity Log (`/iam/audit/me`)
│       └── System Audit Logs (`/iam/audit/logs`)
│
└── 🧪 Governance & Tools
    ├── 🗺️ Access Matrix (`/iam/access-matrix`)
    └── ⚡ Policy Simulator (`/iam/access/simulate`)
```

---

## 2. Dynamic Sidebar Navigation Engine

### Fetching Navigation Tree

On application startup or authentication state change, fetch the user's authorized module tree:

```javascript
async function loadSidebarNavigation() {
  const response = await fetch("/v1/iam/modules/my-modules", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { payload } = await response.json();
  return buildSidebarTree(payload);
}
```

### Response Transformation & Filtering

The API returns priority-ordered active modules. Transform the raw modules into hierarchical navigation items:

```javascript
function buildSidebarTree(modules) {
  const moduleMap = new Map();
  const tree = [];

  modules.forEach((mod) => {
    moduleMap.set(mod.ID, { ...mod, children: [] });
  });

  modules.forEach((mod) => {
    if (mod.parent_id && moduleMap.has(mod.parent_id)) {
      moduleMap.get(mod.parent_id).children.push(moduleMap.get(mod.ID));
    } else {
      tree.push(moduleMap.get(mod.ID));
    }
  });

  return tree;
}
```

---

## 3. Persona Access Matrix & Layout Views

Different user types see distinct sidebar configurations based on their assigned roles and effective permissions.

| Sidebar Section / Route   | Super Admin | IAM Administrator | Department Manager | Security Auditor | Regular Employee |
| ------------------------- | ----------- | ----------------- | ------------------ | ---------------- | ---------------- |
| **Dashboard**             | Full        | Full              | Full               | View             | View             |
| **Users Directory**       | Full        | Full              | View (Dept Only)   | View             | Hidden           |
| **User Policy Overrides** | Full        | Full              | Hidden             | View             | Hidden           |
| **Roles Management**      | Full        | Full              | View               | View             | Hidden           |
| **Policies Registry**     | Full        | Full              | Hidden             | View             | Hidden           |
| **Modules Management**    | Full        | Full              | Hidden             | View             | Hidden           |
| **Security Settings**     | Full        | Full              | Hidden             | View             | Hidden           |
| **Active Sessions**       | Full        | Full              | Hidden             | View             | Self Only        |
| **System Audit Logs**     | Full        | Full              | Hidden             | View             | Self Only        |
| **Access Matrix**         | Full        | Full              | Hidden             | View             | Hidden           |
| **Policy Simulator**      | Full        | Full              | Hidden             | View             | Hidden           |

### Persona Scenarios

1. **Super Admin**: Complete visibility across all nodes, system roles, policy overrides, and security settings.
2. **IAM Administrator**: Full access to Users, Roles, Policies, and Sessions. Read-only on system security configurations.
3. **Department Manager**: Access to Users in their department (`view` action). Cannot alter global Roles or Policies.
4. **Security Auditor**: Read-only (`view`) access across Users, Roles, Policies, Audit Logs, Access Matrix, and Policy Simulator. Edit buttons disabled.
5. **Regular Employee**: Access strictly confined to operational domain modules (e.g. Tasks, Projects) and personal profile/audit log (`/iam/audit/me`).

---

## 4. Permission & Role Assignment UI Workflows

### A. Role Assignment UI Workflow

Assigning roles to a user via `POST /v1/iam/users/:userId/roles`:

```text
+-----------------------------------------------------------------------+
|  Manage User Roles: Jane Doe (ID: 42)                                 |
+-----------------------------------------------------------------------+
|  Assigned Roles:                                                      |
|  [x] Administrator      [ ] Finance Manager     [x] Content Manager   |
|                                                                       |
|  Inherited Parent Roles:                                              |
|  * Administrator -> Senior Admin                                      |
|                                                                       |
|  [ Cancel ]                                    [ Save Assignments ]  |
+-----------------------------------------------------------------------+
```

1. Modal loads current assigned roles from `GET /v1/iam/users/:id/roles`.
2. Multi-select list allows adding or removing roles.
3. Submitting fires `POST /v1/iam/users/:userId/roles` for additions and `DELETE /v1/iam/users/:userId/roles/:roleId` for removals.

---

### B. Direct User Policy Override UI Workflow

Managing user-level policy overrides via `POST /v1/iam/users/:userId/policies`:

```text
+-----------------------------------------------------------------------+
|  Attach Direct Policy Override                                        |
+-----------------------------------------------------------------------+
|  Policy Select: [ Select Policy v ]                                   |
|  Effect:         (o) ALLOW   ( ) DENY (Overrides ALL ALLOWs)          |
|                                                                       |
|  Expiration (Optional):                                               |
|  [ 2026-12-31 23:59:59 ] (DatePicker - Leave empty for permanent)     |
|                                                                       |
|  [ Cancel ]                                       [ Attach Policy ]  |
+-----------------------------------------------------------------------+
```

1. **Explicit DENY Warning**: When selecting `DENY`, display a prominent warning callout:
   > **Warning**: Explicit `DENY` policies take absolute precedence over all `ALLOW` rules inherited from any assigned role.
2. **TTL / Expiration Support**: Provide a date-time picker mapping to `expires_at` (epoch timestamp). Expired policies auto-purge during evaluation.

---

### C. Visual Access Matrix UI (`/iam/access-matrix`)

Visual grid generated from `GET /v1/iam/access-matrix` showing Role x Module capabilities:

```text
+-----------------------------------------------------------------------+
| Capabilities Grid (Roles vs Active Modules)                          |
+-----------------------------------------------------------------------+
| Module \ Role      | Super Admin | Editor      | Viewer     | Guest  |
+--------------------+-------------+-------------+------------+--------+
| Users              | [x] Full    | [ ] View    | [ ] View   | [ ] -  |
| Roles              | [x] Full    | [ ] -       | [ ] -      | [ ] -  |
| Policies           | [x] Full    | [ ] View    | [ ] -      | [ ] -  |
| Modules            | [x] Full    | [ ] View    | [ ] -      | [ ] -  |
| Audit Logs         | [x] Full    | [ ] View    | [ ] View   | [ ] -  |
+-----------------------------------------------------------------------+
```

---

### D. Policy Simulator UI (`/iam/access/simulate`)

Interactive testing tool for evaluating authorization rules before deployment:

```text
+-----------------------------------------------------------------------+
| Policy Engine Simulator                                               |
+-----------------------------------------------------------------------+
| User:     [ Select User (e.g. John Doe) v ]                           |
| Action:   [ edit v ]                                                  |
| Resource: [ Users v ]                                                 |
| Context:  { "timeOfDay": "14:00", "ip": "192.168.1.1" }               |
|                                                                       |
| [ Run Simulation ]                                                    |
+-----------------------------------------------------------------------+
| Simulation Result:                                                    |
| STATUS: ALLOWED                                                       |
| Matched Policy: Policy #12 ("User Admin Policy")                      |
| Evaluation Trace:                                                     |
|  1. Evaluated Direct Overrides -> No match                            |
|  2. Evaluated Role "Administrator" -> ALLOW matched for edit:Users    |
+-----------------------------------------------------------------------+
```

---

## 5. UI Action Control & Button State Guidelines

Enforce component-level action visibility using client-side helper guards:

```javascript
// UI Helper: Check if active user has capability
function canPerform(action, resource) {
  const access = currentUserAccessMap[resource];
  if (!access) return false;
  return access.full || access[action] === true;
}

// React Component Example
function DeleteUserButton({ userId }) {
  if (!canPerform("delete", "Users")) {
    return null; // Or return <Button disabled title="Requires delete:Users permission" />
  }

  return <Button onClick={() => handleDelete(userId)}>Delete User</Button>;
}
```

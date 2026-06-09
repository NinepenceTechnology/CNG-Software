# Security Rules Specification

## 1. Data Invariants
1. **Branch Scoping**: No member, transaction, event, inventory, or report document can exist without a valid branch identifier.
2. **Temporal Integrity**: Fields like `createdAt` and `timestamp` must use real server timestamps (`request.time`) during creation, preventing client forgery of historical records.
3. **Immutable Ownership**: Users cannot forge of whom a chat message or critical resource belongs; the `userId` in chat messages must match the writer's authentic identity (`request.auth.uid`).
4. **Role Integrity**: Non-admin users are strictly forbidden from self-assigning high-privileged roles (like changing their own role to 'admin') during updates.
5. **PII and Identity Protection**: User profiles containing sensitive information are only read-accessible to the owner or a validated administrator.

---

## 2. The "Dirty Dozen" Forgery Payloads
Below are 12 specific payloads crafted by our Red Team to attempt to bypass access, identity, and integrity controls:

### Payload 1: Role Escalation Override
**Intent**: Self-promote role to general admin.
```json
{
  "path": "users/victim_user_id",
  "operation": "update",
  "auth": { "uid": "victim_user_id", "email": "member@cng.org" },
  "data": { "name": "Victim", "role": "admin" }
}
```

### Payload 2: Message Identity Spoofing
**Intent**: Submit a chat message claiming to be from a prominent administrator.
```json
{
  "path": "chat_channels/Geral/messages/msg_101",
  "operation": "create",
  "auth": { "uid": "attacker_id" },
  "data": { "user": "Pastor Admin", "userId": "admin_uid", "text": "Transfer assets", "timestamp": "request.time" }
}
```

### Payload 3: Retroactive Time Forgery
**Intent**: Forge the creation timestamp to a year in the past.
```json
{
  "path": "branches/Sede Beira/members/member_123",
  "operation": "create",
  "auth": { "uid": "user_123", "email": "valid@gmail.com", "email_verified": true },
  "data": { "name": "Fake Member", "status": "ativo", "createdAt": "2025-01-01T00:00:00Z" }
}
```

### Payload 4: Negative Financial Input
**Intent**: Inject a transaction with negative value to drain resources.
```json
{
  "path": "branches/Sede Beira/transactions/tx_99",
  "operation": "create",
  "auth": { "uid": "treasurer_id", "email_verified": true },
  "data": { "type": "oferta", "amount": -5000, "status": "pago" }
}
```

### Payload 5: Spoofed Notification Read-State Write
**Intent**: Forger tries to mark notification as unread and update the text message.
```json
{
  "path": "notifications/notif_1",
  "operation": "update",
  "auth": { "uid": "user_id", "email_verified": true },
  "data": { "title": "Malicious notification overwrite", "read": false }
}
```

### Payload 6: Malicious Long ID Poisoning
**Intent**: Inject a huge string sequence as document ID to incur denial-of-wallet of resource indexers.
```json
{
  "path": "branches/Sede Beira/members/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "operation": "create",
  "auth": { "uid": "user_id", "email_verified": true },
  "data": { "name": "Poison ID User", "status": "ativo" }
}
```

### Payload 7: Ghost Field Injection
**Intent**: Insert non-schema variables to break layout or corrupt index structures.
```json
{
  "path": "branches/Sede Beira/events/ev_321",
  "operation": "create",
  "auth": { "uid": "user_id", "email_verified": true },
  "data": { "title": "Annual Gala", "ghostField": "maliciousScript", "createdAt": "request.time" }
}
```

### Payload 8: Anonymous Member Registry Manipulation
**Intent**: Non-logged user attempting to register church members.
```json
{
  "path": "branches/Sede Beira/members/member_new",
  "operation": "create",
  "auth": null,
  "data": { "name": "Anonymous Inject", "status": "ativo" }
}
```

### Payload 9: Empty Financial Forgery
**Intent**: Creating transactions missing type declarations.
```json
{
  "path": "branches/Sede Beira/transactions/tx_blank",
  "operation": "create",
  "auth": { "uid": "user_id", "email_verified": true },
  "data": { "amount": 100, "createdAt": "request.time" }
}
```

### Payload 10: Unverified Email Registry
**Intent**: Logged-in user with a custom-forged unverified email attempts to create system assets.
```json
{
  "path": "branches/Sede Beira/members/m_verify",
  "operation": "create",
  "auth": { "uid": "scammer_id", "email_verified": false },
  "data": { "name": "Scam Member", "status": "ativo", "createdAt": "request.time" }
}
```

### Payload 11: Foreign Profile Data Harvesting
**Intent**: Attacker attempts to read private PII of another user profile.
```json
{
  "path": "users/victim_profile_id",
  "operation": "get",
  "auth": { "uid": "attacker_id" }
}
```

### Payload 12: Settings Manipulation
**Intent**: A non-admin user attempts to overwrite global church information and branding.
```json
{
  "path": "settings/church",
  "operation": "write",
  "auth": { "uid": "collaborator_id", "email": "collab@cng.org" },
  "data": { "churchName": "Hacked Nova Geracao" }
}
```

---

## 3. The Security Test Suite Reference
The security rules test suite file (`firestore.rules.test.ts`) must run these payloads to verify that each yields `PERMISSION_DENIED`.

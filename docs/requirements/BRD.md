# Business Requirements Document

**Project:** Perks Engine
**Date:** 2026-03-18
**Source:** GitHub Issue #1 — "Perks Engine – High-Level BRD"

---

## 1. Summary

The Perks Engine is a platform capability that manages third-party funded offers ("Perks") on top of an existing consumer benefits and payments platform. The system is split into two planes: a **Control Plane** responsible for the configuration, ingestion, and lifecycle management of Offers, Rules, Purses, and Sponsors; and a **Data Plane** responsible for real-time evaluation and application of Perks during Transactions, plus runtime APIs for channels. The engine must support multiple Sponsors, multiple Benefit Purses, and multiple digital, voice, and agent channels. It enables Members to discover, clip, and redeem Offers, while giving operations teams full control over Offer lifecycle, eligibility rules, and third-party Syndicator integrations.

---

## 2. User Roles

| Role | Description |
|------|-------------|
| Member | End user holding one or more accounts and Purses; discovers, clips, and redeems Offers during Transactions. |
| Operations Admin | Internal user responsible for creating, configuring, activating, suspending, and archiving Offers and related reference data via the Control Plane. |
| Sponsor | Entity funding benefits and/or participating in Perks programs; has its own configuration, reporting partition, and Offer ownership rules. |
| Syndicator / Offer Provider | External third party that supplies Offers to the engine and receives clip/redemption reporting back. |
| Channel System | Web app, mobile app, voice, or agent channel that calls Data Plane APIs to evaluate Transactions and serve Member-facing Offer experiences. |

---

## 3. In Scope

- Offer lifecycle management (Create, Read/Search, Update, Deactivate/Expire, Archive) with full audit trail
- Offer lifecycle states: Draft → Configured → Active → Suspended → Expired → Archived
- Rules / Eligibility Policy management (product/category, merchant/location, member attributes, purse mappings, priority rules); versioned and reusable
- Purse / Benefit configuration including standard and Perks-only purse types
- Sponsor configuration (purse/offer availability, ownership, limits, branding, reporting partitions)
- Third-party Offer ingestion via APIs or files with internal review/edit before activation
- Clip-state synchronisation notifications to Syndicators (clip, unclip, depletion)
- Redemption and settlement reporting to Syndicators (per offer, per merchant, per time period)
- Data Plane transaction evaluation pipeline: intake → candidate resolution → clipped/automatic handling → priority/combination rules → discount calculation → purse application → response and posting
- Member runtime APIs: Offer discovery, Offer details, clip/unclip, redemption history, savings summaries
- Control Plane APIs for administrative and operational console use cases
- Multi-sponsor and multi-tenant isolation of configuration and reporting
- End-to-end auditability of Events/Activity (clip, unclip, redemption, reversal, adjustment)
- Graceful degradation: proceed with benefit evaluation if Perks evaluation fails

---

## 4. Out of Scope

- Underlying consumer benefits/payments platform (pre-existing; the Perks Engine sits on top of it)
- Payment processing and settlement (financial clearing is handled by the existing platform)
- Member identity and account management (Members are sourced from the existing platform)
- Purse balance management beyond Perks discount application (handled by the existing platform)
- Mobile or web channel UI front-ends (channels call the Data Plane APIs; front-ends are built separately)
- Fraud detection and chargeback handling
- Tax calculation
- Loyalty points / non-monetary reward programs (unless modelled as a Perks-only Purse)

---

## 5. Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-001 | Operations Admin can create an Offer with all required attributes (ID, name, description, brand, offer type, discount model, associated products/categories, merchants, eligibility rules, effective/expiration dates, time windows, channel applicability). | 1. A Draft Offer is persisted and retrievable by ID with all supplied fields. 2. Attempting to create an Offer with missing mandatory fields returns a validation error. |
| FR-002 | Offer lifecycle follows the states: Draft → Configured → Active → Suspended → Expired → Archived, with only valid transitions permitted. | 1. An Offer in Draft state cannot be set directly to Active; it must pass through Configured first. 2. An Archived Offer cannot be modified (read-only). |
| FR-003 | Operations Admin can retrieve an Offer by ID and search/filter Offers by status, Sponsor, merchant, product/category, type, and expiration window. | 1. A GET by a valid Offer ID returns the full Offer record. 2. A search with filters returns only matching Offers. |
| FR-004 | Operations Admin can update an Active or Scheduled Offer; the system distinguishes non-material changes (description, images) from material changes (discount value, eligibility) and records a full audit trail. | 1. A non-material change does not invalidate or alter existing Member clips. 2. A material change is recorded in the audit trail with a before/after snapshot and timestamp. |
| FR-005 | Operations Admin can manually deactivate (Suspend) or expire an Offer; the system also automatically expires Offers based on configured dates or depletion limits. | 1. Manual suspension transitions Offer state to Suspended and stops new clips/redemptions immediately. 2. Offer state transitions to Expired automatically when the expiration date/depletion limit is reached. |
| FR-006 | Operations Admin can define and manage Rules / Eligibility Policies covering product/category inclusion or exclusion, merchant/location rules, member attributes, purse mappings, and priority rules; Rules must be versioned and reusable. | 1. A Rule can be saved, versioned, and attached to multiple Offers. 2. Updating a Rule creates a new version; the previous version remains accessible in the audit trail. |
| FR-007 | Operations Admin can configure Purses (name, type, product/category mapping, offer mapping, standard vs. Perks-only designation) and associate them with Sponsors. | 1. A Perks-only Purse has no underlying balance and its value comes solely from Offers. 2. A Purse can be linked to one or more Sponsors with distinct ownership and limit configurations. |
| FR-008 | Operations Admin can configure Sponsor settings including which Purses and Offers are available, ownership/sharing rules, limits, branding, and reporting partitions. | 1. Offers and Purses owned by Sponsor A are not visible in Sponsor B's configuration view. 2. Reporting data is filterable by Sponsor. |
| FR-009 | The system can ingest Offers from external Syndicators via API or file upload, auto-populate metadata/rules/product lists, classify by Sponsor and purse type, and queue them for internal review before activation. | 1. An ingested Offer appears in a pending-review queue and cannot be set Active until reviewed. 2. An Operations Admin can edit any auto-populated field before approving. |
| FR-010 | The system notifies Syndicators of clip and unclip events, including any provider-specific clip tokens, and handles provider responses for clip success/failure and depletion. | 1. A clip event triggers an outbound notification to the relevant Syndicator within the configured SLA. 2. A failed provider acknowledgement is recorded as a failed Event and retried or flagged for manual resolution. |
| FR-011 | The system provides aggregated and detailed redemption and settlement reports to Syndicators, supporting reconciliation of provider invoices against internal redemption records. | 1. A report can be generated per Offer, per merchant, and per time period. 2. Internal redemption totals match provider invoice totals for a closed period within accepted reconciliation tolerance. |
| FR-012 | The Data Plane receives a Transaction request (Member, purses, Sponsor context, merchant/location, line items, channel) and returns evaluated discounts and posting results. | 1. A valid Transaction request with an eligible clipped Offer returns the correct discount amount and applied Offer ID. 2. A Transaction for an expired or suspended Offer returns no Perks discount. |
| FR-013 | The engine resolves eligible Offer candidates based on Member purses, Sponsor configuration, merchant/location, transaction time, product/category matches, and Offer state. | 1. Only Offers in Active state matching the Member's purse, merchant, and product criteria appear as candidates. 2. Offers outside their effective date window are excluded from candidates. |
| FR-014 | The engine correctly handles automatic Offers (evaluated without clip) and clipped Offers (require a valid, non-exhausted Member clip). | 1. An automatic Offer is applied without requiring a clip record. 2. A clipped Offer is not applied if the Member has not clipped it or the clip is exhausted. |
| FR-015 | The engine applies configurable priority and combination rules covering product-level vs. basket-level Offers, stacking vs. best-offer logic, and maximum savings per transaction/day/Member. | 1. When two Offers apply to the same item and stacking is disabled, only the best-value Offer is applied. 2. Total savings are capped at the configured maximum per transaction. |
| FR-016 | Discount calculation is performed at line and/or basket level, ensuring savings do not exceed configured maximums or caps, and Perks discounts are applied before any Purse/benefit deduction. | 1. The response breakdown shows: original price, Perks discount(s), benefit spend, and final Member out-of-pocket. 2. Perks discount is never applied after a Purse deduction has already reduced the price. |
| FR-017 | The system gracefully degrades when the Perks evaluation service fails: the Transaction proceeds using benefit/Purse rules only, and the response clearly signals Perks unavailability. | 1. When Perks evaluation times out or errors, the Transaction response contains a flag indicating Perks were unavailable and no Perk discount is applied. 2. The fallback path completes the Transaction without returning an error to the calling channel. |
| FR-018 | Member-facing APIs support Offer discovery filtered by member, purse, merchant, location, type, expiration, and text search, and return runtime-accurate Offer details. | 1. An API call with a valid Member ID and merchant filter returns only Active Offers eligible for that Member at that merchant. 2. Offer details include terms, restrictions, locations, and remaining validity in real time. |
| FR-019 | Member-facing APIs support real-time clip and unclip operations with immediate state changes and clear success/failure responses. | 1. A clip request for an eligible Offer returns success and the clip is immediately reflected in subsequent eligibility checks. 2. An unclip request removes the clip immediately and the Offer is no longer applied in new Transactions. |
| FR-020 | Member-facing APIs provide redemption history (offer, amount saved, merchant) and savings summaries (total savings, redemption counts) over configurable time periods. | 1. A history API call for a Member returns all past redemptions with Offer name, amount saved, and merchant. 2. A summary API call returns total savings and redemption count for any caller-supplied date range. |
| FR-021 | All Offer configuration actions, Rule changes, and Transaction events are logged as auditable Events / Activity records (clip, unclip, redemption, reversal, adjustment). | 1. Every state transition of an Offer is recorded with actor, timestamp, and before/after state. 2. Every redemption Event is traceable from the originating Transaction back to the Offer and Member clip. |

---

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-001 | Security | JWT authentication on all protected Control Plane and Data Plane API routes; Member and Transaction data protected in line with applicable compliance standards. |
| NFR-002 | Performance | Transaction evaluation must meet strict latency SLAs suitable for real-time checkout flows (target: p99 < 300 ms under peak load). |
| NFR-003 | Performance | Page/API response for non-transaction use cases (Offer search, Member history) must complete within 3 seconds under normal load. |
| NFR-004 | Scalability | The engine must support horizontal scaling to handle peak transaction volumes without degradation. |
| NFR-005 | Reliability | The Data Plane must support graceful degradation (Perks unavailable, benefit processing continues) without returning errors to the calling channel. |
| NFR-006 | Observability | Robust structured logging, metrics, distributed tracing, and alerting across Control and Data Planes. |
| NFR-007 | Auditability | End-to-end trace from Offer configuration through clip to redemption Event must be queryable. |
| NFR-008 | Multi-Tenancy | Sponsor configurations, data, and reporting must be isolated at the data and API level while sharing common infrastructure. |
| NFR-009 | Configuration-Driven | Core engine behaviour (eligibility, priority, combination rules, discount models) must be controllable through configuration data, not code changes. |
| NFR-010 | Usability | Responsive administrative UI works on desktop and mobile browsers. |

---

## 7. Assumptions

- **Existing platform integration**: The Perks Engine is a new capability layered on top of an existing consumer benefits/payments platform. Member identity, account management, and Purse balance operations outside of Perks discount application are owned by the existing platform and are not re-implemented here.
- **Authentication**: JWT-based authentication is assumed for all API surfaces (Control Plane and Data Plane) in line with the pre-built auth middleware in this project.
- **Offer approval workflow**: The requirement mentions internal review before activation for ingested Offers but does not specify a formal multi-step approval workflow. It is assumed a single Operations Admin review/edit step followed by manual state promotion (Configured → Active) is sufficient for the initial implementation.
- **Clip token handling**: Provider-specific clip tokens are assumed to be opaque string values stored and forwarded as-is; no token format validation is in scope.
- **Reconciliation tolerance**: The requirement references reconciliation of provider invoices but does not define acceptable variance. It is assumed a zero-tolerance exact match is required; any discrepancy is flagged for manual investigation.
- **Channel UI**: Web, mobile, and voice channel front-ends are out of scope; only the API surfaces are in scope. The workshop frontend will expose a representative subset of the Member-facing Offer discovery and clip/unclip experience.
- **Geofence rules**: Merchant/location rules including geofence are in scope for the Rules data model but real-time geofence evaluation (GPS coordinates) is assumed to be provided by the calling channel and passed as a location context parameter — not computed by the engine.
- **Offer ingestion file format**: File-based ingestion format (CSV, XML, JSON) is not specified. It is assumed JSON is the default format for the initial implementation.
- **Data retention**: No retention policy is specified; it is assumed all Events and Transaction records are retained indefinitely for audit purposes until a retention policy is defined.
- **Discount models**: Five discount models are listed (amount off, percentage off, fixed price, tiered, capped). All five are in scope for the data model; the initial implementation will support at least amount-off and percentage-off in the calculation engine, with tiered and capped as configurable extensions.

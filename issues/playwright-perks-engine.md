# [PLAYWRIGHT] Perks Engine

## User Story
As a QA engineer I want to verify the Perks Engine journey end to end so that I can confirm the full workflow from Offer creation through lifecycle management to Member clip/unclip and audit trail is working correctly in the browser.

## Assignment Order
Step 21 of 21 — assign after: [FRONTEND] Audit & Events is merged
Tier: PLAYWRIGHT — assign this last, after all FRONTEND Issues are merged

## Primary Journey — Offer Lifecycle Management

One action per step with expected result:

1. Navigate to the app root — expect redirect to /login
2. Fill `data-testid=email-input` with `test@example.com` and `data-testid=password-input` with `password123`, click `data-testid=login-button` — expect redirect to home page (/)
3. Assert `data-testid=offer-dashboard` is visible — expect the Offer management dashboard to load
4. Assert `data-testid=offer-list` contains at least one `data-testid=offer-card` — expect seeded offers to be visible
5. Assert at least one `data-testid=offer-status-badge` shows "ACTIVE" — expect the seeded active offer to appear
6. Click `data-testid=create-offer-button` — expect OfferForm to open
7. Fill `data-testid=offer-name-input` with "Playwright Test Offer"
8. Select `data-testid=offer-type-select` value "AMOUNT_OFF"
9. Fill `data-testid=offer-discount-input` with "12"
10. Select `data-testid=offer-sponsor-select` with the first available sponsor
11. Fill `data-testid=offer-effective-date-input` with today's date in ISO format
12. Click `data-testid=offer-form-submit` — expect the new offer to appear in `data-testid=offer-list` with a DRAFT status badge
13. Locate the new "Playwright Test Offer" card and click its `data-testid=configure-offer-button` — expect the status badge to change to "CONFIGURED"
14. Click `data-testid=activate-offer-button` on the same card — expect the status badge to change to "ACTIVE" and `data-testid=suspend-offer-button` to be visible
15. Click `data-testid=suspend-offer-button` — expect the status badge to change to "SUSPENDED" and `data-testid=reactivate-offer-button` to be visible
16. Filter offers using `data-testid=offer-status-filter` selecting "SUSPENDED" — expect only suspended offers to appear
17. Clear the filter by selecting "All" in `data-testid=offer-status-filter` — expect all offers to be visible again

## Extension Journey — Member Clip & Unclip

> Only run if [FRONTEND] Member APIs is implemented and merged.

1. Click the "My Offers" navigation link — expect navigation to /my-offers
2. Assert `data-testid=available-offers-list` is visible with at least one `data-testid=offer-detail-card`
3. Assert `data-testid=savings-summary` is visible and `data-testid=savings-total` contains a number
4. Locate a card with `data-testid=clipped-badge` — expect at least one pre-clipped offer from seed data to be shown
5. Locate a card with `data-testid=unclip-button` and click it — expect the `data-testid=clipped-badge` to disappear from that card and `data-testid=clip-button` to appear in its place
6. Click `data-testid=clip-button` on the same card — expect `data-testid=clipped-badge` to reappear and `data-testid=unclip-button` to replace the clip button
7. Assert `data-testid=redemption-history-list` is visible and contains at least one `data-testid=redemption-history-item` from seed data

## Extension Journey — Audit Log

> Only run if [FRONTEND] Audit & Events is implemented and merged.

1. Click the "Audit Log" navigation link — expect navigation to /audit
2. Assert `data-testid=audit-log-list` is visible and contains at least one `data-testid=audit-event-row`
3. Assert `data-testid=audit-action-badge` text values include "OFFER_STATE_CHANGED" — expect seeded events to be present
4. Select `data-testid=audit-filter-entity-type` with "Offer" — expect only Offer events to remain in the list
5. Assert no non-Offer entity types appear in any `data-testid=audit-event-row`
6. Fill `data-testid=audit-filter-from-date` with a past date (7 days ago) and `data-testid=audit-filter-to-date` with today — expect filtered results to load

## Extension Journey — Rules Management

> Only run if [FRONTEND] Rules & Eligibility is implemented and merged.

1. Click the "Rules" navigation link — expect navigation to /rules
2. Assert `data-testid=rule-list` contains at least one `data-testid=rule-card`
3. Assert at least one `data-testid=rule-version-badge` shows "v1"
4. Click `data-testid=create-rule-button` — expect RuleForm to open
5. Fill `data-testid=rule-name-input` with "Playwright Test Rule"
6. Select `data-testid=rule-type-select` with "PRODUCT_CATEGORY"
7. Fill `data-testid=rule-criteria-input` with `{"categories":["test"],"action":"include"}`
8. Click `data-testid=rule-form-submit` — expect the new rule to appear in `data-testid=rule-list` with version badge "v1"
9. Click `data-testid=update-rule-button` on the new rule card — expect RuleForm to open pre-populated
10. Change `data-testid=rule-criteria-input` to `{"categories":["test","extended"],"action":"include"}`
11. Click `data-testid=rule-form-submit` — expect the version badge to increment to "v2"

## Extension Journey — Offer Ingestion Review

> Only run if [FRONTEND] Offer Ingestion is implemented and merged.

1. Click the "Ingestion" navigation link — expect navigation to /ingestion
2. Assert `data-testid=ingestion-queue` is visible
3. Locate a `data-testid=ingested-offer-card` — expect at least one ingested offer card
4. Assert `data-testid=approve-offer-button` is visible on the card
5. Assert `data-testid=reject-offer-button` is visible on the card
6. Fill `data-testid=edit-ingested-discount-input` with "8" and click `data-testid=save-ingested-edits-button` — expect the updated discount value to persist
7. Click `data-testid=approve-offer-button` — expect the card to be removed from `data-testid=ingestion-queue`
8. Navigate to / — expect the approved offer to appear in `data-testid=offer-list` with status "CONFIGURED"

## Test Credentials
- Email:    test@example.com
- Password: password123

## data-testid Reference
These must match the data-testid values in the FRONTEND issues exactly:
- `offer-dashboard` — assert Offer management dashboard is visible after login
- `offer-list` — assert offer list container is present
- `offer-card` — select individual offer rows for interaction
- `offer-status-badge` — assert status label on each offer
- `create-offer-button` — click to open OfferForm
- `offer-name-input` — fill offer name in form
- `offer-type-select` — select offer type in form
- `offer-discount-input` — fill discount value in form
- `offer-sponsor-select` — select sponsor in form
- `offer-effective-date-input` — fill effective date in form
- `offer-form-submit` — submit create offer form
- `configure-offer-button` — click to transition DRAFT → CONFIGURED
- `activate-offer-button` — click to transition CONFIGURED → ACTIVE
- `suspend-offer-button` — click to transition ACTIVE → SUSPENDED
- `reactivate-offer-button` — visible on SUSPENDED offers
- `archive-offer-button` — visible on EXPIRED offers
- `offer-search-input` — fill to filter offers by text
- `offer-status-filter` — select to filter offers by status
- `available-offers-list` — assert member offers container
- `offer-detail-card` — select individual offer cards in member view
- `clip-button` — click to clip an offer
- `unclip-button` — click to unclip an offer
- `clipped-badge` — assert clipped state on offer card
- `member-offer-search-input` — fill to search member offers
- `redemption-history-list` — assert redemption history section
- `redemption-history-item` — select individual redemption rows
- `savings-summary` — assert savings summary bar
- `savings-total` — assert total savings value
- `savings-count` — assert redemption count
- `audit-log-list` — assert audit log container
- `audit-event-row` — select individual audit event rows
- `audit-action-badge` — assert action label per event
- `audit-filter-entity-type` — select entity type filter
- `audit-filter-action` — select action type filter
- `audit-filter-from-date` — fill from-date filter
- `audit-filter-to-date` — fill to-date filter
- `rule-list` — assert rules list container
- `rule-card` — select individual rule cards
- `rule-version-badge` — assert version label per rule
- `create-rule-button` — click to open RuleForm
- `rule-name-input` — fill rule name in form
- `rule-type-select` — select rule type in form
- `rule-criteria-input` — fill rule criteria JSON
- `rule-form-submit` — submit rule form
- `update-rule-button` — click to open rule for version update
- `sponsor-list` — assert sponsors list container
- `sponsor-card` — select individual sponsor cards
- `sponsor-detail` — assert expanded sponsor detail section
- `create-purse-button` — click to open PurseForm
- `purse-list` — assert purse list container
- `purse-card` — select individual purse cards
- `purse-type-badge` — assert purse type label
- `purse-name-input` — fill purse name in form
- `purse-type-select` — select purse type in form
- `purse-sponsor-select` — select sponsor in purse form
- `purse-max-discount-input` — fill max discount value in form
- `purse-form-submit` — submit purse form
- `ingestion-queue` — assert ingestion review queue container
- `ingested-offer-card` — select individual ingested offer cards
- `ingested-offer-syndicator-ref` — assert syndicator ref on ingested offer
- `approve-offer-button` — click to approve ingested offer
- `reject-offer-button` — click to reject ingested offer
- `edit-ingested-name-input` — fill to edit ingested offer name
- `edit-ingested-discount-input` — fill to edit ingested offer discount
- `save-ingested-edits-button` — click to save inline edits

## Acceptance Criteria
- [ ] Primary journey (Offer Lifecycle) passes end-to-end: create → configure → activate → suspend workflow completes without errors
- [ ] All selectors use data-testid only — no CSS classes or text content selectors
- [ ] Member clip/unclip extension journey verifies immediate UI state change after each clip and unclip action without page reload

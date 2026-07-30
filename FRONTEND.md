# NyumbaPlug Frontend Documentation

NyumbaPlug is a React/TypeScript frontend designed specifically to surface and visually enforce anti-scam trust controls for the Kenyan rental market.

## Surface Design Languages
1. **Tenant Browse (`/`)**: Mobile-first, consumer-focused marketplace with full-bleed real photography, KES currency formatting, and prominent Verified Landlord shields.
2. **Landlord Dashboard (`/landlord`)**: Dense, work-oriented interface displaying profile review status, caretaker link relationships, and unit availability management.
3. **Admin Console (`/admin`)**: High-density trust-and-safety workspace featuring inline ID document preview, mandatory blast-radius revoke modals, and human-readable narrative audit logs.

## Trust Model & Business Rules Enforced
- **Rule 1 (Verified Creation)**: Property addition buttons remain disabled until `verification_status = 'verified'`.
- **Rule 2 (SQL Layer Search Exclusion)**: Unverified or revoked landlords are filtered out at the API request level.
- **Rule 3 (Contact Gating)**: Contact reveal modal yields distinct states:
  - *Vacant + Verified Landlord*: Unlocks direct `tel:` call and pre-filled WhatsApp (`wa.me`) link.
  - *Occupied/Reserved/Maintenance*: Displays a clear warning explaining that contact info is locked to avoid deposit extortion.
- **Rule 5 (Caretaker Authorizer Verification)**: Caretakers linked to an unverified primary landlord cannot be approved by admins.

## Getting Started

```bash
npm install
npm run dev
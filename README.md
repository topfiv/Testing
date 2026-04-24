# NEPA Grass Cutting — Website + Booking App (PWA)

A fast, SEO-friendly starter for a **Northeast Pennsylvania** lawn care business where customers can:

- get an instant quote based on measured yard area,
- choose add-ons (weed whacking, edging, treatments),
- book a date/time,
- proceed to payment.

## Temporary domain recommendation
Use a temporary, SEO-friendly domain while validating:

- `https://nepa-grasscutting-demo.pages.dev`

Why this works:
- includes regional keyword (`nepa`),
- includes service intent (`grasscutting`),
- fast global hosting on Cloudflare Pages.

## Features

- **SEO best practices** for local service pages:
  - title/meta tuned to Northeast PA service intent
  - canonical URL
  - Open Graph + Twitter cards
  - JSON-LD LocalBusiness schema
- **Performance-focused implementation**:
  - static HTML/CSS/JS (minimal JS)
  - system font stack
  - deferred scripts
  - lazy map initialization
  - service worker + web manifest for app installability
- **Instant quote estimator**:
  - Draw yard polygon on OpenStreetMap via Leaflet + Leaflet.draw
  - Auto-calculate area in square feet
  - Dynamic pricing with configurable add-ons
- **Booking flow** with a checkout handoff button

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Payment wiring (production)

Replace `PAYMENT_URL` in `scripts/booking.js` with your Stripe Payment Link or hosted checkout URL.

## Next production steps

1. Connect to Stripe Checkout Sessions API (server-side) for dynamic totals.
2. Save bookings in a DB (Supabase/Postgres/Firebase).
3. Add technician dispatch logic and service-area geofencing for NEPA zip codes.
4. Plug in Google Maps API if you prefer parcel overlays over OSM drawing.

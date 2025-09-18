# Agri-Dom

Modern React + TypeScript web application for agricultural operations management: parcels, crops, inventory, finance, statistics, reports, and more. The app supports internationalization (i18n) with English and Swahili, real map interaction with Leaflet, and strong modular page and component architecture.

## Key Features

- Real interactive maps using Leaflet (OpenStreetMap tiles)
- Parcels management: add, filter, view on map, import/export
- Crops planning, harvest tracking, and task lists
- Inventory and stock tracking
- Finance dashboards: budgets, tracking, charts
- Statistics and environmental indicators
- Reports generation
- Authentication scaffold (demo) with a plan to migrate to secure HttpOnly cookies
- Internationalization (i18next) with English and Swahili (Kiswahili)

## Getting Started

Prerequisites:
- Node.js 18+
- npm 9+

Install dependencies:

```bash
npm install
# If not already installed, add i18n packages
npm install i18next react-i18next
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Audit and address vulnerabilities (best-effort):

```bash
npm audit fix
```

## Folder Structure

This project follows a modular, feature-first structure that balances clarity with scalability.

```text
agri-dom-0631/
├─ public/                      # Public assets (served as-is)
├─ src/
│  ├─ components/               # Reusable UI and feature components
│  │  ├─ common/                # Shared UI (e.g., LoadingScreen, PreviewPrintButton)
│  │  ├─ cultures/              # Crop-specific widgets (e.g., TaskList)
│  │  ├─ layout/                # Page layout primitives (PageLayout, PageHeader, TabContainer)
│  │  ├─ parcels/               # Parcel dialogs/components (ParcelMapDialog, filters)
│  │  ├─ statistics/            # Stats widgets (charts, indicators)
│  │  ├─ ui/                    # Low-level UI components (shadcn-based: button, input, dropdown, etc.)
│  │  ├─ CropPlanning.tsx
│  │  ├─ Dashboard.tsx
│  │  ├─ FinancialTracking.tsx
│  │  ├─ HarvestTracking.tsx
│  │  ├─ Inventory.tsx
│  │  ├─ ParcelManagement.tsx
│  │  ├─ ParcelMap.tsx          # React-Leaflet map component using local marker assets
│  │  ├─ SpecificCrops.tsx
│  │  └─ WeatherAlerts.tsx
│  │
│  ├─ contexts/                 # React Context Providers
│  │  ├─ AppSettingsContext.tsx # Global settings (dark mode, locale)
│  │  ├─ AuthContext.tsx        # Demo auth (in-memory); planned secure cookies
│  │  ├─ CRMContext.tsx         # CRM-like shared data interactions
│  │  └─ StatisticsContext.tsx  # Shared statistics data
│  │
│  ├─ hooks/                    # Reusable hooks (e.g., use-page-metadata)
│  ├─ locales/                  # i18n resource bundles
│  │  ├─ en/common.json
│  │  └─ sw/common.json
│  │
│  ├─ pages/                    # Route pages
│  │  ├─ Index.tsx              # Dashboard page (home)
│  │  ├─ ParcelsPage.tsx        # Uses i18n as migration template
│  │  ├─ ParcelsDetailsPage.tsx
│  │  ├─ CropsPage.tsx
│  │  ├─ InventoryPage.tsx
│  │  ├─ FinancePage.tsx
│  │  ├─ ReportsPage.tsx
│  │  ├─ SettingsPage.tsx       # Language selector bound to locale + i18n
│  │  └─ StatsPage.tsx
│  │
│  ├─ utils/                    # Utilities (analytics, formatters, etc.)
│  ├─ i18n.ts                   # i18next bootstrap (init, namespaces)
│  ├─ App.tsx                   # Root providers, router, Suspense fallback
│  └─ main.tsx / index.tsx      # Vite entrypoint (if present)
│
├─ .gitignore                   # Includes Vite temp artifacts and build outputs
├─ package.json
├─ tsconfig.json
├─ tsconfig.app.json / tsconfig.node.json
└─ README.md
```

### Why this structure?

- **Separation of concerns**: Pages compose feature components; components compose UI.
- **Scalability**: New features get their own folders or files under `components/` and `pages/`.
- **Testability**: Smaller components/hooks are easier to unit-test.
- **i18n-first mindset**: `locales/` and `i18n.ts` keep translations centralized.

## Internationalization (i18n)

The app uses `i18next` + `react-i18next`.

- Resource bundles live under `src/locales/<lang>/common.json`.
- Initialization is in `src/i18n.ts` with `common` namespace.
- Pages/components call `const { t } = useTranslation('common')` and use keys like `t('parcels_title')`.
- App language is driven by `AppSettingsContext.locale` and synchronized to i18next via `LocaleSync` in `App.tsx`.
- Settings page provides a language selector. Current languages:
  - English (`en` / `en-GB`)
  - Swahili (`sw` / `sw-KE`)

To add a new language:
1. Create `src/locales/<lang>/common.json`.
2. Import and register it in `src/i18n.ts`.
3. Extend the Settings selector to include the new locale code.

## Maps

- `ParcelMap.tsx` uses React-Leaflet with OpenStreetMap tiles.
- Marker assets are imported locally from the `leaflet` package (no runtime CDN dependency).
- Map supports clicking to move a parcel marker when editing.

## Security Notes

- The current `AuthContext.tsx` stores user state in-memory for demo purposes.
- For production, migrate to a backend session with **HttpOnly, Secure cookies**.
- Avoid storing sensitive tokens in `localStorage` or `sessionStorage` to mitigate XSS.

## Development Workflow

- **Routing**: Managed with `react-router-dom`. Routes defined in `src/App.tsx`.
- **Code-splitting**: Route-level with `React.lazy` and `Suspense`.
- **UI**: Built on a shadcn-like UI layer under `src/components/ui/`.
- **State**: Global settings + domain-specific contexts.
- **Build**: Vite. See `.gitignore` for temp artifact filters.

## How this project aligns with the UN Sustainable Development Goals (SDGs)

The application supports sustainable agriculture and responsible resource management. Below are the primary SDGs it aligns with and how:

- **SDG 2: Zero Hunger**
  - Crop planning, harvest tracking, and parcel management help optimize yields and reduce losses.
  - Inventory tracking ensures better post-harvest management and availability of inputs.

- **SDG 6: Clean Water and Sanitation**
  - Environmental data and planning support responsible irrigation and rainfall tracking.
  - Weather alerts can inform action to protect water resources and prevent runoff impacts.

- **SDG 8: Decent Work and Economic Growth**
  - Financial dashboards (budget planning, tracking) strengthen farm economic resilience.
  - Task management supports labor planning and efficiency.

- **SDG 9: Industry, Innovation, and Infrastructure**
  - Uses modern web tech, open data maps (OSM), and modular architecture to scale farmtech solutions.
  - Encourages data-driven decision-making across the farm operation lifecycle.

- **SDG 11: Sustainable Cities and Communities**
  - Better land use management and monitoring contribute to sustainable rural-urban systems.
  - Data exports and reports improve transparency with stakeholders.

- **SDG 13: Climate Action**
  - Weather alerts and environmental indicators help farmers adapt to climate variability.
  - Decision support reduces climate-related risks (e.g., cyclone, drought, heat).

- **SDG 15: Life on Land**
  - Parcel and soil considerations support sustainable land management and biodiversity-friendly practices.
  - Planning tools reduce overuse of inputs and promote crop rotations.

- **SDG 17: Partnerships for the Goals**
  - Modular design and open-source libraries facilitate partnerships and integrations (GIS, ERP, sensors).
  - Exported data and common formats support collaboration across the agricultural ecosystem.

## Business Model and Profitability (Compressed)

- **Primary revenue: SaaS subscriptions**
  - Tiers by features/scale (Starter → Pro → Enterprise). Options: per-farm flat fee or per-hectare pricing with discounts.
  - Example: 100 ha at $1.50/ha/mo ≈ $150/mo ($1,800/yr).
- **Add-on revenue**
  - Advisory/analytics (climate risk, yield forecasts, compliance reports), integrations marketplace, white-label for co-ops/banks, professional services (onboarding, training).
  - Privacy-first aggregated insights (opt-in) for insurers/lenders/regulators; fintech referrals with partners.
- **Customer ROI**
  - +3–10% yield uplift via planning/alerts; 5–15% input savings; 2–6 hrs/week saved on coordination; improved finance access through better records.
- **Unit economics (illustrative)**
  - Revenue: ~$1,800/yr/account (100 ha Pro). Direct costs: ~ $300/yr → gross margin ≈ 83% at scale. CAC via partners ~$400 → payback ~3 months.
- **Go-to-market**
  - Channel partners (co-ops, agri-retailers, MFIs, NGOs), land-and-expand from core features to advanced modules; localized content (e.g., Swahili) for adoption.
- **SDG-aligned monetization**
  - Keep essential planning/alerts accessible; monetize advanced analytics/integrations while partnering with NGOs for smallholder access.
- **Risk & compliance**
  - Strict privacy/consent for data use, move to HttpOnly cookie sessions, regional data relevance (weather, pests, language).

## Contributing

1. Create a new branch for each feature or bugfix.
2. Prefer small, focused pull requests with descriptive titles (e.g., `feat(parcels): i18n parcel headers`).
3. Internationalize new strings with `t('...')` and add keys to `common.json`.
4. Use the `AppSettingsContext.locale` for date/number formatting.

## License

This project is provided as-is for demonstration purposes. Review license terms in `package.json` or add a dedicated LICENSE file.


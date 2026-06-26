# AGENTS.md — takeout-uni

## What is this

A Vue 3 + TypeScript food ordering/takeout app built with **uni-app 3.x** (cross-platform: H5, WeChat Mini-Program, App).

## Quick commands

```bash
npm run dev:h5          # dev server (Vite, H5)
npm run build:h5        # production build (H5)
npm run dev:mp-weixin   # dev for WeChat mini-program
npm run build:mp-weixin # build for WeChat mini-program
```

No test, lint, or typecheck commands configured.

## Architecture

```
src/
├── api/
│   └── http.ts                # Axios wrapper (singleton)
├── components/
│   ├── common/                # Shared components (LoadingProgress)
│   ├── food/                  # Food-related (BuyNumControl, FoodCategory, FoodRecommendCard, FoodSpecDrawer)
│   ├── home/                  # Home page components
│   ├── mine/                  # Profile page (GridSection, IconButton, OrderSection, UserHeader)
│   ├── order/                 # Order components (OrderCard, PageOrderList)
│   └── review/                # Review components (ReviewCard)
├── constants/
│   ├── api.ts                 # API endpoints config
│   └── storage-keys.ts        # Storage key constants
├── hooks/                     # Vue composables
│   ├── useAuth.ts             # Auth state & login/logout
│   ├── useCart.ts             # Cart operations
│   └── useLocation.ts         # Location services
├── models/                    # TypeScript interfaces/enums per domain
│   ├── address.types.ts
│   ├── api.types.ts
│   ├── cart.types.ts
│   ├── common.types.ts
│   ├── food.types.ts
│   ├── order.types.ts
│   ├── payment.types.ts
│   ├── review.types.ts
│   ├── search.types.ts
│   ├── shop.types.ts
│   └── user.types.ts
├── pages/                     # Page views (8 directories)
│   ├── index/                 # Splash → redirects to main
│   ├── main/                  # Tab container (home/food/order/mine)
│   ├── food/                  # Food detail, search
│   ├── mine/                  # Login, register, profile
│   ├── order/                 # Preview, list, detail, payment
│   ├── address/               # Address management
│   ├── shop/                  # Shop list
│   └── review/                # Review submission
├── router/
│   └── index.ts               # vue-router config (used for H5 navigation)
├── services/                  # Static service classes (call httpUtil)
│   ├── AddressService.ts
│   ├── CartService.ts
│   ├── FoodService.ts
│   ├── OrderService.ts
│   ├── PaymentService.ts
│   ├── ReviewService.ts
│   ├── SearchService.ts
│   ├── ShopService.ts
│   └── UserService.ts
├── static/                    # Static assets
│   └── logo.png
├── stores/                    # Pinia stores
│   ├── app.store.ts
│   ├── cart.store.ts
│   ├── order.store.ts
│   ├── shop.store.ts
│   └── user.store.ts
├── types/
│   └── global.types.ts        # Global type declarations
├── utils/                     # Utility classes
│   ├── DateUtil.ts
│   ├── Logger.ts
│   ├── MapUtil.ts
│   ├── MathUtil.ts
│   ├── PermissionsUtil.ts
│   ├── SensitiveFilter.ts
│   ├── StorageUtil.ts
│   └── ToastUtil.ts
├── App.vue                    # Root component
├── env.d.ts                   # Environment type declarations
├── index.html                 # HTML entry
├── main.ts                    # SSR createApp (uni-app convention)
├── manifest.json              # Uni-app manifest
├── pages.json                 # Uni-app native page registry
└── uni.scss                   # Global SCSS variables
```

## Key patterns & quirks

### Page routing has 2 layers
- **`src/pages.json`** — uni-app native routing (platform-native navigation). Primary mechanism.
- **`src/router/index.ts`** — vue-router for potential H5 SPA usage. Route guards can go here.
- Navigation in code uses `uni.navigateTo()` / `uni.reLaunch()` — never raw vue-router push.

### API layer
- `httpUtil` (Axios singleton) interceptors auto-attach token as `satoken: Bearer <token>` header.
- `API_CONFIG.BASE_URL` defaults to empty string → uses Vite proxy (`/api` → `http://192.168.10.155:8123`).
- API responses expected shape: `{ code: 0, message: string, data: T }`. `code !== 0` → Toast error.
- File upload uses `uni.uploadFile()` (not axios), builds full URL manually.

### State persistence
- Pinia + `pinia-plugin-persistedstate` with custom `uni.getStorageSync`/`uni.setStorageSync` storage adapter (see `src/main.ts`).
- `user.store.ts` persists `token` and `isLogin` under key `'user-store'`.
- Token also stored raw under `'token'` key via `UniStorage` utility.
- Cart state (`cart.store.ts`) is NOT persisted — lost on page refresh.

### Auth flow
- `useAuth()` composable wraps user store for login/logout/requireAuth.
- Auth-required routes in vue-router have `meta: { requireAuth: true }`.
- `App.vue` onLaunch tries `fetchUserInfo()` if token exists.

### Store naming convention
- Files: `*.store.ts` (e.g., `user.store.ts`, `cart.store.ts`).
- Store ID matches filename (e.g., `defineStore('user', ...)`).

### Service naming convention
- Files: `*Service.ts` with static class methods.
- Example: `UserService.login()` → `httpUtil.post<...>(API_CONFIG.PATHS.USER_LOGIN, body)`.

### Cart quirk
- `CartService.addToCart()` sends request body as query params (`httpUtil.post(url, undefined, request as any)`) — intentional.

### Model types
- Types organized by domain in `src/models/*.types.ts` (e.g., `food.types.ts`, `order.types.ts`).
- `FoodItem` has `specs: FoodSpec[]` and `images: FoodImage[]` — always assume these exist.
- `CartFoodItem extends FoodItem` adds `buyNum`, `selectedSpecs`, `specId`, `specName`.
- `OrderStatus` enum: `'unpaid' | 'paid' | 'delivering' | 'completed' | 'cancelled'`.
- Order tab type `'CANCELED'` (single-L, which is intentional) vs enum `'cancelled'` (double-L).
- Global types in `src/types/global.types.ts` for app-wide declarations.

### Platform conditionals
- `PermissionsUtil.ts` uses `#ifdef MP-WEIXIN` / `#ifdef APP-PLUS` / `#ifdef H5` blocks — follow this pattern for platform-specific code.

### SCSS
- Global variables in `src/uni.scss` (standard uni-app vars).
- Components use `scoped` `<style lang="scss">` blocks.
- Primary brand color: `#FF6B35` (orange).

### Generated / build artifacts
- `unpackage/` — build output, gitignored.
- `.hbuilderx/` — HBuilderX IDE data, gitignored.

### What's missing (no config found)
- No linter (ESLint), formatter (Prettier), or typecheck step.
- No test framework or test files.
- No CI/CD config.

### Path aliases
- `@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

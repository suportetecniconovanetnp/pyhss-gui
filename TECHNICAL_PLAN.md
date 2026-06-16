# Technical Plan

## Current Git State
- The repository is already initialized with Git on branch `main`.
- The working tree is heavily modified. Before broad refactors, we should either:
  - create a stabilization branch from the current state, or
  - split the work into small commits by concern.

## Build Blockers

### 1. Broken TypeScript typing patterns
- Symptoms:
  - repeated `TS2693`, `TS7006`, `TS2339`, `TS2345`
  - examples: `src/components/subscriber/add.tsx`, `src/components/auc/addModal.tsx`, `src/components/tft/generator.tsx`
- Root cause:
  - components use `ReturnType<typeof Object>`, `ReturnType<typeof any>`, and untyped `useState([])` / callback params
  - object props are typed as `object`, then accessed as if they had known fields
- Fix:
  - define real interfaces for `Subscriber`, `Auc`, `Apn`, `RoamingRule`, etc.
  - replace `object`/`any`/`ReturnType<typeof ...>` with explicit types
  - type `useState<T>()`, event handlers, and API responses
- Impact:
  - high
  - this is the main blocker for `npm run build`
  - once fixed, many secondary errors disappear together

### 2. Shared form components are typed too narrowly
- Symptoms:
  - repeated `TS2769` on `MenuItem value={true|false}`
  - examples: `src/components/forms/Select.tsx`, `src/components/apn/add.tsx`, `src/components/subscriber/add.tsx`
- Root cause:
  - `SelectField` and `InputField` assume `value: string`, but the app passes booleans and numbers
- Fix:
  - widen form value types to `string | number | boolean | null`
  - use MUI `SelectChangeEvent` where applicable
  - normalize conversions at the field boundary
- Impact:
  - high
  - removes a large cluster of repeated errors with a small shared change

### 3. Missing and weak module typing
- Symptoms:
  - missing declaration for `react-highlight.js`
  - unknown values from `Object.values(...)` in dashboard widgets
- Fix:
  - add a local declaration file for `react-highlight.js`
  - type OAM responses and narrow `unknown` before property access
- Impact:
  - low to medium
  - easy wins after the core typing cleanup

## API Contract Mismatches From `pyhss-swagger.json`

### 4. Wrong endpoint paths in API clients
- Confirmed mismatches:
  - `src/services/pyhss/apis/SubscriberApi.ts`
    - current: `/subscriber/ims_subscriber_imsi/{imsi}`
    - swagger: `/subscriber/imsi/{imsi}`
  - `src/services/pyhss/apis/EirApi.ts`
    - current: `/eir/eir_histroy/list`
    - swagger: `/eir/eir_history/list`
- Fix:
  - correct the hard-coded routes
  - add a small API smoke-test layer or typed route constants
- Impact:
  - high
  - these are runtime bugs, not just build issues

### 5. Frontend is not using server-side pagination already supported by PyHSS
- Confirmed in swagger:
  - `/apn/list`, `/auc/list`, `/charging_rule/list`, `/eir/list`, `/ims_subscriber/list`, `/roaming/network/list`, `/roaming/rule/list`, `/subscriber/list`, `/tft/list`
  - all expose `page` and `page_size`
- Current frontend behavior:
  - most pages fetch full collections and paginate only in the browser
- Fix:
  - update API clients to accept `{ page, pageSize }`
  - move table pagination to the backend
  - keep client-side filtering only where PyHSS has no search endpoint
- Impact:
  - medium to high
  - improves performance and avoids loading large datasets unnecessarily

### 6. Search strategy is inconsistent with backend capabilities
- Backend search endpoints available:
  - `AUC`: `/auc/imsi/{imsi}`, `/auc/iccid/{iccid}`
  - `Subscriber`: `/subscriber/imsi/{imsi}`, `/subscriber/msisdn/{msisdn}`
  - `IMS Subscriber`: `/ims_subscriber/ims_subscriber_imsi/{imsi}`, `/ims_subscriber/ims_subscriber_msisdn/{msisdn}`
  - `EIR`: `/eir/lookup_imei/{imei}`
- Gaps:
  - APN, TFT, Charging Rule, Roaming Network, Roaming Rule expose pagination but no dedicated text-search endpoints in the swagger
- Fix:
  - use backend search where dedicated endpoints exist
  - keep client-side filtering for the rest unless PyHSS adds query filters later
- Impact:
  - medium
  - improves accuracy and scalability for the entities with lookup endpoints

## Recommended Execution Order
1. Fix shared form component types.
2. Define domain interfaces and type API responses.
3. Correct confirmed API route mismatches from the swagger.
4. Re-run `npm run build` until TypeScript is clean.
5. Move all list pages to server-side pagination.
6. Upgrade searches to backend lookups where the swagger supports them.
7. Add CI gates for `npm run build` and linting.

## Expected Outcome
- Build becomes deterministic again.
- Runtime failures caused by wrong endpoints are removed.
- List pages scale better with real PyHSS pagination.
- Future work becomes safer because the frontend will finally have a typed contract with the backend.

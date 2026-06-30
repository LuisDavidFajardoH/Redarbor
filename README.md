# Remota — Technical Challenge

> **Senior UI Developer** · Expo 52 · React Native · TypeScript · Zustand
>
> Challenge by Redarbor · 3–5 días · [gustavo.rodriguez@redarbor.net](mailto:gustavo.rodriguez@redarbor.net)

App de búsqueda de empleos remotos que consume la [API pública de Remotive](https://remotive.com/api/remote-jobs). Multiplataforma (iOS / Android), dark/light theme, offline-first.

---

## Requisitos del reto

| Requisito | Implementación |
|---|---|
| Listado con logo, título, empresa, ubicación, fecha | `JobCard` + `FlashList` |
| Búsqueda por texto (título + empresa) | `useDebounce` (300 ms) + `useSmartSearch` (Fuse.js fuzzy) |
| Filtro por categoría (`/categories`) | `fetchCategories()` → endpoint real → `FiltersSheet` |
| Filtro por tipo de empleo | `FiltersSheet` con employment types + `filterAndSortJobs` client-side |
| Indicador visual de favoritos | `AnimatedHeart` en cada card |
| Pull-to-refresh | `FlashList` + `useJobs().refetch` |
| Estados: cargando, error, sin resultados | `StateView` con skeleton, error + retry, empty |
| Detalle con todos los campos + HTML | `job/[id].tsx` con `parseSections`, HTML saneado |
| Guardar/quitar favoritos (persistente) | Zustand + `persist` + AsyncStorage |
| Compartir empleo | `Share.share()` nativo |
| Aplicar (URL externa) | `expo-web-browser` → `openBrowserAsync` |
| Favoritos con eliminar, navegar a detalle, empty state | `(tabs)/favorites.tsx` |
| Corre en iOS y Android con `npx expo start` | Expo Go / dev build |

---

## 🚀 Cómo ejecutar

### Requisitos

- **Node.js ≥ 18**
- **Expo Go** en el dispositivo ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) o emulador

### macOS

```bash
git clone <repo-url> && cd Redarbor
npm install
npx expo start
```

- `i` → simulador iOS (requiere Xcode)
- `a` → emulador Android (requiere Android Studio)
- Escanear QR → Expo Go en dispositivo físico

### Windows

```bash
git clone <repo-url> && cd Redarbor
npm install
npx expo start
```

- `a` → emulador Android (requiere Android Studio)
- Escanear QR → Expo Go (iOS/Android)

> iOS solo compila desde macOS. En Windows usá Expo Go en un iPhone físico.

### Scripts

```bash
npm run typecheck    # tsc --noEmit
npm test             # Jest
npm run lint         # ESLint
```

---

## 🧱 Stack

| Área | Elección | Por qué |
|---|---|---|
| Framework | Expo SDK 52 | Requisito del reto |
| Navegación | Expo Router (file-based) | Deep links automáticos, mejor DX |
| Estado remoto | TanStack React Query v5 | Caché, reintentos, deduplicación, offline |
| Estado local | Zustand v5 + `persist` | Requisito del reto, API mínima |
| Listas | @shopify/flash-list | Rendimiento superior a FlatList |
| Bottom sheets | @gorhom/bottom-sheet v5 | Filtros y quick actions |
| Búsqueda | Fuse.js (fuzzy) | "rn" → "React Native" |
| Validación | Zod | API externa no tipada → validar en el boundary |
| Estilos | NativeWind v4 (Tailwind) | Utility-first, dark mode con `dark:` |
| Animaciones | moti + reanimated | Microinteracciones, skeleton |
| Testing | Jest + RNTL | Lógica de negocio y componentes |

---

## 🧠 Decisiones de arquitectura

### ¿Por qué React Query + Zustand y no todo en Zustand?

Los empleos son **server state** (caché, `staleTime`, reintentos, `refetch`). React Query resuelve esto out of the box. Meterse un `fetch` manual en Zustand obligaría a reimplementar todo eso. Los favoritos son **client state** persistente → Zustand + `persist` es la herramienta correcta para eso.

### Filtrado client-side

La búsqueda usa **debounce (300 ms)** y **Fuse.js** para fuzzy search sobre título y empresa. Los filtros de categoría y tipo de empleo se aplican con `filterAndSortJobs()` sobre los datos ya en memoria.

El endpoint `/categories` **sí se consume** (`fetchCategories`) y de ahí salen las opciones del filtro.

El resto del filtrado **no va contra la API** porque Remotive bloquea a partir de ~2 requests/minuto. Una sola llamada inicial trae todos los jobs; filtrar en local es instantáneo, funciona offline y no golpea el rate limit.

### Validación con Zod

`src/api/remotive.ts` valida cada respuesta de la API contra esquemas Zod. Si la API cambia o devuelve datos inválidos, el error se detecta en el boundary y no se propaga al resto de la app.

### HTML seguro

`react-native-render-html` con `ignoredDomTags: ['script', 'iframe', 'form', ...]`. Las descripciones se particionan en secciones (`parseSections`) según los `<h1>`–`<h4>` del propio anuncio.

---

## 🗂️ Estructura del proyecto

```
src/
 ├── app/                  # Expo Router (file-based)
 │    ├── _layout.tsx      # Providers + Stack
 │    ├── (tabs)/
 │    │    ├── _layout.tsx # Tabs + glass tab bar
 │    │    ├── index.tsx   # Listado de empleos
 │    │    └── favorites.tsx
 │    └── job/[id].tsx     # Detalle
 ├── api/
 │    └── remotive.ts      # fetch + Zod validation
 ├── components/
 │    ├── sheets/          # FiltersSheet, QuickActionsSheet
 │    ├── ui/              # Button, Chip
 │    ├── JobCard.tsx
 │    ├── SearchBar.tsx
 │    ├── StateView.tsx
 │    ├── HtmlContent.tsx
 │    └── ...
 ├── hooks/               # useJobs, useDebounce, useFavorites, useSmartSearch, useNetwork
 ├── store/               # favoritesStore, themeStore (Zustand)
 ├── lib/                 # http, format, cn, filterJobs, share, sections
 ├── theme/               # tokens (light/dark colors)
 └── types/               # job.ts, filters.ts (Zod schemas + TS types)
```

---

## 🧪 Tests

```bash
npm test              # 30 tests, 8 suites
npm run test:coverage # con reporte de cobertura
```

Cubren: store de favoritos, parseo de API, validación Zod, debounce, formateo de fechas, parseo de HTML en secciones, filtrado, y render de `JobCard` + `StateView`.

---

## 📱 Features extra (fuera del scope del reto)

- **Dark/light theme** con toggle, persistido en Zustand
- **Offline-first**: React Query cachea en AsyncStorage; los jobs se ven sin conexión
- **Banner offline** cuando `NetInfo` detecta pérdida de red
- **Skeleton loaders** durante la carga inicial
- **Quick Actions** (long-press en una card → share, favorite, apply)
- **Glass tab bar** con `BlurView`
- **Haptics** en swipe, long-press y favoritos

---

## 🤖 Desarrollo asistido por IA

Durante el desarrollo de esta prueba técnica se utilizó **Claude Code** como
herramienta de asistencia para generación de código, refactorización, limpieza
de código muerto y redacción de este README. Todas las decisiones de arquitectura,
diseño y UX fueron tomadas y validadas por el autor.

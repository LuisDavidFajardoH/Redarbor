# Redarbor — Remote Job Board

App móvil multiplataforma (iOS / Android) que consume la API pública de
[Remotive](https://remotive.com/api/remote-jobs). Permite buscar empleos
remotos, filtrar por categoría y tipo, ver el detalle de cada oferta, compartir
y guardar favoritos de forma persistente.

Diseño **dark/light**, con animaciones y arquitectura **offline-first**.

---

## ✨ Funcionalidades

Dos pestañas: **Empleos** y **Favoritos**. El detalle se abre desde ambas.

**Empleos**
- Búsqueda **debounced** (300 ms) por título/empresa con _fuzzy_ (**Fuse.js**)
- **Filtros en bottom-sheet** (`@gorhom/bottom-sheet`): categoría, tipo de empleo
  y orden, con Reset / Apply, badge `Filters (n)` y resumen bajo la búsqueda
- Resumen de resultados, **FlashList**, _pull-to-refresh_ y entrada animada

**Job Card**
- Logo, título, empresa, ubicación, badge de tipo, fecha, salario y tags
- Botón favorito animado, swipe y long-press con **haptics**

**Job Detail**
- Hero (logo, título, empresa, meta), favorito y compartir
- HTML organizado en **secciones** según los encabezados del anuncio y **saneado**
- Botón **Apply Now** _sticky_

**Favoritos**
- Búsqueda + orden (Más reciente / Más antiguo / Empresa / Publicación)
- Mismo `JobCard`, empty state con CTA. Persistencia local (Zustand + AsyncStorage)

**Transversal**
- **Offline-first**: cache de React Query persistida en disco + banner offline
- Microanimaciones (moti + reanimated), skeleton loaders
- Tema claro/oscuro con toggle, persistido en Zustand

---

## 🧱 Stack

| Área              | Elección                                   |
| ----------------- | ------------------------------------------ |
| Framework         | Expo SDK 52 (RN 0.76, React 18.3)          |
| Lenguaje          | TypeScript                                 |
| Navegación        | Expo Router (file-based)                   |
| Datos de servidor | TanStack React Query v5 (+ persist-client) |
| Estado local      | Zustand v5 + `persist`                     |
| Listas            | @shopify/flash-list                        |
| Bottom sheets     | @gorhom/bottom-sheet v5                    |
| Gestos / haptics  | react-native-gesture-handler + expo-haptics |
| Búsqueda          | Fuse.js (fuzzy)                            |
| Red / offline     | @react-native-community/netinfo            |
| Validación        | Zod (en el _boundary_ de la API)           |
| Estilos           | NativeWind v4 (Tailwind)                   |
| Animaciones       | moti + react-native-reanimated             |
| Iconos            | lucide-react-native                        |
| HTML              | react-native-render-html (saneado)         |
| Imágenes          | expo-image (con caché)                     |
| Testing           | Jest + React Native Testing Library        |

---

## 🚀 Instalación

### Requisitos previos

- **Node.js ≥ 18** ([descargar](https://nodejs.org/))
- **Git** ([descargar](https://git-scm.com/))
- **Expo Go** en el dispositivo físico ([iOS](https://apps.apple.com/app/expo-go/id982107779) /
  [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
  o un emulador/simulador configurado

### macOS

```bash
# Clonar el repo
git clone <repo-url> && cd Redarbor

# Instalar dependencias
npm install

# Iniciar Metro
npx expo start
```

- Pulsá `i` para abrir en **simulador iOS** (requiere Xcode)
- Pulsá `a` para abrir en **emulador Android** (requiere Android Studio)
- O escaneá el QR con **Expo Go** en tu dispositivo

#### Configurar simulador iOS (opcional)

```bash
# Instalar Xcode desde la App Store, luego:
sudo xcode-select --switch /Applications/Xcode.app
xcodebuild -runFirstLaunch   # aceptar licencia
```

#### Configurar emulador Android (opcional)

```bash
# Instalar Android Studio, luego crear un AVD:
#  Android Studio → More Actions → Virtual Device Manager → Create device
# O usar un dispositivo físico con Depuración USB activada
```

### Windows

```bash
# Clonar el repo (PowerShell o Git Bash)
git clone <repo-url> && cd Redarbor

# Instalar dependencias
npm install

# Iniciar Metro
npx expo start
```

- Pulsá `a` para abrir en **emulador Android** (requiere Android Studio)
- O escaneá el QR con **Expo Go** en tu dispositivo (iOS/Android)

#### Configurar emulador Android en Windows

1. Instalar [Android Studio](https://developer.android.com/studio)
2. En Android Studio: **More Actions → Virtual Device Manager → Create device**
3. Elegir un dispositivo (ej. Pixel 7) y una imagen del sistema (API 34+)
4. Asegurarse de que `ANDROID_HOME` esté configurado como variable de entorno
5. Activar **Depuración USB** si usás un dispositivo físico

> En Windows no se puede compilar para iOS (requiere macOS + Xcode). Usá
> **Expo Go** en un iPhone físico para probar en iOS desde Windows.

### Ambos sistemas

```bash
npm install        # instalar dependencias
npx expo start     # iniciar Metro
```

### Scripts

```bash
npm start            # expo start
npm run ios          # abrir en simulador iOS
npm run android      # abrir en emulador Android
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Jest
npm run test:coverage# Jest con cobertura
npm run format       # Prettier
```

---

## 🗂️ Arquitectura

```
src/
 ├── app/                 # Rutas (Expo Router)
 │    ├── _layout.tsx     # Providers + Stack
 │    ├── (tabs)/
 │    │    ├── _layout.tsx   # Tabs + tab bar glass
 │    │    ├── index.tsx     # Listado de empleos
 │    │    └── favorites.tsx # Favoritos
 │    └── job/[id].tsx    # Detalle
 ├── api/                 # remotive.ts (fetch + validación zod)
 ├── components/          # JobCard, SearchBar, StateView, HtmlContent, Skeleton
 │    ├── sheets/         # FiltersSheet, QuickActionsSheet
 │    └── ui/             # Button, Chip
 ├── hooks/               # useJobs, useDebounce, useFavorites, useSmartSearch, useNetwork
 ├── store/               # favoritesStore, themeStore (zustand + persist)
 ├── lib/                 # http, format, cn, filterJobs, share, sections
 ├── theme/               # tokens (colores light/dark)
 └── types/               # job.ts, filters.ts (interfaces + esquemas zod)
```

---

## 🧠 Decisiones técnicas

### Filtrado client-side (por qué no usamos `?category=` / `?search=` de la API)

La API de Remotive **no permite filtrar resultados por categoría, tipo de empleo
ni búsqueda de texto desde el servidor con garantías de disponibilidad**.

- El endpoint `/categories` **SÍ es real** y se consume vía `fetchCategories()`.
  De ahí salen las opciones del filtro de categoría.
- El resto del filtrado (categoría, tipo de empleo, búsqueda) se hace
  **client-side** sobre los datos ya cargados, con `filterAndSortJobs()`.

**¿Por qué?**

Remotive **bloquea a partir de ~2 requests/minuto** (recomienda 4 al día).
Aunque la búsqueda tiene **debounce (300 ms)** para no disparar lógica en cada
tecla, filtrar server-side implicaría requests HTTP por cada cambio de filtro
→ bloqueo seguro en segundos. En cambio, **una sola llamada** trae todo el
listado; filtrar en local con `useSmartSearch` (Fuse.js) + `filterAndSortJobs`
es **instantáneo** y funciona sin conexión.

### React Query (datos) + Zustand (favoritos)

Los empleos son _server state_ (caché, reintentos, `refetch`) → React Query
evita reimplementar todo eso. Los favoritos son _client state_ persistente →
Zustand + `persist` es ligero y sin _boilerplate_.

### Validación con Zod

La API es JSON externo no tipado; se valida en el _boundary_
(`src/api/remotive.ts`) para no propagar datos inválidos.

### Seguridad HTML

`react-native-render-html` con `ignoredDomTags` (`script`, `iframe`, `form`, …)
para mitigar XSS.

---

## ⚡ Rendimiento y accesibilidad

- `FlashList` virtualizada con `keyExtractor`, `estimatedItemSize`
- `React.memo` en `JobCard`; `useCallback`/`useMemo` para props estables
- `expo-image` con caché y placeholder
- Búsqueda con _debounce_ para evitar renders excesivos
- `accessibilityRole` / `accessibilityLabel` / `accessibilityState` en todos los
  elementos interactivos (VoiceOver / TalkBack)
- Skeleton loaders con `accessibilityElementsHidden`

---

## 🔐 Seguridad

- API pública: **sin claves ni secretos** en el repo
- `fetch` con _timeout_ (`AbortController`), reintentos limitados (`retry: 1`) y
  errores tipados
- Validación de datos con Zod y saneado del HTML

---

## 🧪 Testing

`Jest` + `React Native Testing Library`.

```bash
npm test              # ejecutar tests
npm run test:coverage # con cobertura
```

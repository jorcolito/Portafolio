# JORGE.EXE — A Developer's Tale

Portafolio web interactivo de Jorge Colamarco presentado como una experiencia narrativa 2D. El visitante puede recorrer JORGE LABS, descubrir proyectos y trayectoria mediante objetos jugables, o abrir **Quick View** para consultar la misma información en una interfaz HTML directa y accesible.

![Vista previa de JORGE.EXE](public/og.png)

## Qué incluye esta versión

- Portada `JORGE.EXE` iniciable con Enter, clic o toque.
- Introducción de ascensor con opción para omitirla.
- Mundo 2D construido con Phaser: movimiento, salto, gravedad, colisiones, cámara e interacción contextual.
- Cinco pisos conectados por ascensor: Lobby, Proyectos, Educación, Sobre mí y Contacto.
- Lobby con robot, terminal de bienvenida y punto de guardado decorativo.
- Laboratorio de proyectos con estaciones para CarDrive, SHIKO y Comernova.
- Diálogos de varias líneas con efecto de escritura, revelado inmediato y avance por teclado o botón.
- Fichas HTML accesibles con descripción, problema resuelto, funciones, tecnologías, estado y acciones de proyecto.
- Quick View con presentación, proyectos, tecnologías, educación, experiencia, contacto y acceso al CV.
- Panel de contacto y formulario visual; esta versión no envía ni almacena datos.
- Controles táctiles en pantallas pequeñas o dispositivos con puntero grueso.
- Navegación por teclado, foco visible, modales con control de foco y cierre con Escape.
- Preferencia de movimiento reducido, introducción omitible y audio desactivado de inicio.
- Diseño responsive con canvas 16:9 y paneles adaptados al viewport.
- Fallback HTML útil: Quick View no depende del canvas para presentar la información profesional.

El control de sonido está preparado en la interfaz y en el contrato del juego, pero el MVP todavía no reproduce música ni efectos. Tampoco existe guardado de progreso, combate, backend de contacto o analítica.

## Arquitectura real

El proyecto conserva el starter **vinext/Vite** y su App Router compatible con Next.js. La experiencia combina React 19, TypeScript estricto y Phaser 3.90.

```text
app/page.tsx
  └─ JorgeExeExperience (estado y overlays React)
       ├─ StartScreen / Intro / Quick View / modales HTML
       └─ GameCanvas (cliente)
            └─ importación dinámica de src/game
                 └─ Phaser.Game + escenas + Arcade Physics

src/data ────────────────┬─ juego
                         └─ Quick View y modales

React ── comandos tipados ──> GameBridge ──> Phaser
React <── eventos tipados ─── GameBridge <── Phaser
```

- **vinext + Vite:** desarrollo y build principal del starter, con integración de Sites/Cloudflare en `vite.config.ts`.
- **React:** controla portada, introducción, Quick View, diálogos, modales, preferencias y controles táctiles.
- **Phaser:** controla escenas, jugador, física, colisiones, cámara y zonas de interacción.
- **GameBridge:** transporta `ReactToGameCommand` y `GameToReactEvent` sin guardar un segundo estado de la aplicación.
- **Datos tipados:** `src/data/` alimenta tanto el juego como Quick View; los componentes no mantienen copias manuales.
- **Carga segura:** Phaser se importa dinámicamente desde `GameCanvas`, por lo que no se evalúa durante renderizado de servidor.
- **Ciclo de vida:** abrir un modal pausa el mundo existente; no crea otra instancia del juego. Al desmontar, canvas, bridge y listeners se destruyen.

Educación, Sobre mí y Contacto reutilizan una escena parametrizada (`InfoFloorScene`); Lobby y Proyectos tienen escenas dedicadas.

## Prerrequisitos

- Node.js `>= 22.13.0`.
- npm compatible con la versión de Node instalada.
- Navegador moderno con Canvas/WebGL, módulos ES y Pointer Events.

El MVP no requiere variables de entorno, base de datos ni credenciales para ejecutarse.

## Instalación y desarrollo

```bash
npm install
npm run dev
```

Abre la URL indicada por vinext en la terminal. Para detener el servidor, usa `Ctrl+C`.

## Comandos de validación

```bash
# Build vinext/Sites/Cloudflare
npm run build

# ESLint
npm run lint

# Build y pruebas de render/arquitectura
npm test

# Comprobación estricta de TypeScript sin emitir archivos
npx tsc --noEmit
```

| Comando | Propósito |
| --- | --- |
| `npm install` | Instala las versiones declaradas y actualiza el lockfile si corresponde |
| `npm run dev` | Inicia vinext/Vite en modo desarrollo |
| `npm run build` | Genera la salida vinext para el flujo Sites/Cloudflare |
| `npm run start` | Sirve la build vinext generada |
| `npm run lint` | Revisa el proyecto con ESLint |
| `npm test` | Ejecuta primero el build y luego las pruebas de `tests/rendered-html.test.mjs` |
| `npx tsc --noEmit` | Comprueba tipos sin generar JavaScript |

`npm test` vuelve a ejecutar el build; no es necesario correr ambos comandos seguidos salvo que se quiera registrar cada resultado por separado.

## Estructura principal

```text
app/
  JorgeExeExperience.tsx    # orquestación de la experiencia y overlays
  globals.css               # tokens, pixel UI, responsive y accesibilidad
  layout.tsx                # metadata y shell HTML
  page.tsx                  # entrada de la aplicación
src/
  components/game/          # host de Phaser y controles táctiles
  components/ui/            # portada, intro, diálogos, Quick View y modales
  data/                     # perfil, proyectos, pisos y diálogos tipados
  game/config/              # creación y configuración de Phaser
  game/entities/            # texturas originales generadas por código
  game/events/              # bridge React–Phaser
  game/scenes/              # Lobby, Proyectos y pisos informativos
  game/types/               # eventos, comandos y contratos públicos
  types/                    # modelos de contenido y enlaces discriminados
public/                     # favicon, Open Graph y futuros archivos públicos
docs/                       # visión, GDD, arquitectura, contenido y roadmap
tests/                      # pruebas sobre la build renderizada
worker/                     # entrada conservada del starter Sites/Cloudflare
vite.config.ts              # vinext + Vite + Cloudflare/Sites
next.config.ts              # ruta nativa de Next.js para Vercel
```

## Controles

### Escritorio

| Acción | Control |
| --- | --- |
| Mover izquierda | `A` o `←` |
| Mover derecha | `D` o `→` |
| Saltar | `W`, `↑` o `Espacio` |
| Interactuar | `E` o `Enter` |
| Usar ascensor al estar cerca | `S` o `↓` |
| Avanzar/revelar diálogo | `E`, `Enter`, `Espacio` o botón Continuar |
| Cerrar modal | `Escape` o botón Cerrar |

También se puede elegir un piso desde el panel lateral del ascensor y abrir Quick View desde la barra superior.

### Móvil y tablet

- Mantener `←` o `→` para desplazarse.
- `↑` para saltar.
- `E` para interactuar.
- `☰` para abrir el menú de pisos.
- Tocar Continuar para avanzar diálogos y los botones HTML para cerrar paneles.

Los controles táctiles aparecen por debajo de `760 px` o cuando el navegador informa un puntero grueso. Se deshabilitan mientras un diálogo o modal bloquea el juego.

## Datos tipados y placeholders pendientes

La aplicación no publica información ficticia. Correo, GitHub, LinkedIn, CV, demos y repositorios permanecen como recursos `placeholder` con `href: null` hasta recibir valores reales.

El modelo en `src/types/links.ts` es una unión discriminada:

```ts
type ResourceLink =
  | {
      availability: "available";
      href: string;
      // id, kind, label y ariaLabel
    }
  | {
      availability: "placeholder";
      href: null;
      placeholderMessage: string;
      // id, kind, label y ariaLabel
    };
```

Esto evita enlaces `#`, URLs vacías y botones que aparenten estar disponibles.

### Correo, GitHub, LinkedIn y CV

Edita `CONTACT_LINKS` en `src/data/profile.ts`. Para cada recurso confirmado:

1. cambia `availability` a `"available"`;
2. sustituye `href: null` por la URL real;
3. elimina `placeholderMessage`;
4. actualiza `id`, `label` y `ariaLabel` para que ya no digan “pendiente”.

Ejemplo para correo:

```ts
{
  id: "contact-email",
  kind: "email",
  label: "correo@dominio.com",
  ariaLabel: "Enviar un correo a Jorge Colamarco",
  availability: "available",
  href: "mailto:correo@dominio.com",
}
```

Al mezclar enlaces disponibles y pendientes, cambia el tipo del arreglo:

```ts
import type {
  PortfolioProfile,
  ResourceLink,
  Technology,
  TechnologyCategory,
  TechnologyGroup,
} from "../types";

export const CONTACT_LINKS = [
  // ...
] as const satisfies readonly ResourceLink[];
```

Para el CV:

1. copia el PDF a `public/jorge-colamarco-cv.pdf`;
2. usa `kind: "cv"`, `availability: "available"` y `href: "/jorge-colamarco-cv.pdf"`;
3. ejecuta TypeScript, lint y build.

Quick View y el panel de contacto leerán automáticamente los enlaces actualizados. El botón específico **Copiar correo** sigue siendo demostrativo en este MVP; cuando exista una dirección real, conéctalo en `src/components/ui/ContactModal.tsx` al enlace `kind: "email"` y usa `navigator.clipboard.writeText` con un fallback accesible.

### Demos y repositorios de proyectos

Edita `links.demo` y `links.repository` del proyecto correspondiente en `src/data/projects.ts`. Se puede reemplazar cada llamada al helper de placeholder por un enlace disponible:

```ts
links: {
  demo: {
    id: "cardrive-demo",
    kind: "demo",
    label: "Ver demo",
    ariaLabel: "Abrir demo de CarDrive",
    availability: "available",
    href: "https://demo.example.com",
  },
  repository: {
    id: "cardrive-repository",
    kind: "repository",
    label: "Ver en GitHub",
    ariaLabel: "Abrir repositorio de CarDrive en GitHub",
    availability: "available",
    href: "https://github.com/usuario/repositorio",
  },
},
```

Usa URLs reales en lugar de los dominios del ejemplo. El cambio se refleja en la ficha del proyecto y en cualquier vista que consuma el mismo objeto tipado.

Después de sustituir contenido:

```bash
npx tsc --noEmit
npm run lint
npm test
```

## Despliegue en Vercel

El código de `app/` también es una aplicación Next.js válida, pero el script `build` del repositorio ejecuta **vinext**, no `next build`. Vercel detecta y usa el script `build` cuando existe, así que el override es obligatorio para desplegar con su runtime nativo de Next.js.

### Desde el dashboard

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. En Vercel, elige **Add New → Project** e importa el repositorio.
3. Usa la raíz del repositorio como **Root Directory**.
4. Selecciona **Next.js** como **Framework Preset**.
5. En **Build and Deployment**, activa **Override** para Build Command y escribe:

   ```bash
   npx next build
   ```

6. Usa `npm install` como Install Command o conserva el valor automático.
7. Deja **Output Directory** sin override; Vercel debe usar la salida predeterminada de Next.js. No configures `dist`.
8. Selecciona Node.js `22.x`, coherente con `engines.node >=22.13.0`.
9. No agregues variables de entorno para este MVP.
10. Pulsa **Deploy** y, al terminar, valida portada, inicio, Quick View, cambio de pisos y una ficha de proyecto.

Los futuros commits en la rama conectada generarán previews o despliegues de producción según la configuración del proyecto. Vercel documenta el override del build y la detección de frameworks en su [guía de configuración de builds](https://vercel.com/docs/builds/configure-a-build).

### Con Vercel CLI

Después de crear o configurar el proyecto con el build override anterior:

```bash
npx vercel link
npx vercel
npx vercel --prod
```

Si la CLI pregunta por la configuración, selecciona Next.js, usa `npx next build` y conserva la salida predeterminada. No aceptes `npm run build` para el proyecto Vercel, porque ese comando produce la variante vinext/Sites.

## Compatibilidad Sites/Cloudflare

El starter conserva su ruta original para Sites/Cloudflare:

- `npm run dev` y `npm run build` usan vinext/Vite.
- `vite.config.ts` registra `vinext()`, el plugin de Sites y `@cloudflare/vite-plugin`.
- `worker/index.ts`, `.openai/hosting.json` y `build/sites-vite-plugin.ts` permanecen disponibles.
- D1 y R2 están desactivados actualmente (`null`) y el portafolio no los necesita.
- Las pruebas renderizan la salida vinext desde `dist/server/index.js`.

| Destino | Build | Salida administrada por |
| --- | --- | --- |
| Sites/Cloudflare | `npm run build` | vinext/Vite + Worker de Cloudflare |
| Vercel | `npx next build` | runtime nativo de Next.js en Vercel |

No mezcles las salidas: `dist` pertenece al flujo vinext/Cloudflare y la salida Next pertenece al flujo Vercel.

## Documentación de diseño

- [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md)
- [`docs/GAME_DESIGN_DOCUMENT.md`](docs/GAME_DESIGN_DOCUMENT.md)
- [`docs/TECHNICAL_ARCHITECTURE.md`](docs/TECHNICAL_ARCHITECTURE.md)
- [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)

## Limitaciones actuales

- Los enlaces de contacto, CV, demos y repositorios son placeholders intencionales.
- El formulario de contacto no transmite ni almacena información.
- El control de audio no reproduce sonidos todavía.
- El punto de guardado es narrativo; no existe persistencia de progreso.
- Los recursos visuales son originales y ligeros, generados principalmente con código y CSS para el MVP.

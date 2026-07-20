# Roadmap — Portafolio interactivo de Jorge Colamarco

**Objetivo de entrega:** una experiencia jugable y accesible formada por cuatro dioramas compactos y un contacto directo, con proyectos, biblioteca académica, señales personales reales y Quick View como ruta equivalente.

## Estado actual del rediseño

- El repositorio parte de un starter vinext/Vite con React, TypeScript, ESLint y scripts de build/pruebas.
- La aplicación usa `app/` en la raíz; no se migrará a `src/` durante el MVP.
- Phaser ya está integrado y se carga solo en cliente.
- Correo, GitHub, LinkedIn, el Statement of Results de Cambridge y la insignia `AWS Academy Data Engineering Trained` están confirmados; CV y varios enlaces de proyecto siguen pendientes.
- El elevador global con `Q`, sus puertas animadas, los contornos blanco→verde, la proximidad con `E` y la activación por clic/toque ya forman el contrato jugable.
- Lobby utiliza únicamente el ascensor físico y un cartel de ayuda; bitácora, puertas directas, memoria, punto de guardado y sprites flotantes sin función quedaron fuera.
- Chess.com se consulta exclusivamente desde el tablero; Quick View prioriza proyectos, tecnologías, credenciales, método y contacto en menos de un minuto.

## Decisiones de alcance

| Tema | Decisión del MVP | Evolución posterior |
| --- | --- | --- |
| Mundo | Cuatro dioramas compactos y Contacto como panel directo | Variaciones ambientales o secretos breves |
| Nivel de detalle | Todos los pisos densos; Lobby y Proyectos marcan el acabado | Igualar animaciones y profundidad por piso |
| Proyecto de referencia | CarDrive | Demos integradas de SHIKO y Comernova |
| Contenido | Datos TypeScript estáticos e inmutables | CMS solo si existe necesidad real |
| Diálogos y paneles | HTML accesible sobre canvas | Retratos y audio ampliado |
| Navegación | Elevador físico con `E` + llamada global con `Q` + Quick View | Deep links a piso/objeto |
| Datos externos | Chess.com server-side con caché y fallback | Historial o visualizaciones adicionales si aportan valor |
| Guardado | Sin memoria, punto de guardado ni persistencia | Recordar piso solo si mejora retorno |
| Contacto | Correo, GitHub y LinkedIn directos; sin formulario ficticio | CV descargable cuando exista el archivo |
| Audio | Silenciado hasta consentimiento | Música original y mezclador |
| Idioma | Español | Inglés completo |
| Arte | Formas/texturas/SVG originales ligeros | Sprites y fondos finales propios |

## Orden de implementación

### M0 — Diseño y contrato

**Resultado:** el equipo puede implementar sin decidir de nuevo producto, escenas o comunicación.

- [x] Visión y alcance.
- [x] GDD, mapa de escenas y flujos.
- [x] Arquitectura y contrato React–Phaser.
- [x] Guía de contenido.
- [x] Roadmap y criterios trazables.

**Salida:** documentos en `docs/` revisados contra el brief.

### M1 — Shell accesible y datos

**Resultado:** la información profesional ya es útil sin arrancar Phaser.

- Añadir Phaser como única dependencia necesaria para el juego.
- Crear tipos y datos canónicos para proyectos, biblioteca académica, perfil, tecnologías, contacto y diálogos.
- Implementar selectores compartidos.
- Crear portada, skip link, Quick View y preferencias de movimiento/sonido.
- Representar enlaces faltantes como placeholders deshabilitados.
- Crear el reducer de superposiciones y el bridge tipado con pruebas.

**Definition of Done:**

- Quick View contiene todas las secciones y se usa con teclado.
- Juego y Quick View no tienen copias independientes de proyectos.
- La portada sigue funcional aunque el chunk de Phaser se fuerce a fallar.
- No se inventa ningún dato de contacto.

### M2 — Núcleo jugable del Lobby

**Resultado:** iniciar, moverse e interactuar ya se sienten como una escena viva y dirigida.

- Cargar Phaser únicamente tras comenzar.
- Implementar `BootScene`, texturas generadas y animaciones base.
- Implementar introducción de ascensor, opción de omitir y reducción de movimiento.
- Construir `LobbyScene` como diorama, con límites cortos, cámara contenida y focos visibles desde el spawn.
- Crear jugador con caminar y colisiones; el movimiento no es una barrera de acceso.
- Normalizar teclado y controles táctiles.
- Añadir ascensor físico, cartel breve, prompt contextual y llamada global con `Q`.
- Añadir fallback visible si Phaser no inicia.

**Definition of Done:**

- Enter/clic/toque inicia; omitir introducción llega al Lobby.
- Jugador camina, colisiona y no sale de la sala.
- Ningún foco esencial exige mantener una dirección durante un recorrido largo.
- La interacción se activa una vez por pulsación.
- Diálogo soporta varias líneas, revelado inmediato, cierre y devolución de control.
- No se acumulan canvas ni listeners después de desmontar/remontar.

### M3 — Vertical slice CarDrive

**Resultado:** el recorrido principal demuestra narrativa, juego y presentación profesional de extremo a extremo.

- Crear elevador global invocable con `Q`, menú HTML y transición de puertas.
- Implementar `ProjectsScene` y objeto de garaje CarDrive.
- Enlazar interacción → ficha directa de CarDrive.
- Añadir captura placeholder, funciones, tecnologías, estado y acciones.
- Implementar foco modal y cierre con Escape/botón.
- Implementar un bloqueo idempotente mientras existe una superposición.
- Confirmar que abrir/cerrar UI no recrea Phaser.

**Definition of Done:**

- Lobby → `Q` → Proyectos → CarDrive funciona con teclado y táctil.
- Al abrir diálogo/ficha, el jugador queda inmóvil y no acumula entrada.
- Una pulsación abre una sola ficha y el cierre devuelve control una sola vez.
- Cerrar restaura física, entrada y foco.
- CarDrive muestra “MVP en desarrollo” y links placeholder correctos.

### M4 — Contenido inicial completo

**Resultado:** los cuatro pisos jugables forman una colección coherente de escenas densas; Contacto evita una escena artificial y abre la acción profesional directamente.

- Añadir estaciones SHIKO y Comernova con fichas distintas.
- Crear `EducationScene` como biblioteca compacta, con UEES, Cambridge C1 verificable y formación completada `AWS Academy Data Engineering Trained`.
- Añadir apertura animada de libro y panel reutilizable para documentos.
- Crear `AboutScene` con Guayaquil correctamente situado, método de trabajo y tablero conectado a datos públicos de Chess.com.
- Abrir Contacto como panel HTML directo, con fotografía profesional y regreso explícito al elevador.
- Añadir ruta server-side de Chess.com con caché, timeout y fallback sin cifras ficticias.
- Conectar todos los pisos al mismo elevador global.
- Reflejar lo esencial en Quick View sin duplicar Chess.com ni añadir contadores decorativos.
- Añadir señalética, iluminación y animaciones idle discretas sin sprites flotantes que parezcan contenido.

**Definition of Done:**

- Se visitan los cuatro pisos jugables, se abre Contacto y se regresa al Lobby.
- Cada objeto esencial se reconoce al entrar o se alcanza en pocos segundos.
- Los tres proyectos muestran contenido y estados correctos.
- Contacto no simula un envío y usa correo/URLs confirmados.
- Quick View contiene la misma información que las interacciones esenciales.
- Cambridge se presenta como Statement of Results y `AWS Academy Data Engineering Trained` como formación completada, nunca como certificación profesional; no hay volúmenes universitarios ficticios.
- Chess.com puede fallar sin romper el modal del tablero ni el resto del portafolio.

### M5 — Responsive, accesibilidad y rendimiento

**Resultado:** el MVP es usable fuera del equipo de desarrollo.

- Ajustar canvas `16:9`, `FIT`, letterboxing y resolución lógica.
- Validar móvil vertical/horizontal, tablet, laptop y desktop.
- Mostrar controles táctiles por capacidad/preferencia, no solo por ancho.
- Verificar foco, región viva, nombres accesibles, contraste y zoom al 200 %.
- Respetar `prefers-reduced-motion` y permitir sobrescritura.
- Reducir partículas, profundidad ambiental y DPR cuando sea necesario.
- Lazy-load de Phaser/pisos y revisión de tamaños de chunk/asset.
- Auditar cleanup de escenas, bridge, teclado, Pointer Events y ResizeObserver.

**Definition of Done:**

- No hay scroll horizontal ni modal fuera del viewport.
- Todo contenido esencial es accesible sin canvas.
- El recorrido principal se completa solo con teclado.
- Pointer cancel/blur no deja al personaje caminando.
- No hay errores importantes en consola ni degradación acumulativa al cambiar pisos.

### M6 — Validación y entrega

**Resultado:** una build verificable con límites conocidos, no una demo declarada terminada por intuición.

- Ejecutar TypeScript, lint, build y pruebas disponibles.
- Añadir pruebas del bridge, datos, reducer, modales y flujo principal.
- Revisar visualmente portada, Lobby, Proyectos, Quick View y breakpoints.
- Probar carga fallida de Phaser y placeholders de enlaces.
- Actualizar README con ejecución, arquitectura, limitaciones y despliegue validado.
- Registrar resultado real de cada comando y cualquier advertencia.

**Comandos mínimos:**

```bash
npx tsc --noEmit
npm run lint
npm run build
npm test
```

El starter actual está orientado a vinext/Cloudflare. Antes de prometer Vercel, debe validarse una build real en ese destino. Si la configuración de vinext no es compatible, el README debe explicarlo y documentar el host soportado o una migración explícita; no debe afirmar compatibilidad sin prueba.

## Matriz de aceptación del MVP

Cada fila debe tener evidencia: prueba automatizada, revisión manual reproducible o ambas.

| ID | Criterio | Evidencia mínima |
| --- | --- | --- |
| MVP-01 | Instalación limpia completa sin error | `npm install`/`npm ci` registrado |
| MVP-02 | Servidor de desarrollo inicia y sirve la portada | Revisión manual en navegador |
| MVP-03 | Build de producción termina sin error | Salida de `npm run build` |
| MVP-04 | Se muestra `Jorge Colamarco — Portafolio interactivo` | Prueba de render o captura |
| MVP-05 | Enter, clic o toque inicia la experiencia | Prueba de interacción |
| MVP-06 | La introducción se puede omitir | Prueba con preferencia normal y reducida |
| MVP-07 | Jugador se mueve a izquierda/derecha | Prueba manual teclado/táctil |
| MVP-08 | La sala se lee como un diorama y sus focos principales están visibles al entrar | Revisión visual |
| MVP-09 | Suelo y límites tienen colisión | Prueba manual y configuración inspeccionada |
| MVP-10 | Prompt aparece solo dentro del rango | Prueba del sistema de interacción |
| MVP-11 | Diálogo inicia, avanza, revela y termina | Prueba de componente/integración |
| MVP-12 | `Q` abre el elevador desde cualquier punto y permite llegar a Proyectos | Prueba de flujo |
| MVP-13 | CarDrive abre su ficha completa | Prueba de flujo y contenido |
| MVP-14 | Repetir Enter no reinicia ni cierra dos veces un diálogo | Prueba manual dirigida |
| MVP-15 | Modal cierra por botón y Escape | Prueba de teclado/componente |
| MVP-16 | El control vuelve sin recrear juego | Contador de instancias + prueba manual |
| MVP-17 | Quick View funciona desde portada y juego | Prueba de navegación/teclado |
| MVP-18 | SHIKO y Comernova muestran estado correcto | Prueba de datos/render |
| MVP-19 | Biblioteca, Sobre mí, tablero Chess.com y Contacto son navegables | Recorrido de cuatro pisos, contacto directo y fallback de API |
| MVP-20 | Controles táctiles básicos responden y se liberan | Prueba Pointer Events |
| MVP-21 | No hay errores importantes en consola | Revisión de recorrido completo |
| MVP-22 | README explica ejecutar, validar, limitar y desplegar | Revisión documental |
| MVP-23 | Toda información esencial existe fuera del canvas | Auditoría Quick View |
| MVP-24 | Movimiento reducido elimina efectos no esenciales | Prueba de preferencia/SO |
| MVP-25 | Abrir/cerrar overlays no acumula listeners | Prueba repetida e inspección |

## Puertas de calidad

No se avanza a la siguiente puerta si falla un criterio previo que invalida el flujo.

1. **Datos:** tipos estrictos, placeholders honestos, una sola fuente.
2. **Shell:** portada y Quick View disponibles sin Phaser.
3. **Juego:** dioramas densos, movimiento corto, colisión e interacción estables.
4. **Slice:** CarDrive completo con bloqueo/restauración.
5. **Mundo:** cuatro pisos jugables, contacto directo y contenido básico.
6. **Acceso:** teclado, táctil, movimiento reducido y responsive.
7. **Release:** lint, TypeScript, pruebas, build y revisión visual.

## Riesgos y mitigaciones

| Riesgo | Señal temprana | Mitigación |
| --- | --- | --- |
| Phaser se evalúa durante SSR | `window is not defined` en build | Import dinámico dentro de `useEffect`; frontera cliente |
| UI y juego divergen | Estado de proyecto distinto en Quick View | IDs estables y selectores sobre `data/` |
| Enter repetido altera el flujo | Diálogo vuelve al inicio o finaliza dos veces | Máquina de estados monotónica y bloqueo hasta `keyup` |
| Listeners duplicados | Interacción doble tras cambiar piso | Cleanup en `shutdown/destroy` y pruebas repetidas |
| Arte consume el calendario | Muchas piezas sin flujo funcional | Graphics/SVG/placeholders hasta cerrar M3 |
| Móvil pierde control | Personaje sigue andando tras soltar | Manejar `pointercancel`, blur y visibilidad |
| Canvas excluye usuarios | Información inaccesible con teclado/lector | DOM para overlays + Quick View equivalente |
| Assets afectan carga | Portada lenta o memoria alta | Lazy-load, presupuestos y recorte decorativo |
| Enlaces desconocidos parecen reales | Botones `#` o formularios falsos | Ocultar acciones ausentes o usar `href: null`; publicar solo destinos confirmados |
| Chess.com no responde o cambia campos | Tarjetas vacías o cifras engañosas | Normalización server-side, campos opcionales, caché y fallback sin números |
| Host de despliegue no coincide con starter | Build local pasa, destino falla | Spike y despliegue real antes de documentar soporte |

## Criterio de recorte por tiempo

Si una fecha limita el MVP, recortar en este orden:

1. partículas, paralaje y animaciones ambientales;
2. cantidad de objetos opcionales;
3. cantidad de efectos ambientales no esenciales;
4. transiciones distintas por piso;
5. audio.

No recortar Quick View, datos canónicos, CarDrive, control del foco, bloqueo/restauración, teclado ni fallbacks.

## Siguientes cinco pasos después del MVP

1. Incorporar el CV y enlaces de demos/repositorios cuando existan documentos o destinos confirmados.
2. Producir un set original y coherente de sprites/fondos con inventario de licencias.
3. Añadir versión completa en inglés usando las mismas claves de contenido.
4. Medir rutas de uso y rendimiento con analítica respetuosa de privacidad, y ajustar la introducción con evidencia.
5. Evaluar futuras formaciones o certificaciones únicamente cuando exista evidencia verificable y nomenclatura oficial.

## Condición de release

El MVP se considera listo solo cuando `MVP-01` a `MVP-25` tienen evidencia o una excepción explícita, visible y justificada. “Se ve bien en mi equipo” no sustituye build, revisión de consola, teclado, móvil ni fallback de Quick View.

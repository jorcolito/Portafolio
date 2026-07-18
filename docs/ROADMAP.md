# Roadmap del MVP — JORGE.EXE

**Objetivo de entrega:** una vertical slice jugable y accesible que demuestre el concepto completo, con CarDrive como interacción de referencia y contenido básico navegable en los cinco pisos.

## Estado inicial conocido

- El repositorio parte de un starter vinext/Vite con React, TypeScript, ESLint y scripts de build/pruebas.
- La aplicación usa `app/` en la raíz; no se migrará a `src/` durante el MVP.
- Phaser debe agregarse e integrarse solo en cliente.
- No hay credenciales, URLs de perfil, correo, CV ni enlaces de proyectos confirmados.
- El primer arte se construye con Phaser Graphics, SVG/CSS originales y placeholders ligeros.

## Decisiones de alcance

| Tema | Decisión del MVP | Evolución posterior |
| --- | --- | --- |
| Mundo | Una sala lateral por cada uno de cinco pisos | Salas secundarias o secretos |
| Nivel de detalle | Lobby y Proyectos pulidos; otros pisos compactos | Igualar profundidad por piso |
| Proyecto de referencia | CarDrive | Demos integradas de SHIKO y Comernova |
| Contenido | Datos TypeScript estáticos e inmutables | CMS solo si existe necesidad real |
| Diálogos y paneles | HTML accesible sobre canvas | Retratos y audio ampliado |
| Navegación | Ascensor + Quick View | Deep links a piso/objeto |
| Guardado | Punto decorativo, sin persistencia | Recordar piso solo si mejora retorno |
| Contacto | Enlaces y formulario visual sin envío | Backend con validación y antispam |
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
- Crear tipos y datos canónicos para proyectos, educación, experiencia, tecnologías, contacto y diálogos.
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

**Resultado:** iniciar, moverse e interactuar ya se sienten como un juego web.

- Cargar Phaser únicamente tras comenzar.
- Implementar `BootScene`, texturas generadas y animaciones base.
- Implementar introducción de ascensor, opción de omitir y reducción de movimiento.
- Construir `LobbyScene`, suelo, límites, cámara y spawns.
- Crear jugador con caminar, salto y colisiones.
- Normalizar teclado y controles táctiles.
- Añadir robot, terminal, prompt contextual y diálogo reutilizable.
- Añadir fallback visible si Phaser no inicia.

**Definition of Done:**

- Enter/clic/toque inicia; omitir introducción llega al Lobby.
- Jugador camina, salta, colisiona y no sale de la sala.
- La interacción se activa una vez por pulsación.
- Diálogo soporta varias líneas, revelado inmediato, cierre y devolución de control.
- No se acumulan canvas ni listeners después de desmontar/remontar.

### M3 — Vertical slice CarDrive

**Resultado:** el recorrido principal demuestra narrativa, juego y presentación profesional de extremo a extremo.

- Crear menú HTML del ascensor y transición de piso.
- Implementar `ProjectsScene` y objeto de garaje CarDrive.
- Enlazar interacción → preludio → ficha de CarDrive.
- Añadir captura placeholder, funciones, tecnologías, estado y acciones.
- Implementar foco modal y cierre con Escape/botón.
- Implementar `PlayerLockSystem` con suspensión en aire.
- Confirmar que abrir/cerrar UI no recrea Phaser.

**Definition of Done:**

- Lobby → Ascensor → Proyectos → CarDrive funciona con teclado y táctil.
- Al abrir diálogo/ficha, el jugador queda inmóvil en suelo o aire.
- Diálogo → ficha no produce un frame desbloqueado.
- Cerrar restaura física, entrada y foco.
- CarDrive muestra “MVP en desarrollo” y links placeholder correctos.

### M4 — Contenido inicial completo

**Resultado:** los cinco pisos forman una experiencia coherente, aunque el detalle visual sea desigual a propósito.

- Añadir estaciones SHIKO y Comernova con fichas distintas.
- Crear `EducationScene` con UEES, inglés C1 y experiencia académica.
- Crear `AboutScene` con laptop, ajedrez, mapa y maleta.
- Crear `ContactScene` con terminal y panel de contacto.
- Conectar todos los pisos al mismo ascensor.
- Reflejar toda la información en Quick View.
- Añadir señales, punto de guardado decorativo y feedback de piso.

**Definition of Done:**

- Se visitan los cinco pisos y se regresa al Lobby.
- Cada objeto esencial se alcanza sin saltar.
- Los tres proyectos muestran contenido y estados correctos.
- Contacto no simula un envío ni inventa correo/URLs.
- Quick View contiene la misma información que las interacciones esenciales.

### M5 — Responsive, accesibilidad y rendimiento

**Resultado:** el MVP es usable fuera del equipo de desarrollo.

- Ajustar canvas `16:9`, `FIT`, letterboxing y resolución lógica.
- Validar móvil vertical/horizontal, tablet, laptop y desktop.
- Mostrar controles táctiles por capacidad/preferencia, no solo por ancho.
- Verificar foco, región viva, nombres accesibles, contraste y zoom al 200 %.
- Respetar `prefers-reduced-motion` y permitir sobrescritura.
- Reducir partículas, paralaje y DPR cuando sea necesario.
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
| MVP-04 | Se muestra `JORGE.EXE — A Developer's Tale` | Prueba de render o captura |
| MVP-05 | Enter, clic o toque inicia la experiencia | Prueba de interacción |
| MVP-06 | La introducción se puede omitir | Prueba con preferencia normal y reducida |
| MVP-07 | Jugador se mueve a izquierda/derecha | Prueba manual teclado/táctil |
| MVP-08 | Jugador salta y aterriza | Prueba manual |
| MVP-09 | Suelo y límites tienen colisión | Prueba manual y configuración inspeccionada |
| MVP-10 | Prompt aparece solo dentro del rango | Prueba del sistema de interacción |
| MVP-11 | Diálogo inicia, avanza, revela y termina | Prueba de componente/integración |
| MVP-12 | Ascensor abre y permite llegar a Proyectos | Prueba de flujo |
| MVP-13 | CarDrive abre su ficha completa | Prueba de flujo y contenido |
| MVP-14 | Jugador queda suspendido al abrir en salto | Prueba manual dirigida |
| MVP-15 | Modal cierra por botón y Escape | Prueba de teclado/componente |
| MVP-16 | El control vuelve sin recrear juego | Contador de instancias + prueba manual |
| MVP-17 | Quick View funciona desde portada y juego | Prueba de navegación/teclado |
| MVP-18 | SHIKO y Comernova muestran estado correcto | Prueba de datos/render |
| MVP-19 | Educación, Sobre mí y Contacto son navegables | Recorrido de cinco pisos |
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
3. **Juego:** movimiento, colisión e interacción estables.
4. **Slice:** CarDrive completo con bloqueo/restauración.
5. **Mundo:** cinco pisos y contenido básico.
6. **Acceso:** teclado, táctil, movimiento reducido y responsive.
7. **Release:** lint, TypeScript, pruebas, build y revisión visual.

## Riesgos y mitigaciones

| Riesgo | Señal temprana | Mitigación |
| --- | --- | --- |
| Phaser se evalúa durante SSR | `window is not defined` en build | Import dinámico dentro de `useEffect`; frontera cliente |
| UI y juego divergen | Estado de proyecto distinto en Quick View | IDs estables y selectores sobre `data/` |
| Modal desbloquea un frame entre vistas | Jugador cae al pasar diálogo → ficha | Overlay discriminado; nunca transicionar por `none` |
| Listeners duplicados | Interacción doble tras cambiar piso | Cleanup en `shutdown/destroy` y pruebas repetidas |
| Arte consume el calendario | Muchas piezas sin flujo funcional | Graphics/SVG/placeholders hasta cerrar M3 |
| Móvil pierde control | Personaje sigue andando tras soltar | Manejar `pointercancel`, blur y visibilidad |
| Canvas excluye usuarios | Información inaccesible con teclado/lector | DOM para overlays + Quick View equivalente |
| Assets afectan carga | Portada lenta o memoria alta | Lazy-load, presupuestos y recorte decorativo |
| Enlaces desconocidos parecen reales | Botones `#` o formularios falsos | `href: null`, estado placeholder y acción deshabilitada |
| Host de despliegue no coincide con starter | Build local pasa, destino falla | Spike y despliegue real antes de documentar soporte |

## Criterio de recorte por tiempo

Si una fecha limita el MVP, recortar en este orden:

1. partículas, paralaje y animaciones ambientales;
2. cantidad de objetos opcionales;
3. detalle visual de Educación, Sobre mí y Contacto;
4. transiciones distintas por piso;
5. audio.

No recortar Quick View, datos canónicos, CarDrive, control del foco, bloqueo/restauración, teclado ni fallbacks.

## Siguientes cinco pasos después del MVP

1. Sustituir placeholders con correo, GitHub, LinkedIn, CV, demos y repositorios confirmados.
2. Producir un set original y coherente de sprites/fondos con inventario de licencias.
3. Añadir versión completa en inglés usando las mismas claves de contenido.
4. Integrar envío de contacto con validación, privacidad, rate limiting y antispam.
5. Medir rutas de uso y rendimiento con analítica respetuosa de privacidad, y ajustar la introducción con evidencia.

## Condición de release

El MVP se considera listo solo cuando `MVP-01` a `MVP-25` tienen evidencia o una excepción explícita, visible y justificada. “Se ve bien en mi equipo” no sustituye build, revisión de consola, teclado, móvil ni fallback de Quick View.

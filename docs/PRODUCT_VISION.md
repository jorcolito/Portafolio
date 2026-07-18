# Visión de producto — JORGE.EXE

**Estado:** definición del MVP

**Producto:** `JORGE.EXE — A Developer's Tale`

**Propietario del contenido:** Jorge Colamarco

## Visión

JORGE.EXE es un portafolio web jugable: una breve exploración narrativa por un laboratorio retrofuturista donde cada sala, objeto y diálogo revela evidencia profesional de Jorge. No es un portafolio convencional con una capa visual de videojuego; la exploración es el medio principal de presentación.

La experiencia siempre ofrece una segunda ruta equivalente: **Quick View**, una interfaz HTML directa y accesible para quien necesite evaluar el perfil sin jugar.

## Problema y oportunidad

Los portafolios técnicos suelen presentar listas similares de tecnologías y proyectos. Esto dificulta demostrar criterio de producto, creatividad y capacidad de ejecución. JORGE.EXE debe convertir la presentación profesional en una muestra del propio trabajo de Jorge sin ocultar la información que necesita un reclutador.

La oportunidad es comunicar simultáneamente:

- capacidad para construir un producto real de principio a fin;
- dominio de React, TypeScript y experiencias web interactivas;
- atención a UX, accesibilidad, rendimiento y detalle narrativo;
- personalidad profesional sin sacrificar claridad.

## Audiencias y necesidad principal

| Audiencia | Necesidad | Respuesta del producto |
| --- | --- | --- |
| Reclutador con poco tiempo | Entender perfil, proyectos y contacto en 1–2 minutos | Quick View visible desde la portada |
| Equipo técnico | Ver decisiones, alcance y tecnologías con contexto | Objetos de proyecto y fichas detalladas |
| Empresa o cliente | Identificar problemas reales que Jorge puede resolver | Descripción orientada a problema, solución y estado honesto |
| Visitante explorador | Descubrir personalidad y trayectoria de forma memorable | Mundo, diálogos y objetos opcionales |
| Usuario de teclado, lector de pantalla o con sensibilidad al movimiento | Acceder a toda la información sin depender del canvas | HTML semántico, foco visible, reducción de movimiento y Quick View |

## Promesa de la primera visita

En los primeros 45 segundos, una persona debe poder:

1. identificar a Jorge Colamarco como estudiante y desarrollador de software;
2. iniciar el juego o abrir Quick View sin ambigüedad;
3. descubrir al menos un proyecto real;
4. localizar una vía clara de contacto.

## Pilares de experiencia

### 1. Explorar para descubrir

La información importante vive en objetos con intención narrativa: un vehículo representa CarDrive, una mesa de paquetes representa SHIKO y una habitación ordenada representa Comernova. Las tarjetas aparecen como detalle posterior, no como sustituto de la exploración.

### 2. Dos recorridos, una sola verdad

Juego y Quick View consumen los mismos datos tipados. Ningún dato profesional se mantiene manualmente en dos lugares. El canvas nunca es el único acceso a información esencial.

### 3. Personalidad con credibilidad

El humor es breve, sutil y relacionado con desarrollo de software. Los textos distinguen hechos, planes y trabajo en curso; no inventan métricas, clientes, resultados, credenciales ni estados de producción.

### 4. Vertical slice antes que amplitud

Lobby y Proyectos definen la calidad del producto. CarDrive es la interacción de referencia. Los otros pisos existen en el MVP como salas compactas y coherentes, sin intentar igualar todavía el detalle de la vertical slice.

### 5. Retro, original y legible

La estética combina pixel art original, laboratorio subterráneo, paneles HTML modernos y acentos azul, verde y violeta. La inspiración define el tono, no los recursos: no se copian personajes, mapas, música, tipografías, textos ni sprites protegidos.

### 6. Respeto por el tiempo y el dispositivo

La introducción se puede omitir, el audio requiere acción del usuario, el movimiento puede reducirse y la aplicación debe seguir siendo útil en móvil y hardware de gama media.

## Alcance del MVP

### Incluido

- Portada negra con `JORGE.EXE`, subtítulo, acción para comenzar y acceso inmediato a Quick View.
- Transición breve de ascensor, omitible y compatible con movimiento reducido.
- Lobby jugable con personaje, movimiento, salto, colisiones, cámara, robot, terminal, ascensor, punto de guardado decorativo y señales.
- Navegación por ascensor a Proyectos, Educación, Sobre mí y Contacto.
- Piso de Proyectos con objetos diferenciados para CarDrive, SHIKO y Comernova.
- Sistema de interacción con indicación contextual, diálogo reutilizable y ficha HTML de proyecto.
- CarDrive como interacción más pulida; SHIKO y Comernova con contenido inicial completo y presentación visual más sencilla.
- Educación, Sobre mí y Contacto como salas compactas con al menos un recorrido de interacción significativo cada una.
- Quick View completo: presentación, proyectos, tecnologías, educación, experiencia, contacto y CV.
- Controles de teclado y táctiles; cierre con Escape; botones HTML reales.
- Preferencias de sonido y reducción de movimiento; inicio sin reproducción automática.
- Diseño adaptable sin scroll horizontal, deformación del canvas ni modales fuera del viewport.
- Enlaces de demo, GitHub, LinkedIn, correo y CV como placeholders inequívocos hasta disponer de URLs reales.

### Fuera del MVP

- Combate, enemigos, vidas, daño, inventario, economía o sistema de logros.
- Persistencia real del progreso o cuentas de usuario.
- Backend del formulario de contacto.
- Editor de contenido o panel administrativo.
- Música extensa, actuación de voz o paquetes grandes de assets.
- Localización completa a inglés.
- Analítica avanzada, personalización por visitante o funciones sociales.
- Mapas grandes, plataformas de precisión o más de una sala por piso.

## Decisiones del MVP

| Decisión | Razón |
| --- | --- |
| Una sala lateral compacta por piso | Reduce carga de arte y mantiene orientación simple |
| Cinco pisos navegables, con mayor detalle en Lobby y Proyectos | Cumple la narrativa completa sin diluir la vertical slice |
| Diálogos y paneles en HTML sobre el canvas | Mejora accesibilidad, foco, selección de texto y responsive |
| Phaser se carga en cliente y bajo demanda | Evita SSR incompatible y no bloquea Quick View |
| Contenido estático, tipado y versionado | Es suficiente para un portafolio sin backend y evita duplicación |
| Una sola superposición activa | Simplifica foco, bloqueo del jugador y restauración de estado |
| Sin guardado real | La sesión es breve; el punto de guardado comunica humor, no persistencia |
| Audio desactivado hasta interacción | Respeta políticas del navegador y preferencias del visitante |
| Español como idioma inicial | Permite pulir voz y contenido; inglés queda como evolución |
| Enlaces faltantes visibles como “Próximamente” y no navegables | Evita destinos falsos o `#` ambiguos |

## Identidad y tono

- **Nombre del mundo:** Jorge Labs.
- **Fantasía:** recorrer el espacio de trabajo subterráneo donde las ideas se convierten en productos.
- **Voz:** curiosa, precisa, amable y autoconsciente.
- **Humor:** una línea ocasional; nunca desacredita el trabajo ni interrumpe una acción importante.
- **Lenguaje:** español claro, frases breves, tecnología nombrada con precisión.

Las reglas de escritura y el inventario de contenido viven en [CONTENT_GUIDE.md](./CONTENT_GUIDE.md).

## Indicadores de éxito

### Producto

- El nombre, perfil, proyecto destacado y contacto son encontrables sin jugar.
- Un visitante puede abrir CarDrive desde el inicio de la experiencia en menos de tres decisiones: comenzar, usar ascensor, interactuar.
- No existe información profesional importante exclusiva del canvas.
- Las llamadas a demo, repositorio, CV y contacto distinguen claramente entre disponible y placeholder.

### Calidad técnica

- `npm run build`, lint y comprobación de TypeScript finalizan sin errores.
- No hay errores importantes en consola durante inicio, cambio de piso, apertura/cierre de panel ni destrucción del juego.
- Abrir o cerrar una superposición no recrea la instancia de Phaser.
- El jugador permanece inmóvil —también en el aire— mientras hay una superposición bloqueante y recupera el control al cerrarla.
- La experiencia mantiene una interacción fluida en laptop y teléfono de gama media; se degradan efectos decorativos antes que contenido o controles.
- La portada y Quick View se pueden usar aunque el módulo de Phaser falle o aún no haya cargado.

## Criterios de aceptación de visión

- **PV-01:** La portada ofrece dos acciones distinguibles: comenzar y abrir Quick View.
- **PV-02:** Las cinco áreas del perfil se representan como pisos conectados por ascensor.
- **PV-03:** CarDrive, SHIKO y Comernova aparecen en juego y Quick View desde una misma fuente de datos.
- **PV-04:** Quick View contiene presentación, proyectos, tecnologías, educación, experiencia, contacto y CV.
- **PV-05:** Ningún recurso visual o sonoro depende de propiedad intelectual de otro videojuego.
- **PV-06:** El contenido esencial sigue disponible con teclado, movimiento reducido y sin audio.
- **PV-07:** El MVP no comunica como terminadas funciones, enlaces o proyectos que siguen en desarrollo.

## Principio de recorte

Si una restricción obliga a reducir alcance, se conserva en este orden: acceso a Quick View, datos profesionales, interacción CarDrive, controles y accesibilidad, navegación por ascensor, contenido de los otros pisos y, al final, decoración. Nunca se recorta la ruta accesible para proteger un efecto visual.

# Visión de producto — JORGE.EXE

**Estado:** dirección vigente del rediseño

**Producto:** `JORGE.EXE — A Developer's Tale`

**Propietario del contenido:** Jorge Colamarco

## Visión

JORGE.EXE es un portafolio web jugable: una breve exploración narrativa por un estudio retrofuturista compuesto por dioramas compactos. Cada sala funciona como una escena curada, con profundidad, luz, movimiento ambiental y objetos que revelan evidencia profesional de Jorge. No es un portafolio convencional con una capa visual de videojuego; la composición y la interacción forman parte de la presentación.

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

La información importante vive en objetos con intención narrativa: un vehículo representa CarDrive, una mesa de operación representa SHIKO y una boutique digital representa Comernova. Los objetos útiles pulsan con un contorno blanco y, al acercarse, muestran `E`; también aceptan clic o toque directo. Todos los puntos esenciales se ven al entrar o quedan a pocos pasos. Interactuar con un proyecto abre directamente su expediente, sin recorrido vacío ni texto introductorio redundante.

### 2. Dos recorridos, una sola verdad

Juego y Quick View consumen los mismos datos tipados. Ningún dato profesional se mantiene manualmente en dos lugares. El canvas nunca es el único acceso a información esencial.

### 3. Personalidad con credibilidad

El humor es breve, sutil y relacionado con desarrollo de software. Los textos distinguen hechos, planes y trabajo en curso; no inventan métricas, clientes, resultados, credenciales ni estados de producción.

### 4. Densidad antes que tamaño

Cada piso concentra de dos a cuatro focos visuales dentro de una sola composición. La sensación de vida proviene de iluminación por capas, partículas discretas, pantallas, reflejos y props animados, no de hacer la habitación más larga. Lobby y Proyectos marcan el nivel de acabado que debe propagarse al resto.

### 5. Pixel art cinematográfico, original y legible

La estética combina pixel art original, profundidad escénica, iluminación volumétrica simulada, paneles HTML modernos y acentos azul, verde y violeta. La inspiración define el tono, no los recursos: no se copian personajes, mapas, música, tipografías, textos ni sprites protegidos.

### 6. Respeto por el tiempo y el dispositivo

La introducción se puede omitir, el audio requiere acción del usuario, el movimiento puede reducirse y la aplicación debe seguir siendo útil en móvil y hardware de gama media.

## Alcance del MVP

### Incluido

- Portada negra con `JORGE.EXE`, subtítulo, acción para comenzar y acceso inmediato a Quick View.
- Transición breve de ascensor, omitible y compatible con movimiento reducido.
- Lobby jugable como diorama denso, con personaje, movimiento, colisiones, cámara contenida, bitácora, Quick View clicable, puertas directas y objetos ambientales. No contiene memoria ni punto de guardado.
- Elevador global invocable con `Q` desde cualquier punto, panel de destinos y transición breve de puertas.
- Piso de Proyectos con tres sets diferenciados para CarDrive, SHIKO y Comernova; cada interacción abre la ficha correspondiente de forma directa.
- Sistema de interacción con indicación contextual, diálogo grande reutilizable y fichas HTML de proyecto.
- Educación como biblioteca compacta: expediente UEES, Cambridge C1 Advanced con su Statement of Results verificable y una credencial AWS pendiente; los libros abren con una animación breve.
- Sobre mí como estudio personal compacto: Guayaquil se ubica dentro del mapa de Ecuador y el contenido explica cómo Jorge comprende, simplifica y entrega software. Chess.com no se duplica aquí: solo se abre desde el tablero físico.
- Contacto como escena final centrada en el escritorio de trabajo; abre correo, GitHub y LinkedIn reales. El avatar se incorporará únicamente a partir de una fotografía real de Jorge.
- Quick View en menos de un minuto: presentación, proyectos, tecnologías animadas por área, tres credenciales, método de trabajo y contacto directo; sin numeración decorativa, contadores de productos ni Chess duplicado.
- Controles de teclado y táctiles; cierre con Escape; botones HTML reales.
- Preferencias de sonido y reducción de movimiento; inicio sin reproducción automática.
- Diseño adaptable sin scroll horizontal, deformación del canvas ni modales fuera del viewport.
- Correo, GitHub, LinkedIn y Statement of Results como recursos disponibles; CV, AWS y enlaces de proyecto ausentes permanecen ocultos o inequívocamente pendientes.

### Fuera del MVP

- Combate, enemigos, inventario, economía o sistema de logros.
- Persistencia real del progreso o cuentas de usuario.
- Backend de mensajería o agenda; el MVP usa canales directos.
- Editor de contenido o panel administrativo.
- Música extensa, actuación de voz o paquetes grandes de assets.
- Localización completa a inglés.
- Analítica avanzada, personalización por visitante o funciones sociales.
- Mapas grandes, desplazamientos largos o más de una sala por piso.

## Decisiones del MVP

| Decisión | Razón |
| --- | --- |
| Un diorama compacto por piso | Cada entrada ofrece información y detalle visual sin tiempo muerto |
| Cinco pisos navegables con densidad visual consistente | Comunica la narrativa completa sin recurrir a habitaciones de relleno |
| Elevador global con `Q` | Evita obligar al visitante a regresar a una esquina y conserva una transición diegética clara |
| Contorno blanco + proximidad `E` + clic | Hace inequívoco qué parte del fondo contiene información profesional |
| Diálogos y paneles en HTML sobre el canvas | Mejora accesibilidad, foco, selección de texto y responsive |
| Proyecto → expediente directo | Evita textos introductorios diminutos y acelera la evaluación profesional |
| API de Chess.com aislada en servidor | Permite mostrar señales personales reales sin exponer secretos ni romper la experiencia cuando el servicio falla |
| Phaser se carga en cliente y bajo demanda | Evita SSR incompatible y no bloquea Quick View |
| Contenido estático, tipado y versionado | Es suficiente para un portafolio sin backend y evita duplicación |
| Una sola superposición activa | Simplifica foco, bloqueo del jugador y restauración de estado |
| Sin memoria ni guardado | La sesión es breve y no necesita simular un sistema que no existe |
| Audio desactivado hasta interacción | Respeta políticas del navegador y preferencias del visitante |
| Español como idioma inicial | Permite pulir voz y contenido; inglés queda como evolución |
| Acciones ausentes ocultas o marcadas como pendientes | Evita destinos falsos, botones muertos y ruido para el empleador |

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
- Un visitante puede abrir CarDrive desde el inicio en menos de tres decisiones: comenzar, pulsar `Q`, elegir Proyectos y abrir el vehículo por `E` o clic; no necesita recorrer una sala larga.
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
- **PV-02:** Las cinco áreas del perfil se representan como pisos conectados por un elevador global invocable con `Q`.
- **PV-03:** CarDrive, SHIKO y Comernova aparecen en juego y Quick View desde una misma fuente de datos.
- **PV-04:** Quick View contiene presentación, proyectos, tecnologías, credenciales, método de trabajo y contacto; Chess.com aparece únicamente al abrir el tablero.
- **PV-05:** Ningún recurso visual o sonoro depende de propiedad intelectual de otro videojuego.
- **PV-06:** El contenido esencial sigue disponible con teclado, movimiento reducido y sin audio.
- **PV-07:** El MVP no comunica como terminadas funciones, enlaces o proyectos que siguen en desarrollo.
- **PV-08:** Al entrar a cualquier piso, sus interacciones esenciales son visibles o alcanzables en pocos segundos.
- **PV-09:** El Statement of Results se nombra con precisión; AWS, CV y estadísticas externas ausentes muestran un estado honesto, nunca contenido inventado.
- **PV-10:** Correo, GitHub y LinkedIn conducen a los destinos confirmados, sin formulario ni falsa acción de envío.

## Principio de recorte

Si una restricción obliga a reducir alcance, se conserva en este orden: acceso a Quick View, datos profesionales, interacción CarDrive, controles y accesibilidad, navegación por elevador, contenido de los otros pisos y, al final, decoración. Nunca se recorta la ruta accesible para proteger un efecto visual.

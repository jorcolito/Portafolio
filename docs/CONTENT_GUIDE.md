# Guía de contenido — JORGE.EXE

**Propósito:** mantener una voz coherente, datos verificables y el mismo contenido en juego y Quick View.

**Idioma del MVP:** español.

**Regla principal:** el estilo narrativo puede adornar la presentación, pero nunca alterar un hecho profesional.

## Voz

JORGE.EXE habla como un producto creado por una persona curiosa y técnica:

- **claro:** una idea por frase y términos técnicos correctos;
- **cercano:** segunda persona para instrucciones y primera/tercera persona para la historia según el hablante;
- **breve:** diálogos de 1–3 líneas antes de ofrecer detalle;
- **honesto:** diferencia “en desarrollo”, “previsto” y “disponible”;
- **ingenioso:** humor ocasional sobre software, sin depender de memes ni excluir a lectores no técnicos;
- **profesional:** no exagera experiencia, impacto o nivel de dominio.

## Reglas editoriales

- Usar “Jorge” o “Jorge Colamarco”; no alternar apodos.
- Escribir tecnologías con su nombre oficial: React, TypeScript, PostgreSQL, Supabase, FastAPI, GitHub y Vercel.
- Evitar “experto”, “revolucionario”, “el mejor”, “100 % completo” y afirmaciones no verificadas.
- Preferir verbos concretos: construyó, diseñó, integró, automatiza, consolida.
- Un diálogo no supera aproximadamente 120 caracteres por línea visible; dividir ideas largas.
- Una ficha explica primero el problema y después la lista de funciones.
- Los estados de proyecto se muestran exactamente como están definidos en datos.
- No presentar funciones previstas como ya implementadas.
- No usar puntos suspensivos como sustituto de información.
- No depender de mayúsculas sostenidas para dar significado; reservarlas para rótulos visuales breves.

## Hechos canónicos

Estos datos son la fuente editorial del MVP. Cualquier cambio debe hacerse en los módulos tipados y reflejarse automáticamente en todas las vistas.

| Campo | Valor aprobado |
| --- | --- |
| Nombre | Jorge Colamarco |
| Ubicación | Guayaquil, Ecuador |
| Perfil | Estudiante de Ingeniería en Ciencias de la Computación en la UEES |
| Graduación estimada | Diciembre de 2027 |
| Idiomas | Español nativo; inglés C1 |
| Experiencia internacional | Rush Creek Lodge and Spa, California, Estados Unidos, 2025 |
| Aprendizajes de esa experiencia | Comunicación, adaptación, trabajo en equipo y atención al cliente |
| Intereses | Full stack, IA aplicada, SaaS, diseño de experiencias, automatización y productos digitales reales |

No se añade empresa cliente, cargo, duración exacta, métrica, URL o certificación específica sin confirmación de Jorge.

## Presentación principal

### Portada

```text
JORGE.EXE
A Developer's Tale
PRESIONA ENTER
```

En dispositivos táctiles, la acción visible puede decir “TOCA PARA COMENZAR”; su nombre accesible debe ser “Comenzar experiencia”.

### Resumen para Quick View

> Hola, soy Jorge Colamarco. Estudio Ingeniería en Ciencias de la Computación en la UEES y construyo productos digitales con enfoque full stack, automatización y experiencias útiles.

Este resumen puede ajustarse por espacio sin añadir años de experiencia ni especializaciones no confirmadas.

## Personajes y hablantes

### Sistema

Voz neutra para carga, estado y errores. Informa sin bromear cuando una acción falla.

Ejemplos:

- “Cargando espacio de trabajo…”
- “El laboratorio no pudo iniciar. Puedes reintentar o abrir Quick View.”
- “Demo aún no disponible.”

### Robot del Lobby

Voz literal, amable y ligeramente confundida por costumbres de desarrollo. Sus chistes son autocontenidos.

Texto canónico inicial:

```text
Bienvenido.
Jorge me construyó durante una noche larga.
Todavía no entiendo Git.
```

No convertir al robot en narrador constante. Una intervención breve es suficiente para introducir interacción.

### Voz de objetos

Observadora y compacta. Los objetos pueden hablar en tercera persona sobre Jorge, pero no afirmar intenciones o resultados no documentados.

## Catálogo inicial de diálogos

Los IDs son estables y recomendados para `data/dialogues.ts`.

| ID | Hablante | Líneas |
| --- | --- | --- |
| `lobby.robot.welcome` | Robot | “Bienvenido.” / “Jorge me construyó durante una noche larga.” / “Todavía no entiendo Git.” |
| `lobby.terminal.welcome` | Sistema | “JORGE LABS en línea.” / “Explora el laboratorio o abre Quick View cuando quieras.” |
| `lobby.save-point` | Punto de guardado | “El progreso no se guarda.” / “Pero los recuerdos sí. Eso dice el manual.” |
| `projects.cardrive.intro` | Terminal de garaje | “Un sistema para administrar vehículos, contratos, pagos y caja diaria.” / “Este prototipo responde a una operación real.” |
| `projects.shiko.intro` | Terminal SHIKO | “Aquí los pedidos y los anuncios intentan contar la misma historia.” / “El MVP todavía está en diseño y arquitectura.” |
| `projects.comernova.intro` | Terminal Comernova | “Cada producto tiene un lugar.” / “El inventario también debería tenerlo.” |
| `education.uees` | Archivo académico | “Ingeniería en Ciencias de la Computación.” / “UEES.” / “Graduación estimada: diciembre de 2027.” |
| `education.english` | Certificado | “Inglés C1.” / “Útil para documentación, equipos y conversaciones fuera del laboratorio.” |
| `education.projects` | Terminal académica | “Desarrollo web, redes, HCI y sistemas.” / “Cada curso dejó algo que construir mejor.” |
| `about.laptop` | Laptop | “Parece que Jorge pasa demasiado tiempo aquí.” / “Algunos proyectos incluso llegaron a producción.” |
| `about.chess` | Tablero de ajedrez | “Su ELO también está en desarrollo.” |
| `about.map` | Mapa | “Guayaquil, Ecuador.” / “Aquí comenzó esta partida.” |
| `about.suitcase` | Maleta | “Esta maleta viajó a California en 2025.” / “Volvió con experiencia, historias y menos miedo a hablar con desconocidos.” |
| `contact.terminal` | Sistema | “Gracias por llegar hasta aquí.” / “Ahora sí.” / “Hablemos.” |

## Proyectos

### CarDrive

- **ID:** `cardrive`
- **Resumen:** Sistema de gestión para una rentadora real de vehículos.
- **Problema que aborda:** Centralizar la operación diaria de una rentadora —vehículos, clientes, reservas, contratos, pagos y caja— para reducir información dispersa y facilitar el control administrativo.
- **Funciones:**
  - Gestión de vehículos.
  - Gestión de clientes.
  - Reservas.
  - Contratos.
  - Pagos.
  - Caja diaria.
  - Descuentos con aprobación.
  - Evidencias de pago.
  - Panel administrativo.
- **Tecnologías:** React, TypeScript, Vite, Supabase y PostgreSQL.
- **Estado exacto:** MVP en desarrollo.
- **Representación:** garaje tecnológico, vehículo, terminal y documentos digitales.
- **Alt de placeholder:** “Ilustración provisional del garaje tecnológico de CarDrive con un vehículo frente a una terminal.”

### SHIKO

- **ID:** `shiko`
- **Resumen:** Plataforma de analítica y gestión para dropshippers de Ecuador.
- **Problema que aborda:** Unificar pedidos de distintas fuentes con métricas publicitarias para que productos, combos y anuncios puedan analizarse en un mismo flujo.
- **Funciones previstas:**
  - Importación de CSV de Dropi y Rocket.
  - Detección automática del origen.
  - Consolidación de pedidos.
  - Métricas de anuncios.
  - CPA y ROAS.
  - Emparejamiento entre anuncios y productos.
  - Manejo de combos.
  - Reportes.
  - Módulo educativo.
- **Tecnologías:** mostrar solo las confirmadas en `projects.ts`; el brief no fija una lista definitiva.
- **Estado exacto:** Diseño y arquitectura del MVP.
- **Representación:** paquetes, anuncios, pantallas, gráficas y pedidos.
- **Alt de placeholder:** “Ilustración provisional del laboratorio SHIKO con paquetes y paneles de analítica.”

### Comernova

- **ID:** `comernova`
- **Resumen:** Proyecto de comercio electrónico para una tienda de productos de organización del hogar.
- **Problema que aborda:** Reunir catálogo, inventario y administración de productos en una experiencia de compra diseñada primero para móvil.
- **Funciones:**
  - Catálogo.
  - Categorías.
  - Panel administrativo.
  - Gestión de productos.
  - Inventario.
  - Integración con Supabase.
  - Diseño mobile-first.
- **Tecnologías:** React, TypeScript, Vite, Supabase y Vercel.
- **Estado exacto:** En desarrollo.
- **Representación:** habitación tecnológica perfectamente organizada.
- **Alt de placeholder:** “Ilustración provisional de Comernova con estantes modulares y productos organizados.”

### Estructura de una ficha

Orden obligatorio:

1. nombre y estado;
2. resumen;
3. problema que aborda;
4. funciones o funciones previstas;
5. tecnologías confirmadas;
6. imagen o placeholder con texto alternativo;
7. demo, GitHub y cerrar.

Usar “Funciones previstas” para SHIKO. No homogenizar las etiquetas si eso cambia el grado de avance comunicado.

## Educación

La información se descubre en el juego, pero Quick View la presenta reunida:

- Ingeniería en Ciencias de la Computación, UEES.
- Graduación estimada: diciembre de 2027.
- Inglés C1.
- Experiencia académica con desarrollo web, redes, HCI y sistemas.

No llamar “certificación” al nivel C1 si no existe un certificado identificable. El objeto del mundo puede ser un “registro de inglés” hasta confirmar la credencial.

## Sobre mí y experiencia

Objetos y función narrativa:

| Objeto | Información | Tono |
| --- | --- | --- |
| Laptop | Construcción constante de productos | Observador |
| Ajedrez | Interés personal y mejora continua | Humor breve |
| Mapa de Ecuador | Guayaquil como origen | Cálido |
| Maleta | Trabajo en Estados Unidos en 2025 | Humano y profesional |
| Cuaderno | Intereses en IA aplicada, SaaS, automatización y diseño | Curioso |

Texto para Quick View sobre experiencia:

> En 2025 trabajé en Rush Creek Lodge and Spa, en California, Estados Unidos. La experiencia fortaleció mi comunicación, adaptación, trabajo en equipo y atención al cliente.

No inferir ciudad, puesto, duración exacta ni funciones concretas a partir del nombre del lugar.

## Tecnologías

Lista canónica general, agrupable sin añadir nivel de dominio:

- **Frontend:** React, TypeScript, JavaScript, Vite, HTML y CSS.
- **Backend y datos:** Python, FastAPI, Java, SQL, PostgreSQL, Supabase y Firebase.
- **Herramientas y despliegue:** Git, GitHub y Vercel.

Evitar barras de porcentaje o etiquetas como “avanzado” si no existe un criterio verificable.

## Contacto

El panel contiene:

- correo;
- copiar correo;
- GitHub;
- LinkedIn;
- descargar CV;
- formulario visual sin envío en el MVP.

El brief no proporciona correo ni URLs. Hasta recibirlos:

- mostrar una etiqueta como “Correo pendiente de configurar”;
- deshabilitar copiar correo;
- marcar GitHub, LinkedIn y CV como “Enlace pendiente”;
- no inventar nombres de usuario, rutas, archivos o correos;
- el formulario debe decir “Vista previa: el envío se habilitará próximamente” y no simular éxito.

## Quick View

Orden recomendado de navegación:

1. Presentación.
2. Proyectos destacados.
3. Tecnologías.
4. Educación.
5. Experiencia.
6. Contacto.
7. CV.

Requisitos editoriales:

- Cada sección tiene `h2` y puede enlazarse por ancla.
- Los proyectos conservan resumen, problema, estado y funciones; no se reducen a logos.
- Un bloque inicial permite saltar directamente a proyectos o contacto.
- Los mismos placeholders y estados se usan en juego y Quick View.
- El cierre o regreso al juego es siempre visible, pero Quick View puede leerse sin cerrarlo.

## Microcopy de controles y estados

| Contexto | Texto visible | Nombre accesible recomendado |
| --- | --- | --- |
| Interacción escritorio | `E / Enter · Interactuar` | “Interactuar con {objeto}” |
| Interacción táctil | `Interactuar` | “Interactuar con {objeto}” |
| Abrir recorrido directo | `Quick View` | “Abrir vista rápida del portafolio” |
| Cerrar modal | `Cerrar` | “Cerrar {nombre del panel}” |
| Demo faltante | `Demo · Próximamente` | Botón deshabilitado; explicación asociada |
| GitHub faltante | `GitHub · Enlace pendiente` | Botón deshabilitado; explicación asociada |
| Copia correcta | `Correo copiado` | Región viva no intrusiva |
| Carga de piso | `Descendiendo al piso -1…` | Estado vivo `polite` |
| Error de juego | `No pudimos iniciar el laboratorio.` | Mensaje con “Reintentar” y “Abrir Quick View” |

## Accesibilidad del contenido

- No colocar texto importante dentro de una textura sin equivalente HTML.
- No usar color como único indicador de piso, proyecto o estado.
- Todo placeholder visual tiene alt útil; una decoración usa `alt=""`.
- Evitar ASCII art en nombres accesibles.
- Los mensajes de estado son breves y se anuncian una vez, no en bucle.
- El efecto de escritura nunca impide mostrar el texto completo.
- Los botones describen la acción y destino; evitar varios enlaces llamados solo “Ver más”.
- El contenido funciona al 200 % de zoom y con líneas que crecen por ajuste de texto.

## Propiedad intelectual

- No mencionar otros videojuegos dentro de la experiencia como si fueran parte del mundo.
- No recrear personajes, escenarios, objetos icónicos, efectos sonoros, tipografías o frases reconocibles.
- Registrar el origen de cada asset futuro.
- Los placeholders generados para el MVP deben ser originales y suficientemente distintos de cualquier referencia.

## Criterios de aceptación de contenido

- **CG-01:** Los hechos personales coinciden con la tabla canónica y no incluyen inferencias no confirmadas.
- **CG-02:** Cada proyecto tiene resumen, problema, funciones, estado, representación y alt de placeholder.
- **CG-03:** SHIKO distingue funciones previstas de funciones implementadas.
- **CG-04:** Juego y Quick View muestran el mismo estado y tecnologías para cada proyecto.
- **CG-05:** Ningún enlace, correo, CV o resultado se inventa; los faltantes se señalan y deshabilitan.
- **CG-06:** Los diálogos esenciales pueden leerse con efecto de escritura desactivado.
- **CG-07:** Los botones y enlaces tienen etiquetas específicas, no una colección ambigua de “Ver más”.
- **CG-08:** Todo texto profesional esencial tiene equivalente HTML fuera del canvas.
- **CG-09:** El contenido y los assets son originales y no imitan material protegido.

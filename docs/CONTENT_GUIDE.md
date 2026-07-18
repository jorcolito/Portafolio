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
| Intereses | Full stack, IA aplicada, SaaS, diseño de experiencias, automatización y productos digitales reales |
| Chess.com | Perfil público `jorcolito`; sus cifras se consultan desde la API y no se fijan manualmente |
| Cambridge | C1 Advanced, Statement of Results de marzo de 2023; overall score 180 y Pass at Grade C. No es el certificado formal |
| Correo | `jorgecolamarco03@gmail.com` |
| GitHub | `https://github.com/jorcolito` |
| LinkedIn | `https://www.linkedin.com/in/jorge-colamarco-a82456266/` |

No se añade empresa cliente, cargo, duración exacta, métrica, repositorio, URL o credencial específica sin confirmación de Jorge, documento verificable o una respuesta vigente de la fuente pública indicada.

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

### Bitácora del Lobby

Presenta de inmediato a Jorge y ofrece dos salidas claras: elegir una puerta o abrir Quick View. No contiene bromas sobre memoria, guardado ni un tutorial largo.

### Voz de objetos

Observadora y compacta. Los objetos pueden hablar en tercera persona sobre Jorge, pero no afirmar intenciones o resultados no documentados.

## Catálogo inicial de diálogos

Los IDs son estables y recomendados para `data/dialogues.ts`.

| ID | Hablante | Líneas |
| --- | --- | --- |
| `lobby.terminal.welcome` | JORGE.EXE | “Jorge Colamarco — desarrollador de software orientado a producto.” / “Elige una puerta o abre Quick View para ver lo esencial.” |
| `projects.*` | Expediente directo | La interacción abre la ficha; el diorama comunica el contexto. |
| `education.uees` | Libro académico | “Ingeniería en Ciencias de la Computación.” / “UEES.” / “Graduación estimada: diciembre de 2027.” |
| `education.english` | Libro de idiomas | “Cambridge C1 Advanced.” / “Statement of Results verificable; no es el certificado formal.” |
| `education.aws` | Libro cloud | “Credencial AWS.” / “Documento pendiente de verificar.” |
| `about.chess` | Tablero de ajedrez | “Abrir actividad reciente de jorcolito en Chess.com.” |
| `about.map` | Mapa | “Guayaquil, Ecuador.” / “Desde aquí estudio, construyo productos y colaboro con equipos remotos.” |
| `about.notebook` | Método | “Primero aclaro el problema y el criterio de éxito.” / “Después diseño, construyo y mejoro con evidencia.” |
| `contact.jorge` | JORGE.EXE | “¿Buscas a alguien que convierta un problema real en software útil? Hablemos.” |

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
- **Representación:** boutique digital compacta con catálogo, paquetes, inventario y pantallas de producto.
- **Alt de placeholder:** “Diorama de Comernova con catálogo digital, paquetes y panel de inventario.”

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

La información se descubre como una biblioteca en el juego y Quick View la presenta reunida:

- Ingeniería en Ciencias de la Computación, UEES.
- Graduación estimada: diciembre de 2027.
- Cambridge C1 Advanced: Statement of Results, overall score 180, Pass at Grade C, marzo de 2023.
- Credencial AWS pendiente de documento verificable.

Cada registro se representa como un libro. Al interactuar, el libro abre con una animación breve y muestra su ficha. El archivo de Cambridge es verificable, pero se nombra siempre como **Statement of Results**, no como certificado formal. AWS conserva “Documento pendiente” hasta que Jorge proporcione nombre, nivel, fecha y archivo verificables.

## Sobre mí y ajedrez

Objetos y función narrativa:

| Objeto | Información | Tono |
| --- | --- | --- |
| Método de trabajo | Comprender, simplificar y entregar con evidencia | Profesional |
| Ajedrez | Interés personal, mejora continua y actividad pública real | Preciso |
| Mapa de Ecuador | Guayaquil como origen | Cálido |
| Panel de intereses | Full stack, IA aplicada, SaaS y diseño | Profesional |

### Datos de Chess.com

- Usuario canónico: `jorcolito`.
- Rapid se etiqueta como valor actual cuando la API entrega `chess_rapid.last.rating`.
- Tactics se etiqueta como mejor rating histórico cuando la API entrega `tactics.highest.rating`; no se presenta como rating actual.
- Puzzle Rush se etiqueta como puntuación, nunca como ELO.
- Las partidas recientes muestran rival, resultado, color, modalidad, rating y enlace solo cuando esos campos existen.
- Ante error, timeout o campo ausente, ocultar la cifra y conservar el enlace al perfil público; nunca usar una cifra escrita a mano como fallback.

En la sala Sobre mí, cada objeto debe revelar una señal concreta sobre Jorge; los muebles sin función narrativa se omiten. Chess.com se abre únicamente desde el tablero y no se replica en Quick View ni en la ficha “Cómo trabajo”.

## Tecnologías

Lista canónica general, agrupable sin añadir nivel de dominio:

- **Frontend:** React, TypeScript, JavaScript, Vite, HTML y CSS.
- **Backend:** Python, FastAPI y Java.
- **Datos y servicios:** SQL, PostgreSQL, Supabase y Firebase.
- **Herramientas y despliegue:** Git, GitHub y Vercel.

La interfaz revela los grupos mediante una animación corta y derivada de la colección tipada. No escribir conteos manuales, barras de porcentaje o etiquetas como “avanzado” si no existe un criterio verificable.

## Contacto

La escena usa el escritorio y la silla como ancla provisional. No muestra una persona genérica ni un punto luminoso sin función; el avatar final espera una fotografía real de Jorge. Al interactuar, la invitación es “¿Buscas a alguien que convierta un problema real en software útil? Hablemos.”

El panel contiene únicamente destinos confirmados:

- `mailto:jorgecolamarco03@gmail.com`;
- `https://github.com/jorcolito`;
- `https://www.linkedin.com/in/jorge-colamarco-a82456266/`.

El CV permanece pendiente y no se presenta como acción disponible. No existe formulario visual ni envío simulado.

## Quick View

Navegación compacta, sin prefijos numéricos:

- Presentación.
- Proyectos.
- Tecnologías.
- Credenciales.
- Cómo trabajo.
- Contacto.

Chess.com no forma parte de Quick View; vive en el tablero. El CV pendiente tampoco se muestra como llamada a la acción.

Requisitos editoriales:

- Cada sección tiene `h2` y puede enlazarse por ancla.
- Los proyectos conservan resumen, problema, estado y funciones; no se reducen a logos.
- Un bloque inicial permite saltar directamente a proyectos o contacto.
- Tecnologías se presentan por Frontend, Backend, Datos y servicios, y Herramientas y despliegue mediante una animación corta; los conteos se derivan o se omiten.
- La biblioteca contiene solo UEES, Cambridge C1 y AWS; no se rellena con volúmenes ficticios.
- Los mismos placeholders y estados se usan en juego y Quick View.
- El cierre o regreso al juego es siempre visible, pero Quick View puede leerse sin cerrarlo.

## Microcopy de controles y estados

| Contexto | Texto visible | Nombre accesible recomendado |
| --- | --- | --- |
| Interacción escritorio | `E / Enter · Interactuar` | “Interactuar con {objeto}” |
| Interacción táctil | `Interactuar` | “Interactuar con {objeto}” |
| Llamar elevador | `Q · Elevador` | “Llamar al elevador” |
| Abrir recorrido directo | `Quick View` | “Abrir vista rápida del portafolio” |
| Cerrar modal | `Cerrar` | “Cerrar {nombre del panel}” |
| Demo faltante | `Demo · Próximamente` | Botón deshabilitado; explicación asociada |
| GitHub faltante | `GitHub · Enlace pendiente` | Botón deshabilitado; explicación asociada |
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
- **CG-05:** Correo, GitHub y LinkedIn coinciden con los destinos confirmados; CV y otros faltantes no se muestran como acciones disponibles.
- **CG-06:** Los diálogos esenciales pueden leerse con efecto de escritura desactivado.
- **CG-07:** Los botones y enlaces tienen etiquetas específicas, no una colección ambigua de “Ver más”.
- **CG-08:** Todo texto profesional esencial tiene equivalente HTML fuera del canvas.
- **CG-09:** El contenido y los assets son originales y no imitan material protegido.
- **CG-10:** Cambridge se presenta como Statement of Results verificable, nunca como certificado formal; AWS ausente permanece pendiente.
- **CG-11:** Las cifras de Chess.com conservan la semántica de la API, solo aparecen desde el tablero y desaparecen de forma segura cuando no están disponibles.
- **CG-12:** Quick View no usa prefijos numéricos, conteos decorativos, formularios falsos ni contenido de Chess.com duplicado.

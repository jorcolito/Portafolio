import type {
  PlaceholderResourceLink,
  PortfolioProject,
  ProjectId,
} from "../types";

function projectPlaceholderLink(
  projectName: string,
  kind: "demo" | "repository",
): PlaceholderResourceLink {
  const resourceLabel = kind === "demo" ? "demo" : "repositorio de GitHub";

  return {
    id: `${projectName.toLowerCase()}-${kind}-placeholder`,
    kind,
    label: kind === "demo" ? "Demo pendiente" : "GitHub pendiente",
    ariaLabel: `${resourceLabel} de ${projectName}, pendiente de enlazar`,
    availability: "placeholder",
    href: null,
    placeholderMessage: `Enlace al ${resourceLabel} de ${projectName} pendiente de proporcionar.`,
  };
}

export const PROJECTS = [
  {
    id: "cardrive",
    name: "CarDrive",
    category: "Gestión de operaciones",
    shortDescription: "Sistema de gestión para una rentadora real de vehículos.",
    description:
      "Producto diseñado para centralizar la operación diaria de una rentadora real de vehículos.",
    problemSolved:
      "Reúne la gestión de flota, clientes, reservas, contratos, cobros y caja en un solo flujo operativo, con trazabilidad para las tareas que requieren aprobación o evidencia.",
    features: [
      "Gestión de vehículos",
      "Gestión de clientes",
      "Reservas",
      "Contratos",
      "Pagos",
      "Caja diaria",
      "Descuentos con aprobación",
      "Evidencias de pago",
      "Panel administrativo",
    ],
    technologyIds: [
      "react",
      "typescript",
      "vite",
      "supabase",
      "postgresql",
    ],
    status: {
      id: "mvp-in-development",
      label: "MVP en desarrollo",
      tone: "active",
    },
    scene: {
      floorId: "projects",
      interactionId: "project-cardrive",
      concept:
        "Garaje tecnológico con un vehículo, una terminal y documentos digitales.",
      objectLabel: "Terminal del garaje CarDrive",
      accentColor: "#69e85b",
    },
    media: {
      kind: "placeholder",
      label: "Entorno interactivo",
      alt: "Representación visual del entorno de CarDrive",
    },
    links: {
      demo: projectPlaceholderLink("CarDrive", "demo"),
      repository: projectPlaceholderLink("CarDrive", "repository"),
    },
  },
  {
    id: "shiko",
    name: "SHIKO",
    category: "Analítica para comercio digital",
    shortDescription:
      "Plataforma de analítica y gestión para dropshippers de Ecuador.",
    description:
      "Plataforma orientada a consolidar pedidos y métricas publicitarias para operaciones de dropshipping en Ecuador.",
    problemSolved:
      "Reduce la fragmentación entre archivos de pedidos, productos y resultados de anuncios para facilitar decisiones operativas y de inversión.",
    features: [
      "Importación de CSV de Dropi y Rocket",
      "Detección automática del origen",
      "Consolidación de pedidos",
      "Métricas de anuncios",
      "CPA",
      "ROAS",
      "Emparejamiento entre anuncios y productos",
      "Manejo de combos",
      "Reportes",
      "Módulo educativo",
    ],
    technologyIds: [],
    technologyNote: "Stack técnico en definición para el MVP.",
    status: {
      id: "mvp-design-and-architecture",
      label: "Diseño y arquitectura del MVP",
      tone: "planning",
    },
    scene: {
      floorId: "projects",
      interactionId: "project-shiko",
      concept:
        "Laboratorio con paquetes, anuncios, pantallas, gráficas y pedidos.",
      objectLabel: "Consola de analítica SHIKO",
      accentColor: "#b56bff",
    },
    media: {
      kind: "placeholder",
      label: "Entorno interactivo",
      alt: "Representación visual del entorno de SHIKO",
    },
    links: {
      demo: projectPlaceholderLink("SHIKO", "demo"),
      repository: projectPlaceholderLink("SHIKO", "repository"),
    },
  },
  {
    id: "comernova",
    name: "Comernova",
    category: "Comercio electrónico",
    shortDescription:
      "Tienda web en producción para una marca de organización del hogar.",
    description:
      "Experiencia de comercio electrónico mobile-first, publicada y lista para recorrer desde catálogo hasta confirmación del pedido.",
    problemSolved:
      "Convierte un catálogo amplio en un flujo de compra claro: descubrimiento, filtros, carrito, entrega, método de pago y confirmación por WhatsApp.",
    features: [
      "Búsqueda y filtros por categoría",
      "Catálogo responsive",
      "Carrito y control de cantidades",
      "Selección de zona de entrega",
      "Preferencia de pago",
      "Confirmación por WhatsApp",
      "Integración con Supabase",
    ],
    technologyIds: ["react", "typescript", "vite", "supabase", "vercel"],
    status: {
      id: "live",
      label: "Disponible en producción",
      tone: "active",
    },
    scene: {
      floorId: "projects",
      interactionId: "project-comernova",
      concept: "Habitación tecnológica perfectamente organizada.",
      objectLabel: "Estación de catálogo Comernova",
      accentColor: "#39d9ef",
    },
    media: {
      kind: "gallery",
      label: "Producto en funcionamiento",
      alt: "Galería de la experiencia web de Comernova",
      images: [
        {
          id: "home",
          src: "/projects/comernova-home.webp",
          alt: "Inicio de Comernova con propuesta de organización del hogar",
          caption: "Inicio y propuesta de valor",
          width: 1270,
          height: 940,
        },
        {
          id: "catalog",
          src: "/projects/comernova-catalog.webp",
          alt: "Catálogo de Comernova con buscador, categorías y productos",
          caption: "Búsqueda, categorías y catálogo",
          width: 1295,
          height: 950,
        },
        {
          id: "cart",
          src: "/projects/comernova-cart.webp",
          alt: "Carrito de Comernova con entrega, pago y confirmación por WhatsApp",
          caption: "Carrito y confirmación del pedido",
          width: 1330,
          height: 946,
        },
      ],
    },
    links: {
      demo: {
        id: "comernova-demo",
        kind: "demo",
        label: "Visitar Comernova",
        ariaLabel: "Abrir el sitio web de Comernova en una pestaña nueva",
        availability: "available",
        href: "https://comernova.vercel.app",
      },
      repository: projectPlaceholderLink("Comernova", "repository"),
    },
  },
] as const satisfies readonly PortfolioProject[];

type ProjectIndex = {
  readonly [Id in ProjectId]: Extract<
    (typeof PROJECTS)[number],
    { readonly id: Id }
  >;
};

export const PROJECTS_BY_ID = {
  cardrive: PROJECTS[0],
  shiko: PROJECTS[1],
  comernova: PROJECTS[2],
} as const satisfies ProjectIndex;

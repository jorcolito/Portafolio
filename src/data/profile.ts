import type {
  PortfolioProfile,
  ResourceLink,
  Technology,
  TechnologyCategory,
  TechnologyGroup,
} from "../types";

export const TECHNOLOGY_CATEGORIES = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "data", label: "Datos y servicios" },
  { id: "tools-and-deployment", label: "Herramientas y despliegue" },
] as const satisfies readonly TechnologyCategory[];

export const TECHNOLOGIES = [
  { id: "react", name: "React", categoryId: "frontend" },
  { id: "typescript", name: "TypeScript", categoryId: "frontend" },
  { id: "javascript", name: "JavaScript", categoryId: "frontend" },
  { id: "vite", name: "Vite", categoryId: "frontend" },
  { id: "html", name: "HTML", categoryId: "frontend" },
  { id: "css", name: "CSS", categoryId: "frontend" },
  { id: "python", name: "Python", categoryId: "backend" },
  { id: "fastapi", name: "FastAPI", categoryId: "backend" },
  { id: "java", name: "Java", categoryId: "backend" },
  { id: "sql", name: "SQL", categoryId: "data" },
  { id: "postgresql", name: "PostgreSQL", categoryId: "data" },
  { id: "supabase", name: "Supabase", categoryId: "data" },
  { id: "firebase", name: "Firebase", categoryId: "data" },
  { id: "git", name: "Git", categoryId: "tools-and-deployment" },
  { id: "github", name: "GitHub", categoryId: "tools-and-deployment" },
  { id: "vercel", name: "Vercel", categoryId: "tools-and-deployment" },
] as const satisfies readonly Technology[];

/** Group counts are always derived from the source technology array. */
export const TECHNOLOGY_GROUPS: readonly TechnologyGroup[] =
  TECHNOLOGY_CATEGORIES.map((category) => ({
    ...category,
    technologies: TECHNOLOGIES.filter(
      (technology) => technology.categoryId === category.id,
    ),
  }));

export const CONTACT_LINKS = [
  {
    id: "contact-email",
    kind: "email",
    label: "jorgecolamarco03@gmail.com",
    ariaLabel: "Escribir a Jorge por correo electrónico",
    availability: "available",
    href: "mailto:jorgecolamarco03@gmail.com",
  },
  {
    id: "contact-github",
    kind: "github",
    label: "github.com/jorcolito",
    ariaLabel: "Abrir el perfil de Jorge en GitHub",
    availability: "available",
    href: "https://github.com/jorcolito",
  },
  {
    id: "contact-linkedin",
    kind: "linkedin",
    label: "Jorge Colamarco en LinkedIn",
    ariaLabel: "Abrir el perfil de Jorge en LinkedIn",
    availability: "available",
    href: "https://www.linkedin.com/in/jorge-colamarco-a82456266/",
  },
  {
    id: "contact-cv-placeholder",
    kind: "cv",
    label: "CV pendiente",
    ariaLabel: "Currículum pendiente de adjuntar",
    availability: "placeholder",
    href: null,
    placeholderMessage: "El archivo del CV todavía no ha sido proporcionado.",
  },
] as const satisfies readonly ResourceLink[];

export const PROFILE = {
  name: "Jorge Colamarco",
  brandName: "Jorge Colamarco",
  title: "Desarrollador de software orientado a producto",
  location: "Guayaquil, Ecuador",
  introduction:
    "Convierto problemas operativos en productos web claros, mantenibles y fáciles de usar, desde la primera conversación hasta una entrega que se puede validar.",
  summary:
    "Combino criterio de producto y ejecución full stack: entiendo la operación, tomo decisiones con intención y construyo soluciones que un equipo puede mantener y una persona puede usar sin fricción.",
  availability:
    "Disponible para conversar sobre oportunidades de desarrollo de software y colaboraciones de producto.",
  workPrinciples: [
    "Empiezo por entender la operación, escuchar a quien usará el producto y convertir una necesidad ambigua en un objetivo medible.",
    "Diseño recorridos simples y una arquitectura mantenible para que la solución sea clara hoy y pueda crecer mañana.",
    "Construyo en entregas pequeñas, valido con evidencia y comunico las decisiones para que el equipo siempre sepa qué sigue.",
  ],
  languages: [
    { id: "spanish", name: "Español", level: "Nativo" },
    { id: "english", name: "Inglés", level: "C1" },
  ],
  interests: [
    { id: "full-stack", label: "Desarrollo full stack" },
    { id: "applied-ai", label: "Inteligencia artificial aplicada" },
    { id: "saas", label: "Productos SaaS" },
    { id: "experience-design", label: "Diseño de experiencias" },
    { id: "automation", label: "Automatización" },
    {
      id: "digital-products",
      label: "Construcción de productos digitales reales",
    },
  ],
  technologyIds: TECHNOLOGIES.map((technology) => technology.id),
  contactLinks: CONTACT_LINKS,
} as const satisfies PortfolioProfile;

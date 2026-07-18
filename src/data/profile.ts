import type {
  PlaceholderResourceLink,
  PortfolioProfile,
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

export const TECHNOLOGY_GROUPS: readonly TechnologyGroup[] =
  TECHNOLOGY_CATEGORIES.map((category) => ({
    ...category,
    technologies: TECHNOLOGIES.filter(
      (technology) => technology.categoryId === category.id,
    ),
  }));

export const CONTACT_LINKS = [
  {
    id: "contact-email-placeholder",
    kind: "email",
    label: "Correo pendiente",
    ariaLabel: "Correo electrónico pendiente de confirmar",
    availability: "placeholder",
    href: null,
    placeholderMessage: "Dirección de correo pendiente de proporcionar.",
  },
  {
    id: "contact-github-placeholder",
    kind: "github",
    label: "GitHub pendiente",
    ariaLabel: "Perfil de GitHub pendiente de enlazar",
    availability: "placeholder",
    href: null,
    placeholderMessage: "URL de GitHub pendiente de proporcionar.",
  },
  {
    id: "contact-linkedin-placeholder",
    kind: "linkedin",
    label: "LinkedIn pendiente",
    ariaLabel: "Perfil de LinkedIn pendiente de enlazar",
    availability: "placeholder",
    href: null,
    placeholderMessage: "URL de LinkedIn pendiente de proporcionar.",
  },
  {
    id: "contact-cv-placeholder",
    kind: "cv",
    label: "CV pendiente",
    ariaLabel: "Currículum pendiente de adjuntar",
    availability: "placeholder",
    href: null,
    placeholderMessage: "Archivo de CV pendiente de proporcionar.",
  },
] as const satisfies readonly PlaceholderResourceLink[];

export const PROFILE = {
  name: "Jorge Colamarco",
  brandName: "JORGE.EXE",
  title: "Desarrollador de software y estudiante de Ciencias de la Computación",
  location: "Guayaquil, Ecuador",
  introduction:
    "Hola, soy Jorge Colamarco. Construyo productos digitales que convierten problemas reales en experiencias claras y útiles.",
  summary:
    "Estudiante de Ingeniería en Ciencias de la Computación en la UEES, interesado en desarrollo full stack, inteligencia artificial aplicada y creación de productos SaaS.",
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

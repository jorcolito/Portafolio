import type { Locale } from "../i18n/LocaleContext";
import type {
  DialogueId,
  DialogueSequence,
  EducationLibraryItem,
  FloorDefinition,
  PortfolioProfile,
  PortfolioProject,
  ProjectId,
  ResourceLink,
  TechnologyGroup,
} from "../types";
import { DIALOGUES } from "./dialogues";
import { EDUCATION_LIBRARY } from "./education";
import { FLOORS } from "./floors";
import {
  CONTACT_LINKS,
  PROFILE,
  TECHNOLOGIES,
  TECHNOLOGY_CATEGORIES,
} from "./profile";
import { PROJECTS } from "./projects";

type ContactCopy = {
  label: string;
  ariaLabel: string;
  placeholderMessage?: string;
};

const CONTACT_COPY_EN: Record<string, ContactCopy> = {
  "contact-email": {
    label: "jorgecolamarco03@gmail.com",
    ariaLabel: "Email Jorge Colamarco",
  },
  "contact-github": {
    label: "github.com/jorcolito",
    ariaLabel: "Open Jorge's GitHub profile",
  },
  "contact-linkedin": {
    label: "Jorge Colamarco on LinkedIn",
    ariaLabel: "Open Jorge's LinkedIn profile",
  },
  "contact-cv-placeholder": {
    label: "CV coming soon",
    ariaLabel: "CV has not been attached yet",
    placeholderMessage: "The CV file has not been provided yet.",
  },
};

function translateLink(link: ResourceLink, copy: ContactCopy): ResourceLink {
  if (link.availability === "available") {
    return { ...link, label: copy.label, ariaLabel: copy.ariaLabel };
  }
  return {
    ...link,
    label: copy.label,
    ariaLabel: copy.ariaLabel,
    placeholderMessage: copy.placeholderMessage ?? link.placeholderMessage,
  };
}

const CONTACT_LINKS_EN: readonly ResourceLink[] = CONTACT_LINKS.map((link) =>
  translateLink(link, CONTACT_COPY_EN[link.id]),
);

const TECHNOLOGY_GROUPS_EN: readonly TechnologyGroup[] =
  TECHNOLOGY_CATEGORIES.map((category) => ({
    ...category,
    label:
      category.id === "data"
        ? "Data and services"
        : category.id === "tools-and-deployment"
          ? "Tools and deployment"
          : category.label,
    technologies: TECHNOLOGIES.filter(
      (technology) => technology.categoryId === category.id,
    ),
  }));

const PROFILE_EN: PortfolioProfile = {
  ...PROFILE,
  brandName: "Jorge Colamarco",
  title: "Product-minded software developer",
  introduction:
    "I turn operational problems into clear, maintainable and easy-to-use web products, from the first conversation to a delivery that can be validated.",
  summary:
    "I combine product judgment with full-stack execution: I understand the operation, make deliberate decisions and build solutions that teams can maintain and people can use without friction.",
  availability:
    "Open to software development opportunities and product collaborations.",
  workPrinciples: [
    "I start by understanding the operation, listening to the people who will use the product and turning an ambiguous need into a measurable goal.",
    "I design simple journeys and maintainable architecture so the solution is clear today and ready to grow tomorrow.",
    "I ship in small increments, validate with evidence and communicate decisions so the team always knows what comes next.",
  ],
  languages: [
    { id: "spanish", name: "Spanish", level: "Native" },
    { id: "english", name: "English", level: "C1" },
  ],
  interests: [
    { id: "full-stack", label: "Full-stack development" },
    { id: "applied-ai", label: "Applied artificial intelligence" },
    { id: "saas", label: "SaaS products" },
    { id: "experience-design", label: "Experience design" },
    { id: "automation", label: "Automation" },
    { id: "digital-products", label: "Building real digital products" },
  ],
  contactLinks: CONTACT_LINKS_EN,
};

interface ProjectTranslation {
  category: string;
  shortDescription: string;
  description: string;
  problemSolved: string;
  features: readonly string[];
  technologyNote?: string;
  statusLabel: string;
  sceneConcept: string;
  objectLabel: string;
  mediaLabel: string;
  mediaAlt: string;
}

const PROJECT_COPY_EN: Record<ProjectId, ProjectTranslation> = {
  cardrive: {
    category: "Operations management",
    shortDescription: "Management system for a real vehicle rental company.",
    description:
      "A product designed to centralize the daily operation of a real vehicle rental company.",
    problemSolved:
      "Brings fleet, customer, reservation, contract, payment and cash management into one operational flow, with traceability for tasks that require approval or evidence.",
    features: [
      "Vehicle management",
      "Customer management",
      "Reservations",
      "Contracts",
      "Payments",
      "Daily cash control",
      "Approved discounts",
      "Payment evidence",
      "Administration dashboard",
    ],
    statusLabel: "MVP in development",
    sceneConcept:
      "A technology garage with a vehicle, an operations terminal and digital documents.",
    objectLabel: "CarDrive garage terminal",
    mediaLabel: "Interactive environment",
    mediaAlt: "Visual representation of the CarDrive environment",
  },
  shiko: {
    category: "E-commerce analytics",
    shortDescription:
      "Analytics and operations platform for dropshippers in Ecuador.",
    description:
      "A platform for consolidating orders and advertising metrics for dropshipping operations in Ecuador.",
    problemSolved:
      "Reduces fragmentation across order files, products and ad results to support better operational and investment decisions.",
    features: [
      "Dropi and Rocket CSV imports",
      "Automatic source detection",
      "Order consolidation",
      "Advertising metrics",
      "CPA",
      "ROAS",
      "Ad-to-product matching",
      "Bundle management",
      "Reports",
      "Learning module",
    ],
    technologyNote: "The technical stack is being defined for the MVP.",
    statusLabel: "MVP design and architecture",
    sceneConcept:
      "A lab with packages, ads, screens, charts and incoming orders.",
    objectLabel: "SHIKO analytics console",
    mediaLabel: "Interactive environment",
    mediaAlt: "Visual representation of the SHIKO environment",
  },
  comernova: {
    category: "E-commerce",
    shortDescription:
      "Online store for a home-organization retailer.",
    description:
      "An e-commerce project for a home-organization retailer, conceived as a mobile-first experience.",
    problemSolved:
      "Organizes catalog, inventory and product administration in a coherent shopping experience for customers and store operators.",
    features: [
      "Catalog",
      "Categories",
      "Administration dashboard",
      "Product management",
      "Inventory",
      "Supabase integration",
      "Mobile-first design",
    ],
    statusLabel: "In development",
    sceneConcept: "A perfectly organized technology-enabled room.",
    objectLabel: "Comernova catalog station",
    mediaLabel: "Interactive environment",
    mediaAlt: "Visual representation of the Comernova environment",
  },
};

function translateProjectLink(link: ResourceLink, projectName: string): ResourceLink {
  const resource = link.kind === "demo" ? "demo" : "GitHub repository";
  if (link.availability === "available") {
    return {
      ...link,
      ariaLabel: `Open the ${projectName} ${resource}`,
    };
  }
  return {
    ...link,
    label: link.kind === "demo" ? "Demo coming soon" : "GitHub coming soon",
    ariaLabel: `${projectName} ${resource} has not been linked yet`,
    placeholderMessage: `The ${projectName} ${resource} link has not been provided yet.`,
  };
}

const PROJECTS_EN: readonly PortfolioProject[] = PROJECTS.map((project) => {
  const copy = PROJECT_COPY_EN[project.id];
  return {
    ...project,
    category: copy.category,
    shortDescription: copy.shortDescription,
    description: copy.description,
    problemSolved: copy.problemSolved,
    features: copy.features,
    technologyNote: copy.technologyNote,
    status: { ...project.status, label: copy.statusLabel },
    scene: {
      ...project.scene,
      concept: copy.sceneConcept,
      objectLabel: copy.objectLabel,
    },
    media: {
      ...project.media,
      label: copy.mediaLabel,
      alt: copy.mediaAlt,
    },
    links: {
      demo: translateProjectLink(project.links.demo, project.name),
      repository: translateProjectLink(project.links.repository, project.name),
    },
  };
});

const FLOOR_COPY_EN: Record<FloorDefinition["id"], Pick<
  FloorDefinition,
  "label" | "elevatorLabel" | "description"
>> = {
  lobby: {
    label: "Lobby",
    elevatorLabel: "Lobby",
    description:
      "The starting point of Jorge Colamarco's interactive portfolio. The elevator is the room's only interactive object.",
  },
  projects: {
    label: "Projects",
    elevatorLabel: "Projects",
    description:
      "A prototype workshop where every station represents a real product.",
  },
  education: {
    label: "Education",
    elevatorLabel: "Education",
    description:
      "An academic library with UEES studies, a Cambridge C1 result, AWS Academy training and the technologies I use.",
  },
  about: {
    label: "About me",
    elevatorLabel: "About me",
    description:
      "A personal studio with my working method, my home in Guayaquil and my interest in chess.",
  },
  contact: {
    label: "Contact",
    elevatorLabel: "Contact",
    description:
      "Direct access to professional channels, without an unnecessary intermediate scene.",
  },
};

const FLOORS_EN: readonly FloorDefinition[] = FLOORS.map((floor) => ({
  ...floor,
  ...FLOOR_COPY_EN[floor.id],
}));

interface EducationTranslation {
  shelfLabel: string;
  title: string;
  summary: string;
  statusLabel: string;
  metadata: readonly string[];
  imageAlt?: string;
  resourceLabel?: string;
  resourceAriaLabel?: string;
}

const EDUCATION_COPY_EN: Record<string, EducationTranslation> = {
  "uees-degree-volume": {
    shelfLabel: "EDUCATION / UEES",
    title: "Computer Science Engineering",
    summary:
      "University studies in progress, focused on computing fundamentals and software development.",
    statusLabel: "In progress",
    metadata: [
      "Universidad Espíritu Santo (UEES)",
      "Guayaquil, Ecuador",
      "Expected graduation: December 2027",
    ],
  },
  "english-c1-volume": {
    shelfLabel: "ENGLISH / CAMBRIDGE",
    title: "Cambridge C1 Advanced · Statement of Results",
    summary:
      "Official Cambridge English result at CEFR C1 level. The attached document is a Statement of Results, not the formal certificate.",
    statusLabel: "Verified · C1",
    metadata: ["Overall score: 180", "Pass at Grade C", "March 2023"],
    imageAlt: "Preview of the Cambridge C1 Advanced Statement of Results",
    resourceLabel: "Open Statement of Results",
    resourceAriaLabel: "Open the Cambridge C1 Advanced Statement of Results",
  },
  "aws-certificate-volume": {
    shelfLabel: "AWS ACADEMY / DATA",
    title: "AWS Academy Data Engineering Training",
    summary:
      "AWS Academy Data Engineering training completed. The available evidence is a training completion badge, not an AWS professional certification.",
    statusLabel: "Completed · badge available",
    metadata: ["AWS Academy", "Data Engineering", "Training badge"],
    imageAlt: "AWS Academy Data Engineering Trained badge",
    resourceLabel: "Open badge",
    resourceAriaLabel: "Open the AWS Academy Data Engineering Trained badge",
  },
};

const EDUCATION_LIBRARY_EN: readonly EducationLibraryItem[] =
  EDUCATION_LIBRARY.map((rawItem) => {
    const item: EducationLibraryItem = rawItem;
    const copy = EDUCATION_COPY_EN[item.id];
    const evidenceImage = item.evidenceImage
      ? { ...item.evidenceImage, alt: copy.imageAlt ?? item.evidenceImage.alt }
      : undefined;
    const resource = item.resource
      ? translateLink(item.resource, {
          label: copy.resourceLabel ?? item.resource.label,
          ariaLabel: copy.resourceAriaLabel ?? item.resource.ariaLabel,
          placeholderMessage:
            item.resource.availability === "placeholder"
              ? "This document will be published when verifiable evidence is available."
              : undefined,
        })
      : null;

    return {
      ...item,
      shelfLabel: copy.shelfLabel,
      title: copy.title,
      summary: copy.summary,
      statusLabel: copy.statusLabel,
      metadata: copy.metadata,
      evidenceImage,
      resource,
    };
  });

const DIALOGUE_COPY_EN: Record<
  DialogueId,
  { readonly speaker?: string; readonly lines: readonly string[] }
> = {
  "cardrive-introduction": {
    lines: [
      "One terminal controls the entire garage.",
      "CarDrive organizes the daily operation of a real vehicle rental company.",
      "The project dossier contains the rest of the system.",
    ],
  },
  "shiko-introduction": {
    lines: [
      "Orders, ads and products arrive from different sources.",
      "SHIKO aims to turn that operational noise into useful metrics for dropshippers in Ecuador.",
    ],
  },
  "comernova-introduction": {
    lines: [
      "Everything appears to be exactly where it belongs.",
      "Comernova brings that same clarity to a home-organization store.",
    ],
  },
  "uees-record": {
    speaker: "ACADEMIC RECORD",
    lines: [
      "Computer Science Engineering — UEES.",
      "Expected graduation: December 2027.",
    ],
  },
  "english-certificate": {
    speaker: "ACADEMIC RECORD",
    lines: [
      "Cambridge C1 Advanced · Statement of Results.",
      "Official CEFR C1 result with an Overall Score of 180 and Grade C. The document shown is the Statement of Results, not the formal certificate.",
    ],
  },
  "aws-certificate": {
    speaker: "ACADEMIC RECORD",
    lines: [
      "AWS Academy Data Engineering training completed.",
      "The available evidence is the AWS Academy Data Engineering Trained badge: it confirms completed training, but it is not an AWS professional certification.",
    ],
  },
  "studied-technologies": {
    lines: [
      "Frontend, backend, data and deployment share this workstation.",
      "Technology changes; understanding the problem remains the important part.",
    ],
  },
  "work-method": {
    lines: [
      "Before choosing technology, I understand the person, the operation and the outcome we need to achieve.",
      "Then I turn that clarity into a simple flow, a maintainable technical foundation and small deliveries the team can review.",
      "Building well matters as much as explaining why: I document decisions, ask for feedback early and leave the product ready to grow.",
    ],
  },
  "ecuador-map": {
    lines: [
      "Guayaquil, Ecuador.",
      "This is where I study, build products and collaborate with remote teams.",
    ],
  },
};

const DIALOGUES_EN: readonly DialogueSequence[] = DIALOGUES.map((rawDialogue) => {
  const dialogue: DialogueSequence = rawDialogue;
  const copy = DIALOGUE_COPY_EN[dialogue.id];
  return {
    ...dialogue,
    lines: dialogue.lines.map((line, index) => ({
      ...line,
      text: copy.lines[index] ?? line.text,
      speaker: copy.speaker ?? line.speaker,
    })),
  };
});

export interface LocalizedPortfolioContent {
  profile: PortfolioProfile;
  contactLinks: readonly ResourceLink[];
  technologyGroups: readonly TechnologyGroup[];
  projects: readonly PortfolioProject[];
  floors: readonly FloorDefinition[];
  educationLibrary: readonly EducationLibraryItem[];
  dialogues: readonly DialogueSequence[];
}

const CONTENT_ES: LocalizedPortfolioContent = {
  profile: PROFILE,
  contactLinks: CONTACT_LINKS,
  technologyGroups: TECHNOLOGY_CATEGORIES.map((category) => ({
    ...category,
    technologies: TECHNOLOGIES.filter(
      (technology) => technology.categoryId === category.id,
    ),
  })),
  projects: PROJECTS,
  floors: FLOORS,
  educationLibrary: EDUCATION_LIBRARY,
  dialogues: DIALOGUES,
};

const CONTENT_EN: LocalizedPortfolioContent = {
  profile: PROFILE_EN,
  contactLinks: CONTACT_LINKS_EN,
  technologyGroups: TECHNOLOGY_GROUPS_EN,
  projects: PROJECTS_EN,
  floors: FLOORS_EN,
  educationLibrary: EDUCATION_LIBRARY_EN,
  dialogues: DIALOGUES_EN,
};

export function getLocalizedContent(locale: Locale): LocalizedPortfolioContent {
  return locale === "en" ? CONTENT_EN : CONTENT_ES;
}

export function getLocalizedDialogue(
  locale: Locale,
  dialogueId: DialogueId,
): DialogueSequence {
  const content = getLocalizedContent(locale);
  return (
    content.dialogues.find((dialogue) => dialogue.id === dialogueId) ??
    content.dialogues[0]
  );
}

export function getLocalizedProject(
  locale: Locale,
  projectId: ProjectId,
): PortfolioProject {
  const content = getLocalizedContent(locale);
  return (
    content.projects.find((project) => project.id === projectId) ??
    content.projects[0]
  );
}

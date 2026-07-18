export type ResourceLinkKind =
  | "demo"
  | "repository"
  | "certificate"
  | "email"
  | "github"
  | "linkedin"
  | "cv";

interface ResourceLinkBase {
  readonly id: string;
  readonly kind: ResourceLinkKind;
  readonly label: string;
  readonly ariaLabel: string;
}

export interface AvailableResourceLink extends ResourceLinkBase {
  readonly availability: "available";
  readonly href: string;
}

/**
 * A deliberately non-navigable resource. Keeping href as null prevents a
 * placeholder from becoming a broken or misleading link in either UI.
 */
export interface PlaceholderResourceLink extends ResourceLinkBase {
  readonly availability: "placeholder";
  readonly href: null;
  readonly placeholderMessage: string;
}

export type ResourceLink = AvailableResourceLink | PlaceholderResourceLink;

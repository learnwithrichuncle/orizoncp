import {
  AiBrain01Icon,
  ApiIcon,
  CloudUploadIcon,
  DatabaseExportIcon,
  GithubIcon,
  Globe02Icon,
  HardDriveIcon,
  Key02Icon,
  Queue02Icon,
  Refresh03Icon,
  UserGroupIcon
} from "@hugeicons/core-free-icons";

export const systemSettingsTabValues = [
  "root-domain",
  "dns",
  "github",
  "ai",
  "api-access",
  "users",
  "storage",
  "migration",
  "maintenance",
  "deployments",
  "updates"
] as const;

export type SystemSettingsTab = (typeof systemSettingsTabValues)[number];

export const settingsPageSlugs = [
  "domains",
  "dns",
  "github",
  "ai",
  "api-access",
  "users",
  "storage",
  "migration",
  "maintenance",
  "deployments",
  "updates"
] as const;

export type SettingsPageSlug = (typeof settingsPageSlugs)[number];

export type SettingsPageDefinition = {
  slug: SettingsPageSlug;
  tab: SystemSettingsTab;
  label: string;
  icon: unknown;
  ownerOnly: boolean;
};

export const settingsPages: SettingsPageDefinition[] = [
  { slug: "ai", tab: "ai", label: "AI Models", icon: AiBrain01Icon, ownerOnly: false },
  { slug: "api-access", tab: "api-access", label: "API Tokens", icon: Key02Icon, ownerOnly: false },
  { slug: "dns", tab: "dns", label: "DNS Zones", icon: ApiIcon, ownerOnly: true },
  { slug: "domains", tab: "root-domain", label: "Hostnames", icon: Globe02Icon, ownerOnly: true },
  { slug: "maintenance", tab: "maintenance", label: "Operations", icon: HardDriveIcon, ownerOnly: true },
  { slug: "deployments", tab: "deployments", label: "Releases", icon: Queue02Icon, ownerOnly: true },
  { slug: "github", tab: "github", label: "Repositories", icon: GithubIcon, ownerOnly: true },
  { slug: "users", tab: "users", label: "Team", icon: UserGroupIcon, ownerOnly: true },
  { slug: "migration", tab: "migration", label: "Transfer", icon: DatabaseExportIcon, ownerOnly: true },
  { slug: "updates", tab: "updates", label: "Upgrades", icon: Refresh03Icon, ownerOnly: true },
  { slug: "storage", tab: "storage", label: "Volumes", icon: CloudUploadIcon, ownerOnly: false }
];

export function isSettingsPageSlug(value: unknown): value is SettingsPageSlug {
  return typeof value === "string" && settingsPageSlugs.includes(value as SettingsPageSlug);
}

export function settingsPageForSlug(slug: SettingsPageSlug) {
  return settingsPages.find((page) => page.slug === slug) ?? settingsPages[0];
}

export function settingsPageForTab(tab: SystemSettingsTab = "root-domain") {
  return settingsPages.find((page) => page.tab === tab) ?? settingsPages[0];
}

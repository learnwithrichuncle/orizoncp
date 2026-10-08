import { useSyncExternalStore, type ReactNode } from "react";
import { settingsPages } from "../../features/settings/settings-pages";
import {
  getServiceNav,
  subscribeServiceNav
} from "../../features/services/service-nav-store";

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="sidebar-nav-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color="currentColor"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons: Record<string, ReactNode> = {
  "/": (
    <NavIcon>
      <rect x="4" y="4" width="7" height="7" rx="2" fill="currentColor" opacity=".45" />
      <rect x="13" y="4" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="4" y="13" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="13" y="13" width="7" height="7" rx="2" fill="currentColor" opacity=".45" />
    </NavIcon>
  ),
  "/projects": (
    <NavIcon>
      <path d="M3.5 6.5A2 2 0 0 1 5.5 4.5h3.6c.5 0 1 .2 1.4.6l1.1 1.1c.4.4.9.6 1.4.6h5.5a2 2 0 0 1 2 2v7.7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V6.5Z" fill="currentColor" opacity=".45" />
      <path d="M3.5 6.5A2 2 0 0 1 5.5 4.5h3.6c.5 0 1 .2 1.4.6l1.1 1.1c.4.4.9.6 1.4.6h5.5a2 2 0 0 1 2 2v7.7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </NavIcon>
  ),
  "/deployments": (
    <NavIcon>
      <path
        d="M11.8013 6.48949L13.2869 5.00392C14.9596 3.3312 17.1495 2.63737 19.4671 2.52399C20.3686 2.47989 20.8193 2.45784 21.1807 2.81928C21.5422 3.18071 21.5201 3.63143 21.476 4.53289C21.3626 6.8505 20.6688 9.04042 18.9961 10.7131L17.5105 12.1987C16.2871 13.4221 15.9393 13.77 16.1961 15.097C16.4496 16.1107 16.6949 17.0923 15.9578 17.8294C15.0637 18.7235 14.2481 18.7235 13.354 17.8294L6.17058 10.646C5.27649 9.75188 5.27646 8.9363 6.17058 8.04219C6.90767 7.30509 7.88929 7.55044 8.90297 7.80389C10.23 8.06073 10.5779 7.71289 11.8013 6.48949Z"
        fill="currentColor"
        fillOpacity=".45"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M16.9959 7H17.0049" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M2.5 21.5L7.5 16.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M8.5 21.5L10.5 19.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" opacity=".45" />
      <path d="M2.5 15.5L4.5 13.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" opacity=".45" />
    </NavIcon>
  ),
  "/infrastructure": (
    <NavIcon>
      <rect x="3" y="4" width="18" height="7" rx="2" fill="currentColor" opacity=".4" />
      <rect x="3" y="13" width="18" height="7" rx="2" fill="currentColor" />
      <circle cx="7" cy="7.5" r="1.25" fill="#090909" opacity=".85" />
      <circle cx="7" cy="16.5" r="1.25" fill="#090909" opacity=".85" />
      <rect x="11" y="15.7" width="6" height="1.6" rx=".5" fill="#090909" opacity=".55" />
    </NavIcon>
  ),
  "/forge": (
    <NavIcon>
      <path d="M12 2c1.8 1.2 2.8 2.9 2.8 5v4.6l2.4 1.2v2.7L12 17l-5.2-1.5v-2.7l2.4-1.2V7c0-2.1 1-3.8 2.8-5Z" fill="currentColor" opacity=".45" />
      <path d="M12 2c1.8 1.2 2.8 2.9 2.8 5v4.6l2.4 1.2v2.7L12 17l-5.2-1.5v-2.7l2.4-1.2V7c0-2.1 1-3.8 2.8-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 17v5M8.5 20.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </NavIcon>
  ),
  "/databases": (
    <NavIcon>
      <ellipse cx="9.25" cy="5.75" rx="5.75" ry="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 5.75v6c0 1.38 2.58 2.5 5.75 2.5 1.14 0 2.2-.14 3.1-.4M3.5 11.75v5.75c0 1.38 2.58 2.5 5.75 2.5.78 0 1.52-.07 2.18-.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 11.75c0 1.38 2.58 2.5 5.75 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <circle cx="16.75" cy="16.5" r="3.25" stroke="currentColor" strokeWidth="2" opacity=".8" />
      <path d="m19.1 18.85 1.65 1.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".8" />
    </NavIcon>
  ),
  "/domains": (
    <NavIcon>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="2" />
      <path d="M3.75 12h16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <path d="M12 3.75c2.05 2.25 3.15 5.1 3.15 8.25S14.05 18 12 20.25C9.95 18 8.85 15.15 8.85 12S9.95 6 12 3.75Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </NavIcon>
  ),
  "/emails": (
    <NavIcon>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="m3.5 8.5 8.5 5.75L20.5 8.5" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </NavIcon>
  ),
  "/mailboxes": (
    <NavIcon>
      <path d="M4 8h16v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V8Z" fill="currentColor" opacity=".45" />
      <path d="M4 8 7.5 3h9L20 8" fill="currentColor" />
      <path d="M4 13h4l2 3h4l2-3h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </NavIcon>
  ),
  "/migrations": (
    <NavIcon>
      <path d="M7 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m15.5 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 16H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <path d="m8.5 12.5-3.5 3.5 3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
    </NavIcon>
  ),
  "/cdn": (
    <NavIcon>
      <path d="M7 18h11a4 4 0 0 0 .4-8 6 6 0 0 0-11.5-1.5A4.5 4.5 0 0 0 7 18Z" fill="currentColor" opacity=".45" />
      <path d="M7 18h11a4 4 0 0 0 .4-8 6 6 0 0 0-11.5-1.5A4.5 4.5 0 0 0 7 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </NavIcon>
  ),
  "/team": (
    <NavIcon>
      <g transform="translate(5.25 0) scale(0.78)">
        <path opacity=".4" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" fill="currentColor" />
        <path d="M12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z" fill="currentColor" />
      </g>
      <g transform="translate(-1.5 1.25) scale(0.78)">
        <path opacity=".4" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" fill="currentColor" />
        <path d="M12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z" fill="currentColor" />
      </g>
    </NavIcon>
  ),
  "/agency": (
    <NavIcon>
      <path d="M4 20.5h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <path d="M6.5 20.5V8.5L12 5l5.5 3.5v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="9.5" y="11" width="2.25" height="2.25" rx=".4" fill="currentColor" />
      <rect x="12.25" y="11" width="2.25" height="2.25" rx=".4" fill="currentColor" opacity=".8" />
      <rect x="9.5" y="14.75" width="2.25" height="2.25" rx=".4" fill="currentColor" opacity=".8" />
      <rect x="12.25" y="14.75" width="2.25" height="2.25" rx=".4" fill="currentColor" />
    </NavIcon>
  ),
  "/cron": (
    <NavIcon>
      <path d="M18.2 17.75A8.2 8.2 0 1 1 18.15 6.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7.3v5.05l3.15 1.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.45 8.4c.32.72.52 1.48.62 2.25m-.02 2.55a8 8 0 0 1-.75 2.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".8" />
    </NavIcon>
  ),
  "/integrations": (
    <NavIcon>
      <path d="M10 13a5 5 0 0 0 7.07 0l1.42-1.42a5 5 0 0 0-7.08-7.07L9.76 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.08 0L5.5 12.42a5 5 0 0 0 7.07 7.07L14.24 17.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
    </NavIcon>
  ),
  "/api-keys": (
    <NavIcon>
      <circle cx="8" cy="15" r="4" fill="currentColor" opacity=".45" />
      <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="15" r="1.4" fill="currentColor" />
      <path d="m11 12 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 5l2 2M14.5 7.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".45" />
    </NavIcon>
  ),
  "/environment": (
    <NavIcon>
      <rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor" opacity=".45" />
      <rect x="5" y="11" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="16" r="1.4" fill="currentColor" />
    </NavIcon>
  ),
  "/settings": (
    <NavIcon>
      <path opacity=".4" d="M2 12.881v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.899 1.899 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9Z" fill="currentColor" />
      <path d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" fill="currentColor" />
    </NavIcon>
  ),
  "/billing": (
    <NavIcon>
      <path d="M5 5.5h14a2.5 2.5 0 0 1 2.5 2.5v1.25H2.5V8A2.5 2.5 0 0 1 5 5.5Z" fill="currentColor" />
      <rect x="2.5" y="9.25" width="19" height="3.5" fill="currentColor" opacity=".4" />
      <path d="M2.5 12.75H21.5V16a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 16v-3.25Z" fill="currentColor" />
    </NavIcon>
  ),
  "/settings/ai": (
    <NavIcon>
      <path d="M11.5 3.75c.6 3 2.15 4.55 5.15 5.15-3 .6-4.55 2.15-5.15 5.15-.6-3-2.15-4.55-5.15-5.15 3-.6 4.55-2.15 5.15-5.15Z" fill="currentColor" opacity=".45" />
      <path d="M11.5 3.75c.6 3 2.15 4.55 5.15 5.15-3 .6-4.55 2.15-5.15 5.15-.6-3-2.15-4.55-5.15-5.15 3-.6 4.55-2.15 5.15-5.15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 14.25c.3 1.5 1.05 2.25 2.55 2.55-1.5.3-2.25 1.05-2.55 2.55-.3-1.5-1.05-2.25-2.55-2.55 1.5-.3 2.25-1.05 2.55-2.55Z" fill="currentColor" />
    </NavIcon>
  ),
  "/settings/dns": (
    <NavIcon>
      <circle cx="12" cy="5" r="2" fill="currentColor" opacity=".45" />
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5.5" cy="18" r="2" fill="currentColor" opacity=".45" />
      <circle cx="5.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="18.5" cy="18" r="2" fill="currentColor" opacity=".45" />
      <circle cx="18.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7v3.5M12 10.5 6.5 16M12 10.5 17.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
    </NavIcon>
  ),
  "/settings/maintenance": (
    <NavIcon>
      <path d="M4.5 16.5a7.5 7.5 0 1 1 15 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M4.5 16.5h15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".5" />
      <path d="M12 16.5 16 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.6" fill="currentColor" />
    </NavIcon>
  ),
  "/settings/github": (
    <NavIcon>
      <circle cx="7" cy="6" r="2.25" fill="currentColor" opacity=".45" />
      <circle cx="7" cy="6" r="2.25" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7" cy="18" r="2.25" fill="currentColor" opacity=".45" />
      <circle cx="7" cy="18" r="2.25" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="12" r="2.25" fill="currentColor" />
      <circle cx="17" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 8.25v7.5M7 12h7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
    </NavIcon>
  ),
  "/settings/updates": (
    <NavIcon>
      <path d="M12 3.75v10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m7.5 9.75 4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M4.75 19.25h14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".5" />
    </NavIcon>
  ),
};

icons["/settings/api-access"] = icons["/api-keys"];
icons["/settings/domains"] = icons["/domains"];
icons["/settings/deployments"] = icons["/deployments"];
icons["/settings/users"] = icons["/team"];
icons["/settings/migration"] = icons["/migrations"];
icons["/settings/storage"] = icons["/databases"];

type NavLink = { href: string; label: string; badge?: string };

const sections: NavLink[][] = [
  [
    { href: "/", label: "Overview" },
    { href: "/projects", label: "Projects" },
    { href: "/deployments", label: "Deployments" },
  ],
  [
    { href: "/databases", label: "Database" },
    { href: "/domains", label: "Domain" },
    { href: "/migrations", label: "Migrate" },
  ],
  [{ href: "/settings", label: "Settings" }],
];

const SERVICE_NAV = [
  { segment: "overview", label: "Overview" },
  { segment: "deployments", label: "Deployments" },
  { segment: "logs", label: "Logs" },
  { segment: "variables", label: "Variables" },
  { segment: "domains", label: "Domains" },
  { segment: "settings", label: "Settings" }
] as const;

const serviceTabIcons: Record<string, ReactNode> = {
  overview: icons["/"],
  deployments: icons["/deployments"],
  logs: (
    <NavIcon>
      <path d="M4 5.5h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".5" />
      <path d="M4 10h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 14.5h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".7" />
      <path d="M4 19h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".5" />
    </NavIcon>
  ),
  variables: (
    <NavIcon>
      <path d="M9.5 4.5C7.5 4.5 7 5.5 7 7.5v2c0 1.5-.5 2.5-2 2.5 1.5 0 2 1 2 2.5v2c0 2 .5 3 2.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M14.5 4.5c2 0 2.5 1 2.5 3v2c0 1.5.5 2.5 2 2.5-1.5 0-2 1-2 2.5v2c0 2-.5 3-2.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </NavIcon>
  ),
  domains: icons["/domains"],
  "source-code": (
    <NavIcon>
      <path d="M9 8 5 12l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="m15 8 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="m13.5 6-3 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".6" />
    </NavIcon>
  ),
  data: icons["/databases"],
  console: (
    <NavIcon>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="m7.5 9 2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12.5 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </NavIcon>
  ),
  backups: (
    <NavIcon>
      <path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z" fill="currentColor" opacity=".45" />
      <path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="m4 7.5 8 3.5 8-3.5M12 11v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </NavIcon>
  ),
  settings: icons["/settings"]
};

function NavItem({ href, label, badge, active }: NavLink & { active: boolean }) {
  return (
    <li data-sidebar="menu-item" className="group/menu-item relative list-none">
      <a
        data-sidebar="menu-button"
        data-size="default"
        data-active={active ? "true" : "false"}
        data-tour={href}
        href={href}
        data-status={active ? "active" : undefined}
        aria-current={active ? "page" : undefined}
        className={`peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate h-9 text-sm flex flex-row items-center px-2 transition-colors ${
          active
            ? "bg-black/5 text-neutral-100 shadow-xs dark:bg-white/10 dark:text-white active"
            : "text-neutral-400 hover:text-neutral-100 dark:text-neutral-400 dark:hover:text-white"
        }`}
      >
        <span className="sidebar-nav-icon flex shrink-0 items-center justify-center overflow-visible">
          {icons[href]}
        </span>
        <span className="relative ml-2 overflow-visible! text-sm font-medium group-data-[collapsible=icon]:hidden">
          {label}
        </span>
        {badge ? (
          <span className="ml-auto shrink-0 bg-blue-600 px-1.5 py-px text-[8.5px] font-semibold uppercase tracking-wide text-white group-data-[collapsible=icon]:hidden">
            {badge}
          </span>
        ) : null}
      </a>
    </li>
  );
}

export function AppSidebar() {
  const path =
    typeof window === "undefined" ? "/" : window.location.pathname;
  const onSettings = path.startsWith("/settings");
  const segments = path.split("/").filter(Boolean);
  const knownTop = [
    "settings",
    "onboarding",
    "login",
    "svgs",
    "projects",
    "deployments",
    "databases",
    "domains",
    "migrations",
    "cdn",
    "billing",
    "notifications"
  ];
  const projectSlug =
    segments[0] && !knownTop.includes(segments[0]) ? segments[0] : null;
  const serviceSlug = projectSlug && segments[1] ? segments[1] : null;
  const onService = Boolean(projectSlug && serviceSlug);
  const activeServiceTab = onService ? segments[2] ?? "overview" : "overview";
  const serviceNavItems = useSyncExternalStore(
    subscribeServiceNav,
    getServiceNav,
    getServiceNav
  );

  function isActive(href: string) {
    if (href === "/") return path === "/";
    if (href === "/projects") {
      return (
        path === "/projects" ||
        path.startsWith("/projects/") ||
        (!path.startsWith("/settings") &&
          !path.startsWith("/onboarding") &&
          !path.startsWith("/login") &&
          path !== "/" &&
          path !== "/svgs" &&
          path !== "/deployments" &&
          path !== "/databases" &&
          path !== "/domains" &&
          path !== "/migrations" &&
          path !== "/cdn" &&
          path !== "/billing")
      );
    }
    return path === href || path.startsWith(`${href}/`);
  }

  return (
    <div className="group fixed inset-y-0 left-0 z-40 hidden h-svh w-[220px] transition-[left,right,width] duration-200 ease-linear md:flex">
      <div
        data-sidebar="sidebar"
        className="relative flex h-full w-full flex-col bg-neutral-950"
      >
        <div
          data-sidebar="header"
          className="flex flex-row items-center justify-between gap-2 p-2 md:pt-3.5"
        >
          <div className="relative flex flex-row items-center">
            <a
              className="flex items-center text-[15px] font-semibold leading-tight tracking-tight text-white"
              href="/"
            >
              <svg
                className="mr-[1px] h-[1.15em] w-[1.15em] translate-y-[0.06em] text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id="ring-orzn-logo">
                    <circle cx="12" cy="12" r="9" />
                  </clipPath>
                  <clipPath id="top-orzn-logo">
                    <rect x="0" y="0" width="24" height="13.4" />
                  </clipPath>
                </defs>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
                <g clipPath="url(#ring-orzn-logo)">
                  <g clipPath="url(#top-orzn-logo)">
                    <circle cx="12" cy="13.5" r="4" fill="currentColor" />
                  </g>
                  <line x1="3" y1="13.4" x2="21" y2="13.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </g>
              </svg>
              <span className="group-data-[collapsible=icon]:hidden">rizon</span>
            </a>
          </div>
        </div>

        <div
          data-sidebar="content"
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-2 py-4 group-data-[collapsible=icon]:overflow-hidden"
        >
          <div className="flex flex-col gap-2">
            {!onSettings && !onService
              ? sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="flex flex-col gap-1">
                {sectionIndex > 0 ? (
                  <div
                    data-orientation="horizontal"
                    role="none"
                    className="my-1 h-px w-full shrink-0 bg-neutral-800"
                  />
                ) : null}
                <ul
                  data-sidebar="menu"
                  className="sidebar-nav m-0 flex w-full min-w-0 list-none flex-col gap-1 p-0"
                >
                  {section.map((item) => (
                    <NavItem key={item.href} {...item} active={isActive(item.href)} />
                  ))}
                </ul>
              </div>
            ))
              : null}

            {onSettings ? (
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex h-9 w-full flex-row items-center rounded-md px-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span className="sidebar-nav-icon flex shrink-0 items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 12H5M5 12l6-6M5 12l6 6" />
                  </svg>
                </span>
                <span className="relative ml-2 truncate">Back</span>
              </button>
              <div
                data-orientation="horizontal"
                role="none"
                className="my-1 h-px w-full shrink-0 bg-neutral-800"
              />
              <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Settings
              </div>
              <ul
                data-sidebar="menu"
                className="sidebar-nav m-0 flex w-full min-w-0 list-none flex-col gap-1 p-0"
              >
                {settingsPages.map((page) => {
                  const href = `/settings/${page.slug}`;
                  const active = isActive(href);
                  return (
                    <li
                      key={page.slug}
                      data-sidebar="menu-item"
                      className="group/menu-item relative list-none"
                    >
                      <a
                        href={href}
                        data-active={active ? "true" : "false"}
                        data-tour={href}
                        aria-current={active ? "page" : undefined}
                        className={`peer/menu-button flex h-9 w-full flex-row items-center rounded-md px-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-white/10 text-white shadow-xs"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        <span className="sidebar-nav-icon flex shrink-0 items-center justify-center overflow-visible">
                          {icons[href]}
                        </span>
                        <span className="relative ml-2 truncate">
                          {page.label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            ) : null}

            {onService ? (
            <div className="flex flex-col gap-1">
              <div
                data-orientation="horizontal"
                role="none"
                className="my-1 h-px w-full shrink-0 bg-neutral-800"
              />
              <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Service
              </div>
              <ul
                data-sidebar="menu"
                className="sidebar-nav m-0 flex w-full min-w-0 list-none flex-col gap-1 p-0"
              >
                {(serviceNavItems.length > 0 ? serviceNavItems : SERVICE_NAV).map((tab) => {
                  const href = `/${projectSlug}/${serviceSlug}/${tab.segment}`;
                  const active = activeServiceTab === tab.segment;
                  return (
                    <li
                      key={tab.segment}
                      data-sidebar="menu-item"
                      className="group/menu-item relative list-none"
                    >
                      <a
                        href={href}
                        data-active={active ? "true" : "false"}
                        data-tour={href}
                        aria-current={active ? "page" : undefined}
                        className={`peer/menu-button flex h-9 w-full flex-row items-center rounded-md px-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-white/10 text-white shadow-xs"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        <span className="sidebar-nav-icon flex shrink-0 items-center justify-center overflow-visible">
                          {serviceTabIcons[tab.segment]}
                        </span>
                        <span className="relative ml-2 truncate">{tab.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex h-9 w-full flex-row items-center rounded-md px-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span className="sidebar-nav-icon flex shrink-0 items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 12H5M5 12l6-6M5 12l6 6" />
                  </svg>
                </span>
                <span className="relative ml-2 truncate">Back</span>
              </button>
            </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export type ServiceNavItem = { segment: string; label: string };

let current: ServiceNavItem[] = [];
const listeners = new Set<() => void>();

export function setServiceNav(items: ServiceNavItem[]) {
  current = items;
  for (const listener of listeners) listener();
}

export function getServiceNav(): ServiceNavItem[] {
  return current;
}

export function subscribeServiceNav(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
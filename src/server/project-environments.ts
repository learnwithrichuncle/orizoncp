import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { createUniqueSlug } from "../shared/slug.js";
import { db, nowIso } from "./db.js";
import { projectEnvironments, services, type ProjectEnvironment } from "./schema.js";

const defaultEnvironments = [
  { name: "Prod", slug: "production", isDefault: true },
  { name: "Dev", slug: "development", isDefault: false }
] as const;

export function getProjectEnvironments(projectId: string) {
  return db
    .select()
    .from(projectEnvironments)
    .where(eq(projectEnvironments.projectId, projectId))
    .orderBy(asc(projectEnvironments.createdAt))
    .all()
    .sort((left, right) => Number(right.isDefault) - Number(left.isDefault));
}

export function getProjectEnvironment(projectId: string, environmentId: string) {
  return getProjectEnvironments(projectId).find((environment) => environment.id === environmentId) ?? null;
}

export function getDefaultProjectEnvironment(projectId: string) {
  const environments = getProjectEnvironments(projectId);
  return environments.find((environment) => environment.isDefault) ?? environments[0] ?? null;
}

export function createDefaultProjectEnvironments(projectId: string, timestamp = nowIso()) {
  const existing = getProjectEnvironments(projectId);
  const bySlug = new Map(existing.map((environment) => [environment.slug, environment]));

  for (const definition of defaultEnvironments) {
    const { name, slug } = definition;
    if (bySlug.has(slug)) continue;

    const environment: ProjectEnvironment = {
      id: nanoid(10),
      projectId,
      name,
      slug,
      isDefault: definition.isDefault,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    db.insert(projectEnvironments).values(environment).run();
    bySlug.set(slug, environment);
  }

  const production = bySlug.get("production");
  if (!production) throw new Error("Could not create the production environment");

  for (const environment of bySlug.values()) {
    const isDefault = environment.id === production.id;
    if (environment.isDefault === isDefault) continue;
    db.update(projectEnvironments)
      .set({ isDefault, updatedAt: timestamp })
      .where(eq(projectEnvironments.id, environment.id))
      .run();
  }

  return {
    environments: getProjectEnvironments(projectId),
    defaultEnvironment: { ...production, isDefault: true }
  };
}

export function createProjectEnvironment(projectId: string, name: string) {
  const timestamp = nowIso();
  const slugs = new Set(getProjectEnvironments(projectId).map((environment) => environment.slug));
  const environment: ProjectEnvironment = {
    id: nanoid(10),
    projectId,
    name,
    slug: createUniqueSlug(name, slugs),
    isDefault: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  db.insert(projectEnvironments).values(environment).run();
  return environment;
}

export function renameProjectEnvironment(projectId: string, environmentId: string, name: string) {
  const environment = getProjectEnvironment(projectId, environmentId);
  if (!environment) throw new Error("Environment not found");
  const duplicate = getProjectEnvironments(projectId).find(
    (item) => item.id !== environmentId && item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
  );
  if (duplicate) throw new Error("An environment with this name already exists.");
  const timestamp = nowIso();
  db.update(projectEnvironments)
    .set({ name, updatedAt: timestamp })
    .where(eq(projectEnvironments.id, environmentId))
    .run();
  return { ...environment, name, updatedAt: timestamp };
}

export function deleteProjectEnvironment(projectId: string, environmentId: string) {
  const environment = getProjectEnvironment(projectId, environmentId);
  if (!environment) throw new Error("Environment not found");
  if (environment.isDefault) throw new Error("The default environment cannot be deleted.");
  if (getProjectEnvironments(projectId).length <= 1) {
    throw new Error("At least one environment is required.");
  }
  const serviceCount = db
    .select()
    .from(services)
    .where(eq(services.environmentId, environmentId))
    .all().length;
  if (serviceCount > 0) {
    throw new Error("Move or delete this environment's services first.");
  }
  db.delete(projectEnvironments).where(eq(projectEnvironments.id, environmentId)).run();
}

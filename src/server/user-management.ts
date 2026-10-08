import { eq } from "drizzle-orm";
import { z } from "zod";
import { createUser } from "./auth.js";
import { db, sqlite } from "./db.js";
import { users } from "./schema.js";

export const createManagedUserSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export const updateManagedUserSchema = z.object({
  role: z.enum(["owner", "user"])
});

export type PublicManagedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  projectCount: number;
  serviceCount: number;
  activeServiceCount: number;
  apiKeyCount: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

type ManagedUserRow = Omit<PublicManagedUser, "projectCount" | "serviceCount" | "activeServiceCount" | "apiKeyCount"> & {
  projectCount: number | bigint | null;
  serviceCount: number | bigint | null;
  activeServiceCount: number | bigint | null;
  apiKeyCount: number | bigint | null;
};

function displayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "User";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "User";
}

function numericCount(value: number | bigint | null) {
  return typeof value === "bigint" ? Number(value) : value ?? 0;
}

function publicManagedUser(row: ManagedUserRow): PublicManagedUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    projectCount: numericCount(row.projectCount),
    serviceCount: numericCount(row.serviceCount),
    activeServiceCount: numericCount(row.activeServiceCount),
    apiKeyCount: numericCount(row.apiKeyCount),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lastLoginAt: row.lastLoginAt
  };
}

export function listManagedUsers(): PublicManagedUser[] {
  const rows = sqlite.prepare(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.created_at AS createdAt,
      u.updated_at AS updatedAt,
      u.last_login_at AS lastLoginAt,
      COUNT(DISTINCT pg.id) AS projectCount,
      COUNT(DISTINCT p.id) AS serviceCount,
      COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) AS activeServiceCount,
      COUNT(DISTINCT ak.id) AS apiKeyCount
    FROM users u
    LEFT JOIN project_groups pg ON pg.owner_user_id = u.id
    LEFT JOIN projects p ON p.project_group_id = pg.id
    LEFT JOIN api_keys ak ON ak.created_by_user_id = u.id AND ak.revoked_at IS NULL
    GROUP BY u.id
    ORDER BY CASE WHEN u.role = 'owner' THEN 0 ELSE 1 END, u.created_at ASC
  `).all() as ManagedUserRow[];

  return rows.map(publicManagedUser);
}

export function createManagedUser(input: z.infer<typeof createManagedUserSchema>) {
  const existing = db.select({ id: users.id }).from(users).where(eq(users.email, input.email)).get();
  if (existing) {
    throw new Error("A user with that email already exists.");
  }

  const user = createUser({
    name: displayNameFromEmail(input.email),
    email: input.email,
    password: input.password,
    role: "user"
  });

  return listManagedUsers().find((managedUser) => managedUser.id === user.id) ?? publicManagedUser({
    ...user,
    projectCount: 0,
    serviceCount: 0,
    activeServiceCount: 0,
    apiKeyCount: 0
  });
}

function assertOwnerConstraint(userId: string, nextRole: "owner" | "user") {
  const existing = db.select({ id: users.id, role: users.role }).from(users).where(eq(users.id, userId)).get();
  if (!existing) throw new Error("User not found");
  if (existing.role === "owner" && nextRole !== "owner") {
    const owners = db.select({ id: users.id }).from(users).where(eq(users.role, "owner")).all();
    if (owners.length <= 1) throw new Error("At least one owner is required.");
  }
  return existing;
}

export function updateManagedUserRole(userId: string, role: "owner" | "user") {
  assertOwnerConstraint(userId, role);
  db.update(users).set({ role, updatedAt: new Date().toISOString() }).where(eq(users.id, userId)).run();
  return listManagedUsers().find((managedUser) => managedUser.id === userId) ?? null;
}

export function deleteManagedUser(userId: string) {
  assertOwnerConstraint(userId, "user");
  const managed = listManagedUsers().find((managedUser) => managedUser.id === userId);
  if (!managed) throw new Error("User not found");
  if (managed.projectCount > 0) {
    throw new Error("This user owns projects. Move or delete them first.");
  }
  db.delete(users).where(eq(users.id, userId)).run();
}

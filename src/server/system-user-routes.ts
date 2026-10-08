import type { Hono } from "hono";
import {
  createManagedUser,
  createManagedUserSchema,
  deleteManagedUser,
  listManagedUsers,
  updateManagedUserRole,
  updateManagedUserSchema
} from "./user-management.js";

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function registerSystemUserRoutes(app: Hono) {
  app.get("/api/system/users", (c) => {
    return c.json({ users: listManagedUsers() });
  });

  app.post("/api/system/users", async (c) => {
    const body = createManagedUserSchema.safeParse(await c.req.json().catch(() => ({})));
    if (!body.success) {
      return jsonError(body.error.issues[0]?.message ?? "Invalid user");
    }

    try {
      return c.json({ user: createManagedUser(body.data) }, 201);
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Could not create user", 400);
    }
  });

  app.patch("/api/system/users/:userId", async (c) => {
    const body = updateManagedUserSchema.safeParse(await c.req.json().catch(() => ({})));
    if (!body.success) {
      return jsonError(body.error.issues[0]?.message ?? "Invalid user");
    }

    try {
      const user = updateManagedUserRole(c.req.param("userId"), body.data.role);
      if (!user) return jsonError("User not found", 404);
      return c.json({ user });
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Could not update user", 400);
    }
  });

  app.delete("/api/system/users/:userId", (c) => {
    try {
      deleteManagedUser(c.req.param("userId"));
      return c.json({ ok: true });
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Could not delete user", 400);
    }
  });
}

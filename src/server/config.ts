import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function applyEnvFile(filePath: string, { override = false } = {}) {
  if (!existsSync(filePath)) return;

  const source = readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = rawLine.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = rawLine.slice(0, separatorIndex).trim();
    if (!key || (!override && process.env[key] !== undefined)) continue;

    let value = rawLine.slice(separatorIndex + 1).trim();
    if (value.startsWith('"') || value.startsWith("'")) {
      const quote = value[0];
      value = value.slice(1);

      while (!value.endsWith(quote) && index < lines.length - 1) {
        index += 1;
        value += `\n${lines[index] ?? ""}`;
      }

      if (value.endsWith(quote)) {
        value = value.slice(0, -1);
      }
    }

    process.env[key] = value;
  }
}

applyEnvFile(resolve(process.cwd(), ".env"));
applyEnvFile(resolve(process.cwd(), ".env.local"), { override: true });
const envPath = process.env.ORIZONCP_ENV_PATH ?? process.env.ORIZONCP_ENV_PATH;
if (envPath) {
  applyEnvFile(resolve(envPath), { override: true });
}

function pickEnv(primary: string, legacy: string | undefined, fallback: string): string {
  if (process.env[primary] !== undefined) return process.env[primary] as string;
  if (legacy && process.env[legacy] !== undefined) return process.env[legacy] as string;
  return fallback;
}

const appName = process.env.APP_NAME ?? "orizonCP";
const repoUrl = "https://github.com/learnwithrichuncle/orizoncp.git";
// Previously-published repo URLs are normalized to the current repo so in-place
// installs keep pulling updates after the rename.
const legacyRepoUrls = new Set([
  "https://github.com/akinloluwami/ORIZONCP",
  "https://github.com/akinloluwami/ORIZONCP.git",
  "git@github.com:akinloluwami/ORIZONCP",
  "git@github.com:akinloluwami/ORIZONCP.git",
  "https://github.com/learnwithrichuncle/orizoncp",
  "https://github.com/learnwithrichuncle/orizoncp.git",
  "git@github.com:/ORIZONCP",
  "git@github.com:/ORIZONCP.git"
]);

function normalizeRepoUrl(value: string) {
  return legacyRepoUrls.has(value.trim()) ? repoUrl : value;
}

const imageRegistry =
  process.env.IMAGE_REPO ?? "ghcr.io/learnwithrichuncle/orizoncp";

function normalizeImage(image: string) {
  return image
    .trim()
    .replace(/^ghcr\.io\/akinloluwami\/ORIZONCP(?=[:@]|$)/, imageRegistry)
    .replace(/^ghcr\.io\/\/ORIZONCP(?=[:@]|$)/, imageRegistry)
    .replace(/^ghcr\.io\/learnwithrichuncle\/orizoncp(?=[:@]|$)/, imageRegistry);
}

const defaultImage = normalizeImage(
  pickEnv("ORIZONCP_IMAGE", "ORIZONCP_IMAGE", `${imageRegistry}:latest`)
);
const installDir = pickEnv(
  "ORIZONCP_INSTALL_DIR",
  "ORIZONCP_INSTALL_DIR",
  "/opt/orizoncp"
);
const defaultImageUpdateCmd = `docker rm -f orizoncp-self-updater >/dev/null 2>&1 || true; docker run -d --name orizoncp-self-updater -v /var/run/docker.sock:/var/run/docker.sock -v ${installDir}:${installDir} -w ${installDir} ${defaultImage} sh -lc 'docker compose pull orizoncp && docker compose up -d --no-deps orizoncp'`;
const dataDir = resolve(process.env.DATA_DIR ?? "data");
const caddyDataDir =
  process.env.CADDY_DATA_DIR ??
  (process.env.CADDY_RELOAD_CMD === "true" ? "/data" : dataDir);

export const config = {
  appName,
  port: Number(process.env.PORT ?? 4310),
  host: process.env.HOST ?? "0.0.0.0",
  publicUrl: process.env.PUBLIC_URL ?? "http://localhost:5173",
  baseDomain: process.env.BASE_DOMAIN ?? "cp.orzn.io",
  appUrl: process.env.APP_URL ?? "https://cp.orzn.io",
  mailFromAddress: process.env.MAIL_FROM_ADDRESS ?? "no-reply@orzn.io",
  mailFromName: process.env.MAIL_FROM_NAME ?? "orizonCP",
  supportEmail: process.env.SUPPORT_EMAIL ?? "support@orzn.io",
  imageRepo: imageRegistry,
  controlPlaneHostname: process.env.CONTROL_PLANE_HOSTNAME?.trim().toLowerCase() ?? "",
  dataDir,
  deployDryRun: process.env.DEPLOY_DRY_RUN === "true",
  githubAccessToken: process.env.GITHUB_ACCESS_TOKEN ?? "",
  githubAppId: process.env.GITHUB_APP_ID ?? "",
  githubAppClientId: process.env.GITHUB_APP_CLIENT_ID ?? "",
  githubAppSlug: process.env.GITHUB_APP_SLUG ?? "",
  githubAppPrivateKey: (process.env.GITHUB_APP_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET ?? "",
  buildkitHost: process.env.BUILDKIT_HOST ?? "tcp://127.0.0.1:1234",
  runtimeNetworkName: pickEnv(
    "ORIZONCP_RUNTIME_NETWORK",
    "ORIZONCP_RUNTIME_NETWORK",
    "orizoncp-runtime"
  ),
  secretKey: pickEnv("ORIZONCP_SECRET_KEY", "ORIZONCP_SECRET_KEY", ""),
  caddyConfigPath: resolve(process.env.CADDY_CONFIG_PATH ?? "data/Caddyfile"),
  caddyDataDir,
  caddyReloadCmd: process.env.CADDY_RELOAD_CMD ?? "caddy reload --config ./data/Caddyfile",
  updateRepoUrl: normalizeRepoUrl(
    pickEnv("ORIZONCP_UPDATE_REPO_URL", "ORIZONCP_UPDATE_REPO_URL", repoUrl)
  ),
  updateRepoBranch: pickEnv("ORIZONCP_UPDATE_BRANCH", "ORIZONCP_UPDATE_BRANCH", "main"),
  updateRestartCmd: pickEnv("ORIZONCP_UPDATE_RESTART_CMD", "ORIZONCP_UPDATE_RESTART_CMD", ""),
  imageCommitSha: pickEnv("ORIZONCP_COMMIT_SHA", "ORIZONCP_COMMIT_SHA", ""),
  imageUpdateCmd: pickEnv("ORIZONCP_IMAGE_UPDATE_CMD", "ORIZONCP_IMAGE_UPDATE_CMD", defaultImageUpdateCmd)
};
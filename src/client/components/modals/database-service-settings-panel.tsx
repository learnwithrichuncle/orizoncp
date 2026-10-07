import { useEffect, useState } from "react";
import { api } from "../../api";
import { FormInput } from "../ui/primitives";
import { SquareSwitch } from "../ui/square-switch";
import { generateDatabaseHostname } from "./database-hostname";

const settingsLabelClass = "mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim";
const settingsInputClass = "!h-9 border-line bg-base text-xs";

export type DatabaseSettingsState = {
  name: string;
  internalPort: number;
  databasePublicEnabled: boolean;
  databasePublicHostname: string;
  postgresLogicalReplicationEnabled: boolean;
};

type DatabaseServiceSettingsPanelProps = {
  settings: DatabaseSettingsState;
  hostPort?: number;
  supportsLogicalReplication?: boolean;
  onChange: (settings: Partial<DatabaseSettingsState>) => void;
};

export function DatabaseServiceSettingsPanel({ settings, hostPort, supportsLogicalReplication = false, onChange }: DatabaseServiceSettingsPanelProps) {
  const [rootDomain, setRootDomain] = useState("");
  const generatedHostname = generateDatabaseHostname(settings.name, rootDomain);

  useEffect(() => {
    let cancelled = false;
    void api.systemSettings()
      .then((result) => {
        if (!cancelled) setRootDomain(result.settings.rootDomain);
      })
      .catch(() => {
        if (!cancelled) setRootDomain("");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!generatedHostname || settings.databasePublicHostname === generatedHostname) return;
    onChange({ databasePublicHostname: generatedHostname });
  }, [generatedHostname, settings.databasePublicHostname, onChange]);

  return (
    <>
      <div>
        <label htmlFor="database-service-name" className={settingsLabelClass}>Service name</label>
        <FormInput id="database-service-name" name="name" value={settings.name} onChange={(event) => onChange({ name: event.target.value })} variant="monochrome" className={settingsInputClass} />
      </div>
      <div>
        <label htmlFor="database-service-port" className={settingsLabelClass}>Internal port</label>
        <FormInput
          id="database-service-port"
          name="internalPort"
          type="number"
          value={settings.internalPort}
          onChange={(event) => onChange({ internalPort: Number(event.target.value) })}
          variant="monochrome"
          className={settingsInputClass}
        />
      </div>
      <input type="hidden" name="databasePublicHostname" value={settings.databasePublicHostname || generatedHostname} />
      <div className="xl:col-span-2">
        <div className="grid border border-line md:grid-cols-2">
          <div>
            <div className="border-b border-line px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim md:border-b-0 md:border-r">Public hostname</div>
            <div className="flex h-10 min-w-0 items-center px-3 font-mono text-xs text-ink-muted">
              <span className="truncate">{settings.databasePublicHostname || generatedHostname || "Set root domain first"}</span>
            </div>
          </div>
          <div>
            <div className="border-b border-line px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">Connection target</div>
            <div className="flex h-10 min-w-0 items-center px-3 font-mono text-xs text-ink-muted">
              <span className="truncate">
                {settings.databasePublicHostname || generatedHostname
                  ? `${settings.databasePublicHostname || generatedHostname}:${hostPort ?? "<port>"}`
                  : `db.example.com:${hostPort ?? "<port>"}`}
              </span>
            </div>
          </div>
        </div>
      </div>
      {supportsLogicalReplication ? (
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between gap-4 border border-line px-3 py-3">
            <span>
              <span className="block text-xs text-ink-muted">Logical replication</span>
              <span className="mt-1 block font-mono text-[9px] text-ink-dim">wal_level=logical · 10 slots · 10 senders</span>
            </span>
            <SquareSwitch
              checked={settings.postgresLogicalReplicationEnabled}
              label={`${settings.postgresLogicalReplicationEnabled ? "Disable" : "Enable"} logical replication`}
              onCheckedChange={(checked) => onChange({ postgresLogicalReplicationEnabled: checked })}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

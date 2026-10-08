import { FolderOpenIcon } from "@hugeicons/core-free-icons";
import type { GitHubDirectory } from "../../api";
import { ModalShell } from "./modal-shell";
import { DirectoryTree } from "./directory-tree";

type DirectoryPickerModalProps = {
  open: boolean;
  repoLabel: string;
  selectedPath: string;
  directoriesByPath: Record<string, GitHubDirectory[]>;
  expandedPaths: Set<string>;
  loadingPaths: Set<string>;
  errorMessage: string;
  onClose: () => void;
  onToggle: (path: string) => void | Promise<void>;
  onSelect: (path: string) => void;
};

export function DirectoryPickerModal({
  open,
  repoLabel,
  selectedPath,
  directoriesByPath,
  expandedPaths,
  loadingPaths,
  errorMessage,
  onClose,
  onToggle,
  onSelect
}: DirectoryPickerModalProps) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      icon={FolderOpenIcon}
      title="Choose directory"
      meta={repoLabel}
      width="max-w-2xl"
      minHeight="min-h-0"
      bodyClassName="min-h-0 flex-1"
      variant="monochrome"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border border-neutral-800 px-3 py-2.5">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">Selected path</div>
            <div className="mt-1 font-mono text-xs text-neutral-400">{selectedPath || "."}</div>
          </div>
          <button type="button" className="inline-flex h-8 items-center justify-center bg-blue-600 px-3 text-xs text-neutral-100 transition hover:bg-zinc-200" onClick={onClose}>
            Done
          </button>
        </div>

        <DirectoryTree
          repoLabel={repoLabel}
          selectedPath={selectedPath}
          directoriesByPath={directoriesByPath}
          expandedPaths={expandedPaths}
          loadingPaths={loadingPaths}
          errorMessage={errorMessage}
          footerMessage="Choose the folder that contains this service."
          onToggle={onToggle}
          onSelect={onSelect}
        />
      </div>
    </ModalShell>
  );
}

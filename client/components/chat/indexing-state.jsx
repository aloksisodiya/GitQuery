"use client";

import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { getRepoProgress, useStartIndexing } from "@/hooks/use-repos";
export function IndexingState({ repo, status }) {
  var _a, _b, _c, _d, _e;
  const indexMutation = useStartIndexing();
  const filesProcessed =
    (_a =
      status === null || status === void 0 ? void 0 : status.filesProcessed) !==
      null && _a !== void 0
      ? _a
      : repo.filesProcessed;
  const filesTotal =
    (_b = status === null || status === void 0 ? void 0 : status.filesTotal) !==
      null && _b !== void 0
      ? _b
      : repo.filesTotal;
  const chunkCount =
    (_c = status === null || status === void 0 ? void 0 : status.chunkCount) !==
      null && _c !== void 0
      ? _c
      : repo.chunkCount;
  const progress = getRepoProgress({
    filesProcessed,
    filesTotal,
  });
  const indexStatus =
    (_d =
      status === null || status === void 0 ? void 0 : status.indexStatus) !==
      null && _d !== void 0
      ? _d
      : repo.indexStatus;
  const errorMessage =
    (_e =
      status === null || status === void 0 ? void 0 : status.errorMessage) !==
      null && _e !== void 0
      ? _e
      : repo.errorMessage;
  if (indexStatus === "FAILED") {
    return (
      <Empty className="h-full border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Indexing failed</EmptyTitle>
          <EmptyDescription>
            {errorMessage ||
              "Something went wrong while indexing this repository."}
          </EmptyDescription>
        </EmptyHeader>
        <Button
          onClick={() => indexMutation.mutate(repo.id)}
          disabled={indexMutation.isPending}
        >
          <RotateCcw data-icon="inline-start" />
          Retry indexing
        </Button>
      </Empty>
    );
  }
  return (
    <Empty className="h-full border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Loader2 className="animate-spin" />
        </EmptyMedia>
        <EmptyTitle>Indexing {repo.fullName}</EmptyTitle>
        <EmptyDescription>
          {filesTotal > 0
            ? `${filesProcessed} of ${filesTotal} files · ${chunkCount} chunks embedded`
            : "Fetching repository files and preparing embeddings…"}
        </EmptyDescription>
      </EmptyHeader>
      <div className="w-full max-w-sm space-y-2">
        <Progress value={Math.max(progress, filesTotal ? progress : 12)} />
        <p className="text-center text-xs text-muted-foreground">
          You can leave this page open — chat unlocks when indexing finishes.
        </p>
      </div>
    </Empty>
  );
}

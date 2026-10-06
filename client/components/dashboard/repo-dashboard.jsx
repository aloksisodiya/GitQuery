"use client";

import { useMemo, useState } from "react";
import { FolderGit2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RepoCard } from "@/components/dashboard/repo-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useRefreshRepos, useRepos } from "@/hooks/use-repos";
export function RepoDashboard() {
  var _a, _b, _c;
  const reposQuery = useRepos();
  const refresh = useRefreshRepos();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [visibility, setVisibility] = useState("all");
  const filtered = useMemo(() => {
    var _a;
    const list = (_a = reposQuery.data) !== null && _a !== void 0 ? _a : [];
    const q = search.trim().toLowerCase();
    return list.filter((repo) => {
      var _a, _b;
      if (status !== "ALL" && repo.indexStatus !== status) return false;
      if (visibility === "private" && !repo.isPrivate) return false;
      if (visibility === "public" && repo.isPrivate) return false;
      if (!q) return true;
      return (
        repo.fullName.toLowerCase().includes(q) ||
        ((_a = repo.description) !== null && _a !== void 0 ? _a : "")
          .toLowerCase()
          .includes(q) ||
        ((_b = repo.language) !== null && _b !== void 0 ? _b : "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [reposQuery.data, search, status, visibility]);
  const readyCount =
    (_b =
      (_a = reposQuery.data) === null || _a === void 0
        ? void 0
        : _a.filter((r) => r.indexStatus === "READY").length) !== null &&
    _b !== void 0
      ? _b
      : 0;
  return (
    <div className="flex min-h-full flex-col">
      <DashboardHeader
        search={search}
        onSearchChange={setSearch}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        status={status}
        onStatusChange={setStatus}
        totalCount={
          (_c = reposQuery.data) === null || _c === void 0 ? void 0 : _c.length
        }
        readyCount={readyCount}
        onSync={() => refresh.mutate()}
        isSyncing={refresh.isPending || reposQuery.isFetching}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {reposQuery.isLoading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, i) => (
              <Skeleton className="h-64 rounded-2xl" key={i} />
            ))}
          </div>
        )}
        {reposQuery.isError && (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderGit2 />
              </EmptyMedia>
              <EmptyTitle>Couldn’t load repositories</EmptyTitle>
              <EmptyDescription>{reposQuery.error.message}</EmptyDescription>
            </EmptyHeader>
            <Button onClick={() => void reposQuery.refetch()}>Try again</Button>
          </Empty>
        )}
        {reposQuery.isSuccess && filtered.length === 0 && (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderGit2 />
              </EmptyMedia>
              <EmptyTitle>No repositories match</EmptyTitle>
              <EmptyDescription>
                Try clearing filters or syncing again.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {reposQuery.isSuccess && filtered.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((repo) => (
              <RepoCard repo={repo} key={repo.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "@/components/ui/toast";
const INDEXING_POLL_MS = 2000;
function hasIndexingRepos(repos) {
    var _a;
    return (_a = repos === null || repos === void 0 ? void 0 : repos.some((repo) => repo.indexStatus === "INDEXING")) !== null && _a !== void 0 ? _a : false;
}
function updateRepoInListCache(queryClient, repo) {
    queryClient.setQueryData(queryKeys.repos.list(), (current) => {
        if (!current)
            return current;
        return current.map((item) => (item.id === repo.id ? repo : item));
    });
}
export function useRepos() {
    return useQuery({
        queryKey: queryKeys.repos.list(),
        queryFn: async () => {
            const repos = await api.listRepos(false);
            if (repos.length === 0) {
                return api.listRepos(true);
            }
            return repos;
        },
        staleTime: 30000,
        refetchInterval: (query) => hasIndexingRepos(query.state.data) ? INDEXING_POLL_MS : false,
    });
}
export function useRepository(repoId) {
    return useQuery({
        queryKey: queryKeys.repos.detail(repoId),
        queryFn: () => api.getRepo(repoId),
        enabled: Boolean(repoId),
        refetchInterval: (query) => { var _a; return ((_a = query.state.data) === null || _a === void 0 ? void 0 : _a.indexStatus) === "INDEXING" ? INDEXING_POLL_MS : false; },
    });
}
export function useIndexStatus(repoId, enabled = false) {
    return useQuery({
        queryKey: queryKeys.repos.status(repoId),
        queryFn: () => api.indexStatus(repoId),
        enabled: Boolean(repoId) && enabled,
        refetchInterval: (query) => { var _a; return ((_a = query.state.data) === null || _a === void 0 ? void 0 : _a.indexStatus) === "INDEXING" ? 1500 : false; },
    });
}
export function useStartIndexing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (repoId) => api.startIndex(repoId),
        onSuccess: (repo) => {
            queryClient.setQueryData(queryKeys.repos.detail(repo.id), repo);
            updateRepoInListCache(queryClient, repo);
            void queryClient.invalidateQueries({
                queryKey: queryKeys.repos.status(repo.id),
            });
            toast.add({
                title: "Indexing started",
                description: `Indexing ${repo.fullName}…`,
                type: "loading",
            });
        },
        onError: (error) => {
            toast.add({
                title: "Could not start indexing",
                description: error.message,
                type: "error",
            });
        },
    });
}
export function useRefreshRepos() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => toast.promise(api.listRepos(true), {
            loading: {
                title: "Syncing repositories",
                description: "Fetching the latest repos from GitHub…",
                type: "loading",
            },
            success: (repos) => ({
                title: "Sync successful",
                description: `${repos.length} repositories loaded`,
                type: "success",
            }),
            error: (error) => ({
                title: "Sync failed",
                description: error instanceof Error ? error.message : "Could not sync repositories",
                type: "error",
            }),
        }),
        onSuccess: (repos) => {
            queryClient.setQueryData(queryKeys.repos.list(), repos);
        },
    });
}
export function getRepoProgress(repo) {
    if (!repo.filesTotal)
        return 0;
    return Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100));
}

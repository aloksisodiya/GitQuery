"use client";

import { Link } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { IndexingState } from "@/components/chat/indexing-state";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useChatMessages,
  useChatSessions,
  useCreateChatSession,
  useStreamChat,
} from "@/hooks/use-chat";
import { useIndexStatus, useRepository } from "@/hooks/use-repos";
export function ChatView({ repoId }) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u;
  const repoQuery = useRepository(repoId);
  const isIndexing =
    ((_a = repoQuery.data) === null || _a === void 0
      ? void 0
      : _a.indexStatus) === "INDEXING";
  const statusQuery = useIndexStatus(
    repoId,
    isIndexing ||
      ((_b = repoQuery.data) === null || _b === void 0
        ? void 0
        : _b.indexStatus) === "PENDING",
  );
  const indexStatus =
    (_d =
      (_c = statusQuery.data) === null || _c === void 0
        ? void 0
        : _c.indexStatus) !== null && _d !== void 0
      ? _d
      : (_e = repoQuery.data) === null || _e === void 0
        ? void 0
        : _e.indexStatus;
  const ready = indexStatus === "READY";
  const sessionsQuery = useChatSessions(repoId, ready);
  const createSession = useCreateChatSession(repoId);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const autoCreateRef = useRef(false);
  const sessionId =
    (_h =
      selectedSessionId !== null && selectedSessionId !== void 0
        ? selectedSessionId
        : (_g =
              (_f = sessionsQuery.data) === null || _f === void 0
                ? void 0
                : _f[0]) === null || _g === void 0
          ? void 0
          : _g.id) !== null && _h !== void 0
      ? _h
      : null;
  const messagesQuery = useChatMessages(sessionId);
  const { send, stop, streaming, streamText } = useStreamChat(sessionId);
  useEffect(() => {
    var _a, _b;
    if (!ready || sessionsQuery.isLoading) return;
    if (sessionsQuery.data && sessionsQuery.data.length > 0) return;
    if (
      !sessionsQuery.isSuccess ||
      ((_b =
        (_a = sessionsQuery.data) === null || _a === void 0
          ? void 0
          : _a.length) !== null && _b !== void 0
        ? _b
        : 0) > 0 ||
      autoCreateRef.current
    ) {
      return;
    }
    autoCreateRef.current = true;
    createSession.mutate(undefined, {
      onSuccess: (session) => setSelectedSessionId(session.id),
      onError: () => {
        autoCreateRef.current = false;
      },
    });
  }, [
    ready,
    sessionsQuery.isLoading,
    sessionsQuery.isSuccess,
    sessionsQuery.data,
    createSession,
  ]);
  if (repoQuery.isLoading) {
    return (
      <AppShell title="Loading chat\u2026">
        <div className="grid flex-1 gap-4 p-4 md:grid-cols-[18rem_1fr]">
          <Skeleton className="min-h-80 rounded-2xl" />
          <Skeleton className="min-h-80 rounded-2xl" />
        </div>
      </AppShell>
    );
  }
  if (repoQuery.isError || !repoQuery.data) {
    return (
      <AppShell title="Repository unavailable">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
          <p className="text-sm text-muted-foreground">
            {(_k =
              (_j = repoQuery.error) === null || _j === void 0
                ? void 0
                : _j.message) !== null && _k !== void 0
              ? _k
              : "Repository not found"}
          </p>
          <Button nativeButton={false} render={<Link to="/dashboard" />}>
            Back to dashboard
          </Button>
        </div>
      </AppShell>
    );
  }
  const repo = repoQuery.data;
  return (
    <AppShell
      title={repo.fullName}
      description={
        ready
          ? "Ask questions grounded in this repository"
          : "Waiting for indexing to finish"
      }
      actions={
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link to="/dashboard" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Repos
        </Button>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <ChatSidebar
          repo={Object.assign(Object.assign({}, repo), {
            indexStatus:
              indexStatus !== null && indexStatus !== void 0
                ? indexStatus
                : repo.indexStatus,
            filesProcessed:
              (_m =
                (_l = statusQuery.data) === null || _l === void 0
                  ? void 0
                  : _l.filesProcessed) !== null && _m !== void 0
                ? _m
                : repo.filesProcessed,
            filesTotal:
              (_p =
                (_o = statusQuery.data) === null || _o === void 0
                  ? void 0
                  : _o.filesTotal) !== null && _p !== void 0
                ? _p
                : repo.filesTotal,
            chunkCount:
              (_r =
                (_q = statusQuery.data) === null || _q === void 0
                  ? void 0
                  : _q.chunkCount) !== null && _r !== void 0
                ? _r
                : repo.chunkCount,
            errorMessage:
              (_t =
                (_s = statusQuery.data) === null || _s === void 0
                  ? void 0
                  : _s.errorMessage) !== null && _t !== void 0
                ? _t
                : repo.errorMessage,
          })}
          sessionId={sessionId}
          onSelectSession={setSelectedSessionId}
        />
        <section className="flex min-h-[70vh] min-w-0 flex-1 flex-col">
          {!ready ? (
            <IndexingState repo={repo} status={statusQuery.data} />
          ) : (
            <Fragment>
              <ChatMessages
                repo={repo}
                messages={
                  (_u = messagesQuery.data) !== null && _u !== void 0 ? _u : []
                }
                streamText={streamText}
                isLoading={messagesQuery.isLoading}
              />
              <ChatComposer
                disabled={!sessionId}
                streaming={streaming}
                onSend={send}
                onStop={stop}
              />
            </Fragment>
          )}
        </section>
      </div>
    </AppShell>
  );
}
